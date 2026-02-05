import { Todo, Priority, TodoStatus } from '../interfaces/todo.types';

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
          priority: Object.values(Priority).includes(item.priority as Priority) 
            ? item.priority as Priority 
            : Priority.MEDIUM,
          status: Object.values(TodoStatus).includes(item.status as TodoStatus)
            ? item.status as TodoStatus
            : TodoStatus.PENDING,
          categoryId: item.categoryId ? String(item.categoryId) : undefined,
          tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
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
        const lines = content.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('CSV file is empty or has no data rows'));
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const titleIndex = headers.indexOf('title');
        
        if (titleIndex === -1) {
          reject(new Error('CSV must have a "title" column'));
          return;
        }

        const todos = lines.slice(1).map(line => {
          // Simple CSV parsing (handles basic cases)
          const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          
          const getValue = (key: string) => {
            const index = headers.indexOf(key);
            return index !== -1 ? values[index] : undefined;
          };

          return {
            title: getValue('title') || 'Untitled',
            description: getValue('description'),
            completed: getValue('completed') === 'true',
            priority: (getValue('priority') as Priority) || Priority.MEDIUM,
            status: (getValue('status') as TodoStatus) || TodoStatus.PENDING,
            categoryId: getValue('categoryid'),
            tags: getValue('tags')?.split(';').filter(Boolean) || [],
          };
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
