# HU-09: Custom Categories - Quick Reference

## What's New?
Users can now create custom categories on the fly while entering transactions. Instead of being limited to predefined categories, they can add their own categories like "Side Hustle", "Streaming Services", "Hobbies", etc.

## How to Use

### Creating a Custom Category
1. Open the transaction form (Add Income or Add Expense)
2. Scroll down to the "Categoría" section
3. Click the blue "+ Agregar" button
4. In the dialog, enter the category name (max 20 characters)
5. Click "Crear" button
6. The category is instantly added and selected

### Adding a Transaction with Custom Category
1. Create a custom category (steps above)
2. Dialog closes and category is auto-selected
3. Fill in other transaction details (amount, description, date)
4. Click "Guardar Ingreso" or "Guardar Gasto"
5. Transaction is saved with the custom category

### Filtering by Custom Category
1. Go to Transactions List screen
2. Click the filter icon (top right)
3. Custom categories appear in the filter list automatically after you create them
4. Select the category to filter transactions

## Key Features

✓ **Real-time Validation**
- Empty names are rejected
- Duplicate categories are prevented (case-insensitive)
- Max 20 characters enforced

✓ **Smart Filtering**
- Separate categories for Income vs Expense
- Can create categories that work for both types
- Filter modal auto-updates with new categories

✓ **Instant Sync**
- Categories appear immediately across the app
- Multiple components stay in sync without page reload
- No database update delay

✓ **User-Friendly**
- Character counter shows X/20
- Clear error messages
- Dialog auto-focuses input field
- Can easily cancel and try again

## Components

### 1. useCategories Hook (`app/hooks/useCategories.ts`)
Manages all category logic:
```typescript
const { allCategories, customCategories, addCustomCategory } = useCategories('income');
```

### 2. AddCategoryDialog (`app/components/AddCategoryDialog.tsx`)
Handles category creation UI:
```tsx
<AddCategoryDialog 
  visible={showDialog}
  onDismiss={() => setShowDialog(false)}
  type="income"
/>
```

### 3. TransactionFormScreen
Integrated with both above components to provide seamless UX.

## Current Limitations (Phase 1)

⚠️ Categories are stored in local memory only
- They persist during the current app session
- They reset when you close and reopen the app
- (Phase 2 will add SQLite persistence)

## Examples

### Creating Income Categories
- "Freelance Project" - For freelance work
- "Stock Dividends" - For investment income
- "Side Hustle" - For part-time work
- "Refund" - For refunded purchases
- "Bonus" - For unexpected bonuses

### Creating Expense Categories
- "Coffee" - For daily coffee
- "Uber" - For ride sharing
- "Netflix" - For streaming services
- "Gym" - For fitness
- "Gym" - For fitness
- "Groceries" - For supermarket shopping
- "Gas" - For fuel
- "Rent" - For monthly rent

## Tips

1. **Keep Names Short**: Use 20 character limit wisely
2. **Be Specific**: "Streaming Services" is better than "Media"
3. **Consistency**: Use the same category name each time
4. **Type Selection**: Choose the right type (Income/Expense) when creating

## Future Improvements

✨ Coming Soon:
- Persistent storage (SQLite)
- Category icons/colors
- Edit existing categories
- Delete categories
- Category statistics
- Bulk import/export

## Need Help?

If a category isn't showing up:
1. Make sure you clicked "Crear" button
2. Check the category name isn't empty
3. Try a different name if you see "La categoría ya existe"
4. Reload the transaction form

If categories disappeared after app restart:
- This is expected in Phase 1 (temporary memory storage)
- Phase 2 will add permanent persistence
