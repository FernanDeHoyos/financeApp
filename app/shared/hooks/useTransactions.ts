import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transaction } from '../../core/types/transaction';
import type { AppDispatch, RootState } from '../../store/store';
import {
  editTransaction,
  fetchTransactions,
  removeTransaction,
  saveTransaction,
} from '../../store/transactionsSlice';

export function useTransactions() {
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading } = useSelector(
    (state: RootState) => state.transactions
  );

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    dispatch(saveTransaction(t));
  };

  const updateTransaction = (id: string, data: Partial<Omit<Transaction, 'id'>>) => {
    dispatch(editTransaction({ id, data }));
  };

  const deleteTransaction = (id: string) => {
    dispatch(removeTransaction(id));
  };

  return {
    transactions: items,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

