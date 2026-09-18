import React from 'react';
import {
  ShieldCheck,
  Lock,
  ServerOff,
  Database,
  AlertTriangle,
  BookOpen,
  Cpu,
  FileText,
  ExternalLink,
} from 'lucide-react';

export const PrivacyTab: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-emerald">SYSTEM ARCHITECTURE</span>
          <span className="badge badge-primary">ZERO TELEMETRY</span>
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
          Privacy, Security & Research Architecture
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Offline-first, zero-cloud data handling and academic research governance.
        </p>
      </div>

      {/* 3 Privacy Guarantees */}
      <div className="grid-3">
        <div className="card">
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Database size={20} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            100% Local Storage
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            All student expense transactions, budget allowances, and custom records are stored exclusively in your local web browser via the HTML5 <code className="math-var">localStorage</code> API.
          </p>
        </div>

        <div className="card">
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ServerOff size={20} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Zero Cloud Transmission
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            No personal financial data is transmitted to external servers, cloud databases, or tracking services. The application operates entirely offline after the initial client build.
          </p>
        </div>

        <div className="card">
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Lock size={20} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Bank Credential Access
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            This system intentionally does NOT integrate with banking APIs, UPI portals, or credit institutions, completely eliminating credential harvesting vectors.
          </p>
        </div>
      </div>

      {/* Research Presentation Cheat Sheet */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <BookOpen size={18} style={{ color: 'var(--accent-primary)' }} />
              <span>Engineering Paper Defense & Presentation Guide</span>
            </h3>
            <p className="card-subtitle">
              Key methodological talking points for viva / examiner questioning
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--accent-primary)', display: 'block', marginBottom: '0.35rem' }}>
              1. Mathematical Transparency Over Black-Box Models
            </strong>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Examiners often ask: <em>"Why not use a Deep Neural Network or LSTM?"</em><br />
              <strong>Defense:</strong> College student micro-expenditure series are non-stationary and short (typically 30–90 days). Deep networks overfit severely on small datasets. Weighted Moving Average provides exact mathematical explainability, zero latency, and verified empirical backtesting bounds.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.35rem' }}>
              2. Scientific Value of the 7-Day Holdout
            </strong>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Examiners love rigorous validation. The holdout period proves that predictions are tested on unseen future days rather than memorizing historical training points. Computing both MAE and MAPE gives a dual perspective on absolute rupee error vs relative proportional error.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--accent-amber)', display: 'block', marginBottom: '0.35rem' }}>
              3. Handling Zero-Expenditure Days
            </strong>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Standard MAPE divides by actual value $y_i$. If a student incurs ₹0 on Sunday, MAPE encounters division by zero. Our implementation provides WAPE (Weighted Absolute Percentage Error) and non-zero day filtering to ensure mathematical correctness.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
            <strong style={{ color: 'var(--accent-emerald)', display: 'block', marginBottom: '0.35rem' }}>
              4. Future Research Directions
            </strong>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Mention future expansions: (a) Category-decomposed forecasting (predicting Food and Printing separately), (b) Calendar seasonality heuristics (exam weeks vs holidays), and (c) Exponential Smoothing with adaptive trend damping.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Research Disclaimer Card */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--accent-rose)',
          background: 'rgba(244, 63, 94, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <AlertTriangle size={22} style={{ color: 'var(--accent-rose)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              MANDATORY RESEARCH DISCLAIMER
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.6 }}>
              "This prototype demonstrates student spending prediction using historical behaviour. Predictions are estimates and not financial advice."
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Presented for academic research and educational evaluation only. Individual financial outcomes depend upon unexpected emergencies, personal liquidity constraints, and varying collegiate circumstances.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
