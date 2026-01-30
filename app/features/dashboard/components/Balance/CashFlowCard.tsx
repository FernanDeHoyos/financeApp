import { AppTheme } from '@/app/core/theme/theme';
import { PiggyBank, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Divider, Text, useTheme } from 'react-native-paper';

interface CashFlowCardProps {
    income: number;
    expense: number;
}

export const CashFlowCard = ({ income, expense }: CashFlowCardProps) => {
    const { colors } = useTheme<AppTheme>();

    const savings = income - expense;
    const savingsRate = income > 0 ? (savings / income) * 100 : 0;
    const isPositive = savings >= 0;

    const formatMoney = (amount: number) => {
        return `$${Math.abs(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    };

    return (
        <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
            <Card.Content>
                <Text variant="titleMedium" style={{ fontWeight: '700', marginBottom: 16 }}>Flujo de Caja</Text>

                <View style={styles.row}>
                    <View style={styles.item}>
                        <View style={[styles.iconBox, { backgroundColor: colors.incomeContainer }]}>
                            <TrendingUp size={20} color={colors.income} />
                        </View>
                        <View>
                            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>Entradas</Text>
                            <Text variant="titleMedium" style={{ color: colors.income, fontWeight: '700' }}>
                                {formatMoney(income)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.item}>
                        <View style={[styles.iconBox, { backgroundColor: colors.expenseContainer }]}>
                            <TrendingDown size={20} color={colors.expense} />
                        </View>
                        <View>
                            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>Salidas</Text>
                            <Text variant="titleMedium" style={{ color: colors.expense, fontWeight: '700' }}>
                                {formatMoney(expense)}
                            </Text>
                        </View>
                    </View>
                </View>

                <Divider style={{ marginVertical: 16 }} />

                <View style={styles.savingsContainer}>
                    <View style={[styles.iconBox, { backgroundColor: isPositive ? colors.primaryContainer : colors.errorContainer }]}>
                        <PiggyBank size={24} color={isPositive ? colors.primary : colors.error} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>Flujo Neto (Ahorro)</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                            <Text variant="headlineSmall" style={{ fontWeight: '800', color: isPositive ? colors.primary : colors.error }}>
                                {isPositive ? '+' : '-'}{formatMoney(savings)}
                            </Text>
                            {income > 0 && (
                                <View style={[styles.badge, { backgroundColor: isPositive ? colors.primary + '20' : colors.error + '20' }]}>
                                    <Text variant="labelSmall" style={{ fontWeight: '700', color: isPositive ? colors.primary : colors.error }}>
                                        {savingsRate.toFixed(1)}%
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 4 }}>
                            {isPositive
                                ? '¡Excelente! Estás gastando menos de lo que ganas.'
                                : 'Cuidado, estás gastando más de lo que ingresas.'}
                        </Text>
                    </View>
                </View>

            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 22,
        marginBottom: 20,
        elevation: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    savingsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginBottom: 6,
    }
});
