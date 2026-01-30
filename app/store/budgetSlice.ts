import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BudgetState {
    monthlyLimit: number;
    currency: string;
}

const initialState: BudgetState = {
    monthlyLimit: 0,
    currency: 'USD',
};

const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        setBudget: (state, action: PayloadAction<number>) => {
            state.monthlyLimit = action.payload;
        },
        clearBudget: (state) => {
            state.monthlyLimit = 0;
        },
    },
});

export const { setBudget, clearBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
