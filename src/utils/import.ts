import { Todo, Priority, TodoStatus } from '../interfaces/todo.types';
import Papa from 'papaparse';

const toBool = (value: unknown) => {
  const v = String(value ?? '').trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes' || v === 'y';
};

const toDateOrUndefined = (value: unknown) => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? undefined : d;
};

const isPriority = (value: unknown): value is Priority =>
  Object.values(Priority).includes(value as Priority);

const isStatus = (value: unknown): value is TodoStatus =>
  Object.values(TodoStatus).includes(value as TodoStatus);

export const importFromJSON = (file: File): Promise<Partial<Todo>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Handle both array and single object
        const todos = Array.isArray(data) ? data : [data];
        
        // Validate and transform data
        const validatedTodos = todos.map((item: Record<string, unknown>) => ({
          title: String(item.title || 'Untitled'),
          description: item.description ? String(item.description) : undefined,
          completed: Boolean(item.completed),
          priority: isPriority(item.priority)
            ? (item.priority as Priority)
            : Priority.MEDIUM,
          status: isStatus(item.status)
            ? (item.status as TodoStatus)
            : TodoStatus.PENDING,
          categoryId: item.categoryId ? String(item.categoryId) : undefined,
          tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
          createdAt: toDateOrUndefined(item.createdAt),
        }));
        
        resolve(validatedTodos);
      } catch {
        reject(new Error('Invalid JSON file format'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const importFromCSV = (file: File): Promise<Partial<Todo>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = Papa.parse<Record<string, unknown>>(content, {
          header: true,
          skipEmptyLines: 'greedy',
          transformHeader: (h) => h.trim().toLowerCase(),
        });

        if (parsed.errors?.length) {
          reject(new Error(parsed.errors[0]?.message || 'Invalid CSV file format'));
          return;
        }

        const rows = parsed.data ?? [];
        if (rows.length === 0) {
          reject(new Error('CSV file is empty or has no data rows'));
          return;
        }

        // With transformHeader, "categoryId" becomes "categoryid".
        const hasTitle = Object.prototype.hasOwnProperty.call(rows[0], 'title');
        if (!hasTitle) {
          reject(new Error('CSV must have a "title" column'));
          return;
        }

        const todos = rows.map((row) => {
          const title = String(row.title ?? '').trim() || 'Untitled';
          const description = row.description != null && String(row.description).trim() !== '' ? String(row.description) : undefined;
          const completed = toBool(row.completed);
          const priorityRaw = String(row.priority ?? '').trim().toLowerCase();
          const statusRaw = String(row.status ?? '').trim().toLowerCase();
          const categoryId = row.categoryid != null && String(row.categoryid).trim() !== '' ? String(row.categoryid) : undefined;

          const tagsRaw = row.tags != null ? String(row.tags) : '';
          const tags = tagsRaw
            .split(/[;,]/)
            .map((t) => t.trim())
            .filter(Boolean);

          const createdAt = toDateOrUndefined(row.createdat);

          return {
            title,
            description,
            completed,
            priority: isPriority(priorityRaw) ? (priorityRaw as Priority) : Priority.MEDIUM,
            status: isStatus(statusRaw) ? (statusRaw as TodoStatus) : TodoStatus.PENDING,
            categoryId,
            tags,
            createdAt,
          } satisfies Partial<Todo>;
        });

        resolve(todos);
      } catch {
        reject(new Error('Invalid CSV file format'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
