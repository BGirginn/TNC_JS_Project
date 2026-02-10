import { Todo } from '../interfaces/todo.types';
import Papa from 'papaparse';

// Prevent CSV/Excel formula injection (e.g. "=cmd|...") by prefixing a single quote.
const sanitizeCsvCell = (value: string) => {
  const trimmedLeft = value.replace(/^\s+/, '');
  if (trimmedLeft.startsWith('=') || trimmedLeft.startsWith('+') || trimmedLeft.startsWith('-') || trimmedLeft.startsWith('@')) {
    return `'${value}`;
  }
  return value;
};

const toISO = (value: unknown) => {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString();
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
};

export const exportToJSON = (todos: Todo[]) => {
  const dataStr = JSON.stringify(todos, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `protodo-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const exportToCSV = (todos: Todo[]) => {
  const rows = todos.map((todo) => ({
    id: sanitizeCsvCell(String(todo.id ?? '')),
    title: sanitizeCsvCell(String(todo.title ?? '')),
    description: sanitizeCsvCell(String(todo.description ?? '')),
    completed: Boolean(todo.completed),
    priority: String(todo.priority ?? ''),
    status: String(todo.status ?? ''),
    categoryId: sanitizeCsvCell(String(todo.categoryId ?? '')),
    tags: sanitizeCsvCell(Array.isArray(todo.tags) ? todo.tags.join(';') : ''),
    createdAt: toISO((todo as unknown as { createdAt?: unknown }).createdAt),
    updatedAt: toISO((todo as unknown as { updatedAt?: unknown }).updatedAt),
  }));

  const csvContent = Papa.unparse(rows, {
    quotes: true,
    skipEmptyLines: true,
  });

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `protodo-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
