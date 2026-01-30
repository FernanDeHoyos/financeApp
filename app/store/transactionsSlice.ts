import { addTransaction, deleteTransaction, getTransactions, updateTransaction } from '@/app/services/transactions';
import { Transaction } from '@/app/core/types/transaction';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface TransactionsState {
  items: Transaction[];
  loading: boolean;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
};


export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async () => {
    return await getTransactions();
  }
);

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

export const saveTransaction = createAsyncThunk(
  'transactions/save',
  async (t: Omit<Transaction, 'id'>) => {
    const dateStr = formatDateToISO(t.date);
    
    const transaction: Transaction = {
      ...t,
      id: Date.now().toString(),
      date: dateStr,
    };

    await addTransaction(transaction);
    return transaction;
  }
);

export const editTransaction = createAsyncThunk(
  'transactions/edit',
  async ({ id, data }: { id: string; data: Partial<Omit<Transaction, 'id'>> }) => {
    const dateStr = data.date ? formatDateToISO(data.date) : undefined;
    
    const updates = { ...data, ...(dateStr && { date: dateStr }) };
    await updateTransaction(id, updates);
    
    return { id, ...updates };
  }
);


export const removeTransaction = createAsyncThunk(
  'transactions/delete',
  async (id: string) => {
    await deleteTransaction(id);
    return id;
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.pending, state => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(saveTransaction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(removeTransaction.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
      });
  },
});


export default transactionsSlice.reducer;
