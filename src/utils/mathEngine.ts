import {
  Expense,
  ExpenseCategory,
  EXPENSE_CATEGORIES,
  DailyAggregate,
  CategoryStatistic,
  AnalysisSummary,
  PredictionResult,
  PredictionStep,
  ForecastPoint,
  ExperimentResult,
  ExperimentDayResult,
  BudgetSimulation,
} from '../types';

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#3b82f6', // Bright blue
  Travel: '#06b6d4', // Cyan
  Education: '#8b5cf6', // Purple
  Printing: '#ec4899', // Pink
  Project: '#f59e0b', // Amber
  Entertainment: '#10b981', // Emerald
  Recharge: '#6366f1', // Indigo
  Other: '#64748b', // Slate
};

/**
 * Parses YYYY-MM-DD string into a clean Date object (local timezone midnight)
 */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/**
 * Formats a Date to YYYY-MM-DD string
 */
export function toDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats date into readable string like "Sep 15" or "15 Sep"
 */
export function formatDisplayDate(dateStr: string): string {
  const d = parseDate(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Formats currency in INR format: ₹1,250.00 or ₹1,250
 */
export function formatCurrency(amount: number, decimals: number = 0): string {
  if (isNaN(amount) || !isFinite(amount)) return '₹0';
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

/**
 * Builds continuous daily aggregated time series including 0-spend days
 */
export function getDailyAggregates(expenses: Expense[]): DailyAggregate[] {
  if (expenses.length === 0) return [];

  // Group raw expenses by date
  const expenseMap = new Map<string, { total: number; count: number; categories: Record<ExpenseCategory, number> }>();

  let minTime = Infinity;
  let maxTime = -Infinity;

  expenses.forEach((e) => {
    const time = parseDate(e.date).getTime();
    if (time < minTime) minTime = time;
    if (time > maxTime) maxTime = time;

    const existing = expenseMap.get(e.date) || {
      total: 0,
      count: 0,
      categories: {
        Food: 0,
        Travel: 0,
        Education: 0,
        Printing: 0,
        Project: 0,
        Entertainment: 0,
        Recharge: 0,
        Other: 0,
      },
    };

    existing.total += e.amount;
    existing.count += 1;
    existing.categories[e.category] = (existing.categories[e.category] || 0) + e.amount;
    expenseMap.set(e.date, existing);
  });

  // Construct continuous calendar array from minDate to maxDate
  const results: DailyAggregate[] = [];
  const curr = new Date(minTime);
  const end = new Date(maxTime);

  while (curr.getTime() <= end.getTime()) {
    const dateStr = toDateString(curr);
    const data = expenseMap.get(dateStr) || {
      total: 0,
      count: 0,
      categories: {
        Food: 0,
        Travel: 0,
        Education: 0,
        Printing: 0,
        Project: 0,
        Entertainment: 0,
        Recharge: 0,
        Other: 0,
      },
    };

    results.push({
      date: dateStr,
      displayDate: formatDisplayDate(dateStr),
      total: data.total,
      count: data.count,
      categories: data.categories,
    });

    curr.setDate(curr.getDate() + 1);
  }

  return results;
}

/**
 * Computes category breakdown and percentage statistics
 */
export function getCategoryStatistics(expenses: Expense[]): CategoryStatistic[] {
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totals: Record<ExpenseCategory, { total: number; count: number }> = {
    Food: { total: 0, count: 0 },
    Travel: { total: 0, count: 0 },
    Education: { total: 0, count: 0 },
    Printing: { total: 0, count: 0 },
    Project: { total: 0, count: 0 },
    Entertainment: { total: 0, count: 0 },
    Recharge: { total: 0, count: 0 },
    Other: { total: 0, count: 0 },
  };

  expenses.forEach((e) => {
    totals[e.category].total += e.amount;
    totals[e.category].count += 1;
  });

  return EXPENSE_CATEGORIES.map((cat) => {
    const total = totals[cat].total;
    const count = totals[cat].count;
    const percentage = totalSpend > 0 ? (total / totalSpend) * 100 : 0;
    const average = count > 0 ? total / count : 0;

    return {
      category: cat,
      total,
      count,
      percentage: Number(percentage.toFixed(1)),
      average: Number(average.toFixed(1)),
      color: CATEGORY_COLORS[cat],
    };
  }).sort((a, b) => b.total - a.total);
}

/**
 * Computes descriptive statistical overview for the dataset
 */
export function computeAnalysisSummary(expenses: Expense[]): AnalysisSummary {
  if (expenses.length === 0) {
    return {
      totalSpending: 0,
      avgDailySpending: 0,
      avgWeeklySpending: 0,
      avgCategorySpending: 0,
      highestCategory: null,
      lowestCategory: null,
      spendingDaysCount: 0,
      totalCalendarDays: 0,
      spendingTrend: {
        slope: 0,
        percentChange: 0,
        direction: 'stable',
        description: 'No data recorded',
      },
    };
  }

  const dailyAggs = getDailyAggregates(expenses);
  const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCalendarDays = Math.max(dailyAggs.length, 1);
  const spendingDaysCount = dailyAggs.filter((d) => d.total > 0).length;

  const avgDailySpending = totalSpending / totalCalendarDays;
  const avgWeeklySpending = avgDailySpending * 7;

  const catStats = getCategoryStatistics(expenses).filter((c) => c.total > 0);
  const avgCategorySpending = catStats.length > 0 ? totalSpending / catStats.length : 0;

  const highestCategory =
    catStats.length > 0
      ? {
          category: catStats[0].category,
          amount: catStats[0].total,
          percentage: catStats[0].percentage,
        }
      : null;

  const lowestCategory =
    catStats.length > 0
      ? {
          category: catStats[catStats.length - 1].category,
          amount: catStats[catStats.length - 1].total,
          percentage: catStats[catStats.length - 1].percentage,
        }
      : null;

  // Linear regression trend over daily aggregates: y = a + b*x
  let slope = 0;
  let percentChange = 0;
  let direction: 'increasing' | 'decreasing' | 'stable' = 'stable';
  let description = 'Consistent spending trajectory';

  if (dailyAggs.length >= 3) {
    const n = dailyAggs.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    dailyAggs.forEach((d, i) => {
      const x = i + 1;
      const y = d.total;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const denom = n * sumXX - sumX * sumX;
    if (denom !== 0) {
      slope = (n * sumXY - sumX * sumY) / denom;
      const firstHalf = dailyAggs.slice(0, Math.floor(n / 2)).reduce((s, d) => s + d.total, 0);
      const secondHalf = dailyAggs.slice(Math.floor(n / 2)).reduce((s, d) => s + d.total, 0);

      if (firstHalf > 0) {
        percentChange = ((secondHalf - firstHalf) / firstHalf) * 100;
      }

      if (slope > 1.5) {
        direction = 'increasing';
        description = `Spending is trending upward (+₹${slope.toFixed(1)}/day)`;
      } else if (slope < -1.5) {
        direction = 'decreasing';
        description = `Spending is trending downward (-₹${Math.abs(slope).toFixed(1)}/day)`;
      } else {
        direction = 'stable';
        description = 'Spending behavior is relatively consistent across days';
      }
    }
  }

  return {
    totalSpending,
    avgDailySpending: Number(avgDailySpending.toFixed(1)),
    avgWeeklySpending: Number(avgWeeklySpending.toFixed(1)),
    avgCategorySpending: Number(avgCategorySpending.toFixed(1)),
    highestCategory,
    lowestCategory,
    spendingDaysCount,
    totalCalendarDays,
    spendingTrend: {
      slope: Number(slope.toFixed(2)),
      percentChange: Number(percentChange.toFixed(1)),
      direction,
      description,
    },
  };
}

/**
 * Computes day-of-week distribution (Sunday - Saturday)
 */
export function getDayOfWeekDistribution(expenses: Expense[]) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const distribution = dayNames.map((name) => ({
    name,
    total: 0,
    count: 0,
    avg: 0,
  }));

  const daily = getDailyAggregates(expenses);
  daily.forEach((d) => {
    const dayIndex = parseDate(d.date).getDay();
    distribution[dayIndex].total += d.total;
    distribution[dayIndex].count += 1;
  });

  distribution.forEach((item) => {
    item.avg = item.count > 0 ? Number((item.total / item.count).toFixed(1)) : 0;
  });

  return distribution;
}

/**
 * PREDICTION ENGINE:
 * Calculates Simple Moving Average (SMA) and Weighted Moving Average (WMA)
 * for a user-specified window (7, 14, 30 days) with full mathematical transparency.
 */
export function calculatePredictions(
  expenses: Expense[],
  windowSize: 7 | 14 | 30 = 7
): PredictionResult {
  const daily = getDailyAggregates(expenses);

  if (daily.length < 2) {
    return {
      windowSize,
      steps: [],
      totalWeight: 0,
      sumWeightedProduct: 0,
      simpleMovingAverage: 0,
      weightedMovingAverage: 0,
      predictedNext7DaysSMA: 0,
      predictedNext7DaysWMA: 0,
      predictedNext30DaysSMA: 0,
      predictedNext30DaysWMA: 0,
      expectedMonthlySpendingSMA: 0,
      expectedMonthlySpendingWMA: 0,
      forecastPoints: [],
      insufficientData: true,
      actualDataPointsCount: daily.length,
    };
  }

  // Slice the most recent 'windowSize' days from the historical aggregate
  const windowDays = daily.slice(-windowSize);
  const k = windowDays.length;

  let sumRaw = 0;
  let totalWeight = 0;
  let sumWeightedProduct = 0;

  const steps: PredictionStep[] = windowDays.map((d, index) => {
    // Weight wi = index + 1 (1 for oldest in window, k for most recent day)
    const weight = index + 1;
    const amount = d.total;
    const weightedProduct = amount * weight;

    sumRaw += amount;
    totalWeight += weight;
    sumWeightedProduct += weightedProduct;

    return {
      dayIndex: index + 1,
      date: d.date,
      amount,
      weight,
      weightedProduct,
    };
  });

  const simpleMovingAverage = k > 0 ? sumRaw / k : 0;
  const weightedMovingAverage = totalWeight > 0 ? sumWeightedProduct / totalWeight : 0;

  const predictedNext7DaysSMA = simpleMovingAverage * 7;
  const predictedNext7DaysWMA = weightedMovingAverage * 7;
  const predictedNext30DaysSMA = simpleMovingAverage * 30;
  const predictedNext30DaysWMA = weightedMovingAverage * 30;

  // Expected monthly spending calculation:
  // (Current month spend to date + remaining days in month * daily rate)
  const lastDate = parseDate(daily[daily.length - 1].date);
  const daysInMonth = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0).getDate();
  const currentDayOfMonth = lastDate.getDate();
  const remainingDaysInMonth = Math.max(0, daysInMonth - currentDayOfMonth);

  // Spending recorded in the same month as lastDate
  const currentMonthExpenses = expenses.filter((e) => {
    const ed = parseDate(e.date);
    return ed.getFullYear() === lastDate.getFullYear() && ed.getMonth() === lastDate.getMonth();
  });
  const currentMonthSpent = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);

  const expectedMonthlySpendingSMA = currentMonthSpent + remainingDaysInMonth * simpleMovingAverage;
  const expectedMonthlySpendingWMA = currentMonthSpent + remainingDaysInMonth * weightedMovingAverage;

  // Generate 14-day forward projection timeline points for interactive charts
  const forecastPoints: ForecastPoint[] = [];
  const futureBase = new Date(lastDate);

  let cumulativeSma = currentMonthSpent;
  let cumulativeWma = currentMonthSpent;

  for (let i = 1; i <= 14; i++) {
    const fDate = new Date(futureBase);
    fDate.setDate(futureBase.getDate() + i);
    const dateStr = toDateString(fDate);

    cumulativeSma += simpleMovingAverage;
    cumulativeWma += weightedMovingAverage;

    forecastPoints.push({
      date: dateStr,
      dayLabel: `+${i}d (${formatDisplayDate(dateStr)})`,
      predictedSma: Number(simpleMovingAverage.toFixed(1)),
      predictedWma: Number(weightedMovingAverage.toFixed(1)),
      projectedCumulativeSma: Number(cumulativeSma.toFixed(0)),
      projectedCumulativeWma: Number(cumulativeWma.toFixed(0)),
    });
  }

  return {
    windowSize,
    steps,
    totalWeight,
    sumWeightedProduct,
    simpleMovingAverage: Number(simpleMovingAverage.toFixed(1)),
    weightedMovingAverage: Number(weightedMovingAverage.toFixed(1)),
    predictedNext7DaysSMA: Number(predictedNext7DaysSMA.toFixed(0)),
    predictedNext7DaysWMA: Number(predictedNext7DaysWMA.toFixed(0)),
    predictedNext30DaysSMA: Number(predictedNext30DaysSMA.toFixed(0)),
    predictedNext30DaysWMA: Number(predictedNext30DaysWMA.toFixed(0)),
    expectedMonthlySpendingSMA: Number(expectedMonthlySpendingSMA.toFixed(0)),
    expectedMonthlySpendingWMA: Number(expectedMonthlySpendingWMA.toFixed(0)),
    forecastPoints,
    insufficientData: false,
    actualDataPointsCount: k,
  };
}

/**
 * HOLDOUT BACKTESTING EXPERIMENT (THE CORE RESEARCH PAPER FEATURE):
 * 1. Takes the full dataset daily aggregates.
 * 2. Hides the last 7 days as the Holdout Test Period (ground truth actuals).
 * 3. Uses the earlier training period to compute Model A (SMA) and Model B (WMA).
 * 4. Generates predictions for those 7 hidden days.
 * 5. Compares Actual vs Predicted spending for each day.
 * 6. Calculates MAE, MAPE, WAPE for both models and produces empirical scientific findings.
 */
export function runHoldoutExperiment(expenses: Expense[]): ExperimentResult {
  const daily = getDailyAggregates(expenses);
  const minDaysRequired = 14; // Need at least 7 days training + 7 days test

  if (daily.length < minDaysRequired) {
    return {
      trainStartDate: '',
      trainEndDate: '',
      testStartDate: '',
      testEndDate: '',
      trainDaysCount: Math.max(0, daily.length - 7),
      testDaysCount: Math.min(daily.length, 7),
      holdoutDays: [],
      smaBaselineRate: 0,
      wmaBaselineRate: 0,
      smaMae: 0,
      smaMape: 0,
      smaWape: 0,
      wmaMae: 0,
      wmaMape: 0,
      wmaWape: 0,
      bestModel: 'TIE',
      maeDiff: 0,
      verdictRationale: 'Insufficient data points. A minimum of 14 continuous days is required to split into training and 7-day holdout testing.',
      insufficientData: true,
      minDaysRequired,
      availableDaysCount: daily.length,
    };
  }

  // Split: Last 7 days = Test holdout, prior days = Training set
  const testSet = daily.slice(-7);
  const trainSet = daily.slice(0, -7);

  // Train models on the most recent 14 days of the training set (or all training days if < 14)
  const trainWindow = trainSet.slice(-14);
  const trainK = trainWindow.length;

  let trainSumRaw = 0;
  let trainTotalWeight = 0;
  let trainWeightedProduct = 0;

  trainWindow.forEach((d, i) => {
    const weight = i + 1;
    trainSumRaw += d.total;
    trainTotalWeight += weight;
    trainWeightedProduct += d.total * weight;
  });

  const smaBaselineRate = trainK > 0 ? trainSumRaw / trainK : 0;
  const wmaBaselineRate = trainTotalWeight > 0 ? trainWeightedProduct / trainTotalWeight : 0;

  // Evaluate predictions on each of the 7 holdout days
  let sumAbsErrorSma = 0;
  let sumAbsErrorWma = 0;
  let sumActualSpend = 0;
  let sumPctErrorSma = 0;
  let sumPctErrorWma = 0;
  let nonZeroActualCount = 0;

  const holdoutDays: ExperimentDayResult[] = testSet.map((d, index) => {
    const actualAmount = d.total;
    sumActualSpend += actualAmount;

    // Predicted rates from models
    const smaPredicted = Number(smaBaselineRate.toFixed(1));
    const wmaPredicted = Number(wmaBaselineRate.toFixed(1));

    const smaDiff = Math.abs(actualAmount - smaPredicted);
    const wmaDiff = Math.abs(actualAmount - wmaPredicted);

    sumAbsErrorSma += smaDiff;
    sumAbsErrorWma += wmaDiff;

    let smaPctError: number | null = null;
    let wmaPctError: number | null = null;

    if (actualAmount > 0) {
      smaPctError = (smaDiff / actualAmount) * 100;
      wmaPctError = (wmaDiff / actualAmount) * 100;
      sumPctErrorSma += smaPctError;
      sumPctErrorWma += wmaPctError;
      nonZeroActualCount += 1;
    }

    return {
      dayIndex: index + 1,
      date: d.date,
      displayDate: `Day ${index + 1} (${formatDisplayDate(d.date)})`,
      actualAmount,
      smaPredicted,
      wmaPredicted,
      smaDiff: Number(smaDiff.toFixed(1)),
      wmaDiff: Number(wmaDiff.toFixed(1)),
      smaPctError: smaPctError !== null ? Number(smaPctError.toFixed(1)) : null,
      wmaPctError: wmaPctError !== null ? Number(wmaPctError.toFixed(1)) : null,
    };
  });

  // Calculate standard statistical error metrics:
  // MAE = (1/n) * sum(|y - y_hat|)
  const smaMae = Number((sumAbsErrorSma / 7).toFixed(1));
  const wmaMae = Number((sumAbsErrorWma / 7).toFixed(1));

  // MAPE = (1 / nonZeroCount) * sum(|y - y_hat| / y) * 100
  const smaMape = nonZeroActualCount > 0 ? Number((sumPctErrorSma / nonZeroActualCount).toFixed(1)) : 0;
  const wmaMape = nonZeroActualCount > 0 ? Number((sumPctErrorWma / nonZeroActualCount).toFixed(1)) : 0;

  // WAPE = sum(|y - y_hat|) / sum(y) * 100 (graceful zero-handling metric)
  const smaWape = sumActualSpend > 0 ? Number(((sumAbsErrorSma / sumActualSpend) * 100).toFixed(1)) : 0;
  const wmaWape = sumActualSpend > 0 ? Number(((sumAbsErrorWma / sumActualSpend) * 100).toFixed(1)) : 0;

  let bestModel: 'SMA' | 'WMA' | 'TIE' = 'TIE';
  let maeDiff = 0;
  let verdictRationale = '';

  if (wmaMae < smaMae) {
    bestModel = 'WMA';
    maeDiff = Number((smaMae - wmaMae).toFixed(1));
    const improvement = ((smaMae - wmaMae) / smaMae) * 100;
    verdictRationale = `Model B (Weighted Moving Average) demonstrated superior predictive accuracy on this student dataset, yielding a lower Mean Absolute Error of ₹${wmaMae}/day compared to Model A's ₹${smaMae}/day (${improvement.toFixed(1)}% error reduction). This demonstrates that student spending behavior has recency momentum, where recent academic deadlines, printing, and transit costs are stronger indicators of near-term expenditures than equal-weight historical averages.`;
  } else if (smaMae < wmaMae) {
    bestModel = 'SMA';
    maeDiff = Number((wmaMae - smaMae).toFixed(1));
    const improvement = ((wmaMae - smaMae) / wmaMae) * 100;
    verdictRationale = `Model A (Simple Moving Average) performed better on this specific dataset with a lower Mean Absolute Error of ₹${smaMae}/day vs Model B's ₹${wmaMae}/day (${improvement.toFixed(1)}% error reduction). This occurs when recent days contained temporary anomalous spikes (such as a one-time book or hardware purchase) which WMA over-weights, whereas SMA successfully smoothed out the short-term noise.`;
  } else {
    bestModel = 'TIE';
    maeDiff = 0;
    verdictRationale = `Both Model A and Model B produced identical Mean Absolute Errors of ₹${smaMae}/day on this holdout period, indicating balanced spending stability during the transition window.`;
  }

  return {
    trainStartDate: trainSet[0].date,
    trainEndDate: trainSet[trainSet.length - 1].date,
    testStartDate: testSet[0].date,
    testEndDate: testSet[testSet.length - 1].date,
    trainDaysCount: trainSet.length,
    testDaysCount: testSet.length,
    holdoutDays,
    smaBaselineRate: Number(smaBaselineRate.toFixed(1)),
    wmaBaselineRate: Number(wmaBaselineRate.toFixed(1)),
    smaMae,
    smaMape,
    smaWape,
    wmaMae,
    wmaMape,
    wmaWape,
    bestModel,
    maeDiff,
    verdictRationale,
    insufficientData: false,
    minDaysRequired,
    availableDaysCount: daily.length,
  };
}

/**
 * STUDENT BUDGET & RUNWAY SIMULATION:
 * Takes monthly allowance and current wallet/bank balance,
 * calculates burn rate, runway days, depletion projection, and deficit alerts.
 */
export function simulateStudentBudget(
  expenses: Expense[],
  monthlyAllowance: number,
  currentBalance: number,
  selectedModel: 'SMA' | 'WMA' = 'WMA'
): BudgetSimulation {
  const pred = calculatePredictions(expenses, 14);
  const dailyBurnRate =
    selectedModel === 'WMA' ? pred.weightedMovingAverage : pred.simpleMovingAverage;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const currentDay = today.getDate();
  const daysRemainingInMonth = Math.max(1, daysInMonth - currentDay);

  // Month-to-date spending
  const currentMonthExpenses = expenses.filter((e) => {
    const d = parseDate(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const monthToDateSpent = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);

  const predictedMonthlySpend = monthToDateSpent + daysRemainingInMonth * dailyBurnRate;
  const predictedRemainingBalance = currentBalance - daysRemainingInMonth * dailyBurnRate;

  // Runway in days = Current Balance / Daily Burn Rate
  let runwayDays = 0;
  let depletionDate: string | null = null;

  if (dailyBurnRate > 0) {
    runwayDays = Math.floor(currentBalance / dailyBurnRate);
    const depDate = new Date(today);
    depDate.setDate(today.getDate() + runwayDays);
    depletionDate = toDateString(depDate);
  } else {
    runwayDays = 999;
  }

  const isDeficit = predictedMonthlySpend > monthlyAllowance || predictedRemainingBalance < 0;
  const deficitAmount = isDeficit
    ? Math.max(predictedMonthlySpend - monthlyAllowance, Math.abs(predictedRemainingBalance))
    : 0;

  let status: 'safe' | 'warning' | 'critical' = 'safe';
  let statusMessage = '';

  if (runwayDays <= 5 || predictedRemainingBalance < 0) {
    status = 'critical';
    statusMessage = `Critical Budget Alert: Current burn rate (₹${dailyBurnRate.toFixed(0)}/day) will exhaust your balance in ${runwayDays} days, before the current month concludes!`;
  } else if (runwayDays < daysRemainingInMonth || isDeficit) {
    status = 'warning';
    statusMessage = `Budget Warning: Projected monthly spending (₹${predictedMonthlySpend.toFixed(0)}) exceeds your monthly allowance (₹${monthlyAllowance.toLocaleString()}) by ₹${deficitAmount.toFixed(0)}.`;
  } else {
    status = 'safe';
    statusMessage = `Healthy Budget Runway: At current rate, balance will safely sustain you through the remaining ${daysRemainingInMonth} days of the month with a projected surplus of ₹${Math.max(0, predictedRemainingBalance).toFixed(0)}.`;
  }

  return {
    monthlyAllowance,
    currentBalance,
    selectedModel,
    dailyBurnRate: Number(dailyBurnRate.toFixed(1)),
    predictedMonthlySpend: Number(predictedMonthlySpend.toFixed(0)),
    predictedRemainingBalance: Number(predictedRemainingBalance.toFixed(0)),
    runwayDays,
    daysRemainingInMonth,
    isDeficit,
    deficitAmount: Number(deficitAmount.toFixed(0)),
    depletionDate,
    status,
    statusMessage,
  };
}
