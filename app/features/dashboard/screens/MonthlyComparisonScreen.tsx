import { AppTheme } from '@/app/core/theme/theme';
import { useMonthlyComparison } from '@/app/features/dashboard/hooks/useMonthlyComparison';
import { useFinancialTrend } from '@/app/shared/hooks/useFinancialTrend';
import { useNavigation } from '@react-navigation/native';
import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Appbar, Card, IconButton, Text, useTheme } from 'react-native-paper';

// Mock data integration - in real app would come from Redux/Context
import { RootState } from '@/app/store/store';
import { useSelector } from 'react-redux';

export const MonthlyComparisonScreen = () => {
    const theme = useTheme<AppTheme>();
    const navigation = useNavigation();
    const { colors } = theme;

    // State for months (simplified for MVP: Current vs Previous)
    const [date, setDate] = useState(new Date());

    const getMonthStr = (d: Date) => d.toISOString().substring(0, 7); // YYYY-MM

    const currentMonthDate = new Date(date);
    const prevMonthDate = new Date(date);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);

    const monthA = getMonthStr(currentMonthDate);
    const monthB = getMonthStr(prevMonthDate);

    // Get transactions from store
    const transactions = useSelector((state: RootState) => state.transactions.items);

    const comparison = useMonthlyComparison(transactions, monthA, monthB);
    const trend = useFinancialTrend(transactions);

    const { totalA, totalB, totalDiff, totalDiffPercent, categoriesDelta } = comparison;

    const handlePrevMonth = () => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() - 1);
        setDate(newDate);
    }

    const handleNextMonth = () => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 1);
        setDate(newDate);
    }

    const chartData = [
        {
            value: totalB,
            label: 'Prev',
            frontColor: colors.primary + '80',
            topLabelComponent: () => <Text style={{ fontSize: 10, color: colors.onSurface }}>${totalB.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
        },
        {
            value: totalA,
            label: 'Curr',
            frontColor: totalDiff > 0 ? colors.error : colors.primary,
            topLabelComponent: () => <Text style={{ fontSize: 10, color: colors.onSurface }}>${totalA.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
        }
    ];

    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Comparar Meses" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Month Selector */}
                <View style={styles.selectorContainer}>
                    <IconButton icon="chevron-left" onPress={handlePrevMonth} />
                    <View style={styles.dateDisplay}>
                        <Text variant="titleMedium" style={{ fontWeight: '700' }}>{monthA}</Text>
                        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>vs {monthB}</Text>
                    </View>
                    <IconButton icon="chevron-right" onPress={handleNextMonth} />
                </View>

                {/* Trend Insight Card */}
                {trend.direction !== 'stable' || trend.percentageChange !== 0 ? (
                    <Card style={[styles.mainCard, { backgroundColor: trend.statusColor + '15', borderColor: trend.statusColor }]} mode="outlined">
                        <Card.Content style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{
                                width: 40, height: 40, borderRadius: 20,
                                backgroundColor: trend.statusColor + '20',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                {trend.direction === 'increasing'
                                    ? <TrendingUp size={24} color={trend.statusColor} />
                                    : trend.direction === 'decreasing'
                                        ? <TrendingDown size={24} color={trend.statusColor} />
                                        : <ArrowRight size={24} color={trend.statusColor} />
                                }
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text variant="titleSmall" style={{ color: trend.statusColor, fontWeight: '700' }}>
                                    {trend.direction === 'increasing' ? 'Tendencia al Alza' : trend.direction === 'decreasing' ? 'Tendencia a la Baja' : 'Tendencia Estable'}
                                </Text>
                                <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
                                    {trend.insightText}
                                </Text>
                                <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant, marginTop: 4 }}>
                                    Promedio 3 meses: ${trend.averageSpending.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                ) : null}

                {/* Total Comparison Card */}
                <Card style={[styles.mainCard, { backgroundColor: colors.surface }]} mode="outlined">
                    <Card.Content>
                        <Text variant="labelMedium" style={{ textAlign: 'center', marginBottom: 8 }}>Diferencia Total</Text>
                        <View style={styles.diffRow}>
                            <Text variant="displaySmall" style={{
                                fontWeight: '800',
                                color: totalDiff > 0 ? colors.error : colors.primary
                            }}>
                                {totalDiff > 0 ? '+' : ''}{totalDiff.toFixed(2)}
                            </Text>
                            {totalDiff !== 0 && (
                                <View style={[styles.badge, { backgroundColor: totalDiff > 0 ? colors.errorContainer : colors.primaryContainer }]}>
                                    {totalDiff > 0 ? <TrendingUp size={16} color={colors.error} /> : <TrendingDown size={16} color={colors.primary} />}
                                    <Text style={{
                                        marginLeft: 4,
                                        fontWeight: '700',
                                        color: totalDiff > 0 ? colors.error : colors.primary
                                    }}>
                                        {Math.abs(totalDiffPercent).toFixed(1)}%
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text variant="bodyMedium" style={{ textAlign: 'center', marginTop: 8, color: colors.onSurfaceVariant }}>
                            {totalDiff > 0
                                ? `Gastaste $${Math.abs(totalDiff).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} más que el mes anterior`
                                : `Ahorraste $${Math.abs(totalDiff).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} respecto al mes anterior`
                            }
                        </Text>
                    </Card.Content>
                </Card>

                {/* Chart */}
                <View style={styles.chartContainer}>
                    <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: '700' }}>Comparativa Visual</Text>
                    <View style={{ alignItems: 'center' }}>

                        <BarChart
                            key={`${monthA}-${monthB}`} // Force re-render on month change
                            data={chartData}
                            barWidth={60}
                            spacing={40}
                            roundedTop
                            roundedBottom
                            hideRules
                            xAxisThickness={1}
                            yAxisThickness={1}
                            formatYLabel={(label) => String(label).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            yAxisTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10 }}
                            yAxisLabelWidth={55}
                            rulesColor={colors.outlineVariant}
                            yAxisColor={colors.outlineVariant}
                            xAxisColor={colors.outlineVariant}
                            noOfSections={4}
                            maxValue={Math.max(totalA, totalB) * 1.3 || 100}
                            height={200}
                            width={screenWidth - 80}
                            xAxisLabelTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10 }}
                            isAnimated
                        />
                    </View>
                </View>

                {/* Category Breakdown */}
                <Text variant="titleMedium" style={{ marginTop: 24, marginBottom: 16, fontWeight: '700' }}>Por Categoría</Text>

                {categoriesDelta.length === 0 ? (
                    <Card mode="outlined" style={{ padding: 16, alignItems: 'center' }}>
                        <Text>No hay datos suficientes para comparar.</Text>
                    </Card>
                ) : (
                    categoriesDelta.map((item) => (
                        <Card key={item.category} style={[styles.catCard, { backgroundColor: colors.surface }]} mode="elevated">
                            <Card.Content style={styles.catRow}>
                                <View style={{ flex: 1 }}>
                                    <Text variant="titleSmall" style={{ fontWeight: '700' }}>{item.category}</Text>
                                    <View style={styles.catAmounts}>
                                        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                                            {monthB}: ${item.amountB.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                        </Text>
                                        <ArrowRight size={12} color={colors.onSurfaceVariant} style={{ marginHorizontal: 4 }} />
                                        <Text variant="bodySmall" style={{ color: colors.onSurface }}>
                                            {monthA}: ${item.amountA.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text
                                        variant="bodyLarge"
                                        style={{
                                            fontWeight: '800',
                                            color: item.diff > 0 ? colors.error : colors.primary
                                        }}
                                    >
                                        {item.diff > 0 ? '+' : ''}{item.diff.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                    </Text>
                                    <Text variant="labelSmall" style={{ color: item.diff > 0 ? colors.error : colors.primary }}>
                                        {item.amountB > 0 ? ((item.diff / item.amountB) * 100).toFixed(0) : '100'}%
                                    </Text>
                                </View>
                            </Card.Content>
                        </Card>
                    ))
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    selectorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    dateDisplay: {
        alignItems: 'center',
        marginHorizontal: 16,
        minWidth: 150,
    },
    mainCard: {
        marginBottom: 24,
        borderRadius: 16,
    },
    diffRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    chartContainer: {
        marginBottom: 8,
    },
    catCard: {
        marginBottom: 12,
        borderRadius: 12,
    },
    catRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    catAmounts: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    }
});
