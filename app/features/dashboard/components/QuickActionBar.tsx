import { AppTheme } from '@/app/core/theme/theme';
import { Screen } from '@/app/navigation/AppNavigator';
import { FileUp, Minus, Plus } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface QuickActionBarProps {
  onNavigate: (screen: Screen) => void;
}

export const QuickActionBar = ({ onNavigate }: QuickActionBarProps) => {
  const { colors } = useTheme<AppTheme>();

  return (
    <View style={styles.floatingContainer}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.expense }]}
        onPress={() => onNavigate('AddExpense')}
        activeOpacity={0.8}
      >
        <View style={styles.iconCircle}>
          <Minus size={24} color="#FFF" strokeWidth={3} />
        </View>
        <View>
          <Text variant="titleMedium" style={{ color: '#FFF', fontWeight: '800' }}>Gasto</Text>
          <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Registrar salida</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.secondary, flex: 0.8 }]}
        onPress={() => onNavigate('ImportTransactions')}
        activeOpacity={0.8}
      >
        <View style={styles.iconCircle}>
          <FileUp size={24} color="#FFF" strokeWidth={3} />
        </View>
        <View>
          <Text variant="titleMedium" style={{ color: '#FFF', fontWeight: '800' }}>Importar</Text>
          <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Excel</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.income }]}
        onPress={() => onNavigate('AddIncome')}
        activeOpacity={0.8}
      >
        <View style={styles.iconCircle}>
          <Plus size={24} color="#FFF" strokeWidth={3} />
        </View>
        <View>
          <Text variant="titleMedium" style={{ color: '#FFF', fontWeight: '800' }}>Ingreso</Text>
          <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600' }}>Registrar entrada</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
