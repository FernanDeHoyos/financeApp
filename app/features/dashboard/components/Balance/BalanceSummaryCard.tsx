import { AppTheme } from '@/app/core/theme/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface BalanceSummaryCardProps {
    balance: number;
    transactionCount: number;
    averageTransaction: number;
}

export const BalanceSummaryCard = ({ balance, transactionCount, averageTransaction }: BalanceSummaryCardProps) => {
    const { colors } = useTheme<AppTheme>();

    return (
        <Card style={[styles.balanceCard, { backgroundColor: colors.primaryContainer }]} mode="contained">
            <Card.Content style={styles.balanceCardContent}>
                <View>
                    <Text variant="labelMedium" style={{ color: colors.onPrimaryContainer, opacity: 0.85 }}>Balance General</Text>
                    <Text variant="headlineLarge" style={{ color: colors.onPrimaryContainer, fontWeight: '800', marginVertical: 10 }}>
                        ${Math.abs(balance).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </Text>
                </View>
                <View style={styles.statsRow}>
                    <View style={{ flex: 1 }}>
                        <Text variant="labelSmall" style={{ color: colors.onPrimaryContainer, opacity: 0.8 }}>Movimientos</Text>
                        <Text variant="bodyLarge" style={{ color: colors.onPrimaryContainer, fontWeight: '700' }}>{transactionCount}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text variant="labelSmall" style={{ color: colors.onPrimaryContainer, opacity: 0.8 }}>Promedio</Text>
                        <Text variant="bodyLarge" style={{ color: colors.onPrimaryContainer, fontWeight: '700' }}>
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
        elevation: 2,
    },
    balanceCardContent: {
        paddingVertical: 6,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 12,
    },
});
