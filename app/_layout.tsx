import 'react-native-reanimated';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { palette } from '@/constants/theme';
import { IdentificationSessionProvider } from '@/lib/identification-session-context';
import { ResultFeedbackProvider } from '@/lib/result-feedback-context';
import { SavedFindsProvider } from '@/lib/saved-finds-context';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    card: palette.surface,
    primary: palette.accent,
    text: palette.ink,
    border: palette.border,
  },
};

export default function RootLayout() {
  return (
    <IdentificationSessionProvider>
      <SavedFindsProvider>
        <ResultFeedbackProvider>
        <ThemeProvider value={navigationTheme}>
          <StatusBar style="dark" />
          <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: palette.background },
            headerTintColor: palette.ink,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: palette.background },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="capture-tips" options={{ title: 'Before You Snap' }} />
          <Stack.Screen name="review" options={{ title: 'Review Photo' }} />
          <Stack.Screen name="observations" options={{ title: 'Add Details' }} />
          <Stack.Screen name="analyzing" options={{ headerShown: false }} />
          <Stack.Screen name="results" options={{ title: 'Results' }} />
          <Stack.Screen name="saved/[id]" options={{ title: 'Saved Find' }} />
          <Stack.Screen
            name="+not-found"
            options={{
              title: 'Not Found',
              headerRight: () => <FontAwesome name="compass" size={18} color={palette.accent} />,
            }}
          />
          </Stack>
        </ThemeProvider>
        </ResultFeedbackProvider>
      </SavedFindsProvider>
    </IdentificationSessionProvider>
  );
}
