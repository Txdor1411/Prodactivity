import { useEffect } from 'react';
import { View, useWindowDimensions, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/design/theme';
import { Radius } from '@/design/tokens';

// ─── primitive ───────────────────────────────────────────────────────────────

type BoneProps = {
  width?: ViewStyle['width'];
  height?: number;
  radius?: number;
  style?: ViewStyle;
};

export function SkeletonBone({ width = '100%', height = 16, radius = Radius.sm, style }: BoneProps) {
  const theme = useTheme();
  const { width: screenW } = useWindowDimensions();

  const isDark = theme.scheme === 'dark';
  const baseColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const shimmerColors = isDark
    ? (['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.07)'] as const)
    : (['rgba(0,0,0,0.07)', 'rgba(255,255,255,0.55)', 'rgba(0,0,0,0.07)'] as const);

  const translateX = useSharedValue(-screenW);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(screenW, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [screenW, translateX]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: baseColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View style={[{ position: 'absolute', top: 0, bottom: 0, width: screenW }, shimmerStyle]}>
        <LinearGradient
          colors={shimmerColors}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

// ─── presets ─────────────────────────────────────────────────────────────────

/** Mimics a single list row: avatar circle + two text lines. */
export function SkeletonListItem({ style }: { style?: ViewStyle }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 12 }, style]}>
      <SkeletonBone width={44} height={44} radius={999} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonBone width="60%" height={14} />
        <SkeletonBone width="40%" height={12} />
      </View>
    </View>
  );
}

/** Mimics a card with a tall image area + two text lines below. */
export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[{ gap: 10 }, style]}>
      <SkeletonBone width="100%" height={140} radius={Radius.lg} />
      <SkeletonBone width="75%" height={16} />
      <SkeletonBone width="50%" height={13} />
    </View>
  );
}

/** Mimics a stat tile: number + label. */
export function SkeletonStat({ style }: { style?: ViewStyle }) {
  return (
    <View style={[{ gap: 6, alignItems: 'center' }, style]}>
      <SkeletonBone width={56} height={28} radius={Radius.sm} />
      <SkeletonBone width={40} height={12} radius={Radius.sm} />
    </View>
  );
}
