import { db } from '@/db/client';
import { categories, transactions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface CustomCategory {
    id: string;
    name: string;
    type: 'income' | 'expense' | 'both';
    isCustom: string;
}

/**
 * Get all custom categories from the database
 */
export const getCategories = async (): Promise<CustomCategory[]> => {
    try {
        // Robustness: ensure table exists
        await db.run(`
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL UNIQUE,
                type TEXT NOT NULL DEFAULT 'both',
                isCustom TEXT NOT NULL DEFAULT 'true'
            );
        `);
        return await db.select().from(categories);
    } catch (error) {
        console.error('Error getting categories:', error);
        return [];
    }
};

/**
 * Counts how many transactions are using a specific category name
 */
export const countCategoryUsage = async (categoryName: string): Promise<number> => {
    try {
        const result = await db.select().from(transactions).where(eq(transactions.category, categoryName));
        return result.length;
    } catch (error) {
        console.error('Error counting category usage:', error);
        return 0;
    }
};

/**
 * Add a new custom category to the database
 */
export const addCategory = async (
    name: string,
    type: 'income' | 'expense' | 'both' = 'both'
): Promise<CustomCategory> => {
    const newCategory: CustomCategory = {
        id: Date.now().toString(),
        name,
        type,
        isCustom: 'true',
    };

    try {
        await db.insert(categories).values(newCategory);
        return newCategory;
    } catch (error) {
        console.error('Error adding category:', error);
        throw new Error('Error al crear la categoría');
    }
};

/**
 * Delete a category by ID
 */
export const deleteCategory = async (id: string): Promise<void> => {
    try {
        await db.delete(categories).where(eq(categories.id, id));
    } catch (error) {
        console.error('Error deleting category:', error);
        throw new Error('Error al eliminar la categoría');
    }
};
