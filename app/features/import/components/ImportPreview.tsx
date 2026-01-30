import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from '@/app/core/types/transaction';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, IconButton, Text, useTheme } from 'react-native-paper';

interface ImportPreviewProps {
    transactions: Partial<Transaction>[];
    onConfirm: (confirmed: Partial<Transaction>[]) => void;
    onCancel: () => void;
}

export const ImportPreview = ({ transactions: initialTransactions, onConfirm, onCancel }: ImportPreviewProps) => {
    const { colors } = useTheme<AppTheme>();
    const [transactions, setTransactions] = useState(initialTransactions);

    // Simple deduplication logic could go here or in parent

    const removeItem = (index: number) => {
        const newTx = [...transactions];
        newTx.splice(index, 1);
        setTransactions(newTx);
    };

    const renderItem = ({ item, index }: { item: Partial<Transaction>, index: number }) => (
        <Card style={styles.card} mode="outlined">
            <Card.Content style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                    <Text variant="bodyLarge" style={{ fontWeight: '700' }}>{item.description}</Text>
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                        {item.date?.toString().substring(0, 10)} • {item.category}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end', marginRight: 8 }}>
                    <Text variant="bodyLarge" style={{
                        fontWeight: 'bold',
                        color: item.type === 'income' ? colors.income : colors.expense
                    }}>
                        ${item.amount?.toFixed(2)}
                    </Text>
                    <Chip
                        style={{ height: 24, backgroundColor: item.type === 'income' ? colors.incomeContainer : colors.expenseContainer }}
                        textStyle={{ fontSize: 10, lineHeight: 10, marginVertical: 0, marginHorizontal: 0 }}
                        compact
                    >
                        {item.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </Chip>
                </View>
                <IconButton
                    icon="delete"
                    size={20}
                    iconColor={colors.error}
                    onPress={() => removeItem(index)}
                />
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text variant="titleMedium" style={{ marginBottom: 16 }}>
                Revisar Movimientos ({transactions.length})
            </Text>

            <FlatList
                data={transactions}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 80 }}
            />

            <View style={styles.footer}>
                <Button mode="text" onPress={onCancel} style={{ flex: 1 }}>Cancelar</Button>
                <Button
                    mode="contained"
                    onPress={() => onConfirm(transactions)}
                    style={{ flex: 1 }}
                    disabled={transactions.length === 0}
                >
                    Guardar
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginBottom: 8,
        backgroundColor: 'transparent'
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8
    },
    footer: {
        flexDirection: 'row',
        gap: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        marginTop: 8
    }
});
