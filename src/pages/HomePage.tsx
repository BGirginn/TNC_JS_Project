import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Upload, GripVertical, FileJson, FileSpreadsheet } from 'lucide-react';
import TodoForm from '../components/todo/TodoForm';
import TodoList from '../components/todo/TodoList';
import DraggableTodoList from '../components/todo/DraggableTodoList';
import { CategoryFilter, StatusFilter, PriorityFilter, TagFilter } from '../components/todo/TodoFilter';
import TodoSearch from '../components/todo/TodoSearch';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useTodoStore } from '../store/todoStore';
import { exportToJSON, exportToCSV } from '../utils/export';
import { importFromJSON, importFromCSV } from '../utils/import';
import { Priority, TodoStatus } from '../interfaces/todo.types';
import toast from 'react-hot-toast';

//! ana sayfa bileşeni - tüm todo yönetimi burada yapılır
//? layout: 3 kolonlu yapı (Sol: Kategori, Orta: Liste, Sağ: Filtreler)

const HomePage = () => {
  // UI state yönetimi
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);  // yeni todo modal'ı
  const [isDragMode, setIsDragMode] = useState(false);           // sürükle-bırak modu
  const [showExportMenu, setShowExportMenu] = useState(false);   // export dropdown menüsü

  // dosya input referansı - programatik tıklama için
  const fileInputRef = useRef<HTMLInputElement>(null);

  // zustand store'dan gerekli değer ve fonksiyonları al
  const { todos, importTodos } = useTodoStore();

  //! JSON veya CSV olarak dışa aktar
  const handleExport = (format: 'json' | 'csv') => {
    // todo yoksa hata göster
    if (todos.length === 0) {
      toast.error('No todos to export');
      return;
    }

    // formata göre uygun export fonksiyonunu çağır
    if (format === 'json') {
      exportToJSON(todos);
      toast.success('Exported to JSON');
    } else {
      exportToCSV(todos);
      toast.success('Exported to CSV');
    }
    setShowExportMenu(false);  // menüyü kapat
  };

  //! dosyadan todo içe aktar - JSON veya CSV destekler
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // dosya uzantısını kontrol et
    const isJSON = file.name.toLowerCase().endsWith('.json');
    const isCSV = file.name.toLowerCase().endsWith('.csv');

    if (!isJSON && !isCSV) {
      toast.error('Please upload a JSON or CSV file');
      return;
    }

    try {
      // dosya tipine göre uygun import fonksiyonunu seç
      const importFn = isJSON ? importFromJSON : importFromCSV;
      const importedTodos = await importFn(file);

      // import edilen veriyi todo formatına dönüştür
      const todosToAdd = importedTodos.map((todo) => ({
        title: todo.title || 'Untitled',
        description: todo.description,
        completed: todo.completed || false,
        priority: todo.priority || Priority.MEDIUM,
        status: todo.status || TodoStatus.PENDING,
        categoryId: todo.categoryId,
        tags: todo.tags || [],
      }));

      // store'a ekle
      importTodos(todosToAdd as Parameters<typeof importTodos>[0]);
      toast.success(`Imported ${importedTodos.length} todos`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to import');
    }

    // file input'u sıfırla - aynı dosyayı tekrar seçebilmek için
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4"
    >
      {/* Action Bar - More compact and aligned */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        {/* Search - Takes available space */}
        <div className="flex-1 min-w-0">
          <TodoSearch />
        </div>

        {/* Action Buttons - Grouped together */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button onClick={() => setIsAddModalOpen(true)} icon={<Plus size={18} />}>
            Add Todo
          </Button>

          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              icon={<Download size={16} />}
            >
              <span className="hidden sm:inline">Export</span>
            </Button>
            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-1 z-20 overflow-hidden"
                >
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors"
                  >
                    <FileJson size={14} className="text-blue-500" />
                    JSON
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2 transition-colors"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-500" />
                    CSV
                  </button>
                </motion.div>
              </>
            )}
          </div>

          {/* Import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleImport}
            className="hidden"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            icon={<Upload size={16} />}
          >
            <span className="hidden sm:inline">Import</span>
          </Button>

          {/* Drag Mode Toggle */}
          <Button
            variant={isDragMode ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setIsDragMode(!isDragMode)}
            icon={<GripVertical size={16} />}
            title={isDragMode ? 'Disable drag mode' : 'Enable drag mode'}
          />
        </div>
      </div>

      {/* Main Content - 3 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar - Categories (Fixed width approx 250px) */}
        <aside className="lg:col-span-3 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24 space-y-6">
            <CategoryFilter />
            <TagFilter />
          </div>
        </aside>

        {/* Main - Todo List (Center - largest space) */}
        <main className="lg:col-span-6 order-1 lg:order-2">
          {isDragMode ? <DraggableTodoList /> : <TodoList />}
        </main>

        {/* Right Sidebar - Status & Priority (Fixed width) */}
        <aside className="lg:col-span-3 order-3 lg:order-3">
          <div className="lg:sticky lg:top-24 space-y-6 intro-y">
            <StatusFilter />
            <PriorityFilter />
          </div>
        </aside>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Todo"
      >
        <TodoForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>
    </motion.div>
  );
};

export default HomePage;
