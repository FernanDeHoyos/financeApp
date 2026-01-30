import { Text, useTheme } from 'react-native-paper';

interface CurrencyTextProps {
  amount: number;
  type?: 'income' | 'expense';
  style?: any;
  size?: number;
  bold?: boolean;
}

export const CurrencyText = ({
  amount,
  type = 'income',
  style,
  size = 16,
  bold = false,
}: CurrencyTextProps) => {
  const { colors } = useTheme();
  // @ts-ignore: Accediendo a colores personalizados
  const color = type === 'income' ? colors.income : type === 'expense' ? colors.expense : colors.onSurface;
  const prefix = type === 'income' ? '+' : type === 'expense' ? '-' : '';

  return (
    <Text style={[{ color, fontSize: size, fontWeight: bold ? '700' : '400' }, style]}>
      {prefix}${Math.abs(amount).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
    </Text>
  );
};
