import { AppTheme } from '@/app/core/theme/theme';
import { saveUser } from '@/app/services/database';
import { setUserProfile } from '@/app/store/userSlice';
import { useNavigation } from '@react-navigation/native';
import { Check, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { Button, Card, Chip, Text, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';

export default function OnboardingScreen() {
    const { colors } = useTheme<AppTheme>();
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');

    const handleStart = async () => {
        if (!name.trim() || !age || !gender) {
            Alert.alert('Faltan datos', 'Por favor completa todos los campos para continuar.');
            return;
        }

        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum <= 0) {
            Alert.alert('Edad inválida', 'Por favor ingresa una edad válida.');
            return;
        }

        const userProfile = {
            name: name.trim(),
            age: ageNum,
            gender,
            isOnboarded: true,
        };

        // 1. Save to SQLite
        const success = await saveUser(userProfile);
        if (!success) {
            Alert.alert('Error', 'No se pudo guardar tu perfil. Intenta de nuevo.');
            return;
        }

        // 2. Update Redux (this might trigger navigation change if observing state)
        dispatch(setUserProfile(userProfile));

        // 3. Navigate to Dashboard (if not auto-handled)
        // navigation.replace('DashboardStack'); // Depending on nav structure
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primaryContainer }]}>
                    <User size={48} color={colors.primary} />
                </View>

                <Text variant="headlineMedium" style={{ fontWeight: '800', marginBottom: 8, color: colors.primary }}>
                    ¡Bienvenido!
                </Text>
                <Text variant="bodyMedium" style={{ textAlign: 'center', color: colors.onSurfaceVariant, marginBottom: 32 }}>
                    Para comenzar, cuéntanos un poco sobre ti. Tus datos se guardan solo en tu dispositivo.
                </Text>

                <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
                    <Card.Content style={{ gap: 16 }}>
                        <View>
                            <Text variant="labelMedium" style={{ marginBottom: 6, color: colors.onSurface }}>Nombre</Text>
                            <TextInput
                                style={[styles.input, { color: colors.onSurface, borderColor: colors.outline }]}
                                placeholder="Ej. Alex"
                                placeholderTextColor={colors.onSurfaceVariant}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View>
                            <Text variant="labelMedium" style={{ marginBottom: 6, color: colors.onSurface }}>Edad</Text>
                            <TextInput
                                style={[styles.input, { color: colors.onSurface, borderColor: colors.outline }]}
                                placeholder="Ej. 25"
                                placeholderTextColor={colors.onSurfaceVariant}
                                keyboardType="numeric"
                                maxLength={3}
                                value={age}
                                onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))}
                            />
                        </View>

                        <View>
                            <Text variant="labelMedium" style={{ marginBottom: 8, color: colors.onSurface }}>Género</Text>
                            <View style={styles.genderRow}>
                                <Chip
                                    selected={gender === 'male'}
                                    onPress={() => setGender('male')}
                                    showSelectedOverlay
                                    style={styles.chip}
                                >
                                    Masculino
                                </Chip>
                                <Chip
                                    selected={gender === 'female'}
                                    onPress={() => setGender('female')}
                                    showSelectedOverlay
                                    style={styles.chip}
                                >
                                    Femenino
                                </Chip>
                                <Chip
                                    selected={gender === 'other'}
                                    onPress={() => setGender('other')}
                                    showSelectedOverlay
                                    style={styles.chip}
                                >
                                    Otro
                                </Chip>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                <Button
                    mode="contained"
                    onPress={handleStart}
                    style={styles.button}
                    contentStyle={{ height: 50 }}
                    icon={({ size, color }) => <Check size={size} color={color} />}
                >
                    Comenzar
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    card: {
        width: '100%',
        borderRadius: 24,
        marginBottom: 32,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    genderRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    chip: {
        flex: 1,
    },
    button: {
        width: '100%',
        borderRadius: 14,
    }
});
