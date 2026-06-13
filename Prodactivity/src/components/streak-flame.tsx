import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import { Palette } from '@/design/tokens';

type StreakFlameProps = {
  /** Diameter of the glow halo. */
  size?: number;
  /** Emoji font size. */
  glyph?: number;
  color?: string;
  emoji?: string;
};

/** Pulsing flame with a soft radial glow — grows with the streak. */
export function StreakFlame({ size = 62, glyph = 34, color = Palette.coral, emoji = '🔥' }: StreakFlameProps) {
  const flame = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = (val: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: 1, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      );
    const a = loop(flame, 1200);
    const b = loop(glow, 1300);
    a.start();
    b.start();
    return () => {
      a.stop();
      b.stop();
    };
  }, [flame, glow]);

  const flameScale = flame.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] });
  const flameRotate = flame.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] });
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.18] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.22, 0.7] });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color + '22',
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: size + 8,
          height: size + 8,
          borderRadius: (size + 8) / 2,
          backgroundColor: color + '40',
          opacity: glowOpacity,
          transform: [{ scale: glowScale }],
        }}
      />
      <Animated.Text style={{ fontSize: glyph, transform: [{ scale: flameScale }, { rotate: flameRotate }] }}>
        {emoji}
      </Animated.Text>
    </View>
  );
}

/** Small static flame label (used in lists). */
export function FlameGlyph({ size = 11 }: { size?: number }) {
  return <Text style={{ fontSize: size }}>🔥</Text>;
}
