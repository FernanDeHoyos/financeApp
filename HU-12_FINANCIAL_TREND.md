# HU-12: Financial Trend

## Overview

HU-12 adds an automatic financial trend analysis. Instead of asking users to interpret charts, the app provides explicit insights about their spending trajectory (e.g., "Trending Up", "Stable", "Trending Down").

## User Story

> **Como usuario**
> Quiero ver si estoy gastando más o menos que antes
> **Para** tomar mejores decisiones

## Key Features

### 1. Automatic Trend Analysis
-   **Logic:** Analyzes the last 3-6 months of spending.
-   **Insight:** Determines the direction of the trend.
    -   📈 **Increasing:** Expenses are consistently going up.
    -   📉 **Decreasing:** Expenses are going down (Good job!).
    -   ➡️ **Stable:** Spending is consistent.

### 2. Smart Feedback (The "Why")
-   Goes beyond just "Up" or "Down".
-   Example: "Spending is up 15% due to higher Food expenses."
-   Example: "You are saving more effectively this month."

### 3. UI Integration
-   **Monthly Comparison Screen:** Adds a "Trend Context" card that looks at the bigger picture (not just 2 months).
-   **Dashboard:** A small widget indicating the current financial weather (Trend).

## Technical Implementation

### Logic
-   Calculate moving average of last 3 months.
-   Compare current month projection vs moving average.
-   Identify "outlier" categories driving the trend.

### Components
-   `TrendInsightCard`: Displays the text analysis.
-   `TrendIndicator`: Small icon/badge for dashboard.

## Use Cases
-   **Reality Check:** User thinks they are doing well, but trend shows gradual increase. App alerts them.
-   **Motivation:** User sees "Trending Down" and feels encouraged.
