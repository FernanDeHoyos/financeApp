import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/app/core/constants/categories";
import { AddCategoryDialog } from "@/app/shared/components/AddCategoryDialog";
import { useCategories } from "@/app/shared/hooks/useCategories";
import { formatDateForDisplay, parseDate } from "@/app/utils/dateFormatting";
import { Calendar, Plus, Type } from "lucide-react-native";
import { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Button, Chip, IconButton, Text, TextInput, useTheme } from "react-native-paper";

// Componente simple de DatePicker
const SimpleCalendar = ({ selectedDate, onDateSelect, onClose }: any) => {
  const { colors } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  return (
    <View style={[styles.calendarContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.calendarHeader}>
        <IconButton
          icon="chevron-left"
          onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
        />
        <Text style={{ fontSize: 16, fontWeight: '700', flex: 1, textAlign: 'center' }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <IconButton
          icon="chevron-right"
          onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
        />
      </View>

      <View style={styles.daysGrid}>
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
          <Text key={day} style={[styles.dayHeader, { color: colors.onSurfaceVariant }]}>{day}</Text>
        ))}
        {days.map((day, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.dayButton,
              day && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth()
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surfaceVariant }
            ]}
            onPress={() => {
              if (day) {
                const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                onDateSelect(newDate);
              }
            }}
            disabled={!day}
          >
            {day && (
              <Text
                style={{
                  color: selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth.getMonth()
                    ? colors.onPrimary
                    : colors.onSurfaceVariant,
                  fontWeight: '600',
                }}
              >
                {day}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Button mode="contained" onPress={onClose} style={{ marginTop: 16 }}>
        Aceptar
      </Button>
    </View>
  );
};

export const TransactionFormScreen = ({ type, transaction, onSave, onBack }: any) => {
  const { colors } = useTheme();
  const { allCategories } = useCategories(type);
  const isIncome = type === 'income';
  const isEditing = !!transaction;

  // @ts-ignore
  const bgColor = isIncome ? colors.incomeContainer : colors.expenseContainer;
  // @ts-ignore
  const mainColor = isIncome ? colors.income : colors.expense;

  const [desc, setDesc] = useState(transaction?.description || '');
  const [displayAmount, setDisplayAmount] = useState(transaction?.amount ? transaction.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '');
  const [category, setCategory] = useState(transaction?.category || allCategories[0] || (isIncome ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]));
  const [selectedDate, setSelectedDate] = useState(transaction?.date ? parseDate(transaction.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleAmountChange = (text: string) => {
    // Remove dots to get plain number
    const cleanNumber = text.replace(/\./g, '').replace(/[^0-9]/g, '');
    if (cleanNumber === '') {
      setDisplayAmount('');
      return;
    }
    // Format with dots
    const formatted = cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setDisplayAmount(formatted);
  };

  const handleSave = () => {
    const numericAmount = parseFloat(displayAmount.replace(/\./g, ''));

    // Validation
    if (!desc.trim()) {
      Alert.alert("Faltan datos", "Por favor ingresa una descripción");
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Monto inválido", "Por favor ingresa un monto válido mayor a 0");
      return;
    }
    if (!category) {
      Alert.alert("Faltan datos", "Por favor selecciona una categoría");
      return;
    }

    onSave({
      description: desc.trim(),
      amount: numericAmount,
      category,
      type,
      date: selectedDate,
      ...(isEditing && { id: transaction.id })
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content title={isEditing ? (isIncome ? "Editar Ingreso" : "Editar Gasto") : (isIncome ? "Nuevo Ingreso" : "Nuevo Gasto")} />
      </Appbar.Header>

      <View style={styles.formContent}>
        <View style={[styles.amountInputContainer, { backgroundColor: bgColor }]}>
          <Text style={{ color: colors.onSurfaceVariant, marginBottom: 8, fontWeight: '500' }}>Monto del movimiento</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: mainColor, marginRight: 8 }}>$</Text>
            <TextInput
              value={displayAmount}
              onChangeText={handleAmountChange}
              placeholder="0"
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
            left={<TextInput.Icon icon={() => <Type size={20} color={colors.onSurfaceVariant} />} />}
            style={{ backgroundColor: colors.background }}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              label="Fecha"
              value={formatDateForDisplay(selectedDate)}
              mode="outlined"
              editable={false}
              left={<TextInput.Icon icon={() => <Calendar size={20} color={colors.onSurfaceVariant} />} />}
              style={{ backgroundColor: colors.background }}
              pointerEvents="none"
            />
          </TouchableOpacity>

          <Text variant="titleSmall" style={{ marginTop: 8 }}>Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', maxHeight: 50 }}>
            {allCategories.map((cat) => (
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
            <Button
              mode="text"
              icon={Plus}
              onPress={() => setShowAddCategory(true)}
              textColor={colors.onSurfaceVariant}
              compact
            >
              Agregar
            </Button>
          </ScrollView>

          <Button
            mode="contained"
            onPress={handleSave}
            style={{ marginTop: 24, paddingVertical: 6, backgroundColor: mainColor }}
          >
            {isEditing ? (isIncome ? "Actualizar Ingreso" : "Actualizar Gasto") : (isIncome ? "Guardar Ingreso" : "Guardar Gasto")}
          </Button>
        </View>
      </View>

      <AddCategoryDialog
        visible={showAddCategory}
        onDismiss={() => setShowAddCategory(false)}
        type={isIncome ? 'income' : 'expense'}
      />

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <SimpleCalendar
              selectedDate={selectedDate}
              onDateSelect={(date: Date) => {
                setSelectedDate(date);
                setShowDatePicker(false);
              }}
              onClose={() => setShowDatePicker(false)}
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  calendarContainer: {
    borderRadius: 16,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  daysGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayHeader: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
});
