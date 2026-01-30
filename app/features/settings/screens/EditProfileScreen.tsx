import { DashboardStackParamList } from '@/app/navigation/DashboardStack';
import { saveUser } from '@/app/services/database';
import { RootState } from '@/app/store/store';
import { setUserProfile } from '@/app/store/userSlice';
import { AppTheme } from '@/app/core/theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Save, User } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

type Props = NativeStackScreenProps<DashboardStackParamList, 'EditProfile'>;

export const EditProfileScreen = ({ navigation }: Props) => {
    const { colors } = useTheme<AppTheme>();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    const [name, setName] = useState(user.name);
    const [age, setAge] = useState(user.age?.toString() || '');
    const [gender, setGender] = useState(user.gender || 'male');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'El nombre no puede estar vacío');
            return;
        }

        const numericAge = parseInt(age);
        if (age && (isNaN(numericAge) || numericAge < 0 || numericAge > 120)) {
            Alert.alert('Error', 'Por favor ingresa una edad válida');
            return;
        }

        try {
            setSaving(true);
            const userProfile = {
                name: name.trim(),
                age: numericAge || 0,
                gender,
                isOnboarded: true
            };

            const success = await saveUser(userProfile);
            if (success) {
                dispatch(setUserProfile(userProfile));
                Alert.alert('Éxito', 'Perfil actualizado correctamente', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                throw new Error('No se pudo guardar en la base de datos');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Hubo un problema al guardar los cambios');
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Editar Perfil" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.form}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, { backgroundColor: colors.primaryContainer }]}>
                            <User size={64} color={colors.primary} />
                        </View>
                        <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginTop: 12 }}>
                            Tu avatar se actualiza según tu género
                        </Text>
                    </View>

                    <View style={styles.inputSection}>
                        <TextInput
                            label="Nombre completo"
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                            placeholder="¿Cómo te llamas?"
                            style={styles.input}
                            left={<TextInput.Icon icon="account" />}
                        />
                    </View>

                    <View style={styles.inputSection}>
                        <TextInput
                            label="Edad"
                            value={age}
                            onChangeText={setAge}
                            mode="outlined"
                            keyboardType="numeric"
                            placeholder="Opcional"
                            style={styles.input}
                            left={<TextInput.Icon icon="calendar" />}
                        />
                    </View>

                    <View style={styles.inputSection}>
                        <Text variant="labelLarge" style={{ marginBottom: 8, color: colors.onSurfaceVariant }}>Género</Text>
                        <SegmentedButtons
                            value={gender}
                            onValueChange={setGender}
                            buttons={[
                                { value: 'male', label: 'Hombre' },
                                { value: 'female', label: 'Mujer' },
                                { value: 'other', label: 'Otro' },
                            ]}
                        />
                    </View>

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        loading={saving}
                        disabled={saving}
                        icon={Save}
                        style={styles.saveButton}
                        contentStyle={{ paddingVertical: 8 }}
                    >
                        Guardar Cambios
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    form: {
        padding: 24,
        gap: 24,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inputSection: {
        width: '100%',
    },
    input: {
        backgroundColor: 'transparent',
    },
    saveButton: {
        marginTop: 12,
        borderRadius: 12,
    }
});
