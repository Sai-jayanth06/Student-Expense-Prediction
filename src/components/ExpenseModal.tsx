import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '../types';
import { CATEGORY_COLORS, toDateString } from '../utils/mathEngine';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  initialExpense?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialExpense,
}) => {
  const [date, setDate] = useState(toDateString(new Date()));
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialExpense) {
      setDate(initialExpense.date);
      setCategory(initialExpense.category);
      setAmount(initialExpense.amount.toString());
      setDescription(initialExpense.description);
    } else {
      setDate(toDateString(new Date()));
      setCategory('Food');
      setAmount('');
      setDescription('');
    }
    setError('');
  }, [initialExpense, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!date) {
      setError('Please select a valid date.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a positive numeric expense amount.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a short description for context.');
      return;
    }

    onSave({
      date,
      category,
      amount: Number(parsedAmount.toFixed(2)),
      description: description.trim(),
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="card-title">
            {initialExpense ? 'Edit Expense Record' : 'Record New Expense'}
          </h3>
          <button
            className="btn btn-outline btn-icon btn-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && (
              <div className="alert-banner danger" style={{ margin: 0, padding: '0.6rem 0.85rem' }}>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Expense Date
              </label>
              <input
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Category
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.5rem' }}>
                {EXPENSE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  const color = CATEGORY_COLORS[cat];
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      style={{
                        padding: '0.4rem 0.2rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: isSelected ? 700 : 500,
                        border: isSelected ? `2px solid ${color}` : '1px solid var(--border-subtle)',
                        background: isSelected ? `${color}20` : 'var(--bg-surface-elevated)',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Amount (₹ INR)
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                >
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="e.g. 120"
                  className="input"
                  style={{ paddingLeft: '1.75rem', fontFamily: 'var(--font-mono)' }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Description
              </label>
              <input
                type="text"
                placeholder="e.g. Canteen lunch thali, Project sensors kit, Metro reload"
                className="input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialExpense ? <Check size={16} /> : <Plus size={16} />}
              <span>{initialExpense ? 'Update Expense' : 'Add Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
