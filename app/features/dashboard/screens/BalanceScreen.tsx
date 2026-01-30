import { AppTheme } from '@/app/core/theme/theme';
import { Transaction } from '@/app/core/types/transaction';
import { useTransactions } from '@/app/shared/hooks/useTransactions';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Appbar, Card, Text, useTheme } from 'react-native-paper';

import { BalanceSummaryCard } from '../components/Balance/BalanceSummaryCard';
import { CashFlowCard } from '../components/Balance/CashFlowCard';
import { CategoryBreakdown } from '../components/Balance/CategoryBreakdown';
import { MonthlyHistoryChart } from '../components/Balance/MonthlyHistoryChart';
import { TopExpensesCard } from '../components/Balance/TopExpensesCard';

export default function BalanceScreen() {
  const { transactions } = useTransactions();
  const { colors, dark } = useTheme<AppTheme>();

  // Filter for Current Month
  const now = new Date();
  const currentMonthKey = now.toISOString().substring(0, 7); // YYYY-MM
  const currentMonthTransactions = transactions.filter((t: Transaction) => t.date.startsWith(currentMonthKey));

  const totalIncome = currentMonthTransactions
    .filter((t: Transaction) => t.type === 'income')
    .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter((t: Transaction) => t.type === 'expense')
    .reduce((acc: number, curr: Transaction) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Comparison Bar Chart (Summary)
  const barChartData = [
    {
      label: 'Ingresos',
      value: totalIncome,
      frontColor: colors.income,
      labelWidth: 60,
    },
    {
      label: 'Gastos',
      value: totalExpense,
      frontColor: colors.expense,
      labelWidth: 50,
    },
  ];

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.Content title="Análisis Mensual" titleStyle={{ fontWeight: '700' }} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Balance Summary (Current Month) */}
        <BalanceSummaryCard
          balance={balance}
          transactionCount={currentMonthTransactions.length}
          averageTransaction={balance / Math.max(currentMonthTransactions.length, 1)}
        />

        {/* Cash Flow Detailed Summary */}
        <CashFlowCard income={totalIncome} expense={totalExpense} />

        {/* Basic Comparison */}
        <View style={styles.section}>
          <Card style={[styles.chartCard, { backgroundColor: colors.surface }]} mode="outlined">
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: '700', marginBottom: 2 }}>
                Comparativa
              </Text>
              <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                Ingresos vs Gastos Totales
              </Text>
              <View style={{ alignItems: "center", flexDirection: 'row', marginTop: 12, gap: 16 }}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors.income }]} />
                  <Text variant="bodySmall" style={{ color: colors.onSurface }}>Ingresos</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: colors.expense }]} />
                  <Text variant="bodySmall" style={{ color: colors.onSurface }}>Gastos</Text>
                </View>
              </View>
            </View>

            <Card.Content style={[styles.chartContent, { paddingTop: 24, paddingBottom: 12 }]}>

              <BarChart
                data={barChartData}
                height={180}
                barWidth={28}
                spacing={50}
                formatYLabel={(label) => String(label).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                yAxisTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10, fontWeight: '500' }}
                yAxisLabelWidth={50}
                xAxisLabelTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10, fontWeight: '500' }}
                labelWidth={56}
                yAxisColor={colors.outlineVariant}
                xAxisColor={colors.outlineVariant}
                yAxisIndicesColor={colors.outlineVariant}
                noOfSections={5}
                showFractionalValues={false}
                showYAxisIndices
                isAnimated
                animationDuration={900}
                frontColor={colors.primary}
              />
            </Card.Content>
          </Card>
        </View>

        {/* Category Breakdowns (Current Month) */}
        <CategoryBreakdown transactions={currentMonthTransactions} type="income" />
        <CategoryBreakdown transactions={currentMonthTransactions} type="expense" />

        {/* Top Individual Expenses */}
        <TopExpensesCard transactions={currentMonthTransactions} />

        {/* Monthly History */}
        <MonthlyHistoryChart transactions={transactions} dark={dark} />

        <View style={{ height: 40 }} />
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
