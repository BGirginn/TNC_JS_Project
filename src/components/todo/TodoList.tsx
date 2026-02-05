import { motion, AnimatePresence } from 'framer-motion';
import { useTodoStore } from '../../store/todoStore';
import TodoItem from './TodoItem';
import { Package } from 'lucide-react';

//! todo listesi bileşeni - filtrelenmiş todoları gösterir
//? AnimatePresence ile ekleme/çıkarma animasyonları sağlanır

const TodoList = () => {
  // zustand store'dan filtrelenmiş todoları al
  const { getFilteredTodos } = useTodoStore();
  const todos = getFilteredTodos();

  // hiç todo yoksa boş durum göster
  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6"
      >
        {/* Dekoratif arka plan - gradient blur efekti */}
        <div className="relative">
          {/* Sarı gradient glow efekti */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded-full blur-3xl opacity-20" />
          {/* İkon container - glassmorphism efekti */}
          <div className="relative p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:to-[#111111] rounded-3xl shadow-xl border-2 border-gray-200 dark:border-amber-500/40 ring-4 ring-amber-500/10">
            <Package size={64} className="text-gray-400 dark:text-amber-500/60" />
          </div>
        </div>

        {/* Boş durum mesajı */}
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            No todos yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            Start organizing your day by creating your first task. Click the <span className="font-medium text-indigo-600 dark:text-amber-400">Add Todo</span> button above!
          </p>
        </div>
      </motion.div>
    );
  }

  // todo listesini animasyonlu şekilde render et
  return (
    <div className="space-y-4">
      {/* AnimatePresence - liste elemanları eklenip çıkarılırken animasyon sağlar */}
      {/* mode="popLayout" - çıkan eleman layout'u bozmadan animasyonlu çıkar */}
      <AnimatePresence mode="popLayout">
        {todos.map((todo, index) => (
          <motion.div
            key={todo.id}  // React reconciliation için unique key
            initial={{ opacity: 0, y: 20 }}    // başlangıç durumu - görünmez ve aşağıda
            animate={{ opacity: 1, y: 0 }}      // hedef durum - görünür ve yerinde
            exit={{ opacity: 0, x: -100 }}      // çıkış durumu - sola kayarak kaybol
            transition={{ delay: index * 0.03, duration: 0.3 }}  // kademeli animasyon
            layout  // layout değiştiğinde smooth geçiş
          >
            <TodoItem todo={todo} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TodoList;
