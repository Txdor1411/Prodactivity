/**
 * Sample data + heatmap generators, ported verbatim in spirit from the
 * Prodactivity.dc.html runtime so the mockup renders identically.
 */
import { Palette } from './tokens';

export type HabitType = 'count' | 'timer' | 'done';

export type Habit = {
  id: string;
  emoji: string;
  name: string;
  sub: string;
  accent: string;
  type: HabitType;
  value: number;
  goal: number;
  streak: number;
  done: boolean;
};

export const SAMPLE_HABITS: Habit[] = [
  { id: 'water', emoji: '💧', name: 'Drink water', sub: 'glasses', accent: Palette.water, type: 'count', value: 5, goal: 8, streak: 12, done: false },
  { id: 'med', emoji: '🧘', name: 'Meditate', sub: '15 min · calm', accent: Palette.meditate, type: 'timer', value: 0, goal: 1, streak: 23, done: true },
  { id: 'run', emoji: '🏃', name: 'Morning run', sub: '3.0 km', accent: Palette.run, type: 'done', value: 0, goal: 1, streak: 6, done: true },
  { id: 'read', emoji: '📚', name: 'Read', sub: '20 minutes', accent: Palette.read, type: 'done', value: 0, goal: 1, streak: 4, done: false },
  { id: 'greens', emoji: '🥗', name: 'Eat greens', sub: '2 servings', accent: Palette.greens, type: 'done', value: 0, goal: 1, streak: 9, done: false },
];

/** Deterministic pseudo-random level grid (values 0–4), matching the prototype. */
export function mk(seed: number, n: number): number[] {
  let s = seed;
  const r = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const a: number[] = [];
  for (let i = 0; i < n; i++) {
    const x = r();
    a.push(x < 0.2 ? 0 : x < 0.42 ? 1 : x < 0.64 ? 2 : x < 0.84 ? 3 : 4);
  }
  return a;
}

export type HabitMeta = {
  name: string;
  emoji: string;
  accent: string;
  streak: number;
  pct: number;
};

export const HABITS_META: HabitMeta[] = [
  { name: 'Drink water', emoji: '💧', accent: Palette.water, streak: 12, pct: 86 },
  { name: 'Meditate', emoji: '🧘', accent: Palette.meditate, streak: 23, pct: 92 },
  { name: 'Morning run', emoji: '🏃', accent: Palette.run, streak: 6, pct: 71 },
  { name: 'Read', emoji: '📚', accent: Palette.read, streak: 4, pct: 64 },
  { name: 'Eat greens', emoji: '🥗', accent: Palette.greens, streak: 9, pct: 78 },
];

/** Year heatmap levels (Eat greens detail hero). */
export const YEAR_LEVELS = mk(7, 364);

/** Mosaic per-habit cell levels (180 cells each). */
export const MOSAIC_LEVELS = HABITS_META.map((_, i) => mk(31 + i * 13, 180));

export const WEEKDAYS = [
  { d: 'Mon', v: 74 },
  { d: 'Tue', v: 88 },
  { d: 'Wed', v: 62 },
  { d: 'Thu', v: 95 },
  { d: 'Fri', v: 70 },
  { d: 'Sat', v: 48 },
  { d: 'Sun', v: 56 },
];

export const TREND_VALS = [52, 58, 55, 63, 60, 68, 66, 74, 72, 80, 84, 90];

/** Consistency density grid (98 cells, coral). */
export const DENSITY_LEVELS = mk(45, 98);
