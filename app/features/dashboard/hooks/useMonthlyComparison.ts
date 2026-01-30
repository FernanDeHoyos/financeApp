import { Transaction } from '@/app/core/types/transaction';
import { useMemo } from 'react';

export interface CategoryDelta {
    category: string;
    amountA: number;
    amountB: number;
    diff: number;
}

export interface MonthlyComparison {
    expensesA: number;
    expensesB: number;
    incomeA: number;
    incomeB: number;
    balanceA: number;
    balanceB: number;
    savingsRateA: number;
    savingsRateB: number;
    dailyAverageA: number;
    dailyAverageB: number;
    expensesDiff: number;
    expensesDiffPercent: number;
    incomeDiff: number;
    incomeDiffPercent: number;
    categoriesDelta: CategoryDelta[];
}

export const useMonthlyComparison = (
    transactions: Transaction[],
    monthA: string, // YYYY-MM
    monthB: string  // YYYY-MM
): MonthlyComparison => {
    return useMemo(() => {
        const getTransactionsForMonth = (monthKey: string) =>
            transactions.filter(t => {
                // Robust Date Parsing
                if (!t.date) return false;
                const parts = t.date.split('-');
                if (parts.length !== 3) return false;

                const year = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10);

                // Validate year and month
                if (isNaN(year) || isNaN(m) || m < 1 || m > 12) return false;

                const transactionMonthKey = `${year}-${m.toString().padStart(2, '0')}`; // YYYY-MM
                return transactionMonthKey === monthKey;
            });

        const txsA = getTransactionsForMonth(monthA);
        const txsB = getTransactionsForMonth(monthB);

        const calculateMetrics = (txs: Transaction[], monthKey: string) => {
            const income = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const expenses = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const balance = income - expenses;
            const savingsRate = income > 0 ? (balance / income) * 100 : 0;

            // Days in month calculation
            const [y, m] = monthKey.split('-').map(Number);
            const daysInMonth = new Date(y, m, 0).getDate();
            // If current month, use today's date to avoid diluting average? Optional, stick to full month for simple daily rate "pacing"
            // Let's use actual days passed if it's the current month, otherwise total days.
            const now = new Date();
            const isCurrentMonth = now.getFullYear() === y && (now.getMonth() + 1) === m;
            const daysToCount = isCurrentMonth ? now.getDate() : daysInMonth;

            const dailyAverage = daysToCount > 0 ? expenses / daysToCount : 0;

            return { income, expenses, balance, savingsRate, dailyAverage };
        };

        const metricsA = calculateMetrics(txsA, monthA);
        const metricsB = calculateMetrics(txsB, monthB);

        const expensesDiff = metricsA.expenses - metricsB.expenses;
        const expensesDiffPercent = metricsB.expenses === 0 ? (metricsA.expenses > 0 ? 100 : 0) : (expensesDiff / metricsB.expenses) * 100;

        const incomeDiff = metricsA.income - metricsB.income;
        const incomeDiffPercent = metricsB.income === 0 ? (metricsA.income > 0 ? 100 : 0) : (incomeDiff / metricsB.income) * 100;

        // Group by category for both months (Expenses Only)
        const catsA: Record<string, number> = {};
        txsA.filter(t => t.type === 'expense').forEach(t => {
            catsA[t.category] = (catsA[t.category] || 0) + t.amount;
        });

        const catsB: Record<string, number> = {};
        txsB.filter(t => t.type === 'expense').forEach(t => {
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
        }).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

        return {
            expensesA: metricsA.expenses,
            expensesB: metricsB.expenses,
            incomeA: metricsA.income,
            incomeB: metricsB.income,
            balanceA: metricsA.balance,
            balanceB: metricsB.balance,
            savingsRateA: metricsA.savingsRate,
            savingsRateB: metricsB.savingsRate,
            dailyAverageA: metricsA.dailyAverage,
            dailyAverageB: metricsB.dailyAverage,
            expensesDiff,
            expensesDiffPercent,
            incomeDiff,
            incomeDiffPercent,
            categoriesDelta
        };
    }, [transactions, monthA, monthB]);
};
