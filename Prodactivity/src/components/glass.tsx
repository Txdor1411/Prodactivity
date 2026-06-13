import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/design/theme';
import { Radius } from '@/design/tokens';

type GlassProps = {
  children?: ReactNode;
  style?: ViewStyle | ViewStyle[];
  radius?: number;
  /** Slightly stronger fill for nav/sheets. */
  intensity?: number;
};

/**
 * Frosted "liquid glass" surface: a real backdrop blur (iOS/Android) under a
 * translucent tinted fill + hairline border, matching the design's GlassCard.
 */
export function Glass({ children, style, radius = Radius.lg, intensity }: GlassProps) {
  const theme = useTheme();
  const blur = intensity ?? theme.glassBlurIntensity;

  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden' }, styles.shadow, style]}>
      {Platform.OS === 'web' ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.glassBg }]} />
      ) : (
        <BlurView
          tint={theme.glassBlurTint}
          intensity={blur}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.glassBg, borderRadius: radius, borderWidth: 1, borderColor: theme.glassBorder },
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#3c3250',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
});
