import { AppTheme } from '@/app/core/theme/theme';
import BalanceScreen from '@/app/features/dashboard/screens/BalanceScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BarChart3, Home } from 'lucide-react-native';
import { useTheme } from 'react-native-paper';
import { DashboardStack } from './DashboardStack';

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  const { colors } = useTheme<AppTheme>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surfaceVariant,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Balances"
        component={BalanceScreen}
        options={{
          tabBarLabel: 'Balances',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
