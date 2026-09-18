import React, { useState } from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import { Navbar } from './components/Navbar';
import { OverviewTab } from './components/OverviewTab';
import { DatasetTab } from './components/DatasetTab';
import { AnalysisTab } from './components/AnalysisTab';
import { PredictionTab } from './components/PredictionTab';
import { ExperimentTab } from './components/ExperimentTab';
import { ModelComparisonTab } from './components/ModelComparisonTab';
import { BudgetTab } from './components/BudgetTab';
import { PrivacyTab } from './components/PrivacyTab';
import { ActiveTab } from './types';
import { ShieldCheck, Sparkles, LineChart } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="app-wrapper">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
        {activeTab === 'dataset' && <DatasetTab />}
        {activeTab === 'analysis' && <AnalysisTab />}
        {activeTab === 'prediction' && <PredictionTab />}
        {activeTab === 'experiment' && <ExperimentTab />}
        {activeTab === 'models' && <ModelComparisonTab />}
        {activeTab === 'budget' && <BudgetTab />}
        {activeTab === 'privacy' && <PrivacyTab />}
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
          padding: '1.5rem 1.25rem',
          color: 'var(--text-secondary)',
          fontSize: '0.825rem',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              <LineChart size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>AI-Based Student Expense Prediction & Spending Behaviour Analysis</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.78rem' }}>
              Research Prototype for Engineering Paper Presentation &bull; Offline Client-Side Time-Series Engine
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-emerald)' }}>
              <ShieldCheck size={14} />
              <span>HTML5 Local Storage</span>
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>&bull;</span>
            <span style={{ color: 'var(--text-muted)' }}>
              "Predictions are statistical estimates and not financial advice."
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}
