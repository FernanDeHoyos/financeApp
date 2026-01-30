import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from "@/app/core/types/transaction";
import { Screen } from "@/app/navigation/AppNavigator";
import { CurrencyText } from "@/app/shared/components/CurrencyText";
import { useFinancialTrend } from "@/app/shared/hooks/useFinancialTrend";
import { RootState } from "@/app/store/store";
import { useIsFocused } from '@react-navigation/native';
import { ArrowDownCircle, ArrowUpCircle, Calendar, ChevronLeft, ChevronRight, DollarSign, Moon, Settings, Sun, Tag, TrendingDown, TrendingUp } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Divider, FAB, Portal, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { BudgetWidget } from "../components/BudgetWidget";
import { WeeklySpendingChart } from "../components/WeeklySpendingChart";


interface DashboardScreenProps {
  transactions: Transaction[];
  onNavigate: (screen: Screen, params?: any) => void;
  onSelectTransaction: (transaction: Transaction) => void;
  onToggleTheme: () => void;
}

export const DashboardScreen = ({
  transactions,
  onNavigate,
  onSelectTransaction,
  onToggleTheme,
}: DashboardScreenProps) => {
  const theme = useTheme<AppTheme>();
  const { colors, dark } = theme;
  const isFocused = useIsFocused(); // Check if screen is focused

  // 1. Logic: Filter by Month
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openFAB, setOpenFAB] = useState(false); // FAB State

  // Helper to change months
  const changeMonth = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  const currentMonthIdx = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const monthLabel = useMemo(() => selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }), [selectedDate]);
  const formattedMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const currentMonthTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (!t.date) return false;
      const parts = t.date.split('-');
      if (parts.length !== 3) return false;

      const tYear = parseInt(parts[0], 10);
      const tMonth = parseInt(parts[1], 10) - 1;

      return tMonth === currentMonthIdx && tYear === currentYear;
    });
  }, [transactions, currentMonthIdx, currentYear]);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = currentMonthTransactions.filter((t: any) => t.type === 'income').reduce((acc: number, curr: any) => acc + curr.amount, 0);
    const expense = currentMonthTransactions.filter((t: any) => t.type === 'expense').reduce((acc: number, curr: any) => acc + curr.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [currentMonthTransactions]);

  // Calculate Previous Month Balance for Comparison
  const prevMonthDate = new Date(selectedDate);
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  const prevMonthIdx = prevMonthDate.getMonth();
  const prevYear = prevMonthDate.getFullYear();

  const prevMonthTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (!t.date) return false;
      const parts = t.date.split('-');
      if (parts.length !== 3) return false;
      const tYear = parseInt(parts[0], 10);
      const tMonth = parseInt(parts[1], 10) - 1;
      return tMonth === prevMonthIdx && tYear === prevYear;
    });
  }, [transactions, prevMonthIdx, prevYear]);

  const prevBalance = useMemo(() => {
    const pIncome = prevMonthTransactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const pExpense = prevMonthTransactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    return pIncome - pExpense;
  }, [prevMonthTransactions]);

  const balanceDeltaPercent = useMemo(() => {
    if (prevBalance === 0) return 0;
    return ((balance - prevBalance) / Math.abs(prevBalance)) * 100;
  }, [balance, prevBalance]);

  // Derived Trend Properties
  const isPositiveTrend = balanceDeltaPercent >= 0;

  // Trend Hook (still used for other widgets if needed, but Card uses explicit calc now)
  const trend = useFinancialTrend(transactions);

  // Get User from Redux
  const { name, gender } = useSelector((state: RootState) => state.user);
  const insets = useSafeAreaInsets();

  const avatarUrl = gender === 'female'
    ? `https://avatar.iran.liara.run/public/girl?username=${name}`
    : `https://avatar.iran.liara.run/public/boy?username=${name}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header (Sticky) */}
      <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 10, marginBottom: 20 }}>

        {/* Row 1: Greeting & Actions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <View>
            <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>Hola,</Text>
            <Text variant="headlineSmall" style={{ fontWeight: '800', color: colors.onSurface }}>{name || 'Usuario'}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => onNavigate('Settings')}>
              <Settings size={24} color={colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onToggleTheme}>
              {dark ? <Sun size={24} color={colors.onSurface} /> : <Moon size={24} color={colors.onSurface} />}
            </TouchableOpacity>
            <View style={{
              width: 40, height: 40, borderRadius: 20, overflow: 'hidden',
              backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center'
            }}>
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: 40, height: 40 }}
              />
            </View>
          </View>
        </View>

        {/* Row 2: Month Selector (Centered) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceVariant + '40', borderRadius: 16, padding: 4 }}>
          <TouchableOpacity onPress={() => changeMonth(-1)} hitSlop={16} style={{ padding: 8 }}>
            <ChevronLeft size={24} color={colors.onSurface} />
          </TouchableOpacity>

          <Text
            variant="titleLarge"
            style={{ fontWeight: '700', color: colors.onSurface, flex: 1, textAlign: 'center' }}
          >
            {formattedMonthLabel}
          </Text>

          <TouchableOpacity onPress={() => changeMonth(1)} hitSlop={16} style={{ padding: 8 }}>
            <ChevronRight size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Balance Card Principal */}
        <Card style={[styles.balanceCard, { backgroundColor: balance < 0 ? colors.error : colors.primary }]} mode="contained">
          <Card.Content style={styles.balanceCardContent}>

            {/* Top Row: Balance and Percent */}
            <View style={{ width: '100%', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text variant="labelMedium" style={{ color: balance < 0 ? colors.onError : colors.onPrimary, opacity: 0.9 }}>Balance del Mes</Text>
                  <Text variant="displayMedium" style={{ color: balance < 0 ? colors.onError : colors.onPrimary, fontWeight: '800' }}>
                    {balance < 0 ? '-' : ''}${Math.abs(balance).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </Text>
                </View>

                {/* Delta Badge */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.surface, // Solid background for contrast
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 20
                }}>
                  {balanceDeltaPercent >= 0
                    ? <TrendingUp size={16} color={colors.income} />
                    : <TrendingDown size={16} color={colors.expense} />
                  }
                  <Text style={{ marginLeft: 4, fontWeight: '700', color: balanceDeltaPercent >= 0 ? colors.income : colors.expense }}>
                    {Math.abs(balanceDeltaPercent).toFixed(1)}%
                  </Text>
                </View>
              </View>
              <Text variant="labelSmall" style={{ color: balance < 0 ? colors.onError : colors.onPrimary, opacity: 0.7, marginTop: -4 }}>
                vs mes anterior (${prevBalance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")})
              </Text>
            </View>

            {/* Bottom Row: Income / Expense Mini-Summary */}
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ padding: 8, backgroundColor: colors.surface, borderRadius: 12 }}>
                  <ArrowUpCircle size={20} color={colors.income} />
                </View>
                <View>
                  <Text variant="bodyMedium" style={{ color: balance < 0 ? colors.onError : colors.onPrimary, opacity: 0.8 }}>Ingresos</Text>
                  <Text variant="titleSmall" style={{ color: balance < 0 ? colors.onError : colors.onPrimary, fontWeight: '700' }}>
                    ${totalIncome.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </Text>
                </View>
              </View>

              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)', height: '80%' }} />

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ padding: 8, backgroundColor: colors.surface, borderRadius: 12 }}>
                  <ArrowDownCircle size={20} color={colors.expense} />
                </View>
                <View>
                  <Text variant="bodyMedium" style={{ color: balance < 0 ? colors.onError : colors.onPrimary, opacity: 0.8 }}>Gastos</Text>
                  <Text variant="titleSmall" style={{ color: balance < 0 ? colors.onError : colors.onPrimary, fontWeight: '700' }}>
                    ${totalExpense.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </Text>
                </View>
              </View>
            </View>

          </Card.Content>
        </Card>


        {/* Quick Review / Compare */}
        <TouchableOpacity onPress={() => onNavigate('MonthlyComparison', { initialDate: selectedDate.toISOString() })}>
          <Card style={[styles.actionCard, { backgroundColor: colors.secondaryContainer }]} mode="contained">
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Calendar size={24} color={colors.onSecondaryContainer} />
                <View>
                  <Text variant="titleSmall" style={{ fontWeight: '700', color: colors.onSecondaryContainer }}>Comparar Meses</Text>
                  <Text variant="bodySmall" style={{ color: colors.onSecondaryContainer, opacity: 0.8 }}>Ver historial y tendencias</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.onSecondaryContainer} />
            </Card.Content>
          </Card>
        </TouchableOpacity>


        {/* Budget Widget */}
        <BudgetWidget currentExpense={totalExpense} />

        {/* Weekly Spending Habits */}
        <WeeklySpendingChart transactions={currentMonthTransactions} />

        {/* Transacciones Recientes */}
        <View style={[styles.sectionTitleContainer, { marginTop: 12 }]}>
          <Text variant="titleLarge" style={{ fontWeight: '700', color: colors.onSurface }}>Movimientos</Text>
          <Button mode="text" onPress={() => onNavigate('List')} labelStyle={{ fontSize: 13, fontWeight: '700' }}>
            Ver Todos
          </Button>
        </View>

        {currentMonthTransactions.length === 0 ? (
          <Card style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]} mode="outlined">
            <Card.Content style={styles.emptyContent}>
              <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
                Sin movimientos este mes
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.transactionsList}>
            {currentMonthTransactions.slice(0, 5).map((item: any, idx: number) => (
              <TouchableOpacity key={item.id} activeOpacity={0.7} onPress={() => onSelectTransaction(item)}>
                <View style={styles.transactionRowItem}>
                  <View
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: item.type === 'income' ? colors.incomeContainer : colors.expenseContainer,
                      },
                    ]}
                  >
                    {item.type === 'income' ? (
                      <DollarSign size={20} color={colors.income} />
                    ) : (
                      <Tag size={20} color={colors.expense} />
                    )}
                  </View>

                  <View style={styles.transactionInfo}>
                    <Text variant="bodyLarge" style={{ color: colors.onSurface, fontWeight: '600' }} numberOfLines={1}>
                      {item.description}
                    </Text>
                    <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                      {item.category} • {new Date(item.date).getDate()}
                    </Text>
                  </View>

                  <CurrencyText amount={item.amount} type={item.type} bold style={{ fontSize: 16 }} />
                </View>
                {idx < 4 && <Divider style={{ marginLeft: 64, backgroundColor: colors.outlineVariant }} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button (Nequi Style) */}
      <Portal>
        <FAB.Group
          open={openFAB}
          visible={isFocused}
          icon={openFAB ? 'close' : 'plus'}
          color={colors.onPrimaryContainer}
          style={{ paddingBottom: 100 }}
          fabStyle={{ backgroundColor: colors.primaryContainer }}
          actions={[

            {
              icon: 'file-excel',
              label: 'Importar Excel',
              onPress: () => onNavigate('ImportTransactions'),
              style: { backgroundColor: colors.secondaryContainer },
              color: colors.onSecondaryContainer,
              labelStyle: { color: colors.onSurface }
            },
            {
              icon: 'arrow-down',
              label: 'Nuevo Gasto',
              onPress: () => onNavigate('AddExpense'),
              style: { backgroundColor: colors.errorContainer },
              color: colors.onErrorContainer,
              labelStyle: { color: colors.onSurface }
            },
            {
              icon: 'arrow-up',
              label: 'Nuevo Ingreso',
              onPress: () => onNavigate('AddIncome'),
              style: { backgroundColor: colors.incomeContainer },
              color: colors.income,
              labelStyle: { color: colors.onSurface }
            },
          ]}
          onStateChange={({ open }) => setOpenFAB(open)}
          onPress={() => {
            if (openFAB) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </View >
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 140,
  },
  balanceCard: {
    borderRadius: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  balanceCardContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  trendTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 4,
  },
  summaryCard: {
    borderRadius: 22,
    elevation: 2,
    marginBottom: 20,
  },
  groupedSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  summaryItem: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    height: '80%',
    marginHorizontal: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionCard: {
    borderRadius: 16,
    marginBottom: 0,
    elevation: 0,
  },
  sectionTitleContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyCard: {
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyContent: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  transactionsList: {
    backgroundColor: 'transparent',
  },
  transactionRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
});
