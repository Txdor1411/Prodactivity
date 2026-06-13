/**
 * Social accountability layer — friends + a photo "proof" feed.
 *
 * Local-first prototype: everything lives on-device in AsyncStorage, mirroring
 * the habit store's hydrate-gate + first-ref persist pattern. The action surface
 * is deliberately resource-shaped (addPost / toggleReaction / addFriend / nudge)
 * so a real backend (Supabase/Firebase) can replace the persistence layer later
 * without touching the UI.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { Palette } from './tokens';

/** The local user is always this id; friends/demo accounts get their own. */
export const ME = 'me';

export type SocialUser = { id: string; name: string; emoji: string; accent: string };

export type Post = {
  id: string;
  authorId: string;
  kind: 'habit' | 'free';
  /** Habit metadata is denormalized onto the post (demo posts aren't tied to real habit ids). */
  habitName?: string;
  habitEmoji?: string;
  accent?: string;
  streak?: number;
  /** Persistent file URI for real posts; null for seeded/placeholder cards. */
  photoUri: string | null;
  caption?: string;
  createdAt: number;
};

/** postId → emoji → reactor ids. */
export type Reactions = Record<string, Record<string, string[]>>;

export type Nudge = { id: string; fromId: string; toId: string; habitName?: string; createdAt: number; seen: boolean };

export const REACTION_EMOJIS = ['👏', '🔥', '💪', '🎉'] as const;

type Persisted = { friends: SocialUser[]; pool: SocialUser[]; posts: Post[]; reactions: Reactions; nudges: Nudge[] };

const STORAGE_KEY = 'prodactivity:social:v1';
const HOUR = 3600_000;
const now = Date.now();

// --------------------------------------------------------------------- seeds

const FRIENDS: SocialUser[] = [
  { id: 'aya', name: 'Aya', emoji: '🦊', accent: Palette.run },
  { id: 'marco', name: 'Marco', emoji: '🐼', accent: Palette.read },
  { id: 'lena', name: 'Lena', emoji: '🐯', accent: Palette.water },
];

const POOL: SocialUser[] = [
  { id: 'theo', name: 'Theo', emoji: '🐲', accent: Palette.meditate },
  { id: 'priya', name: 'Priya', emoji: '🦉', accent: Palette.greens },
  { id: 'sam', name: 'Sam', emoji: '🐧', accent: Palette.pink },
];

const SEED_POSTS: Post[] = [
  { id: 's1', authorId: 'aya', kind: 'habit', habitName: 'Morning run', habitEmoji: '🏃', accent: Palette.run, streak: 12, photoUri: null, caption: '6am and freezing but it’s done 🥶', createdAt: now - 2 * HOUR },
  { id: 's2', authorId: 'marco', kind: 'habit', habitName: 'Read', habitEmoji: '📚', accent: Palette.read, streak: 5, photoUri: null, caption: '20 pages before work', createdAt: now - 5 * HOUR },
  { id: 's3', authorId: 'lena', kind: 'habit', habitName: 'Drink water', habitEmoji: '💧', accent: Palette.water, streak: 21, photoUri: null, caption: 'glass #8 ✅ staying hydrated', createdAt: now - 9 * HOUR },
  { id: 's4', authorId: 'aya', kind: 'free', photoUri: null, caption: 'rest day reset — meal prep done 🥗', createdAt: now - 26 * HOUR },
  // Posts from suggested (not-yet-added) friends — hidden until you add them.
  { id: 's5', authorId: 'theo', kind: 'habit', habitName: 'Meditate', habitEmoji: '🧘', accent: Palette.meditate, streak: 8, photoUri: null, caption: '10 min of calm', createdAt: now - 4 * HOUR },
  { id: 's6', authorId: 'priya', kind: 'habit', habitName: 'Eat greens', habitEmoji: '🥗', accent: Palette.greens, streak: 30, photoUri: null, caption: 'a month strong 💚', createdAt: now - 7 * HOUR },
];

const SEED_REACTIONS: Reactions = {
  s1: { '🔥': ['marco', 'lena'], '💪': ['lena'] },
  s2: { '👏': ['aya'] },
  s3: { '🔥': ['aya', 'marco'], '🎉': ['marco'] },
};

const SEED_NUDGES: Nudge[] = [
  { id: 'n1', fromId: 'aya', toId: ME, habitName: 'Morning run', createdAt: now - 1 * HOUR, seen: false },
];

// --------------------------------------------------------------------- utils

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/** Compact "2h" / "3d" / "now" relative label. */
export function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return 'now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}

// ------------------------------------------------------------------- context

export type NewPost = Pick<Post, 'kind' | 'habitName' | 'habitEmoji' | 'accent' | 'streak' | 'photoUri' | 'caption'>;

type SocialValue = {
  ready: boolean;
  friends: SocialUser[];
  pool: SocialUser[];
  posts: Post[];
  reactions: Reactions;
  nudges: Nudge[];
  /** Posts from added friends + me, newest first. */
  feedPosts: Post[];
  unseenNudges: Nudge[];
  userById: (id: string) => SocialUser | undefined;
  addPost: (post: NewPost) => void;
  toggleReaction: (postId: string, emoji: string) => void;
  addFriend: (id: string) => void;
  removeFriend: (id: string) => void;
  /** Records a nudge to a friend (no-op persistence in the prototype). */
  nudge: (toId: string, habitName?: string) => void;
  markNudgesSeen: () => void;
};

const SocialContext = createContext<SocialValue | null>(null);

export function SocialProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [friends, setFriends] = useState<SocialUser[]>(FRIENDS);
  const [pool, setPool] = useState<SocialUser[]>(POOL);
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [reactions, setReactions] = useState<Reactions>(SEED_REACTIONS);
  const [nudges, setNudges] = useState<Nudge[]>(SEED_NUDGES);

  // Hydrate once.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && alive) {
          const data = JSON.parse(raw) as Partial<Persisted>;
          if (data.friends) setFriends(data.friends);
          if (data.pool) setPool(data.pool);
          if (data.posts) setPosts(data.posts);
          if (data.reactions) setReactions(data.reactions);
          if (data.nudges) setNudges(data.nudges);
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
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ friends, pool, posts, reactions, nudges })).catch(() => {});
  }, [ready, friends, pool, posts, reactions, nudges]);

  const userById = useCallback((id: string) => [...friends, ...pool].find((u) => u.id === id), [friends, pool]);

  const feedPosts = useMemo(() => {
    const visible = new Set([ME, ...friends.map((f) => f.id)]);
    return posts.filter((p) => visible.has(p.authorId)).sort((a, b) => b.createdAt - a.createdAt);
  }, [posts, friends]);

  const unseenNudges = useMemo(() => nudges.filter((n) => !n.seen), [nudges]);

  const addPost = useCallback((post: NewPost) => {
    setPosts((prev) => [{ ...post, id: uid('p'), authorId: ME, createdAt: Date.now() }, ...prev]);
  }, []);

  const toggleReaction = useCallback((postId: string, emoji: string) => {
    setReactions((prev) => {
      const forPost = { ...(prev[postId] ?? {}) };
      const reactors = forPost[emoji] ?? [];
      forPost[emoji] = reactors.includes(ME) ? reactors.filter((r) => r !== ME) : [...reactors, ME];
      if (forPost[emoji].length === 0) delete forPost[emoji];
      return { ...prev, [postId]: forPost };
    });
  }, []);

  const addFriend = useCallback((id: string) => {
    setPool((prevPool) => {
      const user = prevPool.find((u) => u.id === id);
      if (!user) return prevPool;
      setFriends((prevFriends) => (prevFriends.some((f) => f.id === id) ? prevFriends : [...prevFriends, user]));
      return prevPool.filter((u) => u.id !== id);
    });
  }, []);

  const removeFriend = useCallback((id: string) => {
    setFriends((prevFriends) => {
      const user = prevFriends.find((u) => u.id === id);
      if (!user) return prevFriends;
      setPool((prevPool) => (prevPool.some((u) => u.id === id) ? prevPool : [...prevPool, user]));
      return prevFriends.filter((f) => f.id !== id);
    });
  }, []);

  const nudge = useCallback((_toId: string, _habitName?: string) => {
    // Prototype: friends are demo accounts, so an outgoing nudge has nowhere to
    // land. Kept as a real action so the backend version can POST a nudge.
  }, []);

  const markNudgesSeen = useCallback(() => {
    setNudges((prev) => (prev.every((n) => n.seen) ? prev : prev.map((n) => ({ ...n, seen: true }))));
  }, []);

  const value = useMemo<SocialValue>(
    () => ({
      ready,
      friends,
      pool,
      posts,
      reactions,
      nudges,
      feedPosts,
      unseenNudges,
      userById,
      addPost,
      toggleReaction,
      addFriend,
      removeFriend,
      nudge,
      markNudgesSeen,
    }),
    [ready, friends, pool, posts, reactions, nudges, feedPosts, unseenNudges, userById, addPost, toggleReaction, addFriend, removeFriend, nudge, markNudgesSeen],
  );

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
}

export function useSocial() {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error('useSocial must be used within SocialProvider');
  return ctx;
}
