import { AppTheme } from '@/app/core/theme/theme';
import { categoryColors } from '@/app/utils/colors';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { Card, Text, useTheme } from 'react-native-paper';

interface CategorySectionProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  total: number;
  pieData: any[];
  categoryData: Record<string, number>;
  textColor: string;
}

export const CategorySection = ({
  title,
  icon,
  iconBgColor,
  total,
  pieData,
  categoryData,
  textColor,
}: CategorySectionProps) => {
  const { colors } = useTheme<AppTheme>();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.iconBadge, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
        <Text variant="titleMedium" style={{ color: textColor, fontWeight: '700', marginLeft: 10 }}>{title}</Text>
      </View>
      <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant, marginBottom: 12 }}>
        Total: ${total.toFixed(0)}
      </Text>

      {pieData.length > 0 ? (
        <Card style={[styles.chartCard, { backgroundColor: colors.surface }]} mode="outlined">
          <Card.Content style={styles.chartContent}>
            <PieChart
              data={pieData}
              donut
              radius={70}
              innerRadius={45}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={{ color: colors.onSurface, fontWeight: '700', fontSize: 12 }}>Total</Text>
                  <Text style={{ color: textColor, fontWeight: '800', fontSize: 14 }}>
                    ${total.toFixed(0)}
                  </Text>
                </View>
              )}
              showText={true}
            />
          </Card.Content>
        </Card>
      ) : null}

      {Object.entries(categoryData).map(([category, amount], idx) => (
        <Card key={category} style={[styles.categoryCard, { backgroundColor: colors.surfaceVariant }]} mode="contained">
          <Card.Content style={styles.categoryCardContent}>
            <View style={{ flex: 1 }}>
              <Text variant="bodyMedium" style={{ color: colors.onSurface, fontWeight: '600' }}>{category}</Text>
              <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: categoryColors[idx % categoryColors.length],
                      width: `${(((amount as number) / total) * 100) || 0}%`,
                    },
                  ]}
                />
              </View>
            </View>
            <Text variant="bodyMedium" style={{ color: categoryColors[idx % categoryColors.length], fontWeight: '700', marginLeft: 12 }}>
              ${(amount as number).toFixed(0)}
            </Text>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCard: {
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
