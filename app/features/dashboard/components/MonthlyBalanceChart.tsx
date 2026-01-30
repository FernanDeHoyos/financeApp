import { AppTheme } from '@/app/core/theme/theme';
import { StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Card, useTheme } from 'react-native-paper';

interface MonthlyBalanceChartProps {
  data: any[];
}

export const MonthlyBalanceChart = ({ data }: MonthlyBalanceChartProps) => {
  const { colors } = useTheme<AppTheme>();

  return (
    <Card style={[styles.chartCard, { backgroundColor: colors.surface }]} mode="outlined">
      <Card.Content style={styles.chartContent}>
        <BarChart
          data={data}
          height={280}
          barWidth={30}
          spacing={35}
          yAxisTextStyle={{ color: colors.onSurfaceVariant, fontSize: 11 }}
          yAxisLabelWidth={45}
          labelWidth={50}
          isAnimated
          animationDuration={800}
          frontColor={colors.income}
        />
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
  chartContent: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
