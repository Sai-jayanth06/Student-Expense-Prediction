import React from 'react';
import {
  TrendingUp,
  Sliders,
  Calendar,
  Layers,
  Calculator,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, formatDisplayDate } from '../utils/mathEngine';

export const PredictionTab: React.FC = () => {
  const {
    expenses,
    predictionWindow,
    setPredictionWindow,
    predictionResult,
    budgetSimulation,
  } = useExpense();

  if (expenses.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <TrendingUp size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Dataset Empty</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Please add or load expense records in the Dataset tab to generate predictions.
        </p>
      </div>
    );
  }

  const {
    steps,
    totalWeight,
    sumWeightedProduct,
    simpleMovingAverage,
    weightedMovingAverage,
    predictedNext7DaysSMA,
    predictedNext7DaysWMA,
    predictedNext30DaysSMA,
    predictedNext30DaysWMA,
    expectedMonthlySpendingSMA,
    expectedMonthlySpendingWMA,
    forecastPoints,
    insufficientData,
  } = predictionResult;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Window Selector */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">TRANSPARENT FORECASTING</span>
            <span className="badge badge-emerald">MATHEMATICALLY VERIFIED</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Student Expense Prediction Engine</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Empirical time-series forecasting weighting recent expenditure behavior to model immediate future demands.
          </p>
        </div>

        {/* Lookback Horizon Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Lookback Horizon:
          </span>
          {([7, 14, 30] as const).map((w) => (
            <button
              key={w}
              className={`btn btn-sm ${predictionWindow === w ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setPredictionWindow(w)}
            >
              Last {w} Days
            </button>
          ))}
        </div>
      </div>

      {insufficientData && (
        <div className="alert-banner warning">
          <AlertTriangle size={18} />
          <span>
            Insufficient data points. Need at least 2 consecutive days of spending history to compute predictions.
          </span>
        </div>
      )}

      {/* 4 Core Forecast Cards */}
      <div className="grid-4">
        <div className="stat-card cyan">
          <div className="stat-label">Weighted Daily Burn Rate (WMA)</div>
          <div className="stat-value">{formatCurrency(weightedMovingAverage, 1)}</div>
          <div className="stat-subtext">
            vs. Simple Average: {formatCurrency(simpleMovingAverage, 1)}/day
          </div>
        </div>

        <div className="stat-card emerald">
          <div className="stat-label">Predicted Next 7 Days</div>
          <div className="stat-value">{formatCurrency(predictedNext7DaysWMA)}</div>
          <div className="stat-subtext">
            (SMA Forecast: {formatCurrency(predictedNext7DaysSMA)})
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-label">Predicted Next 30 Days</div>
          <div className="stat-value">{formatCurrency(predictedNext30DaysWMA)}</div>
          <div className="stat-subtext">
            (SMA Forecast: {formatCurrency(predictedNext30DaysSMA)})
          </div>
        </div>

        <div className="stat-card amber">
          <div className="stat-label">Expected Monthly Spending</div>
          <div className="stat-value">{formatCurrency(expectedMonthlySpendingWMA)}</div>
          <div className="stat-subtext">
            Spent to date + projected remaining month
          </div>
        </div>
      </div>

      {/* Methodology & Formula Breakdown Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Calculator size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span>Mathematical Prediction Methodology</span>
            </h3>
            <p className="card-subtitle">
              Formal calculation transparently linking input data to mathematical weights
            </p>
          </div>
        </div>

        <div className="math-box">
          <div className="math-formula">
            WMA = &sum;<sub>i=1..k</sub> (w<sub>i</sub> &times; x<sub>i</sub>) / &sum;<sub>i=1..k</sub> w<sub>i</sub>
            &nbsp;&nbsp;&bull;&nbsp;&nbsp; where w<sub>i</sub> = i &nbsp;&nbsp;&bull;&nbsp;&nbsp; Total Weight W = k(k + 1) / 2
          </div>
          <div className="math-explanation">
            <strong>Why Weighted Moving Average for College Students?</strong> Student expenditures are rarely uniform.
            During project milestones, lab submissions, or exam periods, recent daily spending accelerates sharply
            due to printing, hardware components, and extra meals. By assigning linear weights from 1 (oldest in window)
            to {predictionWindow} (most recent day), the model responds immediately to spending surges while dampening distant noise.
          </div>
        </div>

        {/* Live Calculation Proof */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            padding: '0.85rem',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Window Size (k): </span>
            <strong className="mono-num">{predictionWindow} days</strong>
          </div>
          <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Total Weight (&sum;w): </span>
            <strong className="mono-num">{totalWeight}</strong>
          </div>
          <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Sum of Weighted Products (&sum;wx): </span>
            <strong className="mono-num" style={{ color: 'var(--accent-cyan)' }}>
              ₹{sumWeightedProduct.toLocaleString()}
            </strong>
          </div>
          <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)' }} />
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Weighted Average Daily Rate: </span>
            <strong className="mono-num" style={{ color: 'var(--accent-emerald)' }}>
              ₹{sumWeightedProduct.toLocaleString()} &divide; {totalWeight} = {formatCurrency(weightedMovingAverage, 1)}/day
            </strong>
          </div>
        </div>
      </div>

      {/* Step-by-Step Intermediate Calculation Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Layers size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Intermediate Calculation Steps (Active {predictionWindow}-Day Lookback Window)</span>
            </h3>
            <p className="card-subtitle">
              Every day's spending value multiplied by its assigned mathematical weight
            </p>
          </div>
          <span className="badge badge-primary">{steps.length} Observation Points</span>
        </div>

        <div className="table-container" style={{ maxHeight: '360px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Day i</th>
                <th style={{ width: '140px' }}>Date</th>
                <th style={{ textAlign: 'right', width: '150px' }}>Actual Spend (x_i)</th>
                <th style={{ textAlign: 'center', width: '110px' }}>Weight (w_i)</th>
                <th style={{ textAlign: 'right', width: '180px' }}>Weighted Product (w_i &times; x_i)</th>
                <th>Importance Proportion</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step) => {
                const pctOfWeight = totalWeight > 0 ? ((step.weight / totalWeight) * 100).toFixed(1) : '0';
                return (
                  <tr key={step.dayIndex}>
                    <td>
                      <span className="mono-num" style={{ fontWeight: 700 }}>
                        #{step.dayIndex}
                      </span>
                    </td>
                    <td>
                      <span className="mono-num" style={{ fontSize: '0.825rem' }}>
                        {step.date}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {formatDisplayDate(step.date)}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="mono-num" style={{ fontWeight: 600 }}>
                        {formatCurrency(step.amount)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge-primary">{step.weight}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="mono-num" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        {formatCurrency(step.weightedProduct)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '100px',
                            height: '6px',
                            background: 'var(--bg-surface-elevated)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${pctOfWeight}%`,
                              height: '100%',
                              background: 'var(--accent-primary)',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pctOfWeight}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-surface-elevated)', fontWeight: 800 }}>
                <td colSpan={2}>
                  <strong>TOTALS / WEIGHTED RESULT</strong>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="mono-num">
                    {formatCurrency(steps.reduce((s, d) => s + d.amount, 0))}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="badge badge-emerald">{totalWeight}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="mono-num" style={{ color: 'var(--accent-cyan)', fontSize: '1rem' }}>
                    {formatCurrency(sumWeightedProduct)}
                  </span>
                </td>
                <td>
                  <strong style={{ color: 'var(--accent-emerald)' }}>
                    &rArr; {formatCurrency(weightedMovingAverage, 1)} / day
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Chart: Projected 14-Day Cumulative Spending Trajectory */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <TrendingUp size={18} style={{ color: 'var(--accent-emerald)' }} />
              <span>Projected 14-Day Cumulative Expenditure Trajectory</span>
            </h3>
            <p className="card-subtitle">
              Cumulative spending forecast comparing Model A (SMA) vs Model B (WMA)
            </p>
          </div>
        </div>

        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastPoints} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="dayLabel" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
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
                formatter={(value: any, name: any) => [
                  `₹${value}`,
                  name === 'projectedCumulativeWma' ? 'Model B (WMA) Cumulative' : 'Model A (SMA) Cumulative',
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
              />
              <Line
                type="monotone"
                name="Model B (WMA) Cumulative"
                dataKey="projectedCumulativeWma"
                stroke="var(--accent-cyan)"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                name="Model A (SMA) Cumulative"
                dataKey="projectedCumulativeSma"
                stroke="var(--accent-rose)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
