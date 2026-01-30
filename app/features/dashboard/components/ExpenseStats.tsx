import { AppTheme } from "@/app/core/theme/theme";
import { Transaction } from "@/app/core/types/transaction";
import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

interface ExpenseStatsProps {
  transactions: Transaction[];
}

export const ExpenseStats = ({ transactions }: ExpenseStatsProps) => {
  const theme = useTheme<AppTheme>();
  const { colors } = theme;

  // Calculate expense statistics
  const expenseTransactions = transactions.filter((t: any) => t.type === 'expense');
  
  if (expenseTransactions.length === 0) {
    return null;
  }

  const totalExpenses = expenseTransactions.reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const avgExpense = totalExpenses / expenseTransactions.length;
  const maxExpense = Math.max(...expenseTransactions.map((t: any) => t.amount));
  
  // Find category with most expenses (by count)
  const categoryCount = expenseTransactions.reduce((acc: any, curr: any) => {
    const category = curr.category || 'Sin categoría';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  const mostFrequentCategory = Object.entries(categoryCount).reduce((a: any, b: any) =>
    (b[1] as number) > (a[1] as number) ? b : a
  )[0];

  return (
    <Card style={[styles.card, { backgroundColor: colors.surface }]} mode="outlined">
      <Card.Content style={styles.cardContent}>
        <View style={styles.statsGrid}>
          {/* Promedio de gasto */}
          <View style={styles.statItem}>
            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant, marginBottom: 3, fontSize: 10 }}>
              Promedio
            </Text>
            <Text variant="titleSmall" style={{ color: colors.onSurface, fontWeight: '700', fontSize: 12 }}>
              ${avgExpense.toFixed(0)}
            </Text>
          </View>

          {/* Mayor gasto */}
          <View style={styles.statItem}>
            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant, marginBottom: 3, fontSize: 10 }}>
              Mayor Gasto
            </Text>
            <Text variant="titleSmall" style={{ color: colors.onSurface, fontWeight: '700', fontSize: 12 }}>
              ${maxExpense.toFixed(0)}
            </Text>
          </View>

          {/* Cantidad de gastos */}
          <View style={styles.statItem}>
            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant, marginBottom: 3, fontSize: 10 }}>
              Transacciones
            </Text>
            <Text variant="titleSmall" style={{ color: colors.onSurface, fontWeight: '700', fontSize: 12 }}>
              {expenseTransactions.length}
            </Text>
          </View>

          {/* Categoría más frecuente */}
          <View style={styles.statItem}>
            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant, marginBottom: 3, fontSize: 10 }}>
              Categoría
            </Text>
            <Text 
              variant="labelSmall" 
              style={{ color: colors.onSurface, fontWeight: '700', fontSize: 11 }}
              numberOfLines={1}
            >
              {mostFrequentCategory}
            </Text>
          </View>
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
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
