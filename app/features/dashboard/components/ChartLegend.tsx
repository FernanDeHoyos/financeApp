import { AppTheme } from '@/app/core/theme/theme';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface ChartLegendProps {
  items: Array<{ label: string; color: string }>;
}

export const ChartLegend = ({ items }: ChartLegendProps) => {
  const { colors } = useTheme<AppTheme>();

  return (
    <View style={[styles.legendContainer, { backgroundColor: colors.surfaceVariant }]}>
      {items.map((item) => (
        <View key={item.label} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: item.color }]} />
          <Text variant="labelSmall" style={{ color: colors.onSurface }}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});
