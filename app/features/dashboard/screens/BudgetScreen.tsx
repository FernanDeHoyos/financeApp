import { AppTheme } from '@/app/core/theme/theme';
import { saveBudget } from '@/app/services/database';
import { setBudget } from '@/app/store/budgetSlice';
import { RootState } from '@/app/store/store';
import { useNavigation } from '@react-navigation/native';
import { Check, DollarSign } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { Appbar, Button, Card, Text, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

export const BudgetScreen = () => {
    const theme = useTheme<AppTheme>();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { colors } = theme;

    const currentBudget = useSelector((state: RootState) => state.budget.monthlyLimit);
    const [displayAmount, setDisplayAmount] = useState(currentBudget > 0 ? currentBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '');

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        const value = parseFloat(displayAmount.replace(/\./g, ''));
        if (isNaN(value) || value <= 0) {
            Alert.alert('Monto inválido', 'Por favor ingresa un monto válido mayor a 0');
            return;
        }

        setIsSaving(true);
        const success = await saveBudget(value);

        if (!success) {
            setIsSaving(false);
            Alert.alert('Error', 'No se pudo guardar el presupuesto en la base de datos');
            return;
        }

        dispatch(setBudget(value));
        setIsSaving(false);
        navigation.goBack();
    };

    const handleTextChange = (text: string) => {
        const cleanNumber = text.replace(/\./g, '').replace(/[^0-9]/g, '');
        if (cleanNumber === '') {
            setDisplayAmount('');
            return;
        }
        const formatted = cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setDisplayAmount(formatted);
    };


    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Definir Presupuesto" titleStyle={{ fontWeight: '700' }} />
            </Appbar.Header>

            <View style={styles.content}>
                <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
                    <Card.Content style={styles.cardContent}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.primaryContainer }]}>
                            <DollarSign size={32} color={colors.primary} />
                        </View>
                        <Text variant="titleMedium" style={{ fontWeight: '700', marginBottom: 8, marginTop: 16 }}>
                            Presupuesto Mensual
                        </Text>
                        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: 24 }}>
                            Establece un límite de gastos para controlar mejor tus finanzas.
                        </Text>

                        <View style={[styles.inputContainer, { borderColor: colors.outline }]}>
                            <Text variant="headlineSmall" style={{ color: colors.primary, fontWeight: '800', marginRight: 4 }}>$</Text>
                            <TextInput
                                style={[styles.input, { color: colors.onSurface }]}
                                placeholder="0"
                                placeholderTextColor={colors.onSurfaceVariant}
                                keyboardType="numeric"
                                value={displayAmount}
                                onChangeText={handleTextChange}
                                autoFocus
                            />
                        </View>
                    </Card.Content>
                </Card>

                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={isSaving}
                    disabled={isSaving}
                    style={styles.saveButton}
                    contentStyle={{ paddingVertical: 6 }}
                    icon={({ size, color }) => <Check size={size} color={color} />}
                >
                    Guardar Presupuesto
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        flex: 1,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        borderRadius: 24,
        marginBottom: 32,
    },
    cardContent: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 150,
        justifyContent: 'center',
    },
    input: {
        fontSize: 32,
        fontWeight: '800',
        minWidth: 50,
        textAlign: 'center',
    },
    saveButton: {
        width: '100%',
        borderRadius: 12,
    }
});
