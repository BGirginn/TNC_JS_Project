import { Todo } from '../interfaces/todo.types';

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
  const headers = ['id', 'title', 'description', 'completed', 'priority', 'status', 'categoryId', 'tags', 'createdAt', 'updatedAt'];
  
  const csvContent = [
    headers.join(','),
    ...todos.map(todo => [
      todo.id,
      `"${(todo.title || '').replace(/"/g, '""')}"`,
      `"${(todo.description || '').replace(/"/g, '""')}"`,
      todo.completed,
      todo.priority,
      todo.status,
      todo.categoryId || '',
      `"${todo.tags.join(';')}"`,
      todo.createdAt,
      todo.updatedAt
    ].join(','))
  ].join('\n');

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
