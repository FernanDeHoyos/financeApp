import { useState } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/initialTransactions';
import { Transaction } from '../types/transaction';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const addTransaction = (t: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions(prev => [
      {
        ...t,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
      },
      ...prev,
    ]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
  };
}
