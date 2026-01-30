import { Transaction } from '@/app/core/types/transaction';
import { db } from '@/db/client';
import { transactions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getTransactions = async () => {
  return await db.select().from(transactions);
};

export const addTransaction = async (t: Transaction) => {
  await db.insert(transactions).values(t);
};

export const updateTransaction = async (id: string, t: Partial<Omit<Transaction, 'id'>>) => {
  await db.update(transactions).set(t).where(eq(transactions.id, id));
};

export const deleteTransaction = async (id: string) => {
  await db.delete(transactions).where(eq(transactions.id, id));
};
