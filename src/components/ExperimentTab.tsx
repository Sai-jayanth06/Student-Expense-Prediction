import React from 'react';
import {
  FlaskConical,
  TrendingUp,
  Award,
  Calendar,
  AlertTriangle,
  GitCompare,
  HelpCircle,
  BarChart2,
  CheckCircle2,
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
import { formatCurrency } from '../utils/mathEngine';

export const ExperimentTab: React.FC = () => {
  const { experimentResult, expenses } = useExpense();

  if (expenses.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <FlaskConical size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Experiment Data Available</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Please load or add expenses in the Dataset tab to run the holdout backtesting experiment.
        </p>
      </div>
    );
  }

  const {
    trainStartDate,
    trainEndDate,
    testStartDate,
    testEndDate,
    trainDaysCount,
    testDaysCount,
    holdoutDays,
    smaBaselineRate,
    wmaBaselineRate,
    smaMae,
    smaMape,
    smaWape,
    wmaMae,
    wmaMape,
    wmaWape,
    bestModel,
    maeDiff,
    verdictRationale,
    insufficientData,
    minDaysRequired,
    availableDaysCount,
  } = experimentResult;

  if (insufficientData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <AlertTriangle size={48} style={{ color: 'var(--accent-amber)', margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Insufficient Historical Span for Experiment</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', maxWidth: '600px', margin: '0.5rem auto' }}>
          The backtesting protocol requires at least <strong>{minDaysRequired} continuous days</strong> (at least 7 days of training data to learn spending behavior + 7 days hidden holdout test period).
          Current dataset spans <strong>{availableDaysCount} continuous days</strong>.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Tip: Click "Load Research Dataset" in the navigation bar to instantly populate 50+ days of authentic student records.
        </p>
      </div>
    );
  }

  // Pre-format chart data
  const chartData = holdoutDays.map((d) => ({
    displayDate: d.displayDate,
    Actual: d.actualAmount,
    'Model A (SMA)': d.smaPredicted,
    'Model B (WMA)': d.wmaPredicted,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title & Research Protocol Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08), rgba(99, 102, 241, 0.08))',
          borderColor: 'rgba(244, 63, 94, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-rose">KEY PAPER EXPERIMENT</span>
              <span className="badge badge-primary">TIME-SERIES BACKTESTING</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Actual vs. Predicted Holdout Backtesting Experiment
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '850px', marginTop: '0.35rem', lineHeight: 1.5 }}>
              To validate predictive validity scientifically, we employ a <strong>7-Day Holdout Backtesting Protocol</strong>.
              The last 7 calendar days are hidden from the training stage. Models A (SMA) and B (WMA) are calibrated strictly on
              the prior historical training set ({trainDaysCount} days), forecast each of the 7 hidden days, and are rigorously
              benchmarked against actual ground-truth expenditures.
            </p>
          </div>

          <div
            style={{
              padding: '0.65rem 1rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Training Period: </span>
              <strong className="mono-num">{trainStartDate} &rarr; {trainEndDate}</strong> ({trainDaysCount} days)
            </div>
            <div style={{ marginTop: '0.25rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Holdout Test Period: </span>
              <strong className="mono-num" style={{ color: 'var(--accent-rose)' }}>{testStartDate} &rarr; {testEndDate}</strong> ({testDaysCount} days)
            </div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Scorecard */}
      <div className="grid-3">
        {/* Model A Card */}
        <div className={`card ${bestModel === 'SMA' ? 'emerald' : ''}`} style={{ position: 'relative' }}>
          {bestModel === 'SMA' && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <span className="badge badge-emerald">LOWER ERROR</span>
            </div>
          )}
          <div className="card-header" style={{ marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Approach A
              </span>
              <h3 className="card-title" style={{ fontSize: '1.1rem' }}>
                Simple Moving Average (SMA)
              </h3>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Equal-weight average computed across training window. Baseline daily rate: <strong>₹{smaBaselineRate}/day</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mean Absolute Error (MAE):</span>
              <strong className="mono-num" style={{ fontSize: '1.2rem', color: 'var(--accent-rose)' }}>
                ₹{smaMae}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mean Absolute % Error (MAPE):</span>
              <strong className="mono-num" style={{ fontSize: '1rem' }}>
                {smaMape}%
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Weighted % Error (WAPE):</span>
              <strong className="mono-num" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {smaWape}%
              </strong>
            </div>
          </div>
        </div>

        {/* Model B Card */}
        <div className={`card ${bestModel === 'WMA' ? 'emerald' : ''}`} style={{ position: 'relative' }}>
          {bestModel === 'WMA' && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <span className="badge badge-emerald">LOWER ERROR</span>
            </div>
          )}
          <div className="card-header" style={{ marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Approach B
              </span>
              <h3 className="card-title" style={{ fontSize: '1.1rem' }}>
                Weighted Moving Average (WMA)
              </h3>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Linear recency weighting ($w_i = i$) prioritizing recent days. Baseline daily rate: <strong>₹{wmaBaselineRate}/day</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mean Absolute Error (MAE):</span>
              <strong className="mono-num" style={{ fontSize: '1.2rem', color: 'var(--accent-emerald)' }}>
                ₹{wmaMae}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Mean Absolute % Error (MAPE):</span>
              <strong className="mono-num" style={{ fontSize: '1rem' }}>
                {wmaMape}%
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Weighted % Error (WAPE):</span>
              <strong className="mono-num" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {wmaWape}%
              </strong>
            </div>
          </div>
        </div>

        {/* Empirical Delta & Winner Card */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.08))',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', marginBottom: '0.4rem' }}>
              <Award size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Dataset Error Differential
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {bestModel === 'WMA' ? 'Model B (WMA) Won' : bestModel === 'SMA' ? 'Model A (SMA) Won' : 'Tie Performance'}
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              MAE difference between models on the 7 holdout test days:
            </p>
            <div className="stat-value" style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>
              &Delta; ₹{maeDiff}/day
            </div>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
            Empirical finding based strictly on the current recorded dataset.
          </div>
        </div>
      </div>

      {/* Prominent Scientific Verdict Banner */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <CheckCircle2 size={22} style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Empirical Research Conclusion for this Dataset:
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.55 }}>
              {verdictRationale}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>
              Note for presentation: We do NOT claim that one model is universally best for all financial systems. Moving average performance is governed by student spending variance—WMA provides agility for dynamic project sprints, whereas SMA dampens isolated anomalous outlays.
            </p>
          </div>
        </div>
      </div>

      {/* The Core Graph: Actual vs Predicted Dual-Line Chart */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>ACTUAL VS. PREDICTED SPENDING GRAPH (Holdout Test Days)</span>
            </h3>
            <p className="card-subtitle">
              Ground truth spending (solid line) vs Model A SMA and Model B WMA forecasts (dashed lines)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span className="badge badge-emerald">Ground Truth: Solid Line</span>
            <span className="badge badge-primary">Predictions: Dashed</span>
          </div>
        </div>

        <div style={{ height: '360px', width: '100%', marginTop: '0.5rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 25, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="displayDate" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
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
                  boxShadow: 'var(--shadow-md)',
                }}
                formatter={(val: any) => [`₹${val}`, '']}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: '12px', paddingBottom: '12px' }}
              />
              {/* Actual Spending - Bold and Prominent */}
              <Line
                type="monotone"
                name="Actual Spending (Ground Truth)"
                dataKey="Actual"
                stroke="#38bdf8"
                strokeWidth={3.5}
                dot={{ r: 6, fill: '#0284c7' }}
                activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 2 }}
              />
              {/* Model B: Weighted Moving Average */}
              <Line
                type="monotone"
                name="Model B: WMA Forecast"
                dataKey="Model B (WMA)"
                stroke="#10b981"
                strokeWidth={2.2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#10b981' }}
              />
              {/* Model A: Simple Moving Average */}
              <Line
                type="monotone"
                name="Model A: SMA Forecast"
                dataKey="Model A (SMA)"
                stroke="#f43f5e"
                strokeWidth={2.2}
                strokeDasharray="3 3"
                dot={{ r: 4, fill: '#f43f5e' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Backtesting Verification Comparison Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <FlaskConical size={18} style={{ color: 'var(--accent-rose)' }} />
              <span>Holdout Verification Table (Day-by-Day Ground Truth vs Models)</span>
            </h3>
            <p className="card-subtitle">
              Calculates daily absolute difference (|Actual - Predicted|) and individual percentage error
            </p>
          </div>
          <span className="badge badge-primary">{holdoutDays.length} Test Days</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Test Day</th>
                <th style={{ width: '130px' }}>Date</th>
                <th style={{ textAlign: 'right', width: '120px' }}>Actual (₹)</th>
                <th style={{ textAlign: 'right', width: '120px' }}>SMA Pred (₹)</th>
                <th style={{ textAlign: 'right', width: '120px' }}>WMA Pred (₹)</th>
                <th style={{ textAlign: 'right', width: '120px' }}>SMA Diff (|&Delta;|)</th>
                <th style={{ textAlign: 'right', width: '120px' }}>WMA Diff (|&Delta;|)</th>
                <th style={{ textAlign: 'right', width: '110px' }}>SMA % Error</th>
                <th style={{ textAlign: 'right', width: '110px' }}>WMA % Error</th>
                <th style={{ textAlign: 'center', width: '120px' }}>Closer Model</th>
              </tr>
            </thead>
            <tbody>
              {holdoutDays.map((day) => {
                const wmaCloser = day.wmaDiff < day.smaDiff;
                const smaCloser = day.smaDiff < day.wmaDiff;

                return (
                  <tr key={day.dayIndex}>
                    <td>
                      <span className="mono-num" style={{ fontWeight: 700 }}>
                        Day {day.dayIndex}
                      </span>
                    </td>
                    <td>
                      <span className="mono-num" style={{ fontSize: '0.825rem' }}>
                        {day.date}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <strong className="mono-num" style={{ color: '#38bdf8' }}>
                        {formatCurrency(day.actualAmount)}
                      </strong>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="mono-num">{formatCurrency(day.smaPredicted, 1)}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="mono-num">{formatCurrency(day.wmaPredicted, 1)}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="mono-num" style={{ color: smaCloser ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
                        ₹{day.smaDiff}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="mono-num" style={{ color: wmaCloser ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
                        ₹{day.wmaDiff}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="mono-num" style={{ fontSize: '0.825rem' }}>
                        {day.smaPctError !== null ? `${day.smaPctError}%` : 'N/A (y=0)'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="mono-num" style={{ fontSize: '0.825rem' }}>
                        {day.wmaPctError !== null ? `${day.wmaPctError}%` : 'N/A (y=0)'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {wmaCloser ? (
                        <span className="badge badge-emerald">Model B</span>
                      ) : smaCloser ? (
                        <span className="badge badge-rose">Model A</span>
                      ) : (
                        <span className="badge badge-primary">Tie</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-surface-elevated)', fontWeight: 800 }}>
                <td colSpan={5}>
                  <strong>SUMMARY ERROR METRICS (OVER 7 TEST DAYS)</strong>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="mono-num" style={{ color: 'var(--accent-rose)' }}>
                    MAE: ₹{smaMae}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="mono-num" style={{ color: 'var(--accent-emerald)' }}>
                    MAE: ₹{wmaMae}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="mono-num">MAPE: {smaMape}%</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="mono-num">MAPE: {wmaMape}%</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="badge badge-emerald">
                    {bestModel === 'WMA' ? 'Model B Won' : bestModel === 'SMA' ? 'Model A Won' : 'Tie'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
