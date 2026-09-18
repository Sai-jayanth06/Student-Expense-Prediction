import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '../types';

/**
 * Converts expenses array into a properly escaped CSV string
 */
export function expensesToCSV(expenses: Expense[]): string {
  const headers = ['Date', 'Category', 'Amount', 'Description'];
  const rows = expenses.map((e) => [
    e.date,
    e.category,
    e.amount.toString(),
    `"${(e.description || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Triggers a browser download of the expenses as a CSV file
 */
export function downloadExpensesCSV(expenses: Expense[], filename?: string): void {
  const csv = expensesToCSV(expenses);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const defaultName = `student_expense_dataset_${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', filename || defaultName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses CSV text content into an array of validated Expense items.
 * Validates Category against EXPENSE_CATEGORIES and ensures positive amount and valid YYYY-MM-DD date.
 */
export function parseExpensesCSV(csvText: string): { expenses: Expense[]; errors: string[] } {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const errors: string[] = [];
  const expenses: Expense[] = [];

  if (lines.length < 2) {
    return { expenses: [], errors: ['CSV file is empty or missing data rows.'] };
  }

  // Parse header
  const headerLine = lines[0].toLowerCase();
  const headers = headerLine.split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));

  const dateIdx = headers.indexOf('date');
  const catIdx = headers.indexOf('category');
  const amountIdx = headers.indexOf('amount');
  const descIdx = headers.indexOf('description');

  if (dateIdx === -1 || catIdx === -1 || amountIdx === -1) {
    return {
      expenses: [],
      errors: ['Invalid CSV format. Required headers: Date, Category, Amount (optional: Description).'],
    };
  }

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Simple CSV row parser handling quoted strings
    const cells: string[] = [];
    let insideQuotes = false;
    let currentCell = '';

    for (let c = 0; c < rawLine.length; c++) {
      const char = rawLine[c];
      if (char === '"') {
        if (insideQuotes && rawLine[c + 1] === '"') {
          currentCell += '"';
          c++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        cells.push(currentCell.trim());
        currentCell = '';
      } else {
        currentCell += char;
      }
    }
    cells.push(currentCell.trim());

    if (cells.length < 3) {
      errors.push(`Row ${i + 1}: Incomplete data columns.`);
      continue;
    }

    const rawDate = cells[dateIdx]?.replace(/["']/g, '').trim();
    const rawCat = cells[catIdx]?.replace(/["']/g, '').trim();
    const rawAmount = cells[amountIdx]?.replace(/["']/g, '').trim();
    const rawDesc = descIdx !== -1 && cells[descIdx] ? cells[descIdx].replace(/^["']|["']$/g, '').trim() : '';

    // Validate Date (YYYY-MM-DD)
    const dateMatch = /^\d{4}-\d{2}-\d{2}$/.test(rawDate);
    if (!dateMatch) {
      errors.push(`Row ${i + 1}: Invalid date format "${rawDate}". Expected YYYY-MM-DD.`);
      continue;
    }

    // Validate Amount
    const amount = parseFloat(rawAmount);
    if (isNaN(amount) || amount <= 0) {
      errors.push(`Row ${i + 1}: Invalid positive amount "${rawAmount}".`);
      continue;
    }

    // Validate or map Category
    const matchingCat = EXPENSE_CATEGORIES.find(
      (c) => c.toLowerCase() === rawCat.toLowerCase()
    ) as ExpenseCategory | undefined;

    const category: ExpenseCategory = matchingCat || 'Other';

    expenses.push({
      id: `csv_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
      date: rawDate,
      category,
      amount: Number(amount.toFixed(2)),
      description: rawDesc,
      createdAt: Date.now() + i,
    });
  }

  return { expenses, errors };
}
