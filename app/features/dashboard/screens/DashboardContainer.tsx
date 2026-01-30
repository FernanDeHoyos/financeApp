import { useThemeContext } from '@/app/context/ThemeContext';
import { useTransactions } from '@/app/shared/hooks/useTransactions';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { DashboardScreen } from './DashboardScreen';

export function DashboardContainer() {
  const navigation = useNavigation<any>();
  const { transactions, loading } = useTransactions();
  const { toggleTheme } = useThemeContext();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <DashboardScreen
      transactions={transactions}
      onSelectTransaction={(t) =>
        navigation.navigate('List', { transaction: t })
      }
      onNavigate={(screen, params) => navigation.navigate(screen, params)}
      onToggleTheme={toggleTheme}
    />
  );
}

