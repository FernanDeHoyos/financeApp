import { useCategories } from '@/app/shared/hooks/useCategories';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text, TextInput, useTheme } from 'react-native-paper';

interface AddCategoryDialogProps {
  visible: boolean;
  onDismiss: () => void;
  type?: 'income' | 'expense';
}

export const AddCategoryDialog = ({ visible, onDismiss, type }: AddCategoryDialogProps) => {
  const { colors } = useTheme();
  const { addCustomCategory } = useCategories();
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      setError('El nombre de la categoría no puede estar vacío');
      return;
    }

    if (categoryName.length > 20) {
      setError('El nombre debe tener máximo 20 caracteres');
      return;
    }

    try {
      addCustomCategory(categoryName.trim(), type === 'income' ? 'income' : type === 'expense' ? 'expense' : 'both');
      setCategoryName('');
      setError('');
      onDismiss();
    } catch (err: any) {
      setError(err.message || 'Error al crear la categoría');
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Crear categoría personalizada</Dialog.Title>
        <Dialog.Content>
          <Text style={{ marginBottom: 16, fontSize: 14, color: colors.onSurfaceVariant }}>
            {type === 'income'
              ? 'Nueva categoría de ingreso'
              : type === 'expense'
                ? 'Nueva categoría de gasto'
                : 'Nueva categoría'}
          </Text>
          <TextInput
            label="Nombre de la categoría"
            value={categoryName}
            onChangeText={(text) => {
              setCategoryName(text);
              setError('');
            }}
            mode="outlined"
            placeholder="Ej: Freelance, Suscripciones"
            maxLength={20}
            autoFocus
          />
          {error && (
            <Text style={{ color: colors.error, marginTop: 8, fontSize: 12 }}>
              {error}
            </Text>
          )}
          <Text style={{ fontSize: 12, color: colors.onSurfaceVariant, marginTop: 12 }}>
            {categoryName.length}/20
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button
            onPress={handleAddCategory}
            mode="contained"
          >
            Crear
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
