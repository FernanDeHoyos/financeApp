import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import { INITIAL_TRANSACTIONS } from './data/initialTransactions';
import { AppNavigator, Screen } from './navigation/AppNavigator';
import { theme } from './theme/theme';
import { Transaction } from './types/transaction';

export default function App() {
  const [screen, setScreen] = useState<Screen>('Dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleSave = (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    const t: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
    };
    setTransactions(prev => [t, ...prev]);
    setScreen('Dashboard');
  };

  const handleDelete = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setScreen('Dashboard');
  };

  const handleSelectTransaction = (t: Transaction) => {
    setSelectedTransaction(t);
    setScreen('Detail');
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

        <AppNavigator
          screen={screen}
          transactions={transactions}
          selectedTransaction={selectedTransaction}
          onNavigate={setScreen}
          onSelectTransaction={handleSelectTransaction}
          onSave={handleSave}
          onDelete={handleDelete}
        />

      </SafeAreaView>
    </PaperProvider>
  );
}
