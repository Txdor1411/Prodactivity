import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Wallpaper } from '@/components/wallpaper';

/** Height reserved at the bottom so content clears the floating tab bar. */
export const TAB_BAR_CLEARANCE = 96;

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  paddingHorizontal?: number;
  /** Extra top padding on top of the safe-area inset. */
  topPad?: number;
  /** Leave room for the floating tab bar (set false for non-tab routes). */
  withTabBar?: boolean;
};

export function Screen({
  children,
  scroll = true,
  paddingHorizontal = 20,
  topPad = 8,
  withTabBar = true,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top + topPad;
  const paddingBottom = (withTabBar ? TAB_BAR_CLEARANCE : 0) + insets.bottom + 24;

  return (
    <Wallpaper>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal, paddingTop, paddingBottom }}>
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingHorizontal, paddingTop, paddingBottom }}>{children}</View>
      )}
    </Wallpaper>
  );
}
