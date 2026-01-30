import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from "@/app/core/types/transaction";
import { Screen } from "@/app/navigation/AppNavigator";
import { CurrencyText } from "@/app/shared/components/CurrencyText";
import { useFinancialTrend } from "@/app/shared/hooks/useFinancialTrend";
import { RootState } from "@/app/store/store";
import { ArrowDownCircle, ArrowUpCircle, Calendar, ChevronRight, DollarSign, Moon, Settings, Sun, Tag, TrendingDown, TrendingUp } from "lucide-react-native";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Divider, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { BudgetWidget } from "../components/BudgetWidget";
import { QuickActionBar } from "../components/QuickActionBar";
import { WeeklySpendingChart } from "../components/WeeklySpendingChart";


interface DashboardScreenProps {
  transactions: Transaction[];
  onNavigate: (screen: Screen) => void;
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

  // 1. Logic: Filter for Current Month
  const now = new Date();
  const currentMonthKey = now.toISOString().substring(0, 7); // YYYY-MM
  const monthLabel = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const formattedMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonthKey));

  const totalIncome = currentMonthTransactions.filter((t: any) => t.type === 'income').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const totalExpense = currentMonthTransactions.filter((t: any) => t.type === 'expense').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // Trend Hook (Uses ALL transactions to calculate history)
  const trend = useFinancialTrend(transactions);

  // Get User from Redux
  const { name, gender } = useSelector((state: RootState) => state.user);
  // Simple "Online" check could be using NetInfo, but for now we rely on Image onError

  const insets = useSafeAreaInsets();

  // Avatar Logic
  // Using a distinct avatar service based on gender
  const avatarUrl = gender === 'female'
    ? `https://avatar.iran.liara.run/public/girl?username=${name}`
    : `https://avatar.iran.liara.run/public/boy?username=${name}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header (Sticky) */}
      <View style={[styles.header, { paddingHorizontal: 20, paddingTop: insets.top + 10 }]}>
        <View>
          <Text variant="titleMedium" style={{ color: colors.onSurfaceVariant }}>Hola, {name || 'Usuario'}</Text>
          <Text variant="headlineMedium" style={{ fontWeight: '800', color: colors.onSurface }}>Resumen</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => onNavigate('Settings')}>
            <Settings size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onToggleTheme}>
            {dark ? <Sun size={24} color={colors.onSurface} /> : <Moon size={24} color={colors.onSurface} />}
          </TouchableOpacity>
          <View style={{
            width: 48, height: 48, borderRadius: 24, overflow: 'hidden',
            backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center'
          }}>
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 48, height: 48 }}
            />
            <View style={[StyleSheet.absoluteFill, { zIndex: -1, alignItems: 'center', justifyContent: 'center' }]}>
              <Text variant="titleMedium" style={{ fontWeight: '700', color: colors.primary }}>
                {name ? name[0].toUpperCase() : 'U'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Balance Card Principal */}
        <Card style={[styles.balanceCard, { backgroundColor: colors.primary }]} mode="contained">
          <Card.Content style={styles.balanceCardContent}>
            <View>
              <Text variant="labelMedium" style={{ color: colors.onPrimary, opacity: 0.8, marginBottom: 4 }}>Balance del Mes</Text>
              <Text variant="displayMedium" style={{ color: colors.onPrimary, fontWeight: '800', marginBottom: 8 }}>
                ${Math.abs(balance).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
              </Text>
            </View>

            <View style={styles.trendRow}>
              <View style={[styles.trendTag, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                {trend.direction === 'increasing'
                  ? <TrendingUp size={16} color={colors.onPrimary} />
                  : <TrendingDown size={16} color={colors.onPrimary} />
                }
                <Text style={{ marginLeft: 6, color: colors.onPrimary, fontWeight: '700', fontSize: 12 }}>
                  {trend.direction === 'increasing' ? 'Tencencia al Alza' : trend.direction === 'decreasing' ? 'Tendencia a la Baja' : 'Estable'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Resumen Ingresos y Gastos (Grouped Card) */}
        <Card style={[styles.summaryCard, { backgroundColor: colors.surface }]} mode="contained">
          <Card.Content style={styles.groupedSummaryContent}>

            {/* Ingresos */}
            <View style={styles.summaryItem}>
              <View style={[styles.iconCircle, { backgroundColor: colors.incomeContainer }]}>
                <ArrowUpCircle size={24} color={colors.income} />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}>Ingresos</Text>
                <Text variant="headlineSmall" style={{ color: colors.income, fontWeight: '800' }}>
                  ${totalIncome.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </Text>
              </View>
            </View>

            <View style={[styles.verticalDivider, { backgroundColor: colors.outlineVariant }]} />

            {/* Gastos */}
            <View style={styles.summaryItem}>
              <View style={[styles.iconCircle, { backgroundColor: colors.expenseContainer }]}>
                <ArrowDownCircle size={24} color={colors.expense} />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}>Gastos</Text>
                <Text variant="headlineSmall" style={{ color: colors.expense, fontWeight: '800' }}>
                  ${totalExpense.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </Text>
              </View>
            </View>

          </Card.Content>
        </Card>

        {/* Quick Review / Compare */}
        <TouchableOpacity onPress={() => onNavigate('MonthlyComparison')}>
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

      {/* Quick Action Bar */}
      <QuickActionBar onNavigate={onNavigate} />
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
