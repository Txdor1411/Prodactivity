import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon, PlusIcon } from '@/components/icons';
import { Body, Display } from '@/components/text';
import { useSocial, type SocialUser } from '@/design/social';
import { useTheme } from '@/design/theme';
import { tint } from '@/design/tokens';

export default function FriendsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dark = theme.scheme === 'dark';
  const { friends, pool, addFriend, removeFriend, nudge } = useSocial();
  const [toast, setToast] = useState<string | null>(null);

  const sheetBg = dark ? '#16161e' : 'rgba(248,247,250,0.98)';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((t) => (t === msg ? null : t)), 2000);
  };

  const onNudge = (f: SocialUser) => {
    nudge(f.id);
    showToast(`Nudged ${f.name} 👈`);
  };

  const avatar = (u: SocialUser) => (
    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: tint(u.accent, dark ? '33' : '24'), alignItems: 'center', justifyContent: 'center' }}>
      <Body size={22}>{u.emoji}</Body>
    </View>
  );

  const label = (t: string) => (
    <Body size={12} weight="600" muted style={{ marginBottom: 11, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {t}
    </Body>
  );

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg, borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 14, paddingBottom: insets.bottom + 26 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: 38, height: 5, borderRadius: 3, backgroundColor: theme.fillStrong, alignSelf: 'center', marginBottom: 16 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Display size={22} weight="600">
            Friends
          </Display>
          <Pressable onPress={() => router.back()} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.fillStrong, alignItems: 'center', justifyContent: 'center' }}>
            <CloseIcon color={theme.textSecondary} />
          </Pressable>
        </View>

        {/* Current friends */}
        {label(`Your friends · ${friends.length}`)}
        {friends.length === 0 ? (
          <Body size={13} secondary style={{ marginBottom: 12 }}>
            No friends yet — add a few below to start sharing proof.
          </Body>
        ) : (
          <View style={{ gap: 9 }}>
            {friends.map((f) => (
              <View key={f.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 11, borderRadius: 16, backgroundColor: theme.fill }}>
                {avatar(f)}
                <Display size={15} weight="600" style={{ flex: 1 }}>
                  {f.name}
                </Display>
                <Pressable onPress={() => onNudge(f)} hitSlop={6} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: theme.fillStrong }}>
                  <Body size={12.5} weight="700" color={theme.textSecondary}>
                    👈 Nudge
                  </Body>
                </Pressable>
                <Pressable onPress={() => removeFriend(f.id)} hitSlop={6} style={{ paddingHorizontal: 11, paddingVertical: 8, borderRadius: 12 }}>
                  <Body size={12.5} weight="700" color={theme.textMuted}>
                    Remove
                  </Body>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Suggested */}
        {pool.length > 0 && (
          <>
            {label('Suggested')}
            <View style={{ gap: 9 }}>
              {pool.map((p) => (
                <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 11, borderRadius: 16, backgroundColor: theme.fill }}>
                  {avatar(p)}
                  <Display size={15} weight="600" style={{ flex: 1 }}>
                    {p.name}
                  </Display>
                  <Pressable
                    onPress={() => addFriend(p.id)}
                    hitSlop={6}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 13, backgroundColor: theme.accent }}>
                    <PlusIcon size={15} width={2.6} />
                    <Body size={13} weight="700" color="#fff">
                      Add
                    </Body>
                  </Pressable>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Toast */}
      {toast && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: insets.bottom + 24, alignItems: 'center' }} pointerEvents="none">
          <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: dark ? '#2a2a36' : '#22222a' }}>
            <Body size={13} weight="600" color="#fff">
              {toast}
            </Body>
          </View>
        </View>
      )}
    </View>
  );
}
