# AI-Based Student Expense Prediction and Spending Behaviour Analysis
### Engineering Research Prototype & Paper Presentation Platform

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-purple?logo=vite)](https://vite.dev/)
[![Charts](https://img.shields.io/badge/Recharts-3.10-cyan)](https://recharts.org/)
[![Offline](https://img.shields.io/badge/100%25-Offline%20First-success)](https://github.com/Sai-jayanth06/Student-Expense-Prediction)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

An academic engineering research prototype designed to investigate, analyze, and forecast college student micro-expenditure patterns. Unlike generic commercial personal finance apps, this platform is tailored specifically for **scientific paper presentations and peer review**, providing transparent time-series forecasting (Simple Moving Average vs. Weighted Moving Average) coupled with an empirical **7-Day Holdout Backtesting Protocol** to quantitatively measure forecast accuracy (MAE, MAPE, WAPE).

---

## 🔬 Research Abstract & Objectives

College students represent a unique demographic characterized by irregular micro-transactions (canteen food, printouts, daily transit) punctuated by sudden lump-sum expenditures (course materials, semester fees, hardware project components). This leads to acute end-of-month liquidity bottlenecks.

This research prototype addresses three foundational research questions:
1. **RQ1 (Stochastic Modeling):** Can non-stationary student micro-expenditures be effectively approximated using lightweight statistical moving-average time-series baselines?
2. **RQ2 (Recency Weighting Hypothesis):** Does assigning linearly increasing weights ($w_i = i$) to recent days outperform equal-weight historical averages when students enter exam, printing, or project submission cycles?
3. **RQ3 (Predictive Liquidity Simulation):** How effectively can daily burn-rate forecasting provide actionable runway warnings to prevent premature budget exhaustion?

---

## 📐 Mathematical Prediction Methodology

### Model A: Simple Moving Average (SMA)
Calculates an unweighted average of daily spending across the active lookback window $k$:
$$\text{SMA}_k = \frac{1}{k}\sum_{i=1}^{k} x_i$$
- **Characteristics:** Provides strong noise dampening against isolated, non-recurring outliers (e.g. an unexpected textbook purchase), but exhibits latency when spending accelerates.

### Model B: Weighted Moving Average (WMA)
Applies linearly increasing weights $w_i = i$ for $i \in \{1, 2, \dots, k\}$, giving maximum importance to the most recent spending behavior:
$$W = \sum_{i=1}^{k} w_i = \frac{k(k + 1)}{2}$$
$$\text{WMA}_k = \frac{\sum_{i=1}^{k} i \cdot x_i}{W}$$
- **Characteristics:** Highly responsive to recent momentum shifts (e.g. project sprints, lab record submissions, hackathons).

### Forecast Horizons
- **Next 7 Days Projected Spend:** $\hat{Y}_{7} = 7 \times \text{Rate}_{\text{model}}$
- **Next 30 Days Projected Spend:** $\hat{Y}_{30} = 30 \times \text{Rate}_{\text{model}}$
- **Expected Month-End Spend:** $\text{Spent}_{\text{month-to-date}} + (\text{DaysRemaining} \times \text{Rate}_{\text{model}})$

---

## 🧪 The Holdout Backtesting Experiment

To avoid empirical bias, the system implements a **7-Day Holdout Backtesting Protocol**:
1. The dataset is chronologically split: the **last 7 calendar days** are masked as an unseen test ground truth ($T_{\text{test}}$).
2. Models A and B are trained exclusively on historical data prior to those 7 days ($T_{\text{train}}$).
3. Both models forecast spending for the 7 hidden days.
4. Forecasts are quantitatively compared against actual ground-truth spending $y_t$.

### Statistical Error Metrics
- **Mean Absolute Error (MAE):**
  $$\text{MAE} = \frac{1}{7} \sum_{t=1}^{7} |y_t - \hat{y}_t|$$
- **Mean Absolute Percentage Error (MAPE):**
  $$\text{MAPE} = \frac{1}{N_{>0}} \sum_{y_t > 0} \frac{|y_t - \hat{y}_t|}{y_t} \times 100\%$$
- **Weighted Absolute Percentage Error (WAPE):**
  $$\text{WAPE} = \frac{\sum_{t=1}^{7} |y_t - \hat{y}_t|}{\sum_{t=1}^{7} y_t} \times 100\%$$

> **Zero-Division Resilience:** On days where a student spends ₹0, standard MAPE encounters a division-by-zero anomaly. Our engine handles this gracefully by filtering non-zero days and computing WAPE as an aggregate metric.

---

## 🚀 Key Application Features

| Module | Feature Capabilities |
|---|---|
| **Overview Dashboard** | Research problem statement, 8 real-time KPI metrics, research questions, and end-to-end pipeline flowchart. |
| **Dataset Table & Ingestion** | Full CRUD, 8 academic categories (Food, Travel, Education, Printing, Project, Entertainment, Recharge, Other), search, category/date filters, CSV export/import, and instant 60+ sample record loader. |
| **Exploratory Analysis** | Continuous daily timeline area chart, category spending bar chart, category share donut chart, weekly spending chart, and day-of-week behavioral distribution. |
| **Prediction Engine** | Dynamic lookback selector (7, 14, 30 days), full step-by-step intermediate calculation table showing raw spend, weights, and weighted sums, plus a 14-day cumulative trajectory chart. |
| **Experiment Center** | Actual vs. Predicted dual-line comparison graph, day-by-day verification table, MAE/MAPE scorecard, and automated empirical verdict. |
| **Model Scorecard** | Systematic theoretical and empirical comparison of SMA vs. WMA with examination defense talking points. |
| **Budget Simulation** | Allowance & balance inputs, daily burn-rate calculation, survival runway in days, low-balance deficit alerts, and an interactive **What-If savings reduction slider**. |
| **Privacy & Viva Guide** | 100% offline browser storage architecture, zero telemetry, no banking logins, and presentation cheat sheet. |

---

## 🛠️ Project Structure

```
student-expense-prediction/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AnalysisTab.tsx          # Exploratory charts & statistical summaries
│   │   ├── BudgetTab.tsx            # Budget simulation & What-If slider
│   │   ├── DatasetTab.tsx           # Dataset table, filtering, & CSV actions
│   │   ├── ExpenseModal.tsx         # Add & edit expense modal with validation
│   │   ├── ExperimentTab.tsx        # 7-day holdout backtesting experiment
│   │   ├── ModelComparisonTab.tsx   # SMA vs WMA architectural scorecard
│   │   ├── Navbar.tsx               # Header, KPI chips, theme, & presentation toggle
│   │   ├── OverviewTab.tsx          # Research abstract, questions, & pipeline
│   │   ├── PredictionTab.tsx        # Transparent math engine & step-by-step table
│   │   └── PrivacyTab.tsx           # Architecture, privacy, & viva defense guide
│   ├── context/
│   │   └── ExpenseContext.tsx       # LocalStorage state management & caching
│   ├── data/
│   │   └── sampleDataset.ts         # 60+ realistic student records over 7 weeks
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces & types
│   ├── utils/
│   │   ├── csvUtils.ts              # CSV export & validated import parsing
│   │   └── mathEngine.ts            # SMA, WMA, backtesting, & statistical engine
│   ├── App.tsx                      # Root application layout
│   ├── index.css                    # Academic Vanilla CSS design system
│   └── main.tsx                     # React DOM entry point
├── test_verification.mjs            # Automated mathematical verification test suite
├── index.html                       # HTML5 entry with Google Fonts
├── package.json                     # Dependencies and test scripts
├── tsconfig.json                    # TypeScript configuration
└── vite.config.ts                   # Vite bundler configuration
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Sai-jayanth06/Student-Expense-Prediction.git
   cd Student-Expense-Prediction
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.

4. Run the automated mathematical verification test suite:
   ```bash
   npm test
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🔒 Privacy & Architecture

- **100% Client-Side Storage:** All records are persisted strictly in the browser's HTML5 `localStorage`.
- **Zero Cloud Egress:** No financial data or telemetry is transmitted across the network.
- **No Banking API Integrations:** Completely eliminates credential harvesting and security concerns.

---

## 📜 Research Disclaimer

> *"This prototype demonstrates student spending prediction using historical behaviour. Predictions are statistical estimates and not financial advice."*
