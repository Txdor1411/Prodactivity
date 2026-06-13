import type { ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/design/theme';

type ProgressRingProps = {
  size: number;
  stroke: number;
  /** 0–1 */
  progress: number;
  color: string;
  trackColor?: string;
  children?: ReactNode;
};

/** Circular progress ring (rotated so 0% starts at the top). */
export function ProgressRing({ size, stroke, progress, color, trackColor, children }: ProgressRingProps) {
  const theme = useTheme();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const track = trackColor ?? (theme.scheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(120,120,130,0.15)');
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c * clamped} ${c}`}
        />
      </Svg>
      {children != null && (
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>{children}</View>
      )}
    </View>
  );
}
