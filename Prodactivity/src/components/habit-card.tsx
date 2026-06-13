import { Pressable, View } from 'react-native';

import { Glass } from '@/components/glass';
import { CheckIcon } from '@/components/icons';
import { ProgressRing } from '@/components/progress-ring';
import { Body, Display } from '@/components/text';
import { useTheme } from '@/design/theme';
import type { Habit } from '@/design/data';
import { tint } from '@/design/tokens';

/** Circular log button with done / count-ring / empty states. */
export function LogButton({
  habit,
  onPress,
  size = 50,
}: {
  habit: Habit;
  onPress: () => void;
  size?: number;
}) {
  const theme = useTheme();
  const isCount = habit.type === 'count';
  const done = habit.done || (isCount && habit.value >= habit.goal);

  let inner;
  if (done) {
    inner = (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: habit.accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CheckIcon size={size * 0.4} />
      </View>
    );
  } else if (isCount) {
    inner = (
      <ProgressRing size={size} stroke={4} progress={habit.value / habit.goal} color={habit.accent}>
        <View
          style={{
            width: size - 8,
            height: size - 8,
            borderRadius: (size - 8) / 2,
            backgroundColor: theme.scheme === 'dark' ? '#181822' : '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Display size={15} weight="700" color={habit.accent}>
            {String(habit.value)}
          </Display>
        </View>
      </ProgressRing>
    );
  } else {
    inner = (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.scheme === 'dark' ? 'rgba(255,255,255,0.06)' : '#fff',
        }}
      />
    );
  }

  return (
    <Pressable onPress={onPress} hitSlop={6}>
      {inner}
    </Pressable>
  );
}

/** A habit row used on the Today screen. */
export function HabitCard({
  habit,
  subtitle,
  onLog,
}: {
  habit: Habit;
  subtitle: string;
  onLog: () => void;
}) {
  const theme = useTheme();
  return (
    <Glass radius={20} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 11 }}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: tint(habit.accent, theme.scheme === 'dark' ? '33' : '22'),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Body size={21}>{habit.emoji}</Body>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Display size={15} weight="600" lineHeight={17}>
          {habit.name}
        </Display>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
          <Body size={11}>🔥</Body>
          <Body size={12} weight="600" color={theme.scheme === 'dark' ? '#b0b0bb' : '#6a6a73'}>
            {String(habit.streak)}
          </Body>
          <Body size={12} secondary>
            · {subtitle}
          </Body>
        </View>
      </View>
      <LogButton habit={habit} onPress={onLog} />
    </Glass>
  );
}
