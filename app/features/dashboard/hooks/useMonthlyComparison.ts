import { Transaction } from '@/app/core/types/transaction';
import { useMemo } from 'react';

export interface CategoryDelta {
    category: string;
    amountA: number;
    amountB: number;
    diff: number;
}

export interface MonthlyComparison {
    totalA: number;
    totalB: number;
    totalDiff: number;
    totalDiffPercent: number;
    categoriesDelta: CategoryDelta[];
}

export const useMonthlyComparison = (
    transactions: Transaction[],
    monthA: string, // YYYY-MM
    monthB: string  // YYYY-MM
): MonthlyComparison => {
    return useMemo(() => {
        const getExpensesForMonth = (month: string) =>
            transactions.filter(t => t.date.startsWith(month) && t.type === 'expense');

        const expensesA = getExpensesForMonth(monthA);
        const expensesB = getExpensesForMonth(monthB);

        const totalA = expensesA.reduce((sum, t) => sum + t.amount, 0);
        const totalB = expensesB.reduce((sum, t) => sum + t.amount, 0);

        const totalDiff = totalA - totalB;
        const totalDiffPercent = totalB === 0 ? (totalA > 0 ? 100 : 0) : (totalDiff / totalB) * 100;

        // Group by category for both months
        const catsA: Record<string, number> = {};
        expensesA.forEach(t => {
            catsA[t.category] = (catsA[t.category] || 0) + t.amount;
        });

        const catsB: Record<string, number> = {};
        expensesB.forEach(t => {
            catsB[t.category] = (catsB[t.category] || 0) + t.amount;
        });

        const allCategories = Array.from(new Set([...Object.keys(catsA), ...Object.keys(catsB)]));

        const categoriesDelta: CategoryDelta[] = allCategories.map(category => {
            const amountA = catsA[category] || 0;
            const amountB = catsB[category] || 0;
            return {
                category,
                amountA,
                amountB,
                diff: amountA - amountB
            };
        }).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff)); // Sort by biggest change

        return {
            totalA,
            totalB,
            totalDiff,
            totalDiffPercent,
            categoriesDelta
        };
    }, [transactions, monthA, monthB]);
};
