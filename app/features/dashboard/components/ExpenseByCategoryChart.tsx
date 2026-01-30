import { AppTheme } from "@/app/core/theme/theme";
import { Transaction } from "@/app/core/types/transaction";
import { Dimensions, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Card, Text, useTheme } from "react-native-paper";

interface ExpenseByCategoryChartProps {
  transactions: Transaction[];
}

export const ExpenseByCategoryChart = ({ transactions }: ExpenseByCategoryChartProps) => {
  const theme = useTheme<AppTheme>();
  const { colors, dark } = theme;

  // Filter only expense transactions
  const expenseTransactions = transactions.filter((t: any) => t.type === 'expense');

  // Group expenses by category and sum amounts
  const expenseByCategory = expenseTransactions.reduce((acc: any, curr: any) => {
    const category = curr.category || 'Sin categoría';
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += curr.amount;
    return acc;
  }, {});

  // Color palette for chart
  const colorPalette = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#F7DC6F', // Yellow
    '#BB8FCE', // Purple
    '#85C1E2', // Light Blue
    '#F8B88B', // Peach
    '#A8E6CF', // Light Green
    '#FFD3B6', // Orange
    '#FF8B94', // Pink
  ];

  // Prepare data for pie chart
  let colorIndex = 0;
  const chartData = Object.entries(expenseByCategory)
    .sort((a: any, b: any) => b[1] - a[1]) // Sort by amount descending
    .map(([category, amount]: any, idx: number) => ({
      value: parseFloat(amount.toFixed(2)),
      label: category.length > 12 ? category.substring(0, 10) + '..' : category,
      color: colorPalette[colorIndex++ % colorPalette.length],
      category: category,
      amount: amount,
    }));

  const totalExpenses = chartData.reduce((acc, item) => acc + item.value, 0);

  // Show empty state
  if (chartData.length === 0) {
    return (
      <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
        <Card.Content style={styles.emptyContent}>
          <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, textAlign: 'center' }}>
            Sin gastos registrados
          </Text>
        </Card.Content>
      </Card>
    );
  }

  const screenWidth = Dimensions.get('window').width;
  const chartSize = Math.min(screenWidth - 100, 150);

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
      <Card.Content style={styles.cardContent}>
        <Text variant="titleMedium" style={[styles.title, { color: colors.onSurface }]}>
          Gastos por Categoría
        </Text>
        <Text
          variant="bodySmall"
          style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
        >
          Total: ${totalExpenses.toFixed(2)}
        </Text>

        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            donut
            innerRadius={35}
            radius={chartSize / 2}
            innerCircleColor={colors.surface}
            textColor={dark ? '#FFF' : '#000'}
            showText={false}
            textSize={10}
            focusOnPress={true}
            onPress={(item: any) => {}}
            showValuesAsLabels={false}
          />
        </View>

        {/* Legend - Show only top 4 categories */}
        <View style={styles.legendContainer}>
          {chartData.slice(0, 4).map((item, idx) => {
            const percentage = ((item.value / totalExpenses) * 100).toFixed(0);
            return (
              <View key={idx} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColorBox,
                    { backgroundColor: item.color },
                  ]}
                />
                <View style={styles.legendTextContainer}>
                  <Text
                    variant="labelSmall"
                    style={{ color: colors.onSurface, fontWeight: '600', fontSize: 11 }}
                    numberOfLines={1}
                  >
                    {item.category}
                  </Text>
                  <Text
                    variant="labelSmall"
                    style={{ color: colors.onSurfaceVariant, fontSize: 10 }}
                  >
                    ${item.amount.toFixed(0)} ({percentage}%)
                  </Text>
                </View>
              </View>
            );
          })}
          {chartData.length > 4 && (
            <Text
              variant="labelSmall"
              style={{ color: colors.onSurfaceVariant, marginLeft: 16, marginTop: 2 }}
            >
              +{chartData.length - 4} más
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 2,
    fontSize: 13,
  },
  subtitle: {
    marginBottom: 6,
    fontSize: 11,
  },
  emptyContent: {
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    height: 120,
  },
  legendContainer: {
    gap: 3,
    marginTop: 6,
    maxHeight: 90,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 1,
  },
  legendColorBox: {
    width: 8,
    height: 8,
    borderRadius: 2,
    marginRight: 6,
  },
  legendTextContainer: {
    flex: 1,
  },
});
