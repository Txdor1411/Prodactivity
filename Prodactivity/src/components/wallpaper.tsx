import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/design/theme';

/** Full-screen warm/dark gradient backdrop used behind every screen. */
export function Wallpaper({ children, style }: { children?: ReactNode; style?: ViewStyle }) {
  const theme = useTheme();
  return (
    <View style={[styles.fill, style]}>
      <LinearGradient
        colors={theme.wallpaper}
        locations={theme.wallpaperLocations}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
