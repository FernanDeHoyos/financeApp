import { Transaction } from '@/app/core/types/transaction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addTransaction as addTransactionService,
  deleteTransaction as deleteTransactionService,
  getTransactions,
  updateTransaction as updateTransactionService
} from '../../services/transactions';

export function useTransactions() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading: loading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  const formatDateToISO = (date: any): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    if (typeof date === 'object' && 'toISOString' in date) {
      return (date as Date).toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
      return date;
    }
    return new Date().toISOString().split('T')[0];
  };

  const addMutation = useMutation({
    mutationFn: async (t: Omit<Transaction, 'id'>) => {
      const dateStr = formatDateToISO(t.date);
      const transaction: Transaction = {
        ...t,
        id: Date.now().toString(),
        date: dateStr,
      };
      await addTransactionService(transaction);
      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<Transaction, 'id'>> }) => {
      const dateStr = data.date ? formatDateToISO(data.date) : undefined;
      const updates = { ...data, ...(dateStr && { date: dateStr }) };
      await updateTransactionService(id, updates);
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteTransactionService(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const importMutation = useMutation({
    mutationFn: async (items: Omit<Transaction, 'id'>[]) => {
      const transactionsToSave = items.map(t => ({
        ...t,
        id: Date.now().toString() + Math.random().toString().substring(2, 8),
        date: formatDateToISO(t.date),
      } as Transaction));

      // Import service dynamically or statically
      // Note: We need to make sure bulkAddTransactions is exported from services/transactions
      const { bulkAddTransactions } = await import('../../services/transactions');
      await bulkAddTransactions(transactionsToSave);
      return transactionsToSave;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    transactions: items,
    loading,
    addTransaction: addMutation.mutate,
    updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id'>>) => updateMutation.mutate({ id, data }),
    deleteTransaction: deleteMutation.mutateAsync, // Expose async for await usage in UI
    importTransactions: importMutation.mutateAsync,
  };
}


