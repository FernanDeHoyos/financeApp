import { DashboardScreen } from "../screens/Dashboard/DashboardScreen";
import { DetailScreen } from "../screens/Detail/DetailScreen";
import { TransactionFormScreen } from "../screens/TransactionForm/TransactionFormScreen";

import { Transaction } from '../types/transaction';

export type Screen =
  | 'Dashboard'
  | 'AddIncome'
  | 'AddExpense'
  | 'Detail'
  | 'List';

interface AppNavigatorProps {
  screen: Screen;
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  onNavigate: (screen: Screen) => void;
  onSelectTransaction: (transaction: Transaction) => void;
  onSave: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onDelete: (id: string) => void;
}


export function AppNavigator({
  screen,
  transactions,
  selectedTransaction,
  onNavigate,
  onSelectTransaction,
  onSave,
  onDelete,
}: AppNavigatorProps) {
  switch (screen) {
    case 'Dashboard':
      return (
        <DashboardScreen
          transactions={transactions}
          onNavigate={onNavigate}
          onSelectTransaction={onSelectTransaction}
        />
      );
    case 'AddIncome':
      return <TransactionFormScreen type="income" onSave={onSave} onBack={() => onNavigate('Dashboard')} />;
    case 'AddExpense':
      return <TransactionFormScreen type="expense" onSave={onSave} onBack={() => onNavigate('Dashboard')} />;
    case 'Detail':
      return <DetailScreen transaction={selectedTransaction} onBack={() => onNavigate('Dashboard')} onDelete={onDelete} />;
    default:
      return null;
  }
}
