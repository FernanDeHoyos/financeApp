import { AppTheme } from '@/app/core/theme/theme';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Card, Text, useTheme } from 'react-native-paper';

interface ComparativeChartProps {
  data: any[];
}

export const ComparativeChart = ({ data }: ComparativeChartProps) => {
  const { colors } = useTheme<AppTheme>();

  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={{ color: colors.onSurface, fontWeight: '700', marginBottom: 16 }}>Comparativa</Text>
      <Card style={[styles.chartCard, { backgroundColor: colors.surface }]} mode="outlined">
        <Card.Content style={styles.chartContent}>
          <BarChart
            data={data}
            height={200}
            barWidth={40}
            spacing={60}
            yAxisTextStyle={{ color: colors.onSurfaceVariant, fontSize: 12 }}
            yAxisLabelWidth={40}
            labelWidth={70}
            isAnimated
            animationDuration={800}
            frontColor={colors.primary}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
