import React from 'react';
import {
  BookOpen,
  TrendingUp,
  FlaskConical,
  Database,
  ArrowRight,
  Sparkles,
  GitCompare,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/mathEngine';
import { ActiveTab } from '../types';

interface OverviewTabProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ setActiveTab }) => {
  const {
    expenses,
    analysisSummary,
    predictionResult,
    experimentResult,
    predictionWindow,
  } = useExpense();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Research Title Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))',
          borderColor: 'rgba(99, 102, 241, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ maxWidth: '850px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">ENGINEERING PAPER PROJECT</span>
              <span className="badge badge-emerald">PEER-REVIEW DEMONSTRATION</span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              AI-Based Student Expense Prediction and Spending Behaviour Analysis
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              A specialized research prototype investigating stochastic micro-expenditure patterns among college students.
              Unlike commercial budgeting apps, this system implements rigorous time-series forecasting (Simple Moving Average vs. Weighted Moving Average)
              coupled with an empirical 7-day holdout backtesting experiment to quantify predictive accuracy (MAE, MAPE, and WAPE).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('experiment')}>
              <FlaskConical size={16} />
              <span>View Experiment</span>
              <ArrowRight size={14} />
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('dataset')}>
              <Database size={16} />
              <span>Inspect Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Research Dashboard KPI Cards */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Key Research Metrics & Model Output
        </h3>
        <div className="grid-4">
          <div className="stat-card cyan">
            <div className="stat-label">
              <Database size={14} />
              <span>Dataset Size</span>
            </div>
            <div className="stat-value">{expenses.length}</div>
            <div className="stat-subtext">
              {analysisSummary.spendingDaysCount} active spending days across {analysisSummary.totalCalendarDays} days
            </div>
          </div>

          <div className="stat-card emerald">
            <div className="stat-label">
              <TrendingUp size={14} />
              <span>Avg Daily Spending</span>
            </div>
            <div className="stat-value">{formatCurrency(analysisSummary.avgDailySpending)}</div>
            <div className="stat-subtext">
              {formatCurrency(analysisSummary.avgWeeklySpending)}/week equivalent
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-label">
              <GitCompare size={14} />
              <span>Prediction Window</span>
            </div>
            <div className="stat-value">{predictionWindow} Days</div>
            <div className="stat-subtext">
              Sliding lookback horizon (k={predictionWindow})
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              <Sparkles size={14} />
              <span>Predicted 7-Day Spend</span>
            </div>
            <div className="stat-value">{formatCurrency(predictionResult.predictedNext7DaysWMA)}</div>
            <div className="stat-subtext">
              Based on Weighted Moving Average
            </div>
          </div>

          <div className="stat-card rose">
            <div className="stat-label">
              <FlaskConical size={14} />
              <span>Holdout MAE (SMA)</span>
            </div>
            <div className="stat-value">
              {experimentResult.insufficientData ? 'N/A' : `₹${experimentResult.smaMae}`}
            </div>
            <div className="stat-subtext">
              Mean Absolute Error for Model A
            </div>
          </div>

          <div className="stat-card amber">
            <div className="stat-label">
              <FlaskConical size={14} />
              <span>Holdout MAE (WMA)</span>
            </div>
            <div className="stat-value">
              {experimentResult.insufficientData ? 'N/A' : `₹${experimentResult.wmaMae}`}
            </div>
            <div className="stat-subtext">
              Mean Absolute Error for Model B
            </div>
          </div>

          <div className="stat-card cyan">
            <div className="stat-label">
              <BookOpen size={14} />
              <span>Holdout MAPE</span>
            </div>
            <div className="stat-value">
              {experimentResult.insufficientData
                ? 'N/A'
                : `${experimentResult.bestModel === 'WMA' ? experimentResult.wmaMape : experimentResult.smaMape}%`}
            </div>
            <div className="stat-subtext">
              Mean Absolute Percentage Error
            </div>
          </div>

          <div className="stat-card emerald">
            <div className="stat-label">
              <Award size={14} />
              <span>Empirical Best Model</span>
            </div>
            <div className="stat-value" style={{ fontSize: '1.35rem' }}>
              {experimentResult.insufficientData
                ? 'Pending'
                : experimentResult.bestModel === 'WMA'
                ? 'Model B (WMA)'
                : experimentResult.bestModel === 'SMA'
                ? 'Model A (SMA)'
                : 'Balanced (Tie)'}
            </div>
            <div className="stat-subtext">
              {experimentResult.bestModel === 'WMA'
                ? 'WMA achieved lower MAE'
                : experimentResult.bestModel === 'SMA'
                ? 'SMA achieved lower MAE'
                : 'Identical error'}
            </div>
          </div>
        </div>
      </div>

      {/* Research Questions & Hypotheses */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <BookOpen size={18} style={{ color: 'var(--accent-primary)' }} />
                <span>Core Research Questions</span>
              </h3>
              <p className="card-subtitle">Foundations addressed by this prototype</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <strong>RQ1: Stochastic vs. Patterned Behavior</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Can student spending (characterized by micro-transactions like canteen meals and sudden lump-sum expenditures like project components) be approximated via moving average baselines?
              </p>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <strong>RQ2: Recency Weighting Hypothesis</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Does assigning linearly increasing weights ($w_i = i$) improve forecast precision over equal-weight averages when students enter exam, printing, or project submission periods?
              </p>
            </div>

            <div style={{ padding: '0.75rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <strong>RQ3: Predictive Liquidity Simulation</strong>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                How effectively does integrating daily burn-rate forecasting with student allowance provide timely runway warnings prior to end-of-month budget depletion?
              </p>
            </div>
          </div>
        </div>

        {/* Research Pipeline Architecture */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <TrendingUp size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>End-to-End System Pipeline</span>
              </h3>
              <p className="card-subtitle">Methodological workflow implemented in code</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                step: '01',
                title: 'Data Ingestion & Cleaning',
                desc: 'Expense logging across 8 academic categories with continuous date-gap interpolation (0-spend days included).',
              },
              {
                step: '02',
                title: 'Rolling Window Segmentation',
                desc: 'Extraction of historical windows (k = 7, 14, or 30 days) to reflect varying stages of the academic semester.',
              },
              {
                step: '03',
                title: 'Dual-Model Forecasting',
                desc: 'Computation of Model A (SMA) and Model B (WMA) with transparent intermediate weights and products.',
              },
              {
                step: '04',
                title: 'Holdout Backtesting Validation',
                desc: 'Masking the last 7 calendar days to compute ground truth errors: MAE, MAPE, and WAPE.',
              },
              {
                step: '05',
                title: 'Budget Runway Simulation',
                desc: 'Real-time burn-rate projection against monthly allowance to estimate depletion days.',
              },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                  padding: '0.5rem',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    color: 'var(--accent-primary)',
                    fontSize: '0.85rem',
                  }}
                >
                  {item.step}
                </span>
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>{item.title}</strong>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Research Disclaimer Banner */}
      <div className="alert-banner info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertTriangle size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>RESEARCH DISCLAIMER:</strong> This prototype demonstrates student spending prediction using historical behaviour and empirical time-series models. Predictions are statistical estimates and do not constitute professional financial advice. All data resides 100% locally in your browser storage.
        </div>
      </div>
    </div>
  );
};
