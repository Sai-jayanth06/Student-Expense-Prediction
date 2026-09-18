export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Education'
  | 'Printing'
  | 'Project'
  | 'Entertainment'
  | 'Recharge'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Travel',
  'Education',
  'Printing',
  'Project',
  'Entertainment',
  'Recharge',
  'Other',
];

export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: ExpenseCategory;
  description: string;
  createdAt: number;
}

export interface DailyAggregate {
  date: string; // YYYY-MM-DD
  displayDate: string;
  total: number;
  count: number;
  categories: Record<ExpenseCategory, number>;
}

export interface CategoryStatistic {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number;
  average: number;
  color: string;
}

export interface AnalysisSummary {
  totalSpending: number;
  avgDailySpending: number;
  avgWeeklySpending: number;
  avgCategorySpending: number;
  highestCategory: { category: ExpenseCategory; amount: number; percentage: number } | null;
  lowestCategory: { category: ExpenseCategory; amount: number; percentage: number } | null;
  spendingDaysCount: number;
  totalCalendarDays: number;
  spendingTrend: {
    slope: number;
    percentChange: number;
    direction: 'increasing' | 'decreasing' | 'stable';
    description: string;
  };
}

export interface PredictionStep {
  dayIndex: number;
  date: string;
  amount: number;
  weight: number;
  weightedProduct: number;
}

export interface ForecastPoint {
  date: string;
  dayLabel: string;
  predictedSma: number;
  predictedWma: number;
  projectedCumulativeSma: number;
  projectedCumulativeWma: number;
}

export interface PredictionResult {
  windowSize: 7 | 14 | 30;
  steps: PredictionStep[];
  totalWeight: number;
  sumWeightedProduct: number;
  simpleMovingAverage: number;
  weightedMovingAverage: number;
  predictedNext7DaysSMA: number;
  predictedNext7DaysWMA: number;
  predictedNext30DaysSMA: number;
  predictedNext30DaysWMA: number;
  expectedMonthlySpendingSMA: number;
  expectedMonthlySpendingWMA: number;
  forecastPoints: ForecastPoint[];
  insufficientData: boolean;
  actualDataPointsCount: number;
}

export interface ExperimentDayResult {
  dayIndex: number;
  date: string;
  displayDate: string;
  actualAmount: number;
  smaPredicted: number;
  wmaPredicted: number;
  smaDiff: number; // |Actual - SMA|
  wmaDiff: number; // |Actual - WMA|
  smaPctError: number | null; // null if actual is 0 to avoid division by 0
  wmaPctError: number | null;
}

export interface ExperimentResult {
  trainStartDate: string;
  trainEndDate: string;
  testStartDate: string;
  testEndDate: string;
  trainDaysCount: number;
  testDaysCount: number;
  holdoutDays: ExperimentDayResult[];
  smaBaselineRate: number;
  wmaBaselineRate: number;
  smaMae: number;
  smaMape: number;
  smaWape: number;
  wmaMae: number;
  wmaMape: number;
  wmaWape: number;
  bestModel: 'SMA' | 'WMA' | 'TIE';
  maeDiff: number;
  verdictRationale: string;
  insufficientData: boolean;
  minDaysRequired: number;
  availableDaysCount: number;
}

export interface BudgetSimulation {
  monthlyAllowance: number;
  currentBalance: number;
  selectedModel: 'SMA' | 'WMA';
  dailyBurnRate: number;
  predictedMonthlySpend: number;
  predictedRemainingBalance: number;
  runwayDays: number;
  daysRemainingInMonth: number;
  isDeficit: boolean;
  deficitAmount: number;
  depletionDate: string | null;
  status: 'safe' | 'warning' | 'critical';
  statusMessage: string;
}

export type ActiveTab =
  | 'overview'
  | 'dataset'
  | 'analysis'
  | 'prediction'
  | 'experiment'
  | 'models'
  | 'budget'
  | 'privacy';
