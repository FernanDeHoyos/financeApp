import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async () => {
    try {
        db = await SQLite.openDatabaseAsync('finance.db');
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        age INTEGER,
        gender TEXT,
        isOnboarded INTEGER DEFAULT 0
      );
      CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY NOT NULL,
        amount REAL NOT NULL
      );
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL DEFAULT 'both',
        isCustom TEXT NOT NULL DEFAULT 'true'
      );
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

export interface UserProfile {
    name: string;
    age: number;
    gender: string;
    isOnboarded: boolean;
}

export const saveUser = async (user: UserProfile) => {
    if (!db) await initDB();
    try {
        // We only support one user for now, so we replace ID 1
        await db!.runAsync(
            'INSERT OR REPLACE INTO users (id, name, age, gender, isOnboarded) VALUES (1, ?, ?, ?, ?)',
            [user.name, user.age, user.gender, user.isOnboarded ? 1 : 0]
        );
        return true;
    } catch (error) {
        console.error('Error saving user:', error);
        return false;
    }
};

export const getUser = async (): Promise<UserProfile | null> => {
    if (!db) await initDB();
    try {
        const result = await db!.getFirstAsync<{
            name: string;
            age: number;
            gender: string;
            isOnboarded: number;
        }>('SELECT * FROM users WHERE id = 1');

        if (result) {
            return {
                name: result.name,
                age: result.age,
                gender: result.gender,
                isOnboarded: result.isOnboarded === 1
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const saveBudget = async (amount: number) => {
    if (!db) await initDB();
    try {
        await db!.runAsync(
            'INSERT OR REPLACE INTO budgets (id, amount) VALUES (1, ?)',
            [amount]
        );
        return true;
    } catch (error) {
        console.error('Error saving budget:', error);
        return false;
    }
};

export const getBudget = async (): Promise<number> => {
    if (!db) await initDB();
    try {
        const result = await db!.getFirstAsync<{ amount: number }>('SELECT amount FROM budgets WHERE id = 1');
        return result ? result.amount : 0;
    } catch (error) {
        console.error('Error getting budget:', error);
        return 0;
    }
};
