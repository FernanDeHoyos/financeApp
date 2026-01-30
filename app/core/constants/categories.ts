// Categorías predefinidas para gastos
export const EXPENSE_CATEGORIES = [
  'Alimentación',
  'Transporte',
  'Vivienda',
  'Entretenimiento',
  'Salud',
  'Ahorro',
  'Otros',
];

// Categorías predefinidas para ingresos
export const INCOME_CATEGORIES = [
  'Salario',
  'Ventas',
  'Regalo',
  'Inversión',
  'Otros',
];

// Todas las categorías únicas
export const ALL_CATEGORIES = Array.from(new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]));
