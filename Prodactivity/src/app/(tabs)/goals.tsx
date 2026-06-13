import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { Glass } from '@/components/glass';
import { ChevronRight } from '@/components/icons';
import { ProgressRing } from '@/components/progress-ring';
import { Screen } from '@/components/screen';
import { Body, Display } from '@/components/text';
import { useTheme } from '@/design/theme';
import { Palette, tint } from '@/design/tokens';

const FEATURED = {
  title: 'Get fit',
  emoji: '🏋️',
  pct: 64,
  color: Palette.run,
  habits: ['🏃', '🥗', '💧'],
  meta: '🎯 Target Aug 1 · ',
  metaAccent: '50 days left',
};

const GOALS = [
  { title: 'Calm mind', emoji: '🧘', pct: 78, color: Palette.meditate, sub: 'Meditate + Sleep · daily ritual' },
  { title: 'Read 24 books', emoji: '📚', pct: 42, color: Palette.read, sub: '10 of 24 · 🎯 Dec 31' },
  { title: 'Stay hydrated', emoji: '💧', pct: 86, color: Palette.water, sub: '8 glasses / day · 26-day run' },
];

export default function GoalsScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <Display size={26} weight="600">
        Goals
      </Display>
      <Body size={13} secondary style={{ marginTop: 6 }}>
        4 objectives · 2 due this season
      </Body>

      {/* Featured goal */}
      <View
        style={{
          marginTop: 18,
          borderRadius: 24,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.glassBorder,
        }}>
        <LinearGradient
          colors={[
            tint(FEATURED.color, theme.scheme === 'dark' ? '38' : '29'),
            theme.scheme === 'dark' ? 'rgba(40,40,52,0.45)' : 'rgba(255,255,255,0.5)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 18 }}>
          <ProgressRing size={78} stroke={8} progress={FEATURED.pct / 100} color={FEATURED.color}>
            <Display size={20} weight="600">
              {FEATURED.pct}%
            </Display>
          </ProgressRing>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Body size={20}>{FEATURED.emoji}</Body>
              <Display size={18} weight="600">
                {FEATURED.title}
              </Display>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
              {FEATURED.habits.map((e, i) => (
                <View
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    backgroundColor: tint(FEATURED.color, '33'),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Body size={12}>{e}</Body>
                </View>
              ))}
              <Body size={11.5} secondary style={{ marginLeft: 3 }}>
                3 habits
              </Body>
            </View>
            <Body size={12} secondary style={{ marginTop: 8 }}>
              {FEATURED.meta}
              <Body size={12} weight="600" color={theme.accent}>
                {FEATURED.metaAccent}
              </Body>
            </Body>
          </View>
        </LinearGradient>
      </View>

      {/* Goal rows */}
      <View style={{ gap: 13, marginTop: 13 }}>
        {GOALS.map((g) => (
          <Glass key={g.title} radius={22} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 }}>
            <ProgressRing size={60} stroke={7} progress={g.pct / 100} color={g.color}>
              <Display size={15} weight="600">
                {g.pct}%
              </Display>
            </ProgressRing>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Body size={16}>{g.emoji}</Body>
                <Display size={16} weight="600">
                  {g.title}
                </Display>
              </View>
              <Body size={12} secondary style={{ marginTop: 6 }}>
                {g.sub}
              </Body>
            </View>
            <ChevronRight color={theme.scheme === 'dark' ? '#56565f' : '#c0c0c8'} />
          </Glass>
        ))}
      </View>
    </Screen>
  );
}
