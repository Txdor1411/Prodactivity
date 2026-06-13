/**
 * Prodactivity design tokens — ported from the Claude Design handoff
 * (Prodactivity.dc.html). iOS 26 liquid-glass over a warm gradient,
 * light & dark. Coral accent, emerald heatmap.
 */

export type Scheme = 'light' | 'dark';

/** Brand + per-habit accents (shared across themes). */
export const Palette = {
  coral: '#F2683C',
  coralLight: '#FF8A5B',
  emerald: '#34C77B',
  emeraldLight: '#46d98d',
  // habit accents
  water: '#2BB8B0',
  meditate: '#6C5CE7',
  run: '#FF6B5E',
  read: '#F5A623',
  greens: '#34C77B',
  pink: '#E86CC4',
  freeze: '#5B8DEF',
} as const;

/** The six selectable habit colors in the color picker. */
export const HabitColors = [
  Palette.emerald,
  Palette.run,
  Palette.meditate,
  Palette.read,
  Palette.water,
  Palette.pink,
] as const;

type Theme = {
  scheme: Scheme;
  /** App accent (coral) — slightly brighter in dark. */
  accent: string;
  // wallpaper gradient stops (top → bottom)
  wallpaper: [string, string, string, string];
  wallpaperLocations: [number, number, number, number];
  // text
  text: string;
  textStrong: string;
  textSecondary: string;
  textMuted: string;
  // glass surfaces
  glassBg: string;
  glassBorder: string;
  glassBlurTint: 'light' | 'dark';
  glassBlurIntensity: number;
  // bottom nav glass
  navBg: string;
  navBorder: string;
  // inset fill (segmented controls, inputs)
  fill: string;
  fillStrong: string;
  hairline: string;
  // heatmap empty cell
  heatmapEmpty: string;
};

export const Themes: Record<Scheme, Theme> = {
  light: {
    scheme: 'light',
    accent: Palette.coral,
    wallpaper: ['#dceaf2', '#e7e3ee', '#f3ddd1', '#f6cebc'],
    wallpaperLocations: [0, 0.32, 0.72, 1],
    text: '#22222a',
    textStrong: '#1c1c24',
    textSecondary: '#8a8a93',
    textMuted: '#a0a0a8',
    glassBg: 'rgba(255,255,255,0.6)',
    glassBorder: 'rgba(255,255,255,0.75)',
    glassBlurTint: 'light',
    glassBlurIntensity: 30,
    navBg: 'rgba(255,255,255,0.6)',
    navBorder: 'rgba(255,255,255,0.82)',
    fill: 'rgba(0,0,0,0.04)',
    fillStrong: 'rgba(0,0,0,0.06)',
    hairline: 'rgba(0,0,0,0.05)',
    heatmapEmpty: 'rgba(120,128,124,0.10)',
  },
  dark: {
    scheme: 'dark',
    accent: Palette.coralLight,
    wallpaper: ['#181822', '#0e0e12', '#150f1f', '#1b1426'],
    wallpaperLocations: [0, 0.55, 0.78, 1],
    text: '#f2f2f6',
    textStrong: '#f2f2f6',
    textSecondary: '#86868f',
    textMuted: '#6a6a73',
    glassBg: 'rgba(40,40,52,0.5)',
    glassBorder: 'rgba(255,255,255,0.08)',
    glassBlurTint: 'dark',
    glassBlurIntensity: 40,
    navBg: 'rgba(34,34,44,0.62)',
    navBorder: 'rgba(255,255,255,0.10)',
    fill: 'rgba(255,255,255,0.05)',
    fillStrong: 'rgba(255,255,255,0.08)',
    hairline: 'rgba(255,255,255,0.06)',
    heatmapEmpty: 'rgba(255,255,255,0.05)',
  },
};

/** Display font (titles, headings, big numbers). Body uses the system stack. */
export const DISPLAY_FONT = 'Batica';

export const Radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

/**
 * Heatmap intensity → color. Mirrors the prototype's shade helpers:
 * ALPHA = ['', '40', '73', 'b0', 'ff'] appended to the accent hex.
 */
const ALPHA = ['', '40', '73', 'b0', 'ff'] as const;

export function shade(theme: Theme, hex: string, level: number): string {
  if (level <= 0) return theme.heatmapEmpty;
  return hex + ALPHA[Math.min(level, 4)];
}

/** Translucent tint of an accent, e.g. accent + '22'. */
export function tint(hex: string, alphaHex = '22'): string {
  return hex + alphaHex;
}
