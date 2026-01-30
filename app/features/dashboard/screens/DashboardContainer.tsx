import { useThemeContext } from '@/app/context/ThemeContext';
import { useTransactions } from '@/app/shared/hooks/useTransactions';
import { useNavigation } from '@react-navigation/native';
import { DashboardScreen } from './DashboardScreen';

export function DashboardContainer() {
  const navigation = useNavigation<any>();
  const { transactions } = useTransactions();
  const { toggleTheme } = useThemeContext();

  return (
    <DashboardScreen
      transactions={transactions}
      onSelectTransaction={(t) =>
        navigation.navigate('List', { transaction: t })
      }
      onNavigate={(screen) => navigation.navigate(screen)}
      onToggleTheme={toggleTheme}
    />
  );
}

