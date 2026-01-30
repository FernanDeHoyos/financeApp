import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    name: string;
    age: number | null;
    gender: string; // 'male', 'female', 'other'
    isOnboarded: boolean;
    isLoading: boolean;
}

const initialState: UserState = {
    name: '',
    age: null,
    gender: '',
    isOnboarded: false,
    isLoading: true, // Start loading to check DB
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserProfile: (state, action: PayloadAction<{ name: string; age: number; gender: string }>) => {
            state.name = action.payload.name;
            state.age = action.payload.age;
            state.gender = action.payload.gender;
            state.isOnboarded = true;
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        clearUser: (state) => {
            state.name = '';
            state.age = null;
            state.gender = '';
            state.isOnboarded = false;
        },
    },
});

export const { setUserProfile, setLoading, clearUser } = userSlice.actions;
export default userSlice.reducer;
