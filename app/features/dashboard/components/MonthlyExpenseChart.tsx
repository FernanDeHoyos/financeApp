import { AppTheme } from "@/app/core/theme/theme";
import { Transaction } from "@/app/core/types/transaction";
import { StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Card, Text, useTheme } from "react-native-paper";

interface MonthlyExpenseChartProps {
  transactions: Transaction[];
}

export const MonthlyExpenseChart = ({ transactions }: MonthlyExpenseChartProps) => {
  const theme = useTheme<AppTheme>();
  const { colors, dark } = theme;

  // Group expenses by month
  const expenseByMonth: any = {};
  const currentDate = new Date();
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
    expenseByMonth[monthKey] = 0;
  }

  // Aggregate expenses by month
  transactions
    .filter((t: any) => t.type === 'expense')
    .forEach((t: any) => {
      try {
        const [day, month, year] = t.date.split('/');
        const transactionDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const monthKey = transactionDate.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
        
        if (monthKey in expenseByMonth) {
          expenseByMonth[monthKey] += t.amount;
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

  // Prepare chart data
  const barData = Object.entries(expenseByMonth).map(([month, amount]: any) => ({
    value: Math.round(amount),
    label: month,
    frontColor: colors.expense,
  }));

  const maxValue = Math.max(...barData.map(item => item.value));
  
  // Show message if no expenses in period
  if (maxValue === 0) {
    return (
      <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
        <Card.Content style={styles.emptyContent}>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
            Sin gastos en los últimos 6 meses
          </Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={[styles.title, { color: colors.onSurface }]}>
          Gastos Últimos 6 Meses
        </Text>
        
        <View style={styles.chartContainer}>
          <BarChart
            data={barData}
            barWidth={18}
            isAnimated
            animationDuration={800}
            noOfSections={3}
            barBorderRadius={4}
            yAxisThickness={0}
            xAxisThickness={0}
            xAxisLabelTextStyle={{ color: colors.onSurfaceVariant, fontSize: 10 }}
            labelWidth={32}
            height={140}
            spacing={8}
            hideRules={true}
          />
        </View>

        <View style={[styles.summaryContainer, { backgroundColor: colors.surfaceVariant }]}>
          <Text
            variant="bodySmall"
            style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}
          >
            Máximo gasto en un mes:{' '}
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurface, fontWeight: '700' }}
            >
              ${Math.max(...barData.map(item => item.value)).toFixed(0)}
            </Text>
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginBottom: 12,
  },
  cardContent: {
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 13,
  },
  emptyContent: {
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 6,
    marginLeft: 12,
  },
  summaryContainer: {
    marginHorizontal: 12,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
});
