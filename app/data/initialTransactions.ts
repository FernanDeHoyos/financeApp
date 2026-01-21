import { Transaction } from '../types/transaction';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'income',
    description: 'Salario',
    amount: 2000,
    date: '2024-01-01',
    category: 'Trabajo',
  },
  {
    id: '2',
    type: 'expense',
    description: 'Comida',
    amount: 300,
    date: '2024-01-02',
    category: 'Alimentación',
  },
];
