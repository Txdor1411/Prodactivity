/**
 * App data layer — real, persisted habit tracking.
 *
 * Everything the UI used to fake (habit list, today's progress, streaks,
 * the profile) now lives here, backed by AsyncStorage so it survives reloads.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { Palette } from './tokens';

export type HabitType = 'count' | 'timer' | 'done';

/** A habit definition. Day-to-day progress is kept separately in `logs`. */
export type HabitDef = {
  id: string;
  emoji: string;
  name: string;
  /** Unit label, e.g. "glasses" / "minutes". */
  sub: string;
  accent: string;
  type: HabitType;
  /** Target per day. `done`/`timer` habits use a goal of 1. */
  goal: number;
  /** Mon→Sun schedule. A day that isn't scheduled never breaks a streak. */
  days: boolean[];
};

export type Profile = { name: string; emoji: string };

/** habitId → (YYYY-MM-DD → amount logged that day). */
type Logs = Record<string, Record<string, number>>;

type Persisted = { habits: HabitDef[]; logs: Logs; profile: Profile };

/** A habit projected onto a given day, ready for the existing card UI. */
export type HabitView = HabitDef & {
  value: number;
  streak: number;
  done: boolean;
};

const STORAGE_KEY = 'prodactivity:v1';
const ALL_DAYS = [true, true, true, true, true, true, true];

const SEED_HABITS: HabitDef[] = [
  { id: 'water', emoji: '💧', name: 'Drink water', sub: 'glasses', accent: Palette.water, type: 'count', goal: 8, days: ALL_DAYS },
  { id: 'med', emoji: '🧘', name: 'Meditate', sub: 'minutes', accent: Palette.meditate, type: 'timer', goal: 1, days: ALL_DAYS },
  { id: 'run', emoji: '🏃', name: 'Morning run', sub: 'session', accent: Palette.run, type: 'done', goal: 1, days: [true, true, true, true, true, false, false] },
  { id: 'read', emoji: '📚', name: 'Read', sub: 'session', accent: Palette.read, type: 'done', goal: 1, days: ALL_DAYS },
  { id: 'greens', emoji: '🥗', name: 'Eat greens', sub: 'servings', accent: Palette.greens, type: 'done', goal: 1, days: ALL_DAYS },
];

const SEED_PROFILE: Profile = { name: 'Budi', emoji: '🦊' };

// ---------------------------------------------------------------- date utils

/** Local YYYY-MM-DD key (avoids UTC off-by-one from toISOString). */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

/** Monday = 0 … Sunday = 6, matching the `days` schedule array. */
function weekdayMon0(d: Date): number {
  return (d.getDay() + 6) % 7;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

// ------------------------------------------------------------ streak compute

function isComplete(habit: HabitDef, amount: number | undefined): boolean {
  return (amount ?? 0) >= habit.goal;
}

/**
 * Current streak: consecutive *scheduled* days, counting back from today,
 * that were completed. Today not-yet-done is a grace day (doesn't break it);
 * unscheduled days are skipped.
 */
export function computeStreak(habit: HabitDef, log: Record<string, number> = {}): number {
  let streak = 0;
  let cursor = new Date();
  const today = todayKey();

  for (let i = 0; i < 730; i++) {
    const key = dateKey(cursor);
    const scheduled = habit.days[weekdayMon0(cursor)];
    if (scheduled) {
      if (isComplete(habit, log[key])) {
        streak++;
      } else if (key !== today) {
        break;
      }
    }
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Longest run of completed scheduled days across all history. */
export function computeBestStreak(habit: HabitDef, log: Record<string, number> = {}): number {
  const keys = Object.keys(log).filter((k) => isComplete(habit, log[k]));
  if (keys.length === 0) return 0;
  keys.sort();
  const earliest = new Date(keys[0]);
  let best = 0;
  let run = 0;
  let cursor = new Date(earliest);
  const end = new Date();
  while (cursor <= end) {
    const key = dateKey(cursor);
    if (habit.days[weekdayMon0(cursor)]) {
      if (isComplete(habit, log[key])) {
        run++;
        if (run > best) best = run;
      } else {
        run = 0;
      }
    }
    cursor = addDays(cursor, 1);
  }
  return best;
}

// ------------------------------------------------------------------- context

type StoreValue = {
  ready: boolean;
  habits: HabitDef[];
  profile: Profile;
  /** Habits projected onto a day (default: today), with live streaks. */
  habitsForDay: (key?: string) => HabitView[];
  /** Raw per-day log for one habit. */
  logFor: (id: string) => Record<string, number>;
  /** Tap-to-log: toggles done/timer, increments count (wrapping at goal+1→0). */
  logHabit: (id: string, day?: string) => void;
  /** Set an explicit amount for a day (used by the count stepper / detail). */
  setAmount: (id: string, amount: number, day?: string) => void;
  addHabit: (def: Omit<HabitDef, 'id'>) => string;
  updateHabit: (id: string, patch: Partial<HabitDef>) => void;
  removeHabit: (id: string) => void;
  setProfile: (patch: Partial<Profile>) => void;
  /** Replace everything (used by JSON import). */
  replaceAll: (data: Persisted) => void;
  exportData: () => Persisted;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [habits, setHabits] = useState<HabitDef[]>(SEED_HABITS);
  const [logs, setLogs] = useState<Logs>({});
  const [profile, setProfileState] = useState<Profile>(SEED_PROFILE);

  // Hydrate once.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && alive) {
          const data = JSON.parse(raw) as Partial<Persisted>;
          if (data.habits) setHabits(data.habits);
          if (data.logs) setLogs(data.logs);
          if (data.profile) setProfileState({ ...SEED_PROFILE, ...data.profile });
        }
      } catch {
        // Corrupt/empty storage → fall back to seeds.
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Persist after hydration on any change.
  const first = useRef(true);
  useEffect(() => {
    if (!ready) return;
    if (first.current) {
      first.current = false;
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, logs, profile })).catch(() => {});
  }, [ready, habits, logs, profile]);

  const logFor = useCallback((id: string) => logs[id] ?? {}, [logs]);

  const habitsForDay = useCallback(
    (key: string = todayKey()): HabitView[] =>
      habits.map((h) => {
        const log = logs[h.id] ?? {};
        const value = log[key] ?? 0;
        return { ...h, value, done: isComplete(h, value), streak: computeStreak(h, log) };
      }),
    [habits, logs],
  );

  const setAmount = useCallback((id: string, amount: number, day: string = todayKey()) => {
    setLogs((prev) => {
      const habitLog = { ...(prev[id] ?? {}) };
      if (amount <= 0) delete habitLog[day];
      else habitLog[day] = amount;
      return { ...prev, [id]: habitLog };
    });
  }, []);

  const logHabit = useCallback(
    (id: string, day: string = todayKey()) => {
      const habit = habits.find((h) => h.id === id);
      if (!habit) return;
      const current = logs[id]?.[day] ?? 0;
      if (habit.type === 'count') {
        const next = current >= habit.goal ? 0 : current + 1;
        setAmount(id, next, day);
      } else {
        setAmount(id, current >= 1 ? 0 : 1, day);
      }
    },
    [habits, logs, setAmount],
  );

  const addHabit = useCallback((def: Omit<HabitDef, 'id'>) => {
    const id = `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    setHabits((prev) => [...prev, { ...def, id }]);
    return id;
  }, []);

  const updateHabit = useCallback((id: string, patch: Partial<HabitDef>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  }, []);

  const removeHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setLogs((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const setProfile = useCallback((patch: Partial<Profile>) => {
    setProfileState((prev) => ({ ...prev, ...patch }));
  }, []);

  const replaceAll = useCallback((data: Persisted) => {
    setHabits(data.habits ?? SEED_HABITS);
    setLogs(data.logs ?? {});
    setProfileState({ ...SEED_PROFILE, ...(data.profile ?? {}) });
  }, []);

  const exportData = useCallback((): Persisted => ({ habits, logs, profile }), [habits, logs, profile]);

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      habits,
      profile,
      habitsForDay,
      logFor,
      logHabit,
      setAmount,
      addHabit,
      updateHabit,
      removeHabit,
      setProfile,
      replaceAll,
      exportData,
    }),
    [ready, habits, profile, habitsForDay, logFor, logHabit, setAmount, addHabit, updateHabit, removeHabit, setProfile, replaceAll, exportData],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
