import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from '@/app/core/types/transaction';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Card, Text, useTheme } from 'react-native-paper';

// Paleta de colores para categorías
import { categoryColors } from '@/app/utils/colors';

interface CategoryBreakdownProps {
    transactions: Transaction[];
    type: 'income' | 'expense';
}

export const CategoryBreakdown = ({ transactions, type }: CategoryBreakdownProps) => {
    const { colors } = useTheme<AppTheme>();

    const relevantTransactions = useMemo(() => transactions.filter(t => t.type === type), [transactions, type]);
    const totalAmount = useMemo(() => relevantTransactions.reduce((acc, curr) => acc + curr.amount, 0), [relevantTransactions]);

    const byCategory = useMemo(() => {
        return relevantTransactions.reduce((acc: Record<string, number>, curr: any) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});
    }, [relevantTransactions]);

    const pieData = useMemo(() => {
        return Object.entries(byCategory).map(([category, amount], idx) => ({
            value: amount as number,
            label: category,
            color: categoryColors[idx % categoryColors.length],
            focused: true,
        }));
    }, [byCategory]);

    // Insight Logic
    const insight = useMemo(() => {
        if (pieData.length === 0) return null;

        // Find largest category
        const largest = pieData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
        const percentage = ((largest.value / totalAmount) * 100).toFixed(0);

        const verb = type === 'income' ? 'provienen de' : 'se van en';

        return `La mayor parte de tus ${type === 'income' ? 'ingresos' : 'gastos'} (${percentage}%) ${verb} ${largest.label}.`;
    }, [pieData, totalAmount, type]);

    if (relevantTransactions.length === 0) return null;

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={[styles.iconBadge, { backgroundColor: type === 'income' ? colors.incomeContainer : colors.expenseContainer }]}>
                    {type === 'income' ? <TrendingUp size={18} color={colors.income} /> : <TrendingDown size={18} color={colors.expense} />}
                </View>
                <Text variant="titleMedium" style={{ color: type === 'income' ? colors.income : colors.expense, fontWeight: '700', marginLeft: 10 }}>
                    {type === 'income' ? 'Ingresos' : 'Gastos'}
                </Text>
            </View>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginBottom: 12 }}>
                Total: ${totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </Text>

            {/* Insight Card */}
            {insight && (
                <Card style={{ marginBottom: 12, backgroundColor: colors.surfaceVariant }} mode="contained">
                    <Card.Content style={{ paddingVertical: 12 }}>
                        <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
                            ℹ️ {insight}
                        </Text>
                    </Card.Content>
                </Card>
            )}

            {pieData.length > 0 ? (
                <Card style={[styles.chartCard, { backgroundColor: colors.surface }]} mode="outlined">
                    <Card.Content style={styles.chartContent}>
                        <PieChart
                            data={pieData}
                            donut
                            radius={70}
                            innerRadius={45}
                            centerLabelComponent={() => (
                                <View style={styles.centerLabel}>
                                    <Text style={{ color: colors.onSurface, fontWeight: '700', fontSize: 12 }}>Total</Text>
                                    <Text style={{ color: type === 'income' ? colors.income : colors.expense, fontWeight: '800', fontSize: 14 }}>
                                        ${totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                    </Text>
                                </View>
                            )}
                            showText={false}
                        />

                        <View style={styles.legendContainer}>
                            {pieData.map((item, idx) => {
                                const percentage = ((item.value / totalAmount) * 100).toFixed(0);
                                return (
                                    <View key={idx} style={styles.legendItem}>
                                        <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
                                        <View style={{ flex: 1 }}>
                                            <Text variant="labelSmall" style={{ color: colors.onSurface, fontWeight: '600', fontSize: 11 }} numberOfLines={1}>
                                                {item.label}
                                            </Text>
                                            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant, fontSize: 10 }}>
                                                ${item.value.toFixed(0)} ({percentage}%)
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </Card.Content>
                </Card>
            ) : null}

            {/* List Bars */}

        </View>
    );
};

const styles = StyleSheet.create({
    section: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    iconBadge: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    chartCard: { borderRadius: 18, marginBottom: 16, borderWidth: 1 },
    chartContent: { paddingVertical: 20, alignItems: 'center' },
    centerLabel: { alignItems: 'center', justifyContent: 'center' },
    legendContainer: { gap: 6, paddingVertical: 8, paddingHorizontal: 12, marginTop: 8, justifyContent: 'space-around', width: '100%' },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    legendColorBox: { width: 10, height: 10, borderRadius: 2 },
    categoryCard: { borderRadius: 16, marginBottom: 12, elevation: 0 },
    categoryCardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
    progressBar: { height: 6, borderRadius: 3, marginTop: 8, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
    listContainer: { maxHeight: 400, borderRadius: 16, overflow: 'hidden' },
    listScroll: { flexGrow: 0 },
});
