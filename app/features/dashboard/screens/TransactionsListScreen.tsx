import { CurrencyText } from '@/app/shared/components/CurrencyText';
import { ALL_CATEGORIES } from '@/app/core/constants/categories';
import { useTransactions } from '@/app/shared/hooks/useTransactions';
import { AppTheme } from '@/app/core/theme/theme';
import { formatDateForDisplay, parseDate } from '@/app/utils/dateFormatting';
import { useNavigation } from '@react-navigation/native';
import { Calendar, DollarSign, Edit2, Filter, Tag, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, Card, Dialog, Divider, Portal, Text, useTheme } from 'react-native-paper';

export default function TransactionsListScreen() {
  const { transactions, deleteTransaction } = useTransactions();
  const { colors } = useTheme<AppTheme>();
  const navigation = useNavigation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Obtener categorías reales de las transacciones + predefinidas
  const categoriesFromTransactions = Array.from(
    new Set(transactions.map((t: any) => t.category))
  );
  const availableCategories = Array.from(
    new Set([...categoriesFromTransactions, ...ALL_CATEGORIES])
  ).sort();

  const sortedTransactions = [...transactions]
    .filter(t => !selectedCategory || t.category === selectedCategory)
    .sort((a: any, b: any) => {
      const dateA = parseDate(a.date).getTime();
      const dateB = parseDate(b.date).getTime();
      return dateB - dateA;
    });

  const handleDeletePress = (transaction: any) => {
    setTransactionToDelete(transaction);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
      setShowDeleteDialog(false);
      setTransactionToDelete(null);
    }
  };

  const handleEditPress = (transaction: any) => {
    // @ts-ignore
    navigation.navigate('EditTransaction', { transaction });
  };

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Transacciones" titleStyle={{ fontWeight: '700' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        <Button
          mode="outlined"
          icon={() => <Filter size={18} color={colors.primary} />}
          onPress={() => setShowFilterModal(true)}
          style={styles.filterButton}
          labelStyle={styles.filterButtonLabel}
        >
          {selectedCategory ? `Filtrar: ${selectedCategory}` : 'Filtrar por categoría'}
        </Button>

        {sortedTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={{ color: colors.onSurfaceVariant }}>
              {selectedCategory ? 'No hay transacciones en esta categoría' : 'No hay transacciones aún'}
            </Text>
          </View>
        ) : (
          sortedTransactions.map((t: any) => (
            <Card key={t.id} style={[styles.transactionCard, { backgroundColor: colors.surface, borderColor: colors.surfaceVariant }]} mode="outlined" >
              <Card.Content style={styles.transactionContent}>
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor:
                        t.type === 'income'
                          ? colors.incomeContainer
                          : colors.expenseContainer,
                    },
                  ]}
                >
                  {t.type === 'income' ? (
                    <DollarSign size={20} color={colors.income} />
                  ) : (
                    <Tag size={20} color={colors.expense} />
                  )}
                </View>

                <View style={styles.transactionInfo}>
                  <Text variant="bodyMedium" style={{ color: colors.onSurface, fontWeight: '600' }} numberOfLines={1}>
                    {t.description}
                  </Text>
                  <View style={styles.metaInfo}>
                    <Calendar size={12} color={colors.onSurfaceVariant} />
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginLeft: 4 }}>
                      {formatDateForDisplay(t.date)}
                    </Text>
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginLeft: 8 }}>•</Text>
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginLeft: 8 }}>
                      {t.category}
                    </Text>
                  </View>
                </View>

                <View style={styles.amountContainer}>
                  <CurrencyText amount={t.amount} type={t.type} bold />
                </View>

                <TouchableOpacity
                  style={[styles.actionButton, { marginLeft: 8 }]}
                  onPress={() => handleEditPress(t)}
                >
                  <Edit2 size={18} color={colors.onSurfaceVariant} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, { marginLeft: 4 }]}
                  onPress={() => handleDeletePress(t)}
                >
                  <Trash2 size={18} color={colors.error} />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ))
        )}

        <Portal>
          <Dialog
            visible={showFilterModal}
            onDismiss={() => setShowFilterModal(false)}
          >
            <Dialog.Title style={styles.dialogTitle}>Filtrar por categoría</Dialog.Title>
            <Divider />
            <ScrollView style={styles.filterModalScrollView}>
              <View style={styles.filterModalContent}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedCategory(null);
                    setShowFilterModal(false);
                  }}
                  style={[
                    styles.filterItemRow,
                    selectedCategory === null && { backgroundColor: colors.primaryContainer }
                  ]}
                >
                  <Text
                    style={[
                      styles.filterItemText,
                      selectedCategory === null && { color: colors.primary, fontWeight: '700' }
                    ]}
                  >
                    Todas
                  </Text>
                  <Text
                    style={[
                      styles.filterItemCount,
                      selectedCategory === null && { color: colors.primary }
                    ]}
                  >
                    {transactions.length}
                  </Text>
                </TouchableOpacity>
                <Divider style={{ marginVertical: 4 }} />
                {availableCategories.map((cat) => {
                  const count = transactions.filter(t => t.category === cat).length;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setShowFilterModal(false);
                      }}
                      style={[
                        styles.filterItemRow,
                        selectedCategory === cat && { backgroundColor: colors.primaryContainer }
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterItemText,
                          selectedCategory === cat && { color: colors.primary, fontWeight: '700' }
                        ]}
                      >
                        {cat}
                      </Text>
                      <Text
                        style={[
                          styles.filterItemCount,
                          selectedCategory === cat && { color: colors.primary }
                        ]}
                      >
                        {count}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            <Divider />
            <Dialog.Actions>
              <Button onPress={() => setShowFilterModal(false)} labelStyle={styles.dialogButtonLabel}>
                Cerrar
              </Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
            <Dialog.Title>Eliminar transacción</Dialog.Title>
            <Dialog.Content>
              <Text>¿Estás seguro de que deseas eliminar esta transacción?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setShowDeleteDialog(false)}>Cancelar</Button>
              <Button onPress={handleConfirmDelete} textColor={colors.error}>
                Eliminar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontWeight: '700',
    marginBottom: 16,
  },
  filterButton: {
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1.5,
  },
  filterButtonLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 12,
  },
  filterModalScrollView: {
    maxHeight: 350,
  },
  filterModalContent: {
    paddingVertical: 8,
  },
  filterItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  filterItemText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  filterItemCount: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  dialogButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  transactionCard: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  transactionInfo: {
    flex: 1,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  amountContainer: {
    marginLeft: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
