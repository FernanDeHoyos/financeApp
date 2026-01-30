import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from '@/app/core/types/transaction';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface TopExpensesCardProps {
    transactions: Transaction[];
}

export const TopExpensesCard = ({ transactions }: TopExpensesCardProps) => {
    const { colors } = useTheme<AppTheme>();

    const topExpenses = useMemo(() => {
        return transactions
            .filter((t) => t.type === 'expense')
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
    }, [transactions]);

    const maxAmount = useMemo(() => {
        return topExpenses.length > 0 ? topExpenses[0].amount : 0;
    }, [topExpenses]);

    if (topExpenses.length === 0) return null;

    return (
        <View style={styles.section}>
            <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: '700', marginBottom: 16 }}>
                Mayores Gastos del Mes
            </Text>
            <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
                <Card.Content style={styles.content}>
                    {topExpenses.map((expense, idx) => {
                        const percentage = (expense.amount / maxAmount) * 100;
                        const formattedAmount = expense.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        const date = new Date(expense.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

                        return (
                            <View key={expense.id} style={styles.expenseItem}>
                                <View style={styles.headerRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text variant="bodyMedium" style={{ fontWeight: '700', color: colors.onSurface }}>
                                            {expense.description}
                                        </Text>
                                        <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
                                            {expense.category} • {date}
                                        </Text>
                                    </View>
                                    <Text variant="bodyMedium" style={{ fontWeight: '800', color: colors.expense }}>
                                        ${formattedAmount}
                                    </Text>
                                </View>

                                <View style={[styles.progressBackground, { backgroundColor: colors.surfaceVariant }]}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${percentage}%`,
                                                backgroundColor: colors.expense
                                            }
                                        ]}
                                    />
                                </View>
                                {idx < topExpenses.length - 1 && <View style={{ height: 16 }} />}
                            </View>
                        );
                    })}
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        marginBottom: 32,
    },
    card: {
        borderRadius: 18,
        borderWidth: 1,
    },
    content: {
        paddingVertical: 16,
    },
    expenseItem: {
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressBackground: {
        height: 8,
        borderRadius: 4,
        width: '100%',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
});
