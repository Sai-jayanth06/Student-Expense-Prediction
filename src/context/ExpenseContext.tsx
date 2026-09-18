import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Expense,
  ExpenseCategory,
  DailyAggregate,
  CategoryStatistic,
  AnalysisSummary,
  PredictionResult,
  ExperimentResult,
  BudgetSimulation,
} from '../types';
import { generateSampleExpenses } from '../data/sampleDataset';
import {
  getDailyAggregates,
  getCategoryStatistics,
  computeAnalysisSummary,
  calculatePredictions,
  runHoldoutExperiment,
  simulateStudentBudget,
} from '../utils/mathEngine';
import { downloadExpensesCSV, parseExpensesCSV } from '../utils/csvUtils';

const STORAGE_KEY_EXPENSES = 'student_expense_dataset_v1';
const STORAGE_KEY_ALLOWANCE = 'student_expense_allowance_v1';
const STORAGE_KEY_BALANCE = 'student_expense_balance_v1';
const STORAGE_KEY_THEME = 'student_expense_theme_v1';
const STORAGE_KEY_PRED_WINDOW = 'student_expense_pred_window_v1';

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ExpenseCategory | 'All';
  setSelectedCategory: (cat: ExpenseCategory | 'All') => void;
  dateFilterStart: string;
  setDateFilterStart: (d: string) => void;
  dateFilterEnd: string;
  setDateFilterEnd: (d: string) => void;
  predictionWindow: 7 | 14 | 30;
  setPredictionWindow: (w: 7 | 14 | 30) => void;
  budgetAllowance: number;
  setBudgetAllowance: (amount: number) => void;
  currentBalance: number;
  setCurrentBalance: (amount: number) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  presentationMode: boolean;
  setPresentationMode: (mode: boolean) => void;

  // Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updated: Partial<Omit<Expense, 'id' | 'createdAt'>>) => void;
  deleteExpense: (id: string) => void;
  clearDataset: () => void;
  loadSampleDataset: () => void;
  exportCSV: () => void;
  importCSV: (csvText: string) => { success: boolean; count: number; errors: string[] };

  // Computed Research Analytics
  dailyAggregates: DailyAggregate[];
  categoryStats: CategoryStatistic[];
  analysisSummary: AnalysisSummary;
  predictionResult: PredictionResult;
  experimentResult: ExperimentResult;
  budgetSimulation: BudgetSimulation;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPENSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    // Default: initialize with realistic research dataset
    return generateSampleExpenses();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All'>('All');
  const [dateFilterStart, setDateFilterStart] = useState('');
  const [dateFilterEnd, setDateFilterEnd] = useState('');
  const [predictionWindow, setPredictionWindow] = useState<7 | 14 | 30>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRED_WINDOW);
      if (saved === '7' || saved === '14' || saved === '30') return parseInt(saved) as 7 | 14 | 30;
    } catch {
      // fallback
    }
    return 14;
  });

  const [budgetAllowance, setBudgetAllowanceState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALLOWANCE);
      if (saved) return Number(saved);
    } catch {
      // fallback
    }
    return 7500; // Realistic Indian student monthly allowance in INR
  });

  const [currentBalance, setCurrentBalanceState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BALANCE);
      if (saved) return Number(saved);
    } catch {
      // fallback
    }
    return 2400; // Realistic current wallet balance
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // Sync expenses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [expenses]);

  // Sync settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ALLOWANCE, budgetAllowance.toString());
  }, [budgetAllowance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BALANCE, currentBalance.toString());
  }, [currentBalance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRED_WINDOW, predictionWindow.toString());
  }, [predictionWindow]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setBudgetAllowance = (amount: number) => {
    setBudgetAllowanceState(Math.max(0, amount));
  };

  const setCurrentBalance = (amount: number) => {
    setCurrentBalanceState(Math.max(0, amount));
  };

  // CRUD actions
  const addExpense = (newExp: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...newExp,
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    };
    setExpenses((prev) => [expense, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const clearDataset = () => {
    setExpenses([]);
  };

  const loadSampleDataset = () => {
    setLoading(true);
    const sample = generateSampleExpenses();
    setExpenses(sample);
    setSearchQuery('');
    setSelectedCategory('All');
    setDateFilterStart('');
    setDateFilterEnd('');
    setTimeout(() => setLoading(false), 200);
  };

  const exportCSV = () => {
    downloadExpensesCSV(expenses);
  };

  const importCSV = (csvText: string) => {
    const { expenses: imported, errors } = parseExpensesCSV(csvText);
    if (errors.length > 0 && imported.length === 0) {
      return { success: false, count: 0, errors };
    }
    setExpenses((prev) => [...imported, ...prev]);
    return { success: true, count: imported.length, errors };
  };

  // Filtered dataset for Table
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchAmount = item.amount.toString().includes(q);
          const matchDate = item.date.includes(q);
          if (!matchDesc && !matchCat && !matchAmount && !matchDate) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Date range filter
        if (dateFilterStart && item.date < dateFilterStart) {
          return false;
        }
        if (dateFilterEnd && item.date > dateFilterEnd) {
          return false;
        }

        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  }, [expenses, searchQuery, selectedCategory, dateFilterStart, dateFilterEnd]);

  // Precomputed research modules
  const dailyAggregates = useMemo(() => getDailyAggregates(expenses), [expenses]);
  const categoryStats = useMemo(() => getCategoryStatistics(expenses), [expenses]);
  const analysisSummary = useMemo(() => computeAnalysisSummary(expenses), [expenses]);
  const predictionResult = useMemo(
    () => calculatePredictions(expenses, predictionWindow),
    [expenses, predictionWindow]
  );
  const experimentResult = useMemo(() => runHoldoutExperiment(expenses), [expenses]);
  const budgetSimulation = useMemo(
    () => simulateStudentBudget(expenses, budgetAllowance, currentBalance, 'WMA'),
    [expenses, budgetAllowance, currentBalance]
  );

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filteredExpenses,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        dateFilterStart,
        setDateFilterStart,
        dateFilterEnd,
        setDateFilterEnd,
        predictionWindow,
        setPredictionWindow,
        budgetAllowance,
        setBudgetAllowance,
        currentBalance,
        setCurrentBalance,
        theme,
        toggleTheme,
        presentationMode,
        setPresentationMode,
        addExpense,
        updateExpense,
        deleteExpense,
        clearDataset,
        loadSampleDataset,
        exportCSV,
        importCSV,
        dailyAggregates,
        categoryStats,
        analysisSummary,
        predictionResult,
        experimentResult,
        budgetSimulation,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
