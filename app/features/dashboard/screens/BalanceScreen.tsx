import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from '@/app/core/types/transaction';
import { useTransactions } from '@/app/shared/hooks/useTransactions';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { ActivityIndicator, Appbar, Card, IconButton, Text, useTheme } from 'react-native-paper';

import { useState } from 'react';
import { CashFlowCard } from '../components/Balance/CashFlowCard';
import { CategoryBreakdown } from '../components/Balance/CategoryBreakdown';
import { MonthlyHistoryChart } from '../components/Balance/MonthlyHistoryChart';
import { TopExpensesCard } from '../components/Balance/TopExpensesCard';

export default function BalanceScreen() {
  const { transactions, loading } = useTransactions();
  const { colors, dark } = useTheme<AppTheme>();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // State for Month Filter
  // Pivot on the 1st to prevent month skipping
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const handlePrevMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const monthLabel = selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const getMonthKey = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  };

  const selectedMonthKey = getMonthKey(selectedDate);

  // Filter Transactions by Selected Month (Robust)
  const filteredTransactions = transactions.filter((t: Transaction) => {
    if (!t.date) return false;
    // Handle "YYYY-MM-DD" robustly
    const parts = t.date.split('-');
    if (parts.length < 2) return false; // Need at least YYYY-MM

    const tKey = `${parts[0]}-${parts[1]}`; // YYYY-MM
    return tKey === selectedMonthKey;
  });

  const formatCompact = (val: number) => {
    if (val >= 1000000) {
      const mVal = val / 1000000;
      return `$${mVal.toFixed(mVal % 1 === 0 ? 0 : 1)}M`;
    }
    if (val >= 1000) {
      const kVal = val / 1000;
      return `$${kVal.toFixed(0)}k`;
    }
    return `$${val.toFixed(0)}`;
  };

  const totalIncome = filteredTransactions
    .filter((t: Transaction) => t.type === 'income')
    .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t: Transaction) => t.type === 'expense')
    .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Comparison Bar Chart (Summary)
  const barChartData = [
    {
      label: 'Ingresos',
      value: totalIncome,
      frontColor: colors.income,
      gradientColor: colors.incomeContainer,
      topLabelComponent: () => (
        <Text style={{ fontSize: 10, color: colors.income, fontWeight: '700', marginBottom: 4 }}>
          {totalIncome >= 1000000 ? (totalIncome / 1000000).toFixed(1) + 'M' : (totalIncome / 1000).toFixed(0) + 'k'}
        </Text>
      ),
    },
    {
      label: 'Gastos',
      value: totalExpense,
      frontColor: colors.expense,
      gradientColor: colors.expenseContainer,
      topLabelComponent: () => (
        <Text style={{ fontSize: 10, color: colors.expense, fontWeight: '700', marginBottom: 4 }}>
          {totalExpense >= 1000000 ? (totalExpense / 1000000).toFixed(1) + 'M' : (totalExpense / 1000).toFixed(0) + 'k'}
        </Text>
      ),
    },
  ];

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: 'transparent', height: 40 }}>
        <Appbar.Content title="Análisis Mensual" titleStyle={{ fontWeight: '700', fontSize: 18 }} />
      </Appbar.Header>

      <View style={styles.stickyHeader}>
        <View style={[styles.monthSelector, { backgroundColor: colors.surfaceVariant + '40' }]}>
          <IconButton icon="chevron-left" size={20} onPress={handlePrevMonth} style={{ margin: 0 }} />
          <Text variant="titleMedium" style={{ fontWeight: '700', textTransform: 'capitalize', minWidth: 120, textAlign: 'center' }}>
            {monthLabel}
          </Text>
          <IconButton icon="chevron-right" size={20} onPress={handleNextMonth} style={{ margin: 0 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>



        {/* Cash Flow Detailed Summary (Filtered) */}
        <CashFlowCard income={totalIncome} expense={totalExpense} />

        {/* Basic Comparison (Filtered) */}
        <View style={styles.section}>
          <Card style={[styles.chartCard, { backgroundColor: colors.surface }]} mode="outlined">
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: '700', marginBottom: 2 }}>
                Comparativa
              </Text>
              <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                Ingresos vs Gastos
              </Text>
            </View>

            <Card.Content style={[styles.chartContent, { paddingTop: 30, paddingBottom: 20 }]}>
              {totalIncome === 0 && totalExpense === 0 ? (
                <View style={{ height: 180, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <Text style={{ color: colors.onSurfaceVariant }}>Sin datos en este mes</Text>
                </View>
              ) : (
                <BarChart
                  key={selectedMonthKey} // Force re-render on month change
                  data={barChartData}
                  barWidth={60}
                  spacing={40}
                  roundedTop
                  roundedBottom
                  hideRules
                  showGradient
                  xAxisThickness={0}
                  yAxisThickness={0}
                  xAxisLabelTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10 }}
                  yAxisTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10 }}
                  noOfSections={4}
                  formatYLabel={(label) => formatCompact(parseFloat(label))}
                  maxValue={Math.max(totalIncome, totalExpense) * 1.2 || 100}
                  height={220}
                  width={Dimensions.get('window').width - 80}
                  isAnimated
                  animationDuration={600}
                  renderTooltip={(item: any) => {
                    return (
                      <View style={{
                        marginBottom: 20,
                        marginLeft: -6,
                        backgroundColor: colors.inverseSurface,
                        paddingHorizontal: 6,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }}>
                        <Text style={{ color: colors.inverseOnSurface, fontSize: 12 }}>
                          ${item.value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </Text>
                      </View>
                    );
                  }}
                />
              )}
            </Card.Content>
          </Card>
        </View>

        {/* Category Breakdowns (Filtered) */}
        <CategoryBreakdown transactions={filteredTransactions} type="income" />
        <CategoryBreakdown transactions={filteredTransactions} type="expense" />

        {/* Top Individual Expenses (Filtered) */}
        <TopExpensesCard transactions={filteredTransactions} />

        {/* Monthly History (Global Scope - Unfiltered) */}
        <MonthlyHistoryChart transactions={transactions} dark={dark} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 40,
  },
  stickyHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 0,
    height: 44,
  },
  title: {
    fontWeight: '700',
    marginBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  chartCard: {
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  chartContent: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});
