# HU-11: Monthly Comparison

## Overview

HU-11 introduces a monthly comparison feature to help users analyze their spending habits over time. By comparing expenses between two selected months, users can identify trends, improvements, or areas of concern.

## User Story

> **Como usuario**
> Quiero comparar mis gastos entre meses
> **Para** mejorar mis hábitos financieros

## Key Features

### 1. Month-to-Month Comparison
- **Selectable Months:** Users can choose two months to compare (e.g., "Current Month" vs "Previous Month").
- **Financial Delta:** Shows the total difference in spending (absolute amount and percentage).
- **Visual Indicator:** Green/Red indicators for improvement or regression.

### 2. Comparative Bar Chart
- **Visual Representation:** Side-by-side bars for the total expenses of the selected months.
- **Easy Parsing:** Quickly see which month was more expensive.

### 3. Category Breakdown & Deltas
- **Detailed Insight:** Breakdown of spending by category for both months.
- **Change Tracking:** Shows how much spending in each category changed (e.g., "Food: +$100").
- **Sorted View:** Categories sorted by the largest absolute change to highlight impact areas.

## User Questions It Answers
- ❓ Did I spend more this month than last month?
- ❓ Why is my total higher this month? (Which category caused it?)
- ❓ Am I improving my financial habits?

## Technical Implementation

### Data Processing
1.  **Filter:** Select transactions for Month A and Month B.
2.  **Aggregate:** Sum expenses by category for each month.
3.  **Compare:** Calculate `Diff = Month A - Month B` for totals and per category.
4.  **Sort:** Order categories by `abs(Diff)` descending.

### UI Components
- **`MonthlyComparisonScreen`**: Main container.
- **`MonthSelector`**: Component to pick dates.
- **`ComparisonChart`**: Bar chart visualization.
- **`CategoryDeltaList`**: Scrollable list of category changes.

## Use Cases
- 📊 **End-of-Month Review:** Users check if they stayed within previous limits.
- 🎯 **Goal Tracking:** Users trying to reduce "Entertainment" expenses can verify reduction.
- ⚠️ **Anomaly Detection:** "Why did I spend $500 more? Oh, it was the 'Car Repair' category."
