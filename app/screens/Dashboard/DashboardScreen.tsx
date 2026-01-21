import { CurrencyText } from "@/app/components/CurrencyText";
import { Screen } from "@/app/navigation/AppNavigator";
import { Transaction } from "@/app/types/transaction";
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Minus, Plus, Tag, TrendingUp } from "lucide-react-native";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Appbar, Avatar, Button, Card, FAB, MD3LightTheme, Text, useTheme } from "react-native-paper";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#006C70',
    onPrimary: '#FFFFFF',
    primaryContainer: '#97F0F4',
    onPrimaryContainer: '#002022',
    
    secondary: '#4A6363',
    secondaryContainer: '#CCE8E7',
    onSecondaryContainer: '#051F1F',
    
    tertiary: '#4B607C',
    
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    
    background: '#FBFDFD',
    surface: '#FBFDFD',
    surfaceVariant: '#EFF4F4',
    onSurfaceVariant: '#3F4948',
    
    // Colores personalizados
    income: '#2E7D32',
    incomeContainer: '#C8E6C9',
    expense: '#B00020',
    expenseContainer: '#FFDAD6',
  },
};

interface DashboardScreenProps {
  transactions: Transaction[];
  onNavigate: (screen: Screen) => void;
  onSelectTransaction: (transaction: Transaction) => void;
}

export const DashboardScreen = ({
  transactions,
  onNavigate,
  onSelectTransaction,
}: DashboardScreenProps) => {
  const { colors } = useTheme();
  
  const totalIncome = transactions.filter((t: any) => t.type === 'income').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const totalExpense = transactions.filter((t: any) => t.type === 'expense').reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: 'transparent' }}>
        <Appbar.Content title="Hola, Alex 👋" titleStyle={{ fontWeight: 'bold', fontSize: 24 }} />
        <Appbar.Action icon={() => <Avatar.Image size={36} source={{ uri: '[https://i.pravatar.cc/100](https://i.pravatar.cc/100)' }} />} onPress={() => {}} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Balance Card */}
        <Card style={[styles.balanceCard, { backgroundColor: colors.primaryContainer }]} mode="contained">
          <Card.Content>
            <Text variant="titleMedium" style={{ color: colors.onPrimaryContainer, opacity: 0.7 }}>Balance Actual</Text>
            <Text variant="displayMedium" style={{ color: colors.onPrimaryContainer, fontWeight: 'bold', marginVertical: 8 }}>
              ${balance.toFixed(2)}
            </Text>
            <View style={styles.balanceRow}>
                <View style={styles.trendTag}>
                    <TrendingUp size={16} color={colors.primary} />
                    <Text style={{ marginLeft: 4, color: colors.primary, fontWeight: 'bold' }}>+12% vs mes anterior</Text>
                </View>
            </View>
          </Card.Content>
        </Card>

        {/* Resumen Mensual */}
        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, { backgroundColor: '#E8F5E9' }]} mode="contained">
            <Card.Content style={styles.summaryCardContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#C8E6C9' }]}>
                {/* @ts-ignore */}
                <ArrowUpCircle size={24} color="#2E7D32" />
              </View>
              <View>
                <Text variant="labelMedium" style={{ color: '#1B5E20' }}>Ingresos</Text>
                <Text variant="titleLarge" style={{ color: '#1B5E20', fontWeight: 'bold' }}>${totalIncome.toFixed(0)}</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={[styles.summaryCard, { backgroundColor: '#FFEBEE' }]} mode="contained">
            <Card.Content style={styles.summaryCardContent}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFCDD2' }]}>
                {/* @ts-ignore */}
                <ArrowDownCircle size={24} color="#C62828" />
              </View>
              <View>
                <Text variant="labelMedium" style={{ color: '#B71C1C' }}>Gastos</Text>
                <Text variant="titleLarge" style={{ color: '#B71C1C', fontWeight: 'bold' }}>${totalExpense.toFixed(0)}</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Movimientos Recientes Header */}
        <View style={styles.sectionHeader}>
          <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Movimientos recientes</Text>
          <Button mode="text" onPress={() => onNavigate('List')}>Ver todo</Button>
        </View>

        {/* Lista Corta */}
        {transactions.slice(0, 4).map((item: any) => (
          <TouchableOpacity key={item.id} onPress={() => onSelectTransaction(item)}>
            <Card style={styles.transactionCard} mode="contained">
              <Card.Content style={styles.transactionRow}>
                {/* @ts-ignore */}
                <View style={[styles.iconBox, { backgroundColor: item.type === 'income' ? theme.colors.incomeContainer : theme.colors.expenseContainer }]}>
                   {item.type === 'income' ? <DollarSign size={20} color={theme.colors.onSurfaceVariant} /> : <Tag size={20} color={theme.colors.onSurfaceVariant} />}
                </View>
                <View style={styles.transactionInfo}>
                  <Text variant="bodyLarge" style={{ fontWeight: '600' }} numberOfLines={1}>{item.description}</Text>
                  <Text variant="bodySmall" style={{ color: colors.secondary }}>{item.date} • {item.category}</Text>
                </View>
                <CurrencyText amount={item.amount} type={item.type} bold />
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
        
        <View style={{ height: 80 }} /> 
      </ScrollView>

      {/* FABs */}
      <View style={styles.fabContainer}>
         <FAB
            icon={() => <Minus size={24} color={colors.onErrorContainer} />}
            style={[styles.fab, { backgroundColor: colors.errorContainer, marginRight: 16 }]}
            onPress={() => onNavigate('AddExpense')}
            label="Gasto"
            color={colors.onErrorContainer}
            mode="elevated"
          />
          <FAB
            icon={() => <Plus size={24} color={colors.onPrimaryContainer} />}
            style={[styles.fab, { backgroundColor: colors.primaryContainer }]}
            onPress={() => onNavigate('AddIncome')}
            label="Ingreso"
            color={colors.onPrimaryContainer}
            mode="elevated"
          />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  balanceCard: {
    borderRadius: 24,
    paddingVertical: 10,
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF80',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
  },
  summaryCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionCard: {
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#EFF4F4', // Surface Variant
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center'
  },
  fab: {
    borderRadius: 16,
  },
 
});
