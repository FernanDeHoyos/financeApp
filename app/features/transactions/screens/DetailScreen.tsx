import { ListIconRow } from "@/app/shared/components/ListIconRow";
import { ArrowUpCircle, Calendar, Edit3, Tag, Trash2, TrendingUp, Type } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Card, Chip, Divider, Text, useTheme } from "react-native-paper";

export const DetailScreen = ({ transaction, onBack, onDelete }: any) => {
    const { colors } = useTheme();
    const isIncome = transaction.type === 'income';
    // @ts-ignore
    const color = isIncome ? colors.income : colors.expense;
    // @ts-ignore
    const bgColor = isIncome ? colors.incomeContainer : colors.expenseContainer;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                <Appbar.BackAction onPress={onBack} />
                <Appbar.Content title="Detalle" />
                <Appbar.Action icon={() => <Edit3 size={24} color={colors.onSurface} />} onPress={() => { }} />
                <Appbar.Action icon={() => <Trash2 size={24} color={colors.error} />} onPress={() => onDelete(transaction.id)} />
            </Appbar.Header>

            <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 }}>
                <View style={[styles.bigIconCircle, { backgroundColor: bgColor }]}>
                    {isIncome ? <TrendingUp size={48} color={color} /> : <Tag size={48} color={color} />}
                </View>
                <Text variant="headlineSmall" style={{ marginTop: 24, fontWeight: 'bold', textAlign: 'center' }}>{transaction.description}</Text>
                <Text variant="displayLarge" style={{ marginTop: 8, color: color, fontWeight: 'bold' }}>
                    {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                </Text>
                <Chip style={{ marginTop: 16 }}>{transaction.category}</Chip>
            </View>

            <Card style={styles.detailCard} mode="contained">
                <Card.Content>
                    <ListIconRow label="Fecha" value={transaction.date} icon={Calendar} />
                    <Divider style={{ marginVertical: 12 }} />
                    <ListIconRow label="Estado" value="Completado" icon={ArrowUpCircle} />
                    <Divider style={{ marginVertical: 12 }} />
                    <ListIconRow label="Notas" value="Sin notas adicionales" icon={Type} />
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    detailCard: {
        marginHorizontal: 16,
        borderRadius: 24,
        backgroundColor: '#EFF4F4',
    },
    bigIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
