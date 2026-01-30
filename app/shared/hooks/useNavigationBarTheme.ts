import { AppTheme } from '@/app/core/theme/theme';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useTheme } from 'react-native-paper';

export function useNavigationBarTheme() {
  const theme = useTheme<AppTheme>();

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    try {
      // Aplicar el color a la Navigation Bar
      SystemUI.setBackgroundColorAsync(theme.colors.surface);
    } catch (error) {
      console.warn('Error setting navigation bar:', error);
    }
  }, [theme.colors.surface]);
}
