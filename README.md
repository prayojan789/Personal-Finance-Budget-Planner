# Personal Finance Budget Planner

A single-page personal finance app for tracking transactions, budgets, and goals with analytics and reporting. Data is stored locally in the browser for fast, offline-friendly use.

## Highlights

- Dashboard with income, expenses, and balance summaries.
- Transactions, budgets, and goals management.
- Alerts when budgets are near or over limits.
- Advanced insights: trends, forecasts, and savings rate.
- CSV export and import to move data in and out.
- Local storage persistence with a lightweight mock auth flow.

## Tech Stack

- React 19 + Vite
- Recharts for visualizations
- Context API for state management
- LocalStorage for persistence

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the app.

## Demos

![Dashboard overview](docs/demo-dashboard.png)
![Budgets and alerts](docs/demo-budgets.png)
![Insights and trends](docs/demo-insights.png)

## Scripts

- npm run dev - start the dev server
- npm run build - production build
- npm run preview - preview the production build
- npm run lint - lint the codebase

## App Structure

```
src/
  components/     Reusable UI + charts
  context/        Auth, finance, and toast providers
  features/       Domain features (budgets, reports, settings, etc.)
  pages/          Route-level pages
  routes/         Simple route switcher
  services/       CSV import/export, storage helpers
  utils/          Formatting utilities
```

## Data and Behavior Notes

- Persistence: all data is stored in localStorage under budget-planner-data.
- Auth: mock login/register with a 30-minute idle session timeout.
- Defaults: currency is NPR, timezone Asia/Kathmandu, theme light.

## Export & Import Features

### CSV Export

The app supports comprehensive CSV export with **three separate file formats**:

#### Full Data Export
- **All transactions, budgets, and goals** in one file
- Includes metadata like start dates and alert thresholds
- Format: `budget-planner-export-YYYY-MM-DD.csv`
- Useful for: Full backups, data migration

**CSV Structure:**
```
Type,Description,Amount,Category,Date,Note
expense,"Groceries",150,"Food","2024-12-15","Weekly shopping"
income,"Salary",3000,"Income","2024-12-01",""

# BUDGETS
Category,Limit,Month,AlertAt
Food,500,2024-12,"80"

# GOALS
Name,TargetAmount,TargetDate,SavedAmount,CreatedAt
"Emergency Fund",10000,"2025-12-31",2500,"2024-01-01"
```

#### Filtered Exports
- **Transactions only** — For detailed transaction records
- **Budgets only** — For sharing budget templates
- **Chart data (CSV or JSON)** — Pre-formatted for Excel/BI tools

#### JSON Export
- Full structured backup with nested data
- Format: `chart-data.json`
- Useful for: API integrations, advanced analysis
- **Includes:**
  - Category expense breakdown
  - Monthly trends with income/expense pairs
  - Timestamp metadata

### CSV Import

Seamlessly restore data from previously exported files:
- **Auto-detect format** — Recognizes transactions, budgets, and goals sections
- **Batch import** — Add dozens of records at once
- **Duplicate handling** — Non-destructive (adds to existing data)
- **Validation** — Type and format checks before commit

**Supported formats:**
- Standard CSV with quoted fields
- Section markers for budgets (`# BUDGETS`) and goals (`# GOALS`)
- Escaped quotes in descriptions/notes

### Export Filenames
All exports use **ISO date format** for easy sorting:
- `budget-planner-export-2025-02-17.csv`
- `chart-data.json`
- `transactions.csv`
- `budgets.csv`

**How to use:**
1. Go to **Settings** → **Data Management**
2. Click **Export Data** to download your CSV
3. Click **Import Data** to restore from a file
4. Or use the **Reports** section to export specific data slices

## Performance Optimizations

✅ **Code Splitting**
- Route-based lazy loading with `React.lazy()` and `Suspense`
- Pages load on-demand to reduce bundle size

✅ **Component Memoization**
- `React.memo` for transaction items to prevent unnecessary re-renders
- `useMemo` for derived state calculations

✅ **Search Debouncing**
- 250ms debounce on transaction search to reduce filter operations
- Smooth typing experience without lag

✅ **Virtualized Lists**
- `react-window` for large transaction lists (40+ items)
- Only visible rows rendered, smooth scrolling

## Advanced Features

🎯 **Smart Analytics**
- Savings rate calculation (% of income saved)
- Month-to-month expense change tracking
- Category trend analysis over 6 months
- Spending forecast (AI-like projection)

🎯 **Budget Alerts**
- Real-time progress tracking per category
- Visual status: on-track, at-risk, over-budget
- Customizable alert thresholds (default 80%)

💾 **Data Persistence**
- Full localStorage backup on every change
- JSON export for cloud storage
- Session-based auth with 30-minute timeout

## Keyboard Shortcuts

- **Ctrl/Cmd + N** — New transaction (future feature)
- **Escape** — Close modals and cancel edits
- Search fields auto-focus for quick filtering

## Accessibility

- Semantic HTML with proper ARIA labels
- Keyboard navigation throughout
- High contrast dark/light themes
- Form validation with clear error messages

## Browser Support

- **Modern browsers only** (ES2020+)
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- LocalStorage required for offline mode

## Troubleshooting

**Data not saving?**
- Check if localStorage is enabled in your browser
- Clear browser cache if experiencing stale data
- Check Settings to verify currency and timezone are correct

**Charts not displaying?**
- Ensure you have transaction data for the selected date range
- Recharts requires valid data points to render

**Performance lag on large datasets?**
- Virtualized lists activate at 40+ transactions
- Consider archiving old data in bulk export

## Contributing

PRs welcome! Please:
1. Run `npm run lint` before committing
2. Test on mobile (responsive design)
3. Add comments for complex logic
4. Follow the existing modular structure

## Roadmap

- ✨ Cloud sync (Firebase/Supabase)
- 🔄 Recurring transaction templates
- 🌍 Multi-currency + live exchange rates
- 📊 PDF report generation
- 📱 PWA installability
- 🔐 End-to-end encryption

## License

MIT — Use freely, modify as needed
