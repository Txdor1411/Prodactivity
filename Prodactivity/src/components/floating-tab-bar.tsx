import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Glass } from '@/components/glass';
import { FeedIcon, HabitsIcon, InsightsIcon, SettingsIcon, TodayIcon } from '@/components/icons';
import { Body } from '@/components/text';
import { useTheme } from '@/design/theme';

const ICONS: Record<string, (p: { color: string; active: boolean }) => React.ReactElement> = {
  index: ({ color, active }) => <TodayIcon color={color} active={active} />,
  habits: ({ color, active }) => <HabitsIcon color={color} active={active} />,
  feed: ({ color, active }) => <FeedIcon color={color} active={active} />,
  insights: ({ color, active }) => <InsightsIcon color={color} active={active} />,
  settings: ({ color, active }) => <SettingsIcon color={color} active={active} />,
};

const LABELS: Record<string, string> = {
  index: 'Today',
  habits: 'Habits',
  feed: 'Feed',
  insights: 'Insights',
  settings: 'Settings',
};

type TabRoute = { key: string; name: string };

/** Floating frosted-glass tab bar matching the design's bottom nav.
 *  Typed loosely to avoid coupling to expo-router's internal navigator types. */
export function FloatingTabBar({ state, navigation }: { state: any; navigation: any }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const inactive = theme.scheme === 'dark' ? '#76767f' : '#9a9aa4';

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <Glass radius={26} intensity={theme.scheme === 'dark' ? 50 : 60} style={styles.bar}>
        <View style={styles.row}>
          {state.routes.map((route: TabRoute, i: number) => {
            const Icon = ICONS[route.name];
            if (!Icon) return null;
            const focused = state.index === i;
            const color = focused ? theme.accent : inactive;

            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            };

            return (
              <Pressable key={route.key} onPress={onPress} style={styles.item} hitSlop={6}>
                <Icon color={color} active={focused} />
                <Body size={9.5} weight={focused ? '700' : '600'} color={color}>
                  {LABELS[route.name]}
                </Body>
              </Pressable>
            );
          })}
        </View>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 0,
  },
  bar: {
    height: 62,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  item: {
    alignItems: 'center',
    gap: 3,
  },
});
