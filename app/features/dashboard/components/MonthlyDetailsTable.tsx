import { AppTheme } from '@/app/core/theme/theme';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

interface MonthlyDetailsTableProps {
  data: Array<{
    month: string;
    label: string;
    income: number;
    expense: number;
    balance: number;
  }>;
}

export const MonthlyDetailsTable = ({ data }: MonthlyDetailsTableProps) => {
  const { colors } = useTheme<AppTheme>();

  return (
    <Card style={[styles.chartCard, { backgroundColor: colors.surface }]} mode="outlined">
      <Card.Content style={{ paddingVertical: 16, paddingHorizontal: 12 }}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { color: colors.onSurfaceVariant, flex: 1.2 }]}>Mes</Text>
          <Text style={[styles.tableHeaderCell, { color: colors.income, flex: 1 }]}>Ingresos</Text>
          <Text style={[styles.tableHeaderCell, { color: colors.expense, flex: 1 }]}>Gastos</Text>
          <Text style={[styles.tableHeaderCell, { color: colors.onSurface, flex: 1, textAlign: 'right' }]}>Balance</Text>
        </View>
        {data.map((detail, idx) => (
          <View key={detail.month} style={[styles.tableRow, { backgroundColor: idx % 2 === 0 ? colors.surfaceVariant : 'transparent' }]}>
            <Text style={[styles.tableCell, { color: colors.onSurface, flex: 1.2, fontSize: 12 }]}>
              {detail.label}
            </Text>
            <Text style={[styles.tableCell, { color: colors.income, flex: 1, fontWeight: '600' }]}>
              ${detail.income.toFixed(0)}
            </Text>
            <Text style={[styles.tableCell, { color: colors.expense, flex: 1, fontWeight: '600' }]}>
              ${detail.expense.toFixed(0)}
            </Text>
            <Text style={[styles.tableCell, { color: detail.balance >= 0 ? colors.income : colors.expense, flex: 1, fontWeight: '700', textAlign: 'right' }]}>
              ${detail.balance.toFixed(0)}
            </Text>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 12,
  },
  tableHeaderCell: {
    fontWeight: '700',
    fontSize: 11,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 6,
  },
  tableCell: {
    fontWeight: '500',
  },
});
