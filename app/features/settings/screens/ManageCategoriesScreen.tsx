import { useCategories } from '@/app/shared/hooks/useCategories';
import { DashboardStackParamList } from '@/app/navigation/DashboardStack';
import { AppTheme } from '@/app/core/theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Tags, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, Divider, List, Text, useTheme } from 'react-native-paper';

type Props = NativeStackScreenProps<DashboardStackParamList, 'ManageCategories'>;

export const ManageCategoriesScreen = ({ navigation }: Props) => {
    const { colors } = useTheme<AppTheme>();
    const { customCategories, removeCustomCategory, getCategoryUsageCount } = useCategories();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = (id: string, name: string) => {
        const performDelete = async () => {
            try {
                setDeletingId(id);
                await removeCustomCategory(id);
                setDeletingId(null);
            } catch (error: any) {
                setDeletingId(null);
                Alert.alert('Error', error.message || 'No se pudo eliminar la categoría');
            }
        };

        const checkAndConfirm = async () => {
            const usageCount = await getCategoryUsageCount(name);

            Alert.alert(
                'Eliminar categoría',
                usageCount > 0
                    ? `Esta categoría tiene ${usageCount} movimientos asociados. Si la borras, los movimientos se mantendrán pero no podrás usar esta categoría en el futuro.`
                    : `¿Estás seguro de que deseas eliminar "${name}"?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: performDelete,
                    },
                ]
            );
        };

        checkAndConfirm();
    };

    const incomeCategories = customCategories.filter(cat => cat.type === 'income' || cat.type === 'both');
    const expenseCategories = customCategories.filter(cat => cat.type === 'expense' || cat.type === 'both');

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Gestionar Categorías" />
            </Appbar.Header>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {customCategories.length === 0 ? (
                    <Card style={[styles.emptyCard, { backgroundColor: colors.surface }]} mode="outlined">
                        <Card.Content style={styles.emptyContent}>
                            <Tags size={48} color={colors.onSurfaceVariant} style={{ opacity: 0.5 }} />
                            <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant, marginTop: 16, textAlign: 'center' }}>
                                No hay categorías personalizadas
                            </Text>
                            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}>
                                Las categorías que crees aparecerán aquí
                            </Text>
                        </Card.Content>
                    </Card>
                ) : (
                    <>
                        {incomeCategories.length > 0 && (
                            <View style={styles.section}>
                                <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
                                    Categorías de Ingresos
                                </Text>
                                <Card style={[styles.categoryCard, { backgroundColor: colors.surface }]} mode="outlined">
                                    {incomeCategories.map((cat, idx) => (
                                        <View key={cat.id}>
                                            <List.Item
                                                title={cat.name}
                                                description={cat.type === 'both' ? 'Ingresos y Gastos' : 'Solo Ingresos'}
                                                left={props => <List.Icon {...props} icon={() => <Tags size={24} color={colors.income} />} />}
                                                right={props => (
                                                    <Button
                                                        mode="text"
                                                        onPress={() => handleDelete(cat.id, cat.name)}
                                                        loading={deletingId === cat.id}
                                                        disabled={deletingId !== null}
                                                        textColor={colors.error}
                                                        icon={() => <Trash2 size={20} color={colors.error} />}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                )}
                                            />
                                            {idx < incomeCategories.length - 1 && <Divider />}
                                        </View>
                                    ))}
                                </Card>
                            </View>
                        )}

                        {expenseCategories.length > 0 && (
                            <View style={styles.section}>
                                <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: '700', marginBottom: 12 }}>
                                    Categorías de Gastos
                                </Text>
                                <Card style={[styles.categoryCard, { backgroundColor: colors.surface }]} mode="outlined">
                                    {expenseCategories.map((cat, idx) => (
                                        <View key={cat.id}>
                                            <List.Item
                                                title={cat.name}
                                                description={cat.type === 'both' ? 'Ingresos y Gastos' : 'Solo Gastos'}
                                                left={props => <List.Icon {...props} icon={() => <Tags size={24} color={colors.expense} />} />}
                                                right={props => (
                                                    <Button
                                                        mode="text"
                                                        onPress={() => handleDelete(cat.id, cat.name)}
                                                        loading={deletingId === cat.id}
                                                        disabled={deletingId !== null}
                                                        textColor={colors.error}
                                                        icon={() => <Trash2 size={20} color={colors.error} />}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                )}
                                            />
                                            {idx < expenseCategories.length - 1 && <Divider />}
                                        </View>
                                    ))}
                                </Card>
                            </View>
                        )}
                    </>
                )}

                <Card style={[styles.infoCard, { backgroundColor: colors.surfaceVariant }]} mode="contained">
                    <Card.Content>
                        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                            💡 Puedes crear nuevas categorías al agregar un ingreso o gasto presionando el botón "Agregar" junto a las categorías.
                        </Text>
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    categoryCard: {
        borderRadius: 16,
    },
    emptyCard: {
        borderRadius: 16,
        marginTop: 40,
    },
    emptyContent: {
        paddingVertical: 48,
        alignItems: 'center',
    },
    infoCard: {
        borderRadius: 12,
        marginTop: 16,
    },
});
