import { Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/design/theme';
import { DISPLAY_FONT } from '@/design/tokens';

type DisplayProps = TextProps & {
  size?: number;
  weight?: TextStyle['fontWeight'];
  color?: string;
  lineHeight?: number;
  letterSpacing?: number;
};

/** Title / heading / big-number text set in the Batica display face. */
export function Display({
  size = 17,
  weight = '600',
  color,
  lineHeight,
  letterSpacing = -0.3,
  style,
  ...rest
}: DisplayProps) {
  const theme = useTheme();
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: DISPLAY_FONT,
          fontSize: size,
          fontWeight: weight,
          color: color ?? theme.textStrong,
          letterSpacing,
          ...(lineHeight ? { lineHeight } : null),
        },
        style,
      ]}
    />
  );
}

type BodyProps = TextProps & {
  size?: number;
  weight?: TextStyle['fontWeight'];
  color?: string;
  secondary?: boolean;
  muted?: boolean;
};

/** Body / label text in the system sans stack. */
export function Body({ size = 13, weight = '400', color, secondary, muted, style, ...rest }: BodyProps) {
  const theme = useTheme();
  const resolved = color ?? (muted ? theme.textMuted : secondary ? theme.textSecondary : theme.text);
  return <Text {...rest} style={[{ fontSize: size, fontWeight: weight, color: resolved }, style]} />;
}
