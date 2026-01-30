
import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from '@/app/core/types/transaction';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Card, Divider, Text, useTheme } from 'react-native-paper';

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
                const label = new Date(`${month}-01T12:00:00`).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
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
                        labelTextStyle: { color: colors.onSurfaceVariant, fontSize: 10 }, // add duplicated prop just in case
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

        const monthName = bestMonth.month ? new Date(`${bestMonth.month}-01T12:00:00`).toLocaleDateString('es-ES', { month: 'long' }) : '';

        return {
            text: `Tu mejor mes fue ${monthName} con un balance positivo de $${bestMonth.balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}.`,
            isPositive: bestMonth.balance > 0
        };

    }, [balanceByMonth]);

    const history = useMemo(() => {
        return Object.entries(balanceByMonth)
            .map(([key, val]) => {
                const parts = key.split('-').map(Number);
                const year = parts[0];
                const month = parts[1];
                return {
                    year,
                    month,
                    income: val.income,
                    expense: val.expense
                };
            })
            .sort((a, b) => {
                if (a.year !== b.year) return b.year - a.year;
                return b.month - a.month;
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

                    <Text variant="titleMedium" style={{ fontWeight: '700', marginBottom: 16, color: colors.onSurface }}>
                        Historial Mensual
                    </Text>

                    {/* Table Header */}
                    <View style={styles.headerRow}>
                        <Text style={[styles.headerText, { color: colors.onSurfaceVariant, flex: 1.5 }]}>Mes</Text>
                        <Text style={[styles.headerText, { color: colors.onSurfaceVariant, flex: 1 }]}>Ingreso</Text>
                        <Text style={[styles.headerText, { color: colors.onSurfaceVariant, flex: 1 }]}>Gasto</Text>
                        <Text style={[styles.headerText, { color: colors.onSurfaceVariant, flex: 1, textAlign: 'right' }]}>Balance</Text>
                    </View>

                    {/* Table Rows */}
                    {history.map((item: any, index) => {
                        const balance = item.income - item.expense;
                        const savingsRate = item.income > 0 ? ((balance / item.income) * 100) : 0;
                        const monthName = new Date(item.year, item.month - 1).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });

                        return (
                            <View key={`${item.year}-${item.month}`}>
                                <View style={styles.row}>
                                    {/* Month & Savings */}
                                    <View style={{ flex: 1.5 }}>
                                        <Text variant="bodyMedium" style={{ fontWeight: '600', color: colors.onSurface, textTransform: 'capitalize' }}>
                                            {monthName}
                                        </Text>
                                        <View style={{
                                            flexDirection: 'row', alignItems: 'center', marginTop: 2
                                        }}>
                                            <View style={{
                                                backgroundColor: savingsRate > 0 ? colors.primaryContainer : colors.errorContainer,
                                                paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4
                                            }}>
                                                <Text style={{
                                                    fontSize: 10, fontWeight: '700',
                                                    color: savingsRate > 0 ? colors.onPrimaryContainer : colors.onErrorContainer
                                                }}>
                                                    {savingsRate.toFixed(0)}% Ahorro
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Income */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 13, color: colors.income, fontWeight: '600' }}>
                                            ${item.income.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </Text>
                                    </View>

                                    {/* Expense */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 13, color: colors.expense, fontWeight: '600' }}>
                                            ${item.expense.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                                        </Text>
                                    </View>

                                    {/* Balance */}
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <Text style={{
                                            fontWeight: '700',
                                            color: balance >= 0 ? colors.primary : colors.error
                                        }}>
                                            {balance >= 0 ? '+' : ''}${balance.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                        </Text>
                                    </View>
                                </View>
                                {index < history.length - 1 && <Divider style={{ backgroundColor: colors.outlineVariant, opacity: 0.3 }} />}
                            </View>
                        );
                    })}
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
    card: {
        borderRadius: 18,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerText: {
        fontSize: 12,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
});