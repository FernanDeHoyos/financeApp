import OnboardingScreen from '@/app/features/onboarding/screens/OnboardingScreen';
import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppNavigator } from './navigation/AppNavigator';
import { getBudget, getUser } from './services/database';
import { setBudget } from './store/budgetSlice';
import { RootState } from './store/store';
import { fetchTransactions } from './store/transactionsSlice';
import { setLoading, setUserProfile } from './store/userSlice';

export default function AppContent() {
  const dispatch = useDispatch();
  const { isOnboarded, isLoading } = useSelector((state: RootState) => state.user);
  const theme = useTheme();

  useEffect(() => {
    const checkUser = async () => {
      // 1. Init DB and Load User
      const user = await getUser();
      if (user) {
        dispatch(setUserProfile(user));
      }

      // Load Budget
      const budgetAmount = await getBudget();
      if (budgetAmount > 0) {
        dispatch(setBudget(budgetAmount));
      }

      dispatch(setLoading(false));

      // 2. Load Transactions
      // @ts-ignore
      dispatch(fetchTransactions());
    };
    checkUser();
  }, [dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {/* 👇 React Navigation controla TODO */}
      {!isOnboarded ? <OnboardingScreen /> : <AppNavigator />}
    </SafeAreaView>
  );
}
