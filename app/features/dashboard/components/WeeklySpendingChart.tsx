import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from '@/app/core/types/transaction';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Card, Text, useTheme } from 'react-native-paper';

interface WeeklySpendingChartProps {
    transactions: Transaction[];
}

const DAYS_SHORT = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

export const WeeklySpendingChart = ({ transactions }: WeeklySpendingChartProps) => {
    const { colors } = useTheme<AppTheme>();
    const screenWidth = Dimensions.get('window').width;
    const chartWidth = screenWidth - 85; // Extra margin to avoid overflow and accommodate Y-axis

    const weeklyData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');

        const dayTotals = new Array(7).fill(0);

        expenses.forEach(t => {
            const date = new Date(t.date);
            let dayIndex = date.getDay() - 1;
            if (dayIndex === -1) dayIndex = 6; // Sunday
            dayTotals[dayIndex] += t.amount;
        });

        const maxVal = Math.max(...dayTotals, 100);

        return dayTotals.map((amount, index) => ({
            value: amount,
            label: DAYS_SHORT[index],
            frontColor: amount === maxVal && amount > 0 ? colors.primary : colors.secondary,
            topLabelComponent: () => (
                <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant, fontSize: 9, fontWeight: '700' }}>
                    {amount > 0 ? `$${(amount / 1000).toFixed(0)}k` : ''}
                </Text>
            ),
        }));
    }, [transactions, colors]);

    const maxDayIndex = useMemo(() => {
        const values = weeklyData.map(d => d.value);
        const maxVal = Math.max(...values);
        return maxVal > 0 ? values.indexOf(maxVal) : -1;
    }, [weeklyData]);

    const insightText = useMemo(() => {
        if (maxDayIndex === -1) return 'Agrega gastos para ver tus hábitos.';
        const dayName = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][maxDayIndex];
        const isWeekend = maxDayIndex >= 4;
        return `Gastas más los ${dayName}s. ${isWeekend ? '¡Ojo con los caprichos del finde! 💸' : 'Un día productivo (y costoso). 💼'}`;
    }, [maxDayIndex]);

    const calculatedMax = useMemo(() => {
        const values = weeklyData.map(d => d.value);
        const max = Math.max(...values);
        return max > 0 ? max * 1.3 : 100;
    }, [weeklyData]);

    const hasData = maxDayIndex !== -1;

    return (
        <View style={styles.section}>
            <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
                Hábitos por Día
            </Text>
            <Card style={[styles.card, { backgroundColor: colors.background, overflow: 'hidden' }]} mode="outlined">
                <Card.Content style={styles.content}>
                    {!hasData ? (
                        <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
                            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                                No hay gastos registrados este mes
                            </Text>
                        </View>
                    ) : (
                        <View style={{ width: '100%', paddingLeft: 10 }}>
                            <BarChart
                                data={weeklyData}
                                height={160}
                                width={chartWidth}
                                barWidth={22}
                                spacing={16}
                                initialSpacing={15}
                                noOfSections={3}
                                maxValue={calculatedMax}
                                roundedTop
                                hideRules={false}
                                rulesType="solid"
                                rulesColor={colors.outlineVariant + '40'}
                                xAxisThickness={1}
                                xAxisColor={colors.outlineVariant}
                                yAxisThickness={0}
                                yAxisLabelWidth={35}
                                formatYLabel={(label) => `$${parseInt(label) >= 1000 ? (parseInt(label) / 1000).toFixed(0) + 'k' : label}`}
                                yAxisTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10 }}
                                xAxisLabelTextStyle={{ color: colors.onSurface, fontSize: 10, fontWeight: '600' }}
                                isAnimated
                                animationDuration={500}
                            />
                        </View>
                    )}

                    <View style={[styles.insightContainer, { backgroundColor: colors.surfaceVariant }]}>
                        <Text variant="bodySmall" style={{ color: colors.onSurface, textAlign: 'center' }}>
                            💡 {insightText}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    card: {
        borderRadius: 18,
        borderWidth: 1,
    },
    content: {
        paddingTop: 24,
        paddingBottom: 16,
        paddingHorizontal: 0,
        alignItems: 'center',
    },
    insightContainer: {
        marginTop: 20,
        padding: 12,
        borderRadius: 12,
        width: '90%',
    }
});
