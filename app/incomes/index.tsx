import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function IngresosScreen() {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');

  const guardarIngreso = () => {
    console.log({
      descripcion,
      monto,
    });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Nuevo ingreso</Text>

      <TextInput
        label="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Monto"
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={guardarIngreso}
        disabled={!descripcion || !monto}
      >
        Guardar ingreso
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
});
