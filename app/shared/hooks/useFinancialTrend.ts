import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from '@/app/core/types/transaction';
import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

export type TrendDirection = 'increasing' | 'decreasing' | 'stable';

export interface FinancialTrend {
    direction: TrendDirection;
    percentageChange: number; // vs rolling average
    insightText: string;
    statusColor: string;
    averageSpending: number;
    currentSpending: number;
}

export const useFinancialTrend = (transactions: Transaction[]) => {
    const theme = useTheme<AppTheme>();
    const { colors } = theme;

    return useMemo((): FinancialTrend => {
        // 1. Filter expenses
        const expenses = transactions.filter(t => t.type === 'expense');

        if (expenses.length === 0) {
            return {
                direction: 'stable',
                percentageChange: 0,
                insightText: 'No hay suficientes datos para analizar tu tendencia.',
                statusColor: colors.outline,
                averageSpending: 0,
                currentSpending: 0
            };
        }

        // 2. Group by month (YYYY-MM)
        const expensesByMonth: Record<string, number> = {};
        const categoriesByMonth: Record<string, Record<string, number>> = {};

        expenses.forEach(t => {
            // Robust parsing
            const date = new Date(t.date);
            if (isNaN(date.getTime())) return;
            // Manual YYYY-MM construction to avoid timezone shifts or string format issues
            const year = date.getFullYear();
            const m = date.getMonth() + 1;
            const month = `${year}-${m.toString().padStart(2, '0')}`;

            expensesByMonth[month] = (expensesByMonth[month] || 0) + t.amount;

            if (!categoriesByMonth[month]) categoriesByMonth[month] = {};
            categoriesByMonth[month][t.category] = (categoriesByMonth[month][t.category] || 0) + t.amount;
        });

        const sortedMonths = Object.keys(expensesByMonth).sort();

        // Need at least 2 months to have a trend, but ideally we look at last 3
        if (sortedMonths.length < 2) {
            return {
                direction: 'stable',
                percentageChange: 0,
                insightText: 'Necesitas más meses de datos para ver una tendencia clara.',
                statusColor: colors.primary,
                averageSpending: expensesByMonth[sortedMonths[0]] || 0,
                currentSpending: expensesByMonth[sortedMonths[0]] || 0
            };
        }

        const currentMonth = sortedMonths[sortedMonths.length - 1];
        const currentSpending = expensesByMonth[currentMonth];

        // Calculate average of previous months (excluding current if it's incomplete? 
        // For simplicity, let's assume current month is "active" and we compare against last 3 month avg).
        // Actually, usually trend compares Current vs Average of [Prev1, Prev2, Prev3]

        const previousMonths = sortedMonths.slice(Math.max(0, sortedMonths.length - 4), sortedMonths.length - 1); // Last 3 months before current

        if (previousMonths.length === 0) {
            // Fallback if only 1 previous month
            return {
                direction: 'stable',
                percentageChange: 0,
                insightText: 'Recolectando datos...',
                statusColor: colors.primary,
                averageSpending: currentSpending,
                currentSpending: currentSpending
            };
        }

        const avgSpending = previousMonths.reduce((acc, m) => acc + expensesByMonth[m], 0) / previousMonths.length;

        const diff = currentSpending - avgSpending;
        const percentageChange = avgSpending === 0 ? 0 : (diff / avgSpending) * 100;

        // 3. Determine Direction
        let direction: TrendDirection = 'stable';
        let statusColor = colors.primary;

        if (percentageChange > 10) {
            direction = 'increasing';
            statusColor = colors.error; // Bad
        } else if (percentageChange < -10) {
            direction = 'decreasing';
            statusColor = colors.primary; // Good (using primary usually for positive/brand) or could use specific success color
        }

        // 4. Generate Insight (Find the category driving the change)
        let insightText = '';

        // Find category with biggest increase/decrease compared to it's own average
        // Simplified: Find category with biggest delta in Current Month vs Previous Month (just one prev month for simplicity of "cause")
        const prevMonth = previousMonths[previousMonths.length - 1];
        const currentCats = categoriesByMonth[currentMonth] || {};
        const prevCats = categoriesByMonth[prevMonth] || {};

        let biggestDriver = '';
        let maxDelta = 0;

        const allCats = new Set([...Object.keys(currentCats), ...Object.keys(prevCats)]);
        allCats.forEach(cat => {
            const delta = (currentCats[cat] || 0) - (prevCats[cat] || 0);
            // We care about the delta in the SAME direction as the trend
            if (direction === 'increasing' && delta > 0 && delta > maxDelta) {
                maxDelta = delta;
                biggestDriver = cat;
            } else if (direction === 'decreasing' && delta < 0 && Math.abs(delta) > maxDelta) {
                maxDelta = Math.abs(delta);
                biggestDriver = cat;
            }
        });

        if (direction === 'increasing') {
            insightText = `Tu gasto está subiendo, impulsado principalmente por ${biggestDriver || 'varios gastos'}.`;
        } else if (direction === 'decreasing') {
            insightText = `¡Bien hecho! Estás gastando menos, especialmente en ${biggestDriver || 'general'}.`;
        } else {
            insightText = 'Tu gasto se mantiene estable respecto al promedio reciente.';
        }

        return {
            direction,
            percentageChange,
            insightText,
            statusColor,
            averageSpending: avgSpending,
            currentSpending
        };
    }, [transactions, colors]);
};
