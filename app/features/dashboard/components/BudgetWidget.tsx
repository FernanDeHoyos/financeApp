import { RootState } from '@/app/store/store';
import { AppTheme } from '@/app/core/theme/theme';
import { useNavigation } from '@react-navigation/native';
import { Settings } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, ProgressBar, Text, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

interface BudgetWidgetProps {
    currentExpense: number;
}

export const BudgetWidget = ({ currentExpense }: BudgetWidgetProps) => {
    const { colors } = useTheme<AppTheme>();
    const navigation = useNavigation<any>();
    const monthlyBudget = useSelector((state: RootState) => state.budget.monthlyLimit);

    if (monthlyBudget <= 0) {
        return (
            <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
                <Card.Content style={styles.emptyContent}>
                    <Text variant="titleMedium" style={{ fontWeight: '700', marginBottom: 4 }}>Presupuesto Mensual</Text>
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: 12 }}>
                        Define un límite para controlar tus gastos.
                    </Text>
                    <Button mode="outlined" onPress={() => navigation.navigate('Budget')}>
                        Definir Presupuesto
                    </Button>
                </Card.Content>
            </Card>
        );
    }

    const progress = Math.min(currentExpense / monthlyBudget, 1);
    const remaining = monthlyBudget - currentExpense;
    const isExceeded = remaining < 0;

    // Color logic
    let progressColor = colors.primary;
    if (progress > 0.75) progressColor = '#FBC02D'; // Yellow warning
    if (progress >= 1) progressColor = colors.error; // Red alert

    return (
        <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
            <Card.Content>
                <View style={styles.header}>
                    <Text variant="titleMedium" style={{ fontWeight: '700' }}>Presupuesto</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Budget')}>
                        <Settings size={20} color={colors.onSurfaceVariant} />
                    </TouchableOpacity>
                </View>

                <View style={styles.progressContainer}>
                    <ProgressBar progress={progress} color={progressColor} style={styles.progressBar} />
                </View>

                <View style={styles.statsRow}>
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                        {isExceeded ? 'Excedido por:' : 'Restante:'}
                    </Text>
                    <Text variant="bodyMedium" style={{ fontWeight: '700', color: isExceeded ? colors.error : colors.primary }}>
                        ${Math.abs(remaining).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </Text>
                </View>

                <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant, marginTop: 4 }}>
                    Gastado: ${currentExpense.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} / ${monthlyBudget.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </Text>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 22,
        marginBottom: 24,
        marginTop: 24,
        elevation: 2,
    },
    emptyContent: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressContainer: {
        height: 12,
        backgroundColor: '#E0E0E0',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressBar: {
        height: 12,
        borderRadius: 6,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});
