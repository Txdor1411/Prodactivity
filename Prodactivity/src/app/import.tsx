import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowRight, ChevronLeft, UploadIcon } from '@/components/icons';
import { Body, Display } from '@/components/text';
import { useTheme } from '@/design/theme';
import { Palette, tint } from '@/design/tokens';

type Row = { emoji: string; name: string; meta: string; tag: 'New' | 'Merge' | 'Replace'; color: string };

const PREVIEW: Row[] = [
  { emoji: '💧', name: 'Drink water', meta: 'count · 12-day streak', tag: 'New', color: Palette.water },
  { emoji: '🧘', name: 'Meditate', meta: 'timer · exists locally', tag: 'Merge', color: Palette.meditate },
  { emoji: '🏃', name: 'Morning run', meta: 'done · overwrite local', tag: 'Replace', color: Palette.run },
  { emoji: '📚', name: 'Read', meta: 'timer · new habit', tag: 'New', color: Palette.read },
];

const TAG_COLOR: Record<Row['tag'], string> = { New: Palette.emerald, Merge: Palette.meditate, Replace: Palette.coral };

const JSON_LINES: { pad: number; parts: [string, string][] }[] = [
  { pad: 0, parts: [['{', 'punc']] },
  { pad: 12, parts: [['"habits"', 'key'], [': [', 'punc']] },
  { pad: 24, parts: [['{ ', 'punc'], ['"name"', 'key'], [': ', 'punc'], ['"Drink water"', 'str'], [',', 'punc']] },
  { pad: 36, parts: [['"type"', 'key'], [': ', 'punc'], ['"count"', 'str'], [', ', 'punc'], ['"goal"', 'key'], [': ', 'punc'], ['8', 'num'], [',', 'punc']] },
  { pad: 36, parts: [['"color"', 'key'], [': ', 'punc'], ['"#2BB8B0"', 'str'], [',', 'punc']] },
  { pad: 36, parts: [['"streak"', 'key'], [': ', 'punc'], ['12', 'num'], [' },', 'punc']] },
  { pad: 24, parts: [['{ ', 'punc'], ['"name"', 'key'], [': ', 'punc'], ['"Meditate"', 'str'], [', … }', 'punc']] },
  { pad: 12, parts: [[']', 'punc']] },
  { pad: 0, parts: [['}', 'punc']] },
];

const SYNTAX: Record<string, string> = { key: '#8fd4ff', str: '#a8e6a0', num: '#ffce7a', punc: '#7a7a86' };

export default function ImportScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dark = theme.scheme === 'dark';
  const [step, setStep] = useState<1 | 2>(1);

  const sheetBg = dark ? '#0e0e12' : '#f6f1ec';
  const back = () => (step === 2 ? setStep(1) : router.back());

  const Header = ({ title, subtitle }: { title: string; subtitle: React.ReactNode }) => (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <Pressable onPress={back} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: theme.glassBg, borderWidth: 1, borderColor: theme.glassBorder, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft color={theme.scheme === 'dark' ? '#c8c8d0' : '#56565f'} />
        </Pressable>
        <Display size={20} weight="600">
          {title}
        </Display>
      </View>
      <Body size={13} secondary style={{ marginTop: 6, paddingLeft: 2 }}>
        {subtitle}
      </Body>
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 26 }} showsVerticalScrollIndicator={false}>
        {step === 1 ? (
          <>
            <Header title="Import habits" subtitle="Step 1 of 2 · bring data from another app" />

            {/* Dropzone */}
            <View style={{ marginTop: 20, alignItems: 'center', gap: 12, paddingVertical: 34, paddingHorizontal: 20, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', borderColor: tint(Palette.coral, '66'), backgroundColor: tint(Palette.coral, '0d') }}>
              <View style={{ width: 58, height: 58, borderRadius: 18, backgroundColor: tint(Palette.coral, '24'), alignItems: 'center', justifyContent: 'center' }}>
                <UploadIcon color={Palette.coral} />
              </View>
              <Display size={16} weight="600">
                Drop a .json file
              </Display>
              <Body size={12.5} secondary>
                or tap to browse · max 2 MB
              </Body>
            </View>

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: theme.hairline }} />
              <Body size={12} muted>
                or paste JSON
              </Body>
              <View style={{ flex: 1, height: 1, backgroundColor: theme.hairline }} />
            </View>

            {/* JSON code block */}
            <View style={{ marginTop: 14, borderRadius: 18, backgroundColor: '#1d1d24', padding: 14 }}>
              {JSON_LINES.map((line, i) => (
                <Body key={i} style={{ paddingLeft: line.pad, fontFamily: 'monospace', fontSize: 11, lineHeight: 18 }}>
                  {line.parts.map(([text, kind], j) => (
                    <Body key={j} style={{ fontFamily: 'monospace', fontSize: 11 }} color={SYNTAX[kind]}>
                      {text}
                    </Body>
                  ))}
                </Body>
              ))}
            </View>

            <Pressable onPress={() => setStep(2)} style={{ marginTop: 16, height: 54, borderRadius: 18, backgroundColor: Palette.coral, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: Palette.coral, shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } }}>
              <Display size={16} weight="600" color="#fff">
                Preview import
              </Display>
              <ArrowRight />
            </Pressable>
          </>
        ) : (
          <>
            <Header
              title="Preview import"
              subtitle={
                <Body size={13} secondary>
                  Step 2 of 2 ·{' '}
                  <Body size={13} weight="600" color={Palette.emerald}>
                    12 habits
                  </Body>{' '}
                  found · 287 logs
                </Body>
              }
            />

            {/* Stat chips */}
            <View style={{ flexDirection: 'row', gap: 9, marginTop: 16, marginBottom: 14 }}>
              {[
                { n: '9', l: 'New', c: Palette.emerald },
                { n: '2', l: 'Merge', c: Palette.meditate },
                { n: '1', l: 'Replace', c: Palette.coral },
              ].map((s) => (
                <View key={s.l} style={{ flex: 1, padding: 11, borderRadius: 14, alignItems: 'center', backgroundColor: tint(s.c, '1f') }}>
                  <Display size={19} weight="600" color={s.c}>
                    {s.n}
                  </Display>
                  <Body size={11} secondary style={{ marginTop: 3 }}>
                    {s.l}
                  </Body>
                </View>
              ))}
            </View>

            {/* Preview rows */}
            <View style={{ gap: 9 }}>
              {PREVIEW.map((row) => (
                <View key={row.name} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, padding: 12, borderRadius: 16, backgroundColor: theme.glassBg, borderWidth: 1, borderColor: theme.glassBorder }}>
                  <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: tint(row.color, '2e'), alignItems: 'center', justifyContent: 'center' }}>
                    <Body size={18}>{row.emoji}</Body>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Display size={14} weight="600">
                      {row.name}
                    </Display>
                    <Body size={11.5} secondary style={{ marginTop: 3 }}>
                      {row.meta}
                    </Body>
                  </View>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 9, backgroundColor: tint(TAG_COLOR[row.tag], '29') }}>
                    <Body size={11} weight="700" color={TAG_COLOR[row.tag]}>
                      {row.tag}
                    </Body>
                  </View>
                </View>
              ))}
            </View>

            {/* Footer actions */}
            <View style={{ flexDirection: 'row', gap: 11, marginTop: 14 }}>
              <Pressable onPress={() => setStep(1)} style={{ width: 54, height: 54, borderRadius: 18, backgroundColor: theme.fillStrong, alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft color={theme.textSecondary} />
              </Pressable>
              <Pressable onPress={() => router.back()} style={{ flex: 1, height: 54, borderRadius: 18, backgroundColor: Palette.emerald, alignItems: 'center', justifyContent: 'center', shadowColor: Palette.emerald, shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } }}>
                <Display size={16} weight="600" color="#fff">
                  Import 12 habits
                </Display>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
