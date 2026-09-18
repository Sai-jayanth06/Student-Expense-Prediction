import React from 'react';
import {
  LineChart,
  Database,
  PieChart,
  TrendingUp,
  FlaskConical,
  GitCompare,
  Wallet,
  ShieldCheck,
  Sun,
  Moon,
  Sparkles,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { ActiveTab } from '../types';
import { formatCurrency } from '../utils/mathEngine';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    expenses,
    theme,
    toggleTheme,
    presentationMode,
    setPresentationMode,
    loadSampleDataset,
    analysisSummary,
  } = useExpense();

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Overview', icon: <BookOpen size={16} /> },
    { id: 'dataset', label: 'Dataset', icon: <Database size={16} /> },
    { id: 'analysis', label: 'Analysis', icon: <PieChart size={16} /> },
    { id: 'prediction', label: 'Prediction Engine', icon: <TrendingUp size={16} /> },
    { id: 'experiment', label: 'Experiment', icon: <FlaskConical size={16} /> },
    { id: 'models', label: 'Model Comparison', icon: <GitCompare size={16} /> },
    { id: 'budget', label: 'Budget Simulation', icon: <Wallet size={16} /> },
    { id: 'privacy', label: 'Privacy & Notes', icon: <ShieldCheck size={16} /> },
  ];

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface-glass)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {presentationMode && (
        <div className="presentation-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} />
            <span>
              <strong>ENGINEERING RESEARCH PRESENTATION MODE</strong> &bull; Title: AI-Based Student Expense Prediction and Spending Behaviour Analysis
            </span>
          </div>
          <button
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '0.2rem 0.6rem' }}
            onClick={() => setPresentationMode(false)}
          >
            Exit Presentation View
          </button>
        </div>
      )}

      {/* Top Header Row */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <LineChart size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                AI-Based Student Expense Prediction
              </h1>
              <span className="badge badge-primary">RESEARCH PROTOTYPE</span>
              <span className="badge badge-emerald">100% OFFLINE</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Spending Behaviour Analysis &bull; Empirical Time-Series Backtesting (SMA vs WMA)
            </p>
          </div>
        </div>

        {/* Action badges and Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.35rem 0.85rem',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.825rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Records: </span>
              <strong className="mono-num">{expenses.length}</strong>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'var(--border-subtle)' }} />
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Total Spend: </span>
              <strong className="mono-num" style={{ color: 'var(--accent-cyan)' }}>
                {formatCurrency(analysisSummary.totalSpending)}
              </strong>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={loadSampleDataset}
            title="Reload 50+ realistic academic expense records"
          >
            <RefreshCw size={14} />
            <span>Load Dataset</span>
          </button>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPresentationMode(!presentationMode)}
            title="Toggle presentation banner"
          >
            <Sparkles size={14} style={{ color: 'var(--accent-amber)' }} />
            <span>{presentationMode ? 'Standard' : 'Present'}</span>
          </button>

          <button
            className="btn btn-outline btn-icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1.25rem',
          display: 'flex',
          gap: '0.35rem',
          overflowX: 'auto',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 0.95rem',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ color: isActive ? 'var(--accent-primary)' : 'inherit' }}>
                {item.icon}
              </span>
              {item.label}
              {item.id === 'experiment' && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.35rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-rose)',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  KEY
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
