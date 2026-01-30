import { TransactionFormScreen } from '@/app/features/transactions/screens/TransactionFormScreen';
import { useTransactions } from '@/app/shared/hooks/useTransactions';
import { useNavigation } from '@react-navigation/native';

export default function AddIncomeScreen() {
  const navigation = useNavigation();
  const { addTransaction } = useTransactions();

  return (
    <TransactionFormScreen
      type="income"
      onSave={(data: any) => {
        addTransaction(data);
        navigation.goBack();
      }}
      onBack={() => navigation.goBack()}
    />
  );
}
