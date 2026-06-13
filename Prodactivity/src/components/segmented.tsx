import { Pressable, View } from 'react-native';

import { Body } from '@/components/text';
import { useTheme } from '@/design/theme';

/** Compact segmented control matching the design's pill toggles. */
export function Segmented({
  options,
  value,
  onChange,
  paddingH = 12,
}: {
  options: string[];
  value: string;
  onChange?: (v: string) => void;
  paddingH?: number;
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 3,
        borderRadius: 13,
        backgroundColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)',
        borderWidth: 1,
        borderColor: theme.glassBorder,
      }}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange?.(opt)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: paddingH,
              borderRadius: 10,
              backgroundColor: active
                ? theme.scheme === 'dark'
                  ? 'rgba(255,255,255,0.14)'
                  : '#fff'
                : 'transparent',
            }}>
            <Body size={12} weight="600" color={active ? theme.textStrong : theme.textMuted}>
              {opt}
            </Body>
          </Pressable>
        );
      })}
    </View>
  );
}
