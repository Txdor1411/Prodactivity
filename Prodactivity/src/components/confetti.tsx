import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, Dimensions, StyleSheet, View } from 'react-native';

const COLORS = ['#F2683C', '#34C77B', '#6C5CE7', '#F5A623', '#2BB8B0', '#FF6B5E'];

type Piece = {
  left: number;
  size: number;
  round: number;
  color: string;
  delay: number;
};

/** Soft confetti burst shown on the "all done today" milestone. */
export function Confetti({ count = 16, height }: { count?: number; height?: number }) {
  const fall = height ?? Dimensions.get('window').height;
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: i * 6.2 + (i % 3) * 4,
        size: 7 + (i % 3) * 3,
        round: i % 2 ? 2 : 50,
        color: COLORS[i % COLORS.length],
        delay: (i % 5) * 180,
      })),
    [count],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} piece={p} fall={fall} />
      ))}
    </View>
  );
}

function ConfettiPiece({ piece, fall }: { piece: Piece; fall: number }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 1800,
        delay: piece.delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [t, piece.delay]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [-14, fall] });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '540deg'] });
  const opacity = t.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: `${piece.left}%`,
        width: piece.size,
        height: piece.size,
        borderRadius: piece.round,
        backgroundColor: piece.color,
        opacity,
        transform: [{ translateY }, { rotate }],
      }}
    />
  );
}
