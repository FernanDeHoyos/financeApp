import { darkTheme, lightTheme } from '@/app/core/theme/theme';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { queryClient } from './core/api/queryClient';
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
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
