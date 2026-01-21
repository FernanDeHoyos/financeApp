import { Calendar, Type } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Chip, Text, TextInput, useTheme } from "react-native-paper";

const CATEGORIES = ['Alimentos', 'Transporte', 'Hogar', 'Entretenimiento', 'Salud', 'Otros'];
 
export const TransactionFormScreen = ({ type, onSave, onBack }: any) => {
  const { colors } = useTheme();
  const isIncome = type === 'income';
  // @ts-ignore
  const bgColor = isIncome ? colors.incomeContainer : colors.expenseContainer;
  // @ts-ignore
  const mainColor = isIncome ? colors.income : colors.expense;

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(isIncome ? 'Salario' : CATEGORIES[0]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title={isIncome ? "Nuevo Ingreso" : "Nuevo Gasto"} />
      </Appbar.Header>

      <View style={styles.formContent}>
        <View style={[styles.amountInputContainer, { backgroundColor: bgColor }]}>
            <Text style={{ color: colors.onSurfaceVariant, marginBottom: 8, fontWeight: '500' }}>Monto del movimiento</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 40, fontWeight: 'bold', color: mainColor, marginRight: 8 }}>$</Text>
                <TextInput 
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="0.00"
                    keyboardType="numeric"
                    style={{ fontSize: 40, fontWeight: 'bold', backgroundColor: 'transparent', flex: 1 }}
                    textColor={mainColor}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholderTextColor={mainColor + '80'}
                    autoFocus
                />
            </View>
        </View>

        <View style={{ padding: 24, gap: 16 }}>
            <TextInput
                label="Descripción"
                value={desc}
                onChangeText={setDesc}
                mode="outlined"
                left={<TextInput.Icon icon={() => <Type size={20} color={colors.onSurfaceVariant}/>} />}
                style={{ backgroundColor: colors.background }}
            />

            <TextInput
                label="Fecha"
                value={new Date().toLocaleDateString()}
                mode="outlined"
                editable={false}
                left={<TextInput.Icon icon={() => <Calendar size={20} color={colors.onSurfaceVariant}/>} />}
                style={{ backgroundColor: colors.background }}
            />

            <Text variant="titleSmall" style={{ marginTop: 8 }}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', maxHeight: 40 }}>
                {(isIncome ? ['Salario', 'Ventas', 'Regalo'] : CATEGORIES).map((cat) => (
                    <Chip 
                        key={cat} 
                        selected={category === cat} 
                        onPress={() => setCategory(cat)}
                        style={{ marginRight: 8, backgroundColor: category === cat ? colors.secondaryContainer : colors.surfaceVariant }}
                        textStyle={{ color: category === cat ? colors.onSecondaryContainer : colors.onSurfaceVariant }}
                        showSelectedOverlay
                    >
                        {cat}
                    </Chip>
                ))}
            </ScrollView>

            <Button 
                mode="contained" 
                onPress={() => onSave({ description: desc, amount: parseFloat(amount), category, type })}
                style={{ marginTop: 24, paddingVertical: 6, backgroundColor: mainColor }}
            >
                {isIncome ? "Guardar Ingreso" : "Guardar Gasto"}
            </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 
  formContent: {
      flex: 1,
  },
  amountInputContainer: {
      padding: 32,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      marginBottom: 8,
      justifyContent: 'center'
  },

});
