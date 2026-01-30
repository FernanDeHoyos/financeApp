
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../core/constants/categories";

// Map common descriptions to App Categories
// Keys MUST match values in EXPENSE_CATEGORIES or INCOME_CATEGORIES
export const AUTO_CATEGORIES: Record<string, string[]> = {
    // Gastos
    'Alimentación': ['restaurante', 'rappi', 'didi food', 'comida', 'almuerzo', 'cena', 'burger', 'pizza', 'mc donalds', 'kfc', 'corral', 'frisby'],
    'Mercado': ['exito', 'carulla', 'd1', 'ara', 'jumbo', 'olimpica', 'mercado', 'tienda', 'supermercado', 'oxxo'],
    'Transporte': ['uber', 'didi', 'cabify', 'ticket', 'pasaje', 'bus', 'transmilenio', 'metro', 'gasolina', 'terpel', 'primax', 'parqueadero'],
    'Salud': ['drogueria', 'farmacia', 'medico', 'consultas', 'salud', 'eps', 'cruz verde', 'doctors', 'hospital'],
    'Vivienda': ['arriendo', 'administracion', 'servicios', 'luz', 'agua', 'gas', 'internet', 'claro', 'movistar', 'tigo', 'homecenter', 'etb'],
    'Entretenimiento': ['netflix', 'spotify', 'cine', 'tiquetes', 'concierto', 'juegos', 'steam', 'playstation', 'prime video', 'hbomax', 'disney'],
    'Bancos': ['cuota manejo', 'intereses', 'seguro tarjeta', 'bancolombia', 'transaccion', 'comision'],
    'Retiros': ['retiro', 'cajero'],
    'Transferencias': ['nequi', 'transfiya', 'daviplata', 'transferencia', 'abono a cuenta'], // Could be mixed, implies checking context or user mapping

    // Ingresos
    'Salario': ['nomina', 'nomi', 'salario', 'sueldo', 'pago de nomina', 'honorarios'],
    'Ventas': ['venta', 'pago recibido'],
    'Inversión': ['rendimientos', 'fiducuenta', 'dividendos'],
};

export const categorizeByDescription = (description: string): string => {
    const lowerDesc = description.toLowerCase();

    for (const [category, keywords] of Object.entries(AUTO_CATEGORIES)) {
        if (keywords.some(keyword => lowerDesc.includes(keyword))) {
            return category;
        }
    }

    return 'Otros'; // Default to generic 'Otros' instead of 'Importado' which might look weird
};

export const inferTypeFromCategory = (category: string): 'income' | 'expense' => {
    // If it is in Expense Categories list
    // Note: checks partial match or exact? Exact is better if clean.
    if (EXPENSE_CATEGORIES.includes(category) || category === 'Mercado' || category === 'Bancos' || category === 'Retiros') {
        return 'expense';
    }
    if (INCOME_CATEGORIES.includes(category)) {
        return 'income';
    }
    // Fallback: Default to expense as safe bet for imported banking stuff? 
    // Or keep based on sign.
    // For now, return 'expense' for most unclassified things if they are not explicitly income
    return 'expense';
};

export const normalizeCategory = (rawCategory: string): string => {
    if (!rawCategory) return 'Otros';

    // 1. Direct match (Case insensitive)
    const exactMatch = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].find(c => c.toLowerCase() === rawCategory.toLowerCase());
    if (exactMatch) return exactMatch;

    // 2. Keyword match (Thesaurus)
    const lowerRaw = rawCategory.toLowerCase();
    for (const [sysCat, keywords] of Object.entries(AUTO_CATEGORIES)) {
        if (keywords.some(k => lowerRaw.includes(k))) {
            return sysCat;
        }
    }

    // 3. Fallback: If it looks like "Comida", map to "Alimentación" specifically (common alias)
    // (This is covered by AUTO_CATEGORIES technically if 'comida' is a keyword, which it is)

    // 4. Return raw if reasonable, or 'Importado'?
    // User prefers "Default Categories". If we can't match, maybe we should return 'Otros'?
    // Or return Title Case of raw?
    return rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);
};
