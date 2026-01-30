import { AppTheme } from '@/app/core/theme/theme';
import * as DocumentPicker from 'expo-document-picker';
import { FileSpreadsheet } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

interface FileSelectorProps {
    onFileSelected: (uri: string) => void;
}

export const FileSelector = ({ onFileSelected }: FileSelectorProps) => {
    const { colors } = useTheme<AppTheme>();

    const handlePickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                onFileSelected(result.assets[0].uri);
            }
        } catch (err) {
            console.error('Error picking document:', err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primaryContainer }]}>
                <FileSpreadsheet size={64} color={colors.primary} />
            </View>
            <Text variant="headlineSmall" style={{ fontWeight: '700', marginBottom: 8, textAlign: 'center' }}>
                Selecciona tu archivo
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: 'center', color: colors.onSurfaceVariant, marginBottom: 32 }}>
                Soporta archivos .xlsx y .xls. Asegúrate de que tu archivo tenga encabezados claros.
            </Text>

            <Button mode="contained" onPress={handlePickDocument} style={styles.button}>
                Buscar Archivo
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    button: {
        width: '100%',
        borderRadius: 12,
    }
});
