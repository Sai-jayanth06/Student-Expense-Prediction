import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  Edit2,
  RefreshCw,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '../types';
import { CATEGORY_COLORS, formatCurrency, formatDisplayDate } from '../utils/mathEngine';
import { ExpenseModal } from './ExpenseModal';

export const DatasetTab: React.FC = () => {
  const {
    filteredExpenses,
    expenses,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    dateFilterStart,
    setDateFilterStart,
    dateFilterEnd,
    setDateFilterEnd,
    addExpense,
    updateExpense,
    deleteExpense,
    clearDataset,
    loadSampleDataset,
    exportCSV,
    importCSV,
  } = useExpense();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [importStatus, setImportStatus] = useState<{ msg: string; isError: boolean } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleSaveExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      deleteExpense(id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const result = importCSV(text);
        if (result.success) {
          setImportStatus({
            msg: `Successfully imported ${result.count} expense records!`,
            isError: false,
          });
        } else {
          setImportStatus({
            msg: `Import failed: ${result.errors.join(', ')}`,
            isError: true,
          });
        }
        setTimeout(() => setImportStatus(null), 5000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setDateFilterStart('');
    setDateFilterEnd('');
  };

  const hasActiveFilters =
    searchQuery !== '' || selectedCategory !== 'All' || dateFilterStart !== '' || dateFilterEnd !== '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Action Toolbar */}
      <div
        className="card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Student Expense Dataset</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Record, import, filter, and curate empirical micro-transactions for model training and analysis.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Expense</span>
          </button>

          <button className="btn btn-secondary" onClick={loadSampleDataset} title="Load 50+ realistic student records">
            <RefreshCw size={15} />
            <span>Load Research Dataset</span>
          </button>

          <button className="btn btn-secondary" onClick={exportCSV} title="Export current dataset as CSV">
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            title="Import expenses from CSV"
          >
            <Upload size={15} />
            <span>Import CSV</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,text/csv"
            style={{ display: 'none' }}
          />

          <button
            className="btn btn-danger"
            onClick={() => setShowClearConfirm(true)}
            title="Clear all expense records"
          >
            <Trash2 size={15} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Banner */}
      {showClearConfirm && (
        <div className="alert-banner warning" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>Are you sure you want to clear the entire dataset? All {expenses.length} records will be wiped from local storage.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                clearDataset();
                setShowClearConfirm(false);
              }}
            >
              Confirm Clear
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowClearConfirm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Import status notification */}
      {importStatus && (
        <div className={`alert-banner ${importStatus.isError ? 'danger' : 'success'}`}>
          <span>{importStatus.msg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem',
            alignItems: 'center',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search description, category..."
              className="input"
              style={{ paddingLeft: '2.2rem' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | 'All')}
            >
              <option value="All">All Categories ({expenses.length})</option>
              {EXPENSE_CATEGORIES.map((cat) => {
                const count = expenses.filter((e) => e.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Start Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              type="date"
              className="input"
              title="Start Date"
              value={dateFilterStart}
              onChange={(e) => setDateFilterStart(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
            <input
              type="date"
              className="input"
              title="End Date"
              value={dateFilterEnd}
              onChange={(e) => setDateFilterEnd(e.target.value)}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button className="btn btn-outline btn-sm" onClick={clearAllFilters}>
              Clear Filters
            </button>
          )}
        </div>

        {/* Counters summary */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            Showing <strong className="mono-num" style={{ color: 'var(--text-primary)' }}>{filteredExpenses.length}</strong> of{' '}
            <strong className="mono-num">{expenses.length}</strong> total records
          </div>
          <div>
            Filtered Total Spending:{' '}
            <strong className="mono-num" style={{ color: 'var(--accent-emerald)', fontSize: '1rem' }}>
              {formatCurrency(totalFilteredAmount)}
            </strong>
          </div>
        </div>
      </div>

      {/* Dataset Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Date</th>
              <th style={{ width: '130px' }}>Category</th>
              <th style={{ width: '120px', textAlign: 'right' }}>Amount</th>
              <th>Description</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <FileSpreadsheet size={40} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <strong>No expense records found</strong>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: '0.25rem' }}>
                        {expenses.length === 0
                          ? 'The dataset is currently empty. Click below to load realistic sample research data.'
                          : 'No expenses match the selected filters.'}
                      </p>
                    </div>
                    {expenses.length === 0 ? (
                      <button className="btn btn-primary btn-sm" onClick={loadSampleDataset}>
                        <RefreshCw size={14} />
                        <span>Load Research Dataset</span>
                      </button>
                    ) : (
                      <button className="btn btn-secondary btn-sm" onClick={clearAllFilters}>
                        Reset Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => {
                const color = CATEGORY_COLORS[expense.category];
                return (
                  <tr key={expense.id}>
                    <td>
                      <span className="mono-num" style={{ fontSize: '0.825rem' }}>
                        {expense.date}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {formatDisplayDate(expense.date)}
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">
                        <span className="category-dot" style={{ backgroundColor: color }} />
                        {expense.category}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="mono-num" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatCurrency(expense.amount)}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)' }}>{expense.description}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          className="btn btn-outline btn-icon btn-sm"
                          onClick={() => handleOpenEdit(expense)}
                          title="Edit expense"
                          aria-label="Edit expense"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-danger btn-icon btn-sm"
                          onClick={() => handleDeleteExpense(expense.id)}
                          title="Delete expense"
                          aria-label="Delete expense"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveExpense}
        initialExpense={editingExpense}
      />
    </div>
  );
};
