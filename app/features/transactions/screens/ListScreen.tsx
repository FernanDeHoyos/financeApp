import { AppTheme } from '@/app/core/theme/theme';
import { CurrencyText } from "@/app/shared/components/CurrencyText";
import { DollarSign, Tag } from "lucide-react-native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Card, Text, useTheme } from "react-native-paper";

export const ListScreen = ({ transactions, onBack, onSelect }: any) => {
    const { colors } = useTheme<AppTheme>();

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                <Appbar.BackAction onPress={onBack} />
                <Appbar.Content title="Todos los movimientos" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {transactions.map((item: any) => (
                    <TouchableOpacity key={item.id} onPress={() => onSelect(item)}>
                        <Card style={[styles.transactionCard, { marginBottom: 12 }]} mode="contained">
                            <Card.Content style={styles.transactionRow}>
                                {/* @ts-ignore */}
                                <View
                                    style={[
                                        styles.iconBox,
                                        {
                                            backgroundColor:
                                                item.type === 'income'
                                                    ? colors.incomeContainer
                                                    : colors.expenseContainer,
                                        },
                                    ]}
                                >
                                    {item.type === 'income' ? (
                                        <DollarSign size={20} color={colors.onSurfaceVariant} />
                                    ) : (
                                        <Tag size={20} color={colors.onSurfaceVariant} />
                                    )}
                                </View>


                                <View style={styles.transactionInfo}>
                                    <Text variant="bodyLarge" style={{ fontWeight: '600' }}>{item.description}</Text>
                                    <Text variant="bodySmall" style={{ color: colors.secondary }}>{item.date}</Text>
                                </View>
                                <CurrencyText amount={item.amount} type={item.type} bold />
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    transactionCard: {
        marginBottom: 8,
        borderRadius: 16,
        backgroundColor: '#EFF4F4', // Surface Variant
    },
    transactionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    transactionInfo: {
        flex: 1,
    }

});
