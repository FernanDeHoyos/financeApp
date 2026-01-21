import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#006C70',
    onPrimary: '#FFFFFF',
    primaryContainer: '#97F0F4',
    onPrimaryContainer: '#002022',
    
    secondary: '#4A6363',
    secondaryContainer: '#CCE8E7',
    onSecondaryContainer: '#051F1F',
    
    tertiary: '#4B607C',
    
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    
    background: '#FBFDFD',
    surface: '#FBFDFD',
    surfaceVariant: '#EFF4F4',
    onSurfaceVariant: '#3F4948',
    
    // Colores personalizados
    income: '#2E7D32',
    incomeContainer: '#C8E6C9',
    expense: '#B00020',
    expenseContainer: '#FFDAD6',
  },
};
