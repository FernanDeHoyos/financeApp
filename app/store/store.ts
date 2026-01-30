import { configureStore } from '@reduxjs/toolkit';
import budgetReducer from './budgetSlice';
import transactionsReducer from './transactionsSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    budget: budgetReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
