import { BottomTabs } from './BottomTabs';

export type Screen =
  | 'Dashboard'
  | 'AddIncome'
  | 'AddExpense'
  | 'List'
  | 'Balance'
  | 'MonthlyComparison'
  | 'ManageCategories'
  | 'Settings'
  | 'EditProfile';

export function AppNavigator() {
  return <BottomTabs />;
}
