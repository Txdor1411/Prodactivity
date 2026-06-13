import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { Themes, type Scheme } from './tokens';

type ThemePref = Scheme | 'auto';

type ThemeContextValue = {
  theme: (typeof Themes)['light'];
  pref: ThemePref;
  setPref: (p: ThemePref) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [pref, setPref] = useState<ThemePref>('auto');

  const value = useMemo<ThemeContextValue>(() => {
    const scheme: Scheme = pref === 'auto' ? (system === 'dark' ? 'dark' : 'light') : pref;
    return { theme: Themes[scheme], pref, setPref };
  }, [pref, system]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx.theme;
}

export function useThemePref() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemePref must be used within ThemeProvider');
  return ctx;
}
