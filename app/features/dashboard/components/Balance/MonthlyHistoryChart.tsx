import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from '@/app/core/types/transaction';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Card, Text, useTheme } from 'react-native-paper';

interface MonthlyHistoryChartProps {
    transactions: Transaction[];
    dark?: boolean;
}

export const MonthlyHistoryChart = ({ transactions, dark }: MonthlyHistoryChartProps) => {
    const { colors } = useTheme<AppTheme>();

    // Logic moved from BalanceScreen
    const balanceByMonth = useMemo(() => {
        return transactions.reduce((acc: Record<string, { income: number; expense: number }>, curr: any) => {
            const date = new Date(curr.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!acc[monthKey]) acc[monthKey] = { income: 0, expense: 0 };

            if (curr.type === 'income') acc[monthKey].income += curr.amount;
            else acc[monthKey].expense += curr.amount;
            return acc;
        }, {});
    }, [transactions]);

    const monthlyChartData = useMemo(() => {
        return Object.entries(balanceByMonth)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .flatMap(([month, data]) => {
                const label = new Date(`${month}-01`).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
                return [
                    {
                        value: data.income,
                        label,
                        spacing: 2,
                        labelWidth: 30,
                        labelTextStyle: { color: colors.onSurfaceVariant, fontSize: 10 },
                        frontColor: colors.income,
                    },
                    {
                        value: data.expense,
                        frontColor: colors.expense,
                    }
                ];
            });
    }, [balanceByMonth, colors]);

    // Insight Logic
    const insight = useMemo(() => {
        const entries = Object.entries(balanceByMonth);
        if (entries.length === 0) return null;

        // Find month with max savings (Income - Expense)
        const bestMonth = entries.reduce((max, [month, data]) => {
            const balance = data.income - data.expense;
            return balance > max.balance ? { month, balance } : max;
        }, { month: '', balance: -Infinity });

        const monthName = bestMonth.month ? new Date(`${bestMonth.month}-01`).toLocaleDateString('es-ES', { month: 'long' }) : '';

        return {
            text: `Tu mejor mes fue ${monthName} con un balance positivo de $${bestMonth.balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}.`,
            isPositive: bestMonth.balance > 0
        };

    }, [balanceByMonth]);

    const monthlyDetails = useMemo(() => {
        return Object.entries(balanceByMonth)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, data]) => {
                const [year, monthNum] = month.split('-').map(Number);
                const label = new Date(year, monthNum - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                return {
                    month,
                    label,
                    income: data.income,
                    expense: data.expense,
                    balance: data.income - data.expense,
                };
            });
    }, [balanceByMonth]);

    if (monthlyChartData.length === 0) {
        return (
            <Card style={[styles.chartCard, { backgroundColor: colors.surface }]} mode="outlined">
                <Card.Content style={styles.chartContent}>
                    <Text style={{ color: colors.onSurfaceVariant }}>Sin datos de meses</Text>
                </Card.Content>
            </Card>
        );
    }

    return (
        <View style={styles.section}>
            <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: '700', marginBottom: 16 }}>Balance Mensual</Text>

            {/* Insight Card */}
            {insight && (
                <Card style={{ marginBottom: 16, backgroundColor: insight.isPositive ? colors.incomeContainer : colors.expenseContainer }}>
                    <Card.Content>
                        <Text variant="bodyMedium" style={{ color: colors.onSurface, fontWeight: '600' }}>
                            💡 {insight.text}
                        </Text>
                    </Card.Content>
                </Card>
            )}

            <Card style={[styles.chartCard, { backgroundColor: colors.surface }]} mode="outlined">
                <Card.Content style={styles.chartContent}>

                    <BarChart
                        data={monthlyChartData}
                        height={280}
                        barWidth={12}
                        spacing={24}
                        roundedTop
                        roundedBottom
                        formatYLabel={(label) => String(label).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        yAxisTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10, fontWeight: '500' }}
                        yAxisLabelWidth={55}
                        xAxisLabelTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10, fontWeight: '500' }}
                        yAxisColor={colors.outlineVariant}
                        xAxisColor={colors.outlineVariant}
                        yAxisIndicesColor={colors.outlineVariant}
                        showYAxisIndices
                        noOfSections={4}
                        isAnimated
                        animationDuration={800}
                    />
                </Card.Content>

                <View style={[styles.legendContainer]}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: colors.income }]} />
                        <Text variant="bodySmall" style={{ color: colors.onSurface }}>Ingresos</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: colors.expense }]} />
                        <Text variant="bodySmall" style={{ color: colors.onSurface }}>Gastos</Text>
                    </View>
                </View>
            </Card>

            {/* Tabla de detalles mensuales */}
            <Card style={[styles.chartCard, { backgroundColor: colors.surface }]} mode="outlined">
                <Card.Content style={{ paddingVertical: 16, paddingHorizontal: 12 }}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { color: colors.onSurfaceVariant, flex: 1.2 }]}>Mes</Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.income, flex: 1 }]}>Ingresos</Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.expense, flex: 1 }]}>Gastos</Text>
                        <Text style={[styles.tableHeaderCell, { color: colors.onSurface, flex: 1, textAlign: 'right' }]}>Balance</Text>
                    </View>
                    {monthlyDetails.map((detail, idx) => (
                        <View key={detail.month} style={[styles.tableRow, { backgroundColor: idx % 2 === 0 ? colors.surfaceVariant : 'transparent' }]}>
                            <Text style={[styles.tableCell, { color: colors.onSurface, flex: 1.2, fontSize: 12 }]}>
                                {detail.label}
                            </Text>
                            <Text style={[styles.tableCell, { color: colors.income, flex: 1, fontWeight: '600' }]}>
                                ${detail.income.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            </Text>
                            <Text style={[styles.tableCell, { color: colors.expense, flex: 1, fontWeight: '600' }]}>
                                ${detail.expense.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            </Text>
                            <Text style={[styles.tableCell, { color: detail.balance >= 0 ? colors.income : colors.expense, flex: 1, fontWeight: '700', textAlign: 'right' }]}>
                                ${detail.balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            </Text>
                        </View>
                    ))}
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    section: { marginBottom: 32 },
    chartCard: { borderRadius: 18, marginBottom: 16, borderWidth: 1 },
    chartContent: { paddingVertical: 20, alignItems: 'center' },
    legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, paddingBottom: 16 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    legendColor: { width: 12, height: 12, borderRadius: 6 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingBottom: 10, marginBottom: 12 },
    tableHeaderCell: { fontWeight: '700', fontSize: 11 },
    tableRow: { flexDirection: 'row', paddingVertical: 10, borderRadius: 6 },
    tableCell: { fontWeight: '500' },
});
