import { AppTheme } from '@/app/core/theme/theme';
import { useMonthlyComparison } from '@/app/features/dashboard/hooks/useMonthlyComparison';
import { DashboardStackParamList } from '@/app/navigation/DashboardStack';
import { useTransactions } from '@/app/shared/hooks/useTransactions';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Appbar, Card, IconButton, Text, useTheme } from 'react-native-paper';

export const MonthlyComparisonScreen = () => {
    const theme = useTheme<AppTheme>();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<DashboardStackParamList, 'MonthlyComparison'>>();
    const { colors } = theme;
    const { transactions } = useTransactions();

    const getSafeDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
    const initialDate = route.params?.initialDate ? new Date(route.params.initialDate) : new Date();
    const [date, setDate] = useState(getSafeDate(initialDate));

    const getMonthStr = (d: Date) => {
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        return `${year}-${month.toString().padStart(2, '0')}`;
    };

    const monthA = getMonthStr(date);
    const prevDate = new Date(date);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const monthB = getMonthStr(prevDate);

    const comparison = useMonthlyComparison(transactions, monthA, monthB);
    const {
        expensesA, expensesB, expensesDiff, expensesDiffPercent,
        incomeA, incomeB, incomeDiff, incomeDiffPercent,
        balanceA, balanceB,
        savingsRateA, savingsRateB,
        dailyAverageA, dailyAverageB,
        categoriesDelta
    } = comparison;

    // Derived Top Expenses for Month A
    const topExpensesA = useMemo(() => {
        return transactions
            .filter(t => t.type === 'expense' && t.date?.startsWith(monthA))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3);
    }, [transactions, monthA]);

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

    const formatMoney = (amount: number) => `$${Math.abs(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

    // Grouped Chart Data: [Prev Income, Prev Expense, Curr Income, Curr Expense]
    const chartData: any[] = [
        {
            value: incomeB,
            label: 'Mes Ant.',
            frontColor: colors.income,
            gradientColor: colors.incomeContainer,
            spacing: 4,
            labelTextStyle: { fontSize: 10, color: colors.onSurfaceVariant }
        },
        {
            value: expensesB,
            frontColor: colors.error,
            gradientColor: colors.errorContainer,
            spacing: 32 // Gap between groups
        },
        {
            value: incomeA,
            label: 'Mes Act.',
            frontColor: colors.income,
            gradientColor: colors.incomeContainer,
            spacing: 4,
            labelTextStyle: { fontSize: 10, color: colors.onSurfaceVariant, fontWeight: 'bold' }
        },
        {
            value: expensesA,
            frontColor: colors.error,
            gradientColor: colors.errorContainer,
        }
    ];

    const screenWidth = Dimensions.get('window').width;
    const maxValChart = Math.max(incomeA, expensesA, incomeB, expensesB) * 1.2 || 100;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Reporte Mensual" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Month Selector */}
                <View style={styles.selectorContainer}>
                    <IconButton icon="chevron-left" onPress={handlePrevMonth} />
                    <View style={styles.dateDisplay}>
                        <Text variant="titleMedium" style={{ fontWeight: '800' }}>{new Date(date).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}</Text>
                        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>vs Mes Anterior</Text>
                    </View>
                    <IconButton icon="chevron-right" onPress={handleNextMonth} />
                </View>

                {/* 1. Overview Cards (Grid) */}
                <View style={styles.gridContainer}>
                    {/* Income */}
                    <Card style={[styles.miniCard, { backgroundColor: colors.incomeContainer + '40' }]} mode="contained">
                        <Card.Content style={{ padding: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <ArrowUp size={16} color={colors.income} />
                                <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>Ingresos</Text>
                            </View>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{formatMoney(incomeA)}</Text>
                            <Text variant="labelSmall" style={{ color: incomeDiff >= 0 ? colors.income : colors.error }}>
                                {incomeDiff >= 0 ? '+' : ''}{incomeDiffPercent.toFixed(1)}% vs ant.
                            </Text>
                        </Card.Content>
                    </Card>

                    {/* Expenses */}
                    <Card style={[styles.miniCard, { backgroundColor: colors.errorContainer + '40' }]} mode="contained">
                        <Card.Content style={{ padding: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <ArrowDown size={16} color={colors.expense} />
                                <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>Gastos</Text>
                            </View>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{formatMoney(expensesA)}</Text>
                            <Text variant="labelSmall" style={{ color: expensesDiff <= 0 ? colors.income : colors.error }}>
                                {expensesDiff > 0 ? '+' : ''}{expensesDiffPercent.toFixed(1)}% vs ant.
                            </Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Chart Comparison (Grouped) */}
                <Card style={[styles.mainCard, { marginTop: 4, paddingVertical: 16 }]} mode="outlined">
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text variant="titleSmall" style={{ fontWeight: '700' }}>Comparativa Mensual</Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.income }} />
                                    <Text variant="labelSmall">Ingresos</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error }} />
                                    <Text variant="labelSmall">Gastos</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <BarChart
                                key={`chart-${monthA}-${monthB}`}
                                data={chartData}
                                barWidth={32}
                                spacing={24}
                                roundedTop
                                rulesColor={colors.outlineVariant + '40'}
                                rulesType="solid"
                                yAxisThickness={0}
                                xAxisThickness={0}
                                yAxisTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10 }}
                                maxValue={maxValChart}
                                hideYAxisText={false}
                                showYAxisIndices
                                noOfSections={4}
                                formatYLabel={(label) => {
                                    const val = parseFloat(label);
                                    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
                                    if (val >= 1000) return (val / 1000).toFixed(0) + 'k';
                                    return val.toFixed(0);
                                }}
                                height={200}
                                width={screenWidth - 80}
                                isAnimated
                            />
                        </View>
                    </Card.Content>
                </Card>

                {/* 2. Balance & Savings (Full Width) */}
                <Card style={[styles.mainCard, { backgroundColor: colors.surface }]} mode="outlined">
                    <Card.Content>
                        <View style={styles.rowBetween}>
                            <View>
                                <Text variant="titleSmall" style={{ color: colors.onSurfaceVariant }}>Balance Neto</Text>
                                <Text variant="headlineSmall" style={{ fontWeight: '800', color: balanceA >= 0 ? colors.primary : colors.error }}>
                                    {balanceA >= 0 ? '+' : ''}{formatMoney(balanceA)}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text variant="titleSmall" style={{ color: colors.onSurfaceVariant }}>Tassa de Ahorro</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                    <View style={{ width: 60, height: 6, backgroundColor: colors.outlineVariant, borderRadius: 3, overflow: 'hidden' }}>
                                        <View style={{ width: `${Math.min(savingsRateA, 100)}%`, height: '100%', backgroundColor: savingsRateA > 20 ? colors.income : colors.primary }} />
                                    </View>
                                    <Text variant="titleSmall" style={{ fontWeight: '700' }}>{savingsRateA.toFixed(0)}%</Text>
                                </View>
                                <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>Prev: {savingsRateB.toFixed(0)}%</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                {/* 3. Daily Average & Habits */}
                <Text variant="titleMedium" style={styles.sectionTitle}>Hábitos de Gasto</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Card style={{ flex: 1, backgroundColor: colors.surface }} mode="outlined">
                        <Card.Content>
                            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>Promedio Diario</Text>
                            <Text variant="titleMedium" style={{ fontWeight: '700', marginTop: 4 }}>{formatMoney(dailyAverageA)}</Text>
                            <Text variant="labelSmall" style={{ marginTop: 4, color: dailyAverageA < dailyAverageB ? colors.income : colors.error }}>
                                {dailyAverageA < dailyAverageB ? '↓ Mejoró' : '↑ Subió'}
                            </Text>
                        </Card.Content>
                    </Card>

                    <Card style={{ flex: 1, backgroundColor: colors.surface }} mode="outlined">
                        <Card.Content>
                            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>Top Gasto #1</Text>
                            <Text variant="titleMedium" style={{ fontWeight: '700', marginTop: 4 }} numberOfLines={1}>
                                {topExpensesA[0] ? formatMoney(topExpensesA[0].amount) : '$0'}
                            </Text>
                            <Text variant="labelSmall" style={{ marginTop: 4 }} numberOfLines={1}>
                                {topExpensesA[0]?.category || '-'}
                            </Text>
                        </Card.Content>
                    </Card>
                </View>



                {/* 5. Top Expenses Detail */}
                {topExpensesA.length > 0 && (
                    <View style={{ marginTop: 24 }}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Mayores Gastos del Mes</Text>
                        {topExpensesA.map((t, index) => (
                            <Card key={t.id} style={{ marginBottom: 12, backgroundColor: colors.surface }} mode="outlined">
                                <Card.Content style={styles.rowBetween}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <View style={{
                                            width: 32, height: 32, borderRadius: 16, backgroundColor: colors.secondaryContainer,
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Text style={{ fontWeight: 'bold' }}>{index + 1}</Text>
                                        </View>
                                        <View>
                                            <Text variant="bodyMedium" style={{ fontWeight: '600' }}>{t.description}</Text>
                                            <Text variant="labelSmall">{t.category} • {t.date}</Text>
                                        </View>
                                    </View>
                                    <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>{formatMoney(t.amount)}</Text>
                                </Card.Content>
                            </Card>
                        ))}
                    </View>
                )}


                {/* 6. Category Breakdown */}
                <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 24 }]}>Cambios por Categoría</Text>
                {categoriesDelta.length === 0 ? (
                    <Text style={{ textAlign: 'center', opacity: 0.5 }}>No hay datos de gastos.</Text>
                ) : (
                    categoriesDelta.map((item) => (
                        <View key={item.category} style={styles.catRowItem}>
                            <View style={{ flex: 1 }}>
                                <Text variant="bodyMedium" style={{ fontWeight: '700' }}>{item.category}</Text>
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>{monthB}: {formatMoney(item.amountB)}</Text>
                                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>→</Text>
                                    <Text variant="bodySmall" style={{ color: colors.onSurface }}>{monthA}: {formatMoney(item.amountA)}</Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text
                                    variant="titleSmall"
                                    style={{
                                        fontWeight: '800',
                                        color: item.diff > 0 ? colors.error : colors.primary
                                    }}
                                >
                                    {item.diff > 0 ? '+' : ''}{formatMoney(item.diff)}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
                <View style={{ height: 60 }} />
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
        marginBottom: 20,
    },
    dateDisplay: {
        alignItems: 'center',
        marginHorizontal: 16,
        minWidth: 150,
    },
    gridContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12
    },
    miniCard: {
        flex: 1,
        borderRadius: 16,
        elevation: 0,
    },
    mainCard: {
        marginBottom: 12,
        borderRadius: 20,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sectionTitle: {
        fontWeight: '700',
        marginBottom: 12,
    },
    catRowItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(150,150,150,0.2)'
    }
});
