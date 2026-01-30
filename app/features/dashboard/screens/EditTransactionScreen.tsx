import { TransactionFormScreen } from '@/app/features/transactions/screens/TransactionFormScreen';
import { useTransactions } from '@/app/shared/hooks/useTransactions';
import { formatDateToISO } from '@/app/utils/dateFormatting';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditTransactionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { updateTransaction } = useTransactions();
  const transaction = (route.params as any)?.transaction;

  if (!transaction) {
    return null;
  }

  return (
    <TransactionFormScreen
      type={transaction.type}
      transaction={transaction}
      onSave={(data: any) => {
        updateTransaction(transaction.id, {
          description: data.description,
          amount: data.amount,
          category: data.category,
          date: formatDateToISO(data.date),
        });
        navigation.goBack();
      }}
      onBack={() => navigation.goBack()}
    />
  );
}
