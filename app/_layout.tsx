import { darkTheme, lightTheme } from '@/app/core/theme/theme';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { store } from './store/store';

function RootLayoutContent() {
  const systemScheme = useColorScheme();
  const { theme } = useThemeContext();

  const isDark = theme === 'dark' || (theme === 'system' && systemScheme === 'dark');
  const selectedTheme = isDark ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={selectedTheme}>
      <Stack screenOptions={{
        headerShown: false,
      }} />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </ReduxProvider>
  );
}
