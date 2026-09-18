import React, { useMemo } from 'react';
import {
  PieChart as PieIcon,
  TrendingUp,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useExpense } from '../context/ExpenseContext';
import {
  formatCurrency,
  getDayOfWeekDistribution,
  parseDate,
} from '../utils/mathEngine';

export const AnalysisTab: React.FC = () => {
  const {
    expenses,
    analysisSummary,
    categoryStats,
    dailyAggregates,
  } = useExpense();

  // Weekly spending aggregation for chart
  const weeklyData = useMemo(() => {
    if (dailyAggregates.length === 0) return [];
    // Group into 7-day buckets
    const weeks: Array<{ weekLabel: string; total: number; daysCount: number }> = [];
    const chunkSize = 7;

    for (let i = 0; i < dailyAggregates.length; i += chunkSize) {
      const chunk = dailyAggregates.slice(i, i + chunkSize);
      const sum = chunk.reduce((s, d) => s + d.total, 0);
      const startLabel = chunk[0].displayDate;
      const endLabel = chunk[chunk.length - 1].displayDate;
      weeks.push({
        weekLabel: `${startLabel} - ${endLabel}`,
        total: sum,
        daysCount: chunk.length,
      });
    }

    return weeks;
  }, [dailyAggregates]);

  const dayOfWeekData = useMemo(() => getDayOfWeekDistribution(expenses), [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <PieIcon size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Data to Analyze</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Please go to the Dataset tab and load or add student expense records to compute analysis.
        </p>
      </div>
    );
  }

  // Trend icon and color
  const renderTrendBadge = () => {
    const { direction, percentChange, description } = analysisSummary.spendingTrend;
    if (direction === 'increasing') {
      return (
        <span className="badge badge-rose" title={description}>
          <ArrowUpRight size={14} />
          <span>+{percentChange.toFixed(1)}% ({direction})</span>
        </span>
      );
    }
    if (direction === 'decreasing') {
      return (
        <span className="badge badge-emerald" title={description}>
          <ArrowDownRight size={14} />
          <span>{percentChange.toFixed(1)}% ({direction})</span>
        </span>
      );
    }
    return (
      <span className="badge badge-primary" title={description}>
        <Minus size={14} />
        <span>Stable Trajectory</span>
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Stat Cards */}
      <div className="grid-4">
        <div className="stat-card cyan">
          <div className="stat-label">Total Student Spending</div>
          <div className="stat-value">{formatCurrency(analysisSummary.totalSpending)}</div>
          <div className="stat-subtext">Cumulative recorded expenditures</div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-label">Average Daily Spending</div>
          <div className="stat-value">{formatCurrency(analysisSummary.avgDailySpending)}</div>
          <div className="stat-subtext">
            Across {analysisSummary.totalCalendarDays} continuous calendar days
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-label">Average Weekly Spending</div>
          <div className="stat-value">{formatCurrency(analysisSummary.avgWeeklySpending)}</div>
          <div className="stat-subtext">Normalized 7-day burn estimate</div>
        </div>

        <div className="stat-card amber">
          <div className="stat-label">Average Category Spending</div>
          <div className="stat-value">{formatCurrency(analysisSummary.avgCategorySpending)}</div>
          <div className="stat-subtext">Per active student budget category</div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-label">Highest Spending Category</div>
          <div className="stat-value" style={{ fontSize: '1.35rem', color: 'var(--accent-primary)' }}>
            {analysisSummary.highestCategory ? analysisSummary.highestCategory.category : 'N/A'}
          </div>
          <div className="stat-subtext">
            {analysisSummary.highestCategory
              ? `${formatCurrency(analysisSummary.highestCategory.amount)} (${analysisSummary.highestCategory.percentage}%)`
              : ''}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Lowest Spending Category</div>
          <div className="stat-value" style={{ fontSize: '1.35rem', color: 'var(--text-secondary)' }}>
            {analysisSummary.lowestCategory ? analysisSummary.lowestCategory.category : 'N/A'}
          </div>
          <div className="stat-subtext">
            {analysisSummary.lowestCategory
              ? `${formatCurrency(analysisSummary.lowestCategory.amount)} (${analysisSummary.lowestCategory.percentage}%)`
              : ''}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Spending Days</div>
          <div className="stat-value">
            {analysisSummary.spendingDaysCount}{' '}
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              / {analysisSummary.totalCalendarDays} days
            </span>
          </div>
          <div className="stat-subtext">
            {((analysisSummary.spendingDaysCount / Math.max(1, analysisSummary.totalCalendarDays)) * 100).toFixed(0)}% frequency of transactions
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Spending Trend Slope</div>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {renderTrendBadge()}
          </div>
          <div className="stat-subtext" style={{ marginTop: '0.4rem' }}>
            {analysisSummary.spendingTrend.description}
          </div>
        </div>
      </div>

      {/* Chart 1: Daily Spending Line / Area Chart */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Daily Spending Time-Series Trajectory</span>
            </h3>
            <p className="card-subtitle">
              Daily cumulative expenditures showing natural micro-transaction spikes and quiet study periods
            </p>
          </div>
          <div className="badge badge-primary">
            <span>Avg: {formatCurrency(analysisSummary.avgDailySpending)}/day</span>
          </div>
        </div>

        <div style={{ height: '320px', width: '100%', marginTop: '0.5rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyAggregates} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="dailySpendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="displayDate"
                stroke="var(--text-muted)"
                fontSize={12}
                tickLine={false}
                interval={Math.max(1, Math.floor(dailyAggregates.length / 10))}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                  boxShadow: 'var(--shadow-md)',
                }}
                formatter={(value: any) => [`₹${value}`, 'Spending']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="var(--accent-primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#dailySpendGradient)"
                activeDot={{ r: 6, fill: 'var(--accent-cyan)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid 2: Category Breakdown Bar Chart + Category Donut Chart */}
      <div className="grid-2">
        {/* Category Spending Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <BarChart3 size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Spending by Category (₹)</span>
              </h3>
              <p className="card-subtitle">Total expenditure sorted by academic student category</p>
            </div>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                  }}
                  formatter={(value: any, _, item: any) => [
                    `₹${value} (${item.payload.percentage}%)`,
                    'Total Spent',
                  ]}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {categoryStats.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Percentage Donut Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <PieIcon size={18} style={{ color: 'var(--accent-purple)' }} />
                <span>Category Proportions (%)</span>
              </h3>
              <p className="card-subtitle">Proportional student budget allocation</p>
            </div>
          </div>

          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats.filter((c) => c.total > 0)}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {categoryStats.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                  }}
                  formatter={(value: any, name: any, item: any) => [
                    `₹${value} (${item.payload.percentage}%)`,
                    name,
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid 2: Weekly Spending Chart + Day of Week Behavioral Distribution */}
      <div className="grid-2">
        {/* Weekly Spending Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Calendar size={18} style={{ color: 'var(--accent-amber)' }} />
                <span>Weekly Aggregate Spending</span>
              </h3>
              <p className="card-subtitle">7-day aggregated cycle expenditures</p>
            </div>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="weekLabel" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                  }}
                  formatter={(value: any) => [`₹${value}`, 'Weekly Spending']}
                />
                <Bar dataKey="total" fill="var(--accent-amber)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day-of-Week Behavioral Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Layers size={18} style={{ color: 'var(--accent-emerald)' }} />
                <span>Day-of-Week Spending Behavior</span>
              </h3>
              <p className="card-subtitle">Average expenditure per day of the week (Sun - Sat)</p>
            </div>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-mono)',
                  }}
                  formatter={(value: any) => [`₹${value}/day`, 'Average Spend']}
                />
                <Bar dataKey="avg" fill="var(--accent-emerald)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
