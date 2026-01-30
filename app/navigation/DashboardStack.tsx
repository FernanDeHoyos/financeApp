import AddExpenseScreen from '@/app/features/dashboard/screens/AddExpenseScreen';
import AddIncomeScreen from '@/app/features/dashboard/screens/AddIncomeScreen';
import { BudgetScreen } from '@/app/features/dashboard/screens/BudgetScreen';
import { DashboardContainer } from '@/app/features/dashboard/screens/DashboardContainer';
import EditTransactionScreen from '@/app/features/dashboard/screens/EditTransactionScreen';
import { MonthlyComparisonScreen } from '@/app/features/dashboard/screens/MonthlyComparisonScreen';
import TransactionsListScreen from '@/app/features/dashboard/screens/TransactionsListScreen';

import { ImportTransactionsScreen } from '@/app/features/import/screens/ImportTransactionsScreen';
import { EditProfileScreen } from '@/app/features/settings/screens/EditProfileScreen';
import { ManageCategoriesScreen } from '@/app/features/settings/screens/ManageCategoriesScreen';
import { SettingsScreen } from '@/app/features/settings/screens/SettingsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type DashboardStackParamList = {
  Dashboard: undefined;
  AddIncome: undefined;
  AddExpense: undefined;
  Budget: undefined;
  EditTransaction: { transaction: any };
  List: undefined;
  MonthlyComparison: { initialDate: string }; // Pass ISO string of selected date
  ManageCategories: undefined;
  Settings: undefined;
  EditProfile: undefined;
  ImportTransactions: undefined;

};

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardContainer} />
      <Stack.Screen name="AddIncome" component={AddIncomeScreen} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      <Stack.Screen name="Budget" component={BudgetScreen} />
      <Stack.Screen name="EditTransaction" component={EditTransactionScreen} />
      <Stack.Screen name="List" component={TransactionsListScreen} />
      <Stack.Screen name="MonthlyComparison" component={MonthlyComparisonScreen} />
      <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />

      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ImportTransactions" component={ImportTransactionsScreen} />

    </Stack.Navigator>
  );
}
