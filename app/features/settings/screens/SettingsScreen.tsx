import { DashboardStackParamList } from '@/app/navigation/DashboardStack';
import { AppTheme } from '@/app/core/theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight, Tags, User } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, List, useTheme } from 'react-native-paper';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Settings'>;

export const SettingsScreen = ({ navigation }: Props) => {
    const { colors } = useTheme<AppTheme>();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Appbar.Header style={{ backgroundColor: 'transparent' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Configuración" />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <List.Section>
                    <List.Subheader>Perfil y Datos</List.Subheader>
                    <List.Item
                        title="Editar Perfil"
                        description="Cambia tu nombre, edad y género"
                        left={props => <List.Icon {...props} icon={() => <User size={24} color={colors.primary} />} />}
                        right={props => <ChevronRight size={20} color={colors.onSurfaceVariant} style={styles.chevron} />}
                        onPress={() => navigation.navigate('EditProfile')}
                        style={[styles.listItem, { backgroundColor: colors.surface }]}
                    />
                    <List.Item
                        title="Gestionar Categorías"
                        description="Ver y eliminar categorías personalizadas"
                        left={props => <List.Icon {...props} icon={() => <Tags size={24} color={colors.secondary} />} />}
                        right={props => <ChevronRight size={20} color={colors.onSurfaceVariant} style={styles.chevron} />}
                        onPress={() => navigation.navigate('ManageCategories')}
                        style={[styles.listItem, { backgroundColor: colors.surface, marginTop: 1 }]}
                    />
                </List.Section>


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
    listItem: {
        paddingVertical: 8,
    },
    chevron: {
        alignSelf: 'center',
        marginRight: 8,
    }
});
