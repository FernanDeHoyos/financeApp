import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/app/core/constants/categories';
import * as categoryService from '@/app/services/categories';
import { useCallback, useEffect, useState } from 'react';

interface CustomCategory {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'both';
  isCustom: boolean;
}

// Almacenamiento local de categorías personalizadas - compartido entre instancias
let customCategoriesCache: CustomCategory[] = [];
let subscribers: ((categories: CustomCategory[]) => void)[] = [];
let isInitialized = false;

// Función para notificar a todos los suscriptores
const notifySubscribers = () => {
  subscribers.forEach(callback => callback(customCategoriesCache));
};

// Función para cargar categorías desde la base de datos
const loadCategoriesFromDB = async () => {
  try {
    const dbCategories = await categoryService.getCategories();
    customCategoriesCache = dbCategories.map(cat => ({
      ...cat,
      isCustom: cat.isCustom === 'true',
    }));
    notifySubscribers();
    isInitialized = true;
  } catch (error) {
    console.error('Error loading categories from DB:', error);
  }
};

// Función global para agregar categoría
const addCategoryGlobal = async (name: string, type: 'income' | 'expense' | 'both' = 'both'): Promise<CustomCategory> => {
  // Verificar duplicados en cache
  if (customCategoriesCache.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('La categoría ya existe');
  }

  try {
    const newCategory = await categoryService.addCategory(name, type);
    const categoryWithBoolean: CustomCategory = {
      ...newCategory,
      isCustom: true,
    };
    customCategoriesCache = [...customCategoriesCache, categoryWithBoolean];
    notifySubscribers();
    return categoryWithBoolean;
  } catch (error: any) {
    throw new Error(error.message || 'Error al crear la categoría');
  }
};

// Función global para eliminar categoría
const removeCategoryGlobal = async (id: string) => {
  try {
    await categoryService.deleteCategory(id);
    customCategoriesCache = customCategoriesCache.filter(cat => cat.id !== id);
    notifySubscribers();
  } catch (error: any) {
    throw new Error(error.message || 'Error al eliminar la categoría');
  }
};

export function useCategories(transactionType?: 'income' | 'expense') {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(customCategoriesCache);

  useEffect(() => {
    // Cargar categorías de la DB si no se han cargado
    if (!isInitialized) {
      loadCategoriesFromDB();
    }

    // Suscribirse a cambios de categorías
    const callback = (categories: CustomCategory[]) => {
      setCustomCategories(categories);
    };
    subscribers.push(callback);

    // Cleanup
    return () => {
      subscribers = subscribers.filter(cb => cb !== callback);
    };
  }, []);

  const getPredefinedCategories = () => {
    if (transactionType === 'income') {
      return INCOME_CATEGORIES;
    } else if (transactionType === 'expense') {
      return EXPENSE_CATEGORIES;
    }
    return [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  };

  const getFilteredCustomCategories = () => {
    if (!transactionType) return customCategories;
    return customCategories.filter(
      cat => cat.type === transactionType || cat.type === 'both'
    );
  };

  const getAllCategories = useCallback(() => {
    const predefined = getPredefinedCategories();
    const filtered = getFilteredCustomCategories();
    return Array.from(new Set([...predefined, ...filtered.map(c => c.name)])).sort();
  }, [customCategories, transactionType]);

  const addCustomCategory = useCallback((name: string, type: 'income' | 'expense' | 'both' = 'both') => {
    return addCategoryGlobal(name, type);
  }, []);

  const removeCustomCategory = useCallback((id: string) => {
    return removeCategoryGlobal(id);
  }, []);

  const isCustomCategory = useCallback((name: string) => {
    return customCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase());
  }, [customCategories]);

  const getCategoryUsageCount = useCallback((name: string) => {
    return categoryService.countCategoryUsage(name);
  }, []);

  return {
    customCategories,
    allCategories: getAllCategories(),
    addCustomCategory,
    removeCustomCategory,
    isCustomCategory,
    getCategoryUsageCount,
  };
}
