import { AppTheme } from '@/app/core/theme/theme';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Menu, Text, useTheme } from 'react-native-paper';

interface ColumnMapperProps {
    fileHeaders: string[];
    onMappingComplete: (mapping: Record<string, string>) => void;
}

const REQUIRED_FIELDS = [
    { key: 'date', label: 'Fecha' },
    { key: 'description', label: 'Descripción' },
    { key: 'amount', label: 'Monto' },
    { key: 'type', label: 'Tipo (Opcional)' },
];

export const ColumnMapper = ({ fileHeaders, onMappingComplete }: ColumnMapperProps) => {
    const { colors } = useTheme<AppTheme>();
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [menuVisible, setMenuVisible] = useState<string | null>(null);

    const handleConfirm = () => {
        // Validation: Date, Desc, Amount are mandatory
        if (!mapping.date || !mapping.description || !mapping.amount) {
            // Alert handled by parent or show error text
            return;
        }
        onMappingComplete(mapping);
    };

    return (
        <ScrollView style={styles.container}>
            <Text variant="titleMedium" style={{ fontWeight: '700', marginBottom: 16 }}>
                Asigna las columnas
            </Text>
            <Text variant="bodySmall" style={{ marginBottom: 24, color: colors.onSurfaceVariant }}>
                Relaciona las columnas de tu archivo Excel con los datos de la app.
            </Text>

            {REQUIRED_FIELDS.map((field) => (
                <View key={field.key} style={styles.fieldRow}>
                    <Text variant="bodyMedium" style={{ flex: 1, fontWeight: '600' }}>{field.label}</Text>
                    <Menu
                        visible={menuVisible === field.key}
                        onDismiss={() => setMenuVisible(null)}
                        anchor={
                            <Button
                                mode="outlined"
                                onPress={() => setMenuVisible(field.key)}
                                style={{ flex: 1.5 }}
                                contentStyle={{ justifyContent: 'flex-start' }}
                            >
                                {mapping[field.key] || 'Seleccionar...'}
                            </Button>
                        }
                    >
                        {fileHeaders.map((header, index) => (
                            <Menu.Item
                                key={`${header}-${index}`}
                                onPress={() => {
                                    setMapping({ ...mapping, [field.key]: header });
                                    setMenuVisible(null);
                                }}
                                title={header}
                            />
                        ))}
                    </Menu>
                </View>
            ))}

            <Button
                mode="contained"
                onPress={handleConfirm}
                style={{ marginTop: 32 }}
                disabled={!mapping.date || !mapping.description || !mapping.amount}
            >
                Continuar
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    }
});
