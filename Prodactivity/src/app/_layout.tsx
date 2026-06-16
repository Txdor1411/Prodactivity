import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from '@/design/auth';
import { OnboardingProvider, useOnboarding } from '@/design/onboarding';
import { ThemeProvider, useTheme } from '@/design/theme';
import { DISPLAY_FONT } from '@/design/tokens';
import { StoreProvider, useStore } from '@/design/store';
import { SocialProvider } from '@/design/social';

function AppSplash({ onDone }: { onDone: () => void }) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(onDone);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity, zIndex: 100 }]}>
      <LinearGradient
        colors={theme.wallpaper}
        locations={theme.wallpaperLocations}
        style={StyleSheet.absoluteFill}
      />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: DISPLAY_FONT,
            fontSize: 34,
            letterSpacing: -0.5,
            color: theme.textStrong,
          }}>
          Prodactivity
        </Text>
      </View>
    </Animated.View>
  );
}

function Navigator() {
  const { ready } = useStore();
  const { ready: onbReady, onboarded } = useOnboarding();
  if (!ready || !onbReady) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}>
      <Stack.Protected guard={!onboarded}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected guard={onboarded}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="habit/[id]" />
        <Stack.Screen name="create" options={{ presentation: 'modal' }} />
        <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="import" options={{ presentation: 'modal' }} />
        <Stack.Screen name="compose" options={{ presentation: 'modal' }} />
        <Stack.Screen name="friends" options={{ presentation: 'modal' }} />
      </Stack.Protected>

      {/* Reachable from both onboarding and the app, so it stays outside the gate. */}
      <Stack.Screen name="auth" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      <StatusBar style="auto" />
      <Navigator />
      {!splashDone && <AppSplash onDone={() => setSplashDone(true)} />}
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Batica: require('@/assets/fonts/BaticaSans-Regular.otf'),
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <StoreProvider>
            <SocialProvider>
              <OnboardingProvider>
                <App />
              </OnboardingProvider>
            </SocialProvider>
          </StoreProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
