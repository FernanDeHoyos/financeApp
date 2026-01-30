import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  category: text('category').notNull(),
  date: text('date').notNull(),
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  type: text('type', { enum: ['income', 'expense', 'both'] }).notNull().default('both'),
  isCustom: text('isCustom').notNull().default('true'),
});
