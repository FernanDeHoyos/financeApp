import { ALL_CATEGORIES } from '@/app/core/constants/categories';
import { AppTheme } from '@/app/core/theme/theme';
import { CurrencyText } from '@/app/shared/components/CurrencyText';
import { useTransactions } from '@/app/shared/hooks/useTransactions';
import { formatDateForDisplay, parseDate } from '@/app/utils/dateFormatting';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { Calendar, DollarSign, Edit2, Filter, ListChecks, Tag, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Appbar, Button, Card, Dialog, Divider, Modal, Portal, Text, useTheme } from 'react-native-paper';

export default function TransactionsListScreen() {
  const { transactions, deleteTransaction, loading } = useTransactions();
  const { colors } = useTheme<AppTheme>();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const selectionMode = selectedIds.size > 0;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<any>(null); // For single delete
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Handlers for Selection
  const handleLongPress = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handlePress = (transaction: any) => {
    if (selectionMode) {
      handleLongPress(transaction.id);
    } else {
      // @ts-ignore
      navigation.navigate('EditTransaction', { transaction });
    }
  };

  const handleExitSelection = () => {
    setSelectedIds(new Set());
  };

  // Handlers for Single Delete
  const handleDeletePress = (transaction: any) => {
    if (selectionMode) {
      handleLongPress(transaction.id);
      return;
    }
    setTransactionToDelete(transaction);
    setShowDeleteDialog(true);
  };

  const handleConfirmSingleDelete = async () => {
    if (transactionToDelete) {
      setIsDeleting(true);
      // Close dialog immediately to show the loading modal
      setShowDeleteDialog(false);
      try {
        await deleteTransaction(transactionToDelete.id);
        setTransactionToDelete(null);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handlers for Bulk Delete
  const confirmBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true);
    // Close dialog immediately to show the loading modal
    setShowDeleteDialog(false);
    try {
      for (const id of Array.from(selectedIds)) {
        await deleteTransaction(id);
      }
      setSelectedIds(new Set());
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditPress = (transaction: any) => {
    // @ts-ignore
    navigation.navigate('EditTransaction', { transaction });
  };

  const isBulkDelete = selectionMode && !transactionToDelete;

  const renderItem = ({ item: t }: { item: any }) => {
    const isSelected = selectedIds.has(t.id);
    return (
      <Card
        style={[
          styles.transactionCard,
          {
            backgroundColor: isSelected ? colors.primaryContainer + '40' : colors.surface,
            borderColor: isSelected ? colors.primary : colors.surfaceVariant,
            borderWidth: isSelected ? 2 : 1
          }
        ]}
        mode="outlined"
        onLongPress={() => handleLongPress(t.id)}
        onPress={() => handlePress(t)}
      >
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

          {!selectionMode && (
            <>
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
            </>
          )}
        </Card.Content>
      </Card>
    );
  };

  const ListHeader = () => (
    <>
      {!selectionMode && (
        <Button
          mode="outlined"
          icon={() => <Filter size={18} color={colors.primary} />}
          onPress={() => setShowFilterModal(true)}
          style={styles.filterButton}
          labelStyle={styles.filterButtonLabel}
        >
          {selectedCategory ? `Filtrar: ${selectedCategory}` : 'Filtrar por categoría'}
        </Button>
      )}
    </>
  );

  const ListEmpty = () => (
    <View style={styles.emptyState}>
      <Text variant="bodyLarge" style={{ color: colors.onSurfaceVariant }}>
        {selectedCategory ? 'No hay transacciones en esta categoría' : 'No hay transacciones aún'}
      </Text>
    </View>
  );

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        {selectionMode ? (
          <>
            <Appbar.Action icon={() => <X size={24} color={colors.onSurface} />} onPress={handleExitSelection} />
            <Appbar.Content title={`${selectedIds.size} seleccionados`} />
            <Appbar.Action
              icon={() => <ListChecks size={24} color={colors.onSurface} />}
              onPress={() => {
                if (selectedIds.size === sortedTransactions.length) {
                  // Deselect all
                  setSelectedIds(new Set());
                } else {
                  // Select all
                  const allIds = new Set(sortedTransactions.map((t: any) => t.id));
                  setSelectedIds(allIds);
                }
              }}
            />
            <Appbar.Action icon={() => <Trash2 size={24} color={colors.error} />} onPress={confirmBulkDelete} />
          </>
        ) : (
          <>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Transacciones" titleStyle={{ fontWeight: '700' }} />
          </>
        )}
      </Appbar.Header>

      <View style={styles.container}>
        <FlashList
          data={sortedTransactions}
          renderItem={renderItem}
          // @ts-ignore
          estimatedItemSize={100}
          keyExtractor={(item: any) => item.id}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <Portal>
        <Dialog
          visible={showFilterModal}
          onDismiss={() => setShowFilterModal(false)}
        >
          <Dialog.Title style={styles.dialogTitle}>Filtrar por categoría</Dialog.Title>
          <Divider />
          <View style={styles.filterModalScrollContainer}>
            <FlashList
              data={[null, ...availableCategories]} // null for "Todas"
              // @ts-ignore
              estimatedItemSize={50}
              renderItem={({ item: cat }: { item: string | null }) => {
                const startCount = transactions.length;
                const count = cat === null
                  ? startCount
                  : transactions.filter((t: any) => t.category === cat).length;

                const isSelected = (cat === null && selectedCategory === null) || cat === selectedCategory;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory(cat);
                      setShowFilterModal(false);
                    }}
                    style={[
                      styles.filterItemRow,
                      isSelected && { backgroundColor: colors.primaryContainer }
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterItemText,
                        isSelected && { color: colors.primary, fontWeight: '700' }
                      ]}
                    >
                      {cat === null ? 'Todas' : cat}
                    </Text>
                    <Text
                      style={[
                        styles.filterItemCount,
                        isSelected && { color: colors.primary }
                      ]}
                    >
                      {count}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          <Divider />
          <Dialog.Actions>
            <Button onPress={() => setShowFilterModal(false)} labelStyle={styles.dialogButtonLabel}>
              Cerrar
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showDeleteDialog} onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>{isBulkDelete ? "Eliminar transacciones" : "Eliminar transacción"}</Dialog.Title>
          <Dialog.Content>
            <Text>
              {isBulkDelete
                ? `¿Estás seguro de que deseas eliminar ${selectedIds.size} elementos seleccionados?`
                : "¿Estás seguro de que deseas eliminar esta transacción?"}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button onPress={isBulkDelete ? handleConfirmBulkDelete : handleConfirmSingleDelete} textColor={colors.error}>
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Modal visible={isDeleting} dismissable={false} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: colors.surface, padding: 24, borderRadius: 16, alignItems: 'center', elevation: 5 }}>
            <ActivityIndicator size="large" />
            <Text style={{ color: colors.onSurface, marginTop: 16, fontWeight: '600' }}>Eliminando...</Text>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  filterButton: {
    borderRadius: 12,
    marginBottom: 20,
    marginTop: 10,
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
  filterModalScrollContainer: {
    height: 350,
    width: '100%',
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

