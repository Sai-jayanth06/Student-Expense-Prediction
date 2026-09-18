import React from 'react';
import {
  GitCompare,
  Award,
  CheckCircle2,
  Sliders,
  Sparkles,
  BookOpen,
  Info,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';

export const ModelComparisonTab: React.FC = () => {
  const { experimentResult, expenses } = useExpense();

  if (expenses.length === 0 || experimentResult.insufficientData) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <GitCompare size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Model Comparison Unavailable</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Please load or record sufficient expense data in the Dataset tab to evaluate and compare models.
        </p>
      </div>
    );
  }

  const {
    smaMae,
    smaMape,
    smaWape,
    wmaMae,
    wmaMape,
    wmaWape,
    bestModel,
    verdictRationale,
  } = experimentResult;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-primary">ACADEMIC BENCHMARK</span>
          <span className="badge badge-emerald">EMPIRICAL COMPARISON</span>
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
          Forecasting Model Architecture Comparison
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Systematic theoretical and empirical evaluation of Simple Moving Average (SMA) versus Weighted Moving Average (WMA).
        </p>
      </div>

      {/* Primary Model Comparison Table (Required by Section 6 of prompt) */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <GitCompare size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Model Performance Evaluation Matrix (Holdout Period)</span>
            </h3>
            <p className="card-subtitle">
              Benchmarking error scores on identical 7-day unseen test days
            </p>
          </div>
          <span className="badge badge-primary">Empirical Test Ground Truth</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Approach</th>
                <th>Mathematical Formula</th>
                <th>Weighting Scheme</th>
                <th style={{ textAlign: 'right' }}>MAE (₹/day)</th>
                <th style={{ textAlign: 'right' }}>MAPE (%)</th>
                <th style={{ textAlign: 'right' }}>WAPE (%)</th>
                <th style={{ textAlign: 'center' }}>Empirical Outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr style={bestModel === 'SMA' ? { background: 'rgba(16, 185, 129, 0.08)' } : {}}>
                <td>
                  <strong>Model A: Simple Moving Average</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SMA-k Baseline</div>
                </td>
                <td>
                  <code className="math-var" style={{ color: 'var(--accent-rose)' }}>
                    &sum;x_i / k
                  </code>
                </td>
                <td>
                  <span className="badge badge-primary">Equal Weight (1/k)</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <strong className="mono-num" style={{ fontSize: '1.1rem', color: bestModel === 'SMA' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                    ₹{smaMae}
                  </strong>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="mono-num">{smaMape}%</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="mono-num" style={{ color: 'var(--text-muted)' }}>{smaWape}%</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {bestModel === 'SMA' ? (
                    <span className="badge badge-emerald">Lowest Error Winner</span>
                  ) : (
                    <span className="badge badge-rose">Higher Error</span>
                  )}
                </td>
              </tr>

              <tr style={bestModel === 'WMA' ? { background: 'rgba(16, 185, 129, 0.08)' } : {}}>
                <td>
                  <strong>Model B: Weighted Moving Average</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>WMA-k Linear Recency</div>
                </td>
                <td>
                  <code className="math-var" style={{ color: 'var(--accent-cyan)' }}>
                    &sum;(i &times; x_i) / &sum;i
                  </code>
                </td>
                <td>
                  <span className="badge badge-emerald">Linear Recency (w_i = i)</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <strong className="mono-num" style={{ fontSize: '1.1rem', color: bestModel === 'WMA' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                    ₹{wmaMae}
                  </strong>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="mono-num">{wmaMape}%</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="mono-num" style={{ color: 'var(--text-muted)' }}>{wmaWape}%</span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {bestModel === 'WMA' ? (
                    <span className="badge badge-emerald">Lowest Error Winner</span>
                  ) : (
                    <span className="badge badge-rose">Higher Error</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', fontSize: '0.825rem' }}>
          <strong>Highlight: </strong>
          <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
            {bestModel === 'WMA'
              ? 'Model B (Weighted Moving Average) produced lower error for the current recorded dataset.'
              : bestModel === 'SMA'
              ? 'Model A (Simple Moving Average) produced lower error for the current recorded dataset.'
              : 'Both models produced equal error scores.'}
          </span>
        </div>
      </div>

      {/* Rationale & Scientific Defense */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
        <h3 className="card-title" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
          <BookOpen size={17} style={{ color: 'var(--accent-cyan)' }} />
          <span>Paper Presentation Talking Points & Scientific Interpretation</span>
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {verdictRationale}
        </p>
        <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong>Engineering Defense Note:</strong> In peer review, always state:
          <em> "We do not claim that Weighted Moving Average is universally superior to Simple Moving Average for all financial datasets. Its performance depends upon autocorrelation structure and recent volatility in the student's micro-expenditure series."</em>
        </div>
      </div>

      {/* Qualitative Comparison Cards */}
      <div className="grid-2">
        <div className="card">
          <h3 className="card-title" style={{ fontSize: '1rem', color: 'var(--accent-rose)' }}>
            Properties of Simple Moving Average (SMA)
          </h3>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li><strong>Equal Weights:</strong> Every day in the lookback window exerts identical influence on the forecast.</li>
            <li><strong>Noise Smoothing:</strong> Highly effective at smoothing out isolated, random one-off expenditures (such as a single textbook purchase).</li>
            <li><strong>Lag / Latency:</strong> Slow to react when a student enters a persistent high-burn phase (e.g. daily printing during project submission week).</li>
            <li><strong>Complexity:</strong> Minimal $O(k)$ operations; perfectly suited for ultra-lightweight client-side processing.</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title" style={{ fontSize: '1rem', color: 'var(--accent-emerald)' }}>
            Properties of Weighted Moving Average (WMA)
          </h3>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <li><strong>Linear Weighting:</strong> Day $i$ receives weight $i$, making the most recent day $k$ times more influential than the oldest.</li>
            <li><strong>High Agility:</strong> Instantly captures momentum shifts when a student's daily expenses ramp up.</li>
            <li><strong>Vulnerability to Outliers:</strong> If yesterday had an extreme abnormal spike, WMA will overestimate near-term burn until that day ages out.</li>
            <li><strong>College Student Suitability:</strong> Demonstrates superior predictive accuracy whenever recent academic activities follow multi-day patterns.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
