import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';

export type AppTheme = MD3Theme & {
  colors: MD3Theme['colors'] & {
    income: string;
    incomeContainer: string;
    expense: string;
    expenseContainer: string;
  };
};

export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    primary: '#263333',
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

    income: '#2E7D32',
    incomeContainer: '#C8E6C9',
    expense: '#B00020',
    expenseContainer: '#FFDAD6',
  },
};


export const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,

    primary: '#97F0F4',
    onPrimary: '#002022',
    primaryContainer: '#004F55',
    onPrimaryContainer: '#97F0F4',

    secondary: '#B2CCCB',
    secondaryContainer: '#354F4F',
    onSecondaryContainer: '#CCE8E7',

    tertiary: '#B3C5E6',

    error: '#FFB4AB',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',

    background: '#0E1415',
    surface: '#0E1415',
    surfaceVariant: '#3F4948',
    onSurfaceVariant: '#BFC8C7',

    income: '#81C784',
    incomeContainer: '#1B5E20',
    expense: '#EF9A9A',
    expenseContainer: '#7F0000',
  },
};
