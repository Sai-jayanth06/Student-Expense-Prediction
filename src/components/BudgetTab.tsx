import React, { useState, useMemo } from 'react';
import {
  Wallet,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Clock,
  Sliders,
  DollarSign,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, formatDisplayDate } from '../utils/mathEngine';

export const BudgetTab: React.FC = () => {
  const {
    budgetAllowance,
    setBudgetAllowance,
    currentBalance,
    setCurrentBalance,
    budgetSimulation,
    expenses,
    predictionResult,
  } = useExpense();

  const [selectedModel, setSelectedModel] = useState<'WMA' | 'SMA'>('WMA');
  const [savingsReductionPct, setSavingsReductionPct] = useState<number>(0);

  // Active burn rate based on model selection
  const baseBurnRate =
    selectedModel === 'WMA' ? predictionResult.weightedMovingAverage : predictionResult.simpleMovingAverage;

  // Scenario simulated burn rate
  const simulatedBurnRate = useMemo(() => {
    return Math.max(1, baseBurnRate * (1 - savingsReductionPct / 100));
  }, [baseBurnRate, savingsReductionPct]);

  const simulatedRunwayDays = useMemo(() => {
    return Math.floor(currentBalance / simulatedBurnRate);
  }, [currentBalance, simulatedBurnRate]);

  const daysRemainingInMonth = budgetSimulation.daysRemainingInMonth;

  // Simulated projected spend this month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentMonthExpenses = expenses.filter((e) => {
    const [y, m] = e.date.split('-').map(Number);
    return y === year && m - 1 === month;
  });
  const monthToDateSpent = currentMonthExpenses.reduce((s, e) => s + e.amount, 0);

  const simulatedProjectedMonthSpend = monthToDateSpent + daysRemainingInMonth * simulatedBurnRate;
  const simulatedRemainingBalance = currentBalance - daysRemainingInMonth * simulatedBurnRate;
  const isDeficit = simulatedProjectedMonthSpend > budgetAllowance || simulatedRemainingBalance < 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span className="badge badge-primary">LIQUIDITY SIMULATION</span>
          <span className="badge badge-emerald">BURNOUT PREDICTION</span>
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
          Student Budget & Runway Simulation
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Projects end-of-month financial liquidity and estimates depletion timelines based on current daily spending velocity.
        </p>
      </div>

      {/* Warning/Status Alert Banner */}
      {isDeficit ? (
        <div className="alert-banner danger" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ fontSize: '0.95rem' }}>WARNING: PROJECTED BUDGET DEFICIT DETECTED</strong>
            <p style={{ marginTop: '0.25rem' }}>
              At your current daily burn rate of <strong>{formatCurrency(simulatedBurnRate, 1)}/day</strong>, your projected monthly expenditure (
              <strong>{formatCurrency(simulatedProjectedMonthSpend)}</strong>) exceeds your entered allowance of{' '}
              <strong>{formatCurrency(budgetAllowance)}</strong> by{' '}
              <strong>{formatCurrency(simulatedProjectedMonthSpend - budgetAllowance)}</strong>.
              {simulatedRunwayDays < daysRemainingInMonth && (
                <span>
                  {' '}Your balance will be exhausted in approximately <strong>{simulatedRunwayDays} days</strong>, prior to month-end!
                </span>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="alert-banner success" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle size={22} style={{ flexShrink: 0 }} />
          <div>
            <strong>SUSTAINABLE BUDGET TRAJECTORY</strong>
            <p style={{ marginTop: '0.25rem' }}>
              Projected monthly spending ({formatCurrency(simulatedProjectedMonthSpend)}) is within your monthly allowance ({formatCurrency(budgetAllowance)}).
              Estimated runway is {simulatedRunwayDays} days with a safe surplus of {formatCurrency(simulatedRemainingBalance)}.
            </p>
          </div>
        </div>
      )}

      {/* Input Parameters & Simulation Controls */}
      <div className="grid-2">
        {/* User Input Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Wallet size={18} style={{ color: 'var(--accent-primary)' }} />
                <span>Simulation Parameters</span>
              </h3>
              <p className="card-subtitle">Enter your financial constraints to simulate outcomes</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Monthly Allowance Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Monthly Allowance (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                className="input"
                value={budgetAllowance}
                onChange={(e) => setBudgetAllowance(parseFloat(e.target.value) || 0)}
              />
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem' }}>
                {[5000, 7500, 10000, 12000].map((preset) => (
                  <button
                    key={preset}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                    onClick={() => setBudgetAllowance(preset)}
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Balance Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Current Available Wallet / Bank Balance (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                className="input"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(parseFloat(e.target.value) || 0)}
              />
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem' }}>
                {[1000, 2000, 3000, 5000].map((preset) => (
                  <button
                    key={preset}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                    onClick={() => setCurrentBalance(preset)}
                  >
                    ₹{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Model Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Prediction Velocity Driver
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  className={`btn btn-sm ${selectedModel === 'WMA' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedModel('WMA')}
                >
                  Model B: WMA (₹{predictionResult.weightedMovingAverage.toFixed(0)}/day)
                </button>
                <button
                  className={`btn btn-sm ${selectedModel === 'SMA' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedModel('SMA')}
                >
                  Model A: SMA (₹{predictionResult.simpleMovingAverage.toFixed(0)}/day)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Simulation Output */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Clock size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Simulated Runway & Balances</span>
              </h3>
              <p className="card-subtitle">Calculated strictly from real dataset spending velocity</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                padding: '1.25rem',
                background: isDeficit ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                border: `1px solid ${isDeficit ? 'rgba(244,63,94,0.25)' : 'rgba(16,185,129,0.25)'}`,
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estimated Survival Runway
              </div>
              <div
                className="mono-num"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: isDeficit ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                }}
              >
                {simulatedRunwayDays}{' '}
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Days</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {daysRemainingInMonth} calendar days remaining in current month
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Predicted Daily Burn Rate:</span>
                <strong className="mono-num">{formatCurrency(simulatedBurnRate, 1)} / day</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Projected Total Month Spend:</span>
                <strong className="mono-num">{formatCurrency(simulatedProjectedMonthSpend)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Projected End-of-Month Balance:</span>
                <strong
                  className="mono-num"
                  style={{ color: simulatedRemainingBalance < 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}
                >
                  {formatCurrency(simulatedRemainingBalance)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive What-If Scenario Slider */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-surface-elevated))' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Sliders size={18} style={{ color: 'var(--accent-amber)' }} />
              <span>Interactive "What-If" Behavioral Intervention Simulator</span>
            </h3>
            <p className="card-subtitle">
              Simulate spending austerity: What happens to your runway if you reduce discretionary spending by {savingsReductionPct}%?
            </p>
          </div>
          <span className="badge badge-amber">{savingsReductionPct}% Expense Reduction</span>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={savingsReductionPct}
              onChange={(e) => setSavingsReductionPct(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
            />
            <span className="mono-num" style={{ fontWeight: 700, minWidth: '45px' }}>
              {savingsReductionPct}%
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1rem',
              padding: '0.85rem 1rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.85rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Simulated Daily Burn: </span>
              <strong className="mono-num" style={{ color: 'var(--accent-emerald)' }}>
                {formatCurrency(simulatedBurnRate, 1)}/day
              </strong>{' '}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                (-{formatCurrency(baseBurnRate - simulatedBurnRate, 1)}/day saved)
              </span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Extended Runway: </span>
              <strong className="mono-num" style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>
                {simulatedRunwayDays} Days
              </strong>{' '}
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
                (+{Math.max(0, simulatedRunwayDays - Math.floor(currentBalance / baseBurnRate))} extra days)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
