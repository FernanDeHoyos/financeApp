import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const ingresos = sqliteTable('ingresos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  monto: real('monto').notNull(),
  fecha: text('fecha').notNull(),
});

export const gastos = sqliteTable('gastos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  monto: real('monto').notNull(),
  fecha: text('fecha').notNull(),
});
