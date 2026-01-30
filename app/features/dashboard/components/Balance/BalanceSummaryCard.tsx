import { AppTheme } from '@/app/core/theme/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface BalanceSummaryCardProps {
    balance: number;
    income: number;
    expense: number;
    transactionCount: number;
    averageTransaction: number; // Daily Avg or Per Transaction Avg
}

export const BalanceSummaryCard = ({ balance, income, expense, transactionCount, averageTransaction }: BalanceSummaryCardProps) => {
    const { colors } = useTheme<AppTheme>();
    const isNegative = balance < 0;

    // Calculate Savings Rate (avoid division by zero)
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;

    // Dynamic Colors
    const cardColor = isNegative ? colors.error : colors.primary;
    const textColor = isNegative ? colors.onError : colors.onPrimary;

    return (
        <Card style={[styles.balanceCard, { backgroundColor: cardColor }]} mode="contained">
            <Card.Content style={styles.balanceCardContent}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text variant="labelMedium" style={{ color: textColor, opacity: 0.9 }}>Balance Neto</Text>

                        {/* Savings Rate Badge */}
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                            <Text style={{ color: textColor, fontWeight: '700', fontSize: 12 }}>
                                {savingsRate.toFixed(1)}% Ahorro
                            </Text>
                        </View>
                    </View>

                    <Text variant="displayMedium" style={{ color: textColor, fontWeight: '800', marginVertical: 8 }}>
                        {isNegative ? '-' : ''}${Math.abs(balance).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.statsRow}>
                    <View style={{ flex: 1 }}>
                        <Text variant="labelSmall" style={{ color: textColor, opacity: 0.8 }}>Movimientos</Text>
                        <Text variant="titleMedium" style={{ color: textColor, fontWeight: '700' }}>{transactionCount}</Text>
                    </View>

                    {/* Vertical Divider */}
                    <View style={{ width: 1, height: '100%', backgroundColor: 'rgba(255,255,255,0.2)' }} />

                    <View style={{ flex: 1, paddingLeft: 16 }}>
                        <Text variant="labelSmall" style={{ color: textColor, opacity: 0.8 }}>Promedio / Trans.</Text>
                        <Text variant="titleMedium" style={{ color: textColor, fontWeight: '700' }}>
                            ${averageTransaction.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    balanceCard: {
        borderRadius: 24,
        marginBottom: 28,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    balanceCardContent: {
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 12,
    }
});
