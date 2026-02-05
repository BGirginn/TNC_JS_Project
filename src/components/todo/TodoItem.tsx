import { Edit2, Trash2, MoreHorizontal, CheckCircle2, Circle, Clock, Tag, Folder, Zap, AlertCircle, ArrowDownCircle, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTodoStore } from '../../store/todoStore';
import { Todo, Priority, TodoStatus } from '../../interfaces/todo.types';
import Modal from '../common/Modal';
import TodoForm from './TodoForm';
import toast from 'react-hot-toast';

//! tek bir todo kartı bileşeni - tüm CRUD işlemleri buradan yapılır

interface TodoItemProps {
  todo: Todo;  // gösterilecek todo verisi
}

// Helper for tag colors
const getTagColorClasses = (color: string) => {
  const map: Record<string, string> = {
    red: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
    lime: 'bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
    cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300',
    sky: 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
    fuchsia: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-300',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300',
    zinc: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300',
    stone: 'bg-stone-100 text-stone-700 dark:bg-stone-500/20 dark:text-stone-300',
    neutral: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-500/20 dark:text-neutral-300',
    crimson: 'bg-red-100 text-red-800 dark:bg-red-600/20 dark:text-red-200',
    coral: 'bg-orange-100 text-orange-700 dark:bg-orange-400/20 dark:text-orange-300',
  };
  return map[color] || map.gray;
};

const TodoItem = ({ todo }: TodoItemProps) => {
  // zustand store'dan gerekli fonksiyonları al
  const { toggleTodo, updateTodo, deleteTodo, categories, tags: availableTags } = useTodoStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);   // düzenleme modal'ı açık mı
  const [showActions, setShowActions] = useState(false);           // aksiyon menüsü açık mı

  // öncelik ayarları - her seviye için renk, ikon ve label
  const priorityConfig = {
    [Priority.LOW]: {
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30',
      icon: ArrowDownCircle,
      label: 'Low',
    },
    [Priority.MEDIUM]: {
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30',
      icon: AlertCircle,
      label: 'Medium',
    },
    [Priority.HIGH]: {
      color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30',
      icon: Zap,
      label: 'High',
    },
  };

  // durum ayarları - pending, in_progress, completed için stil
  const statusConfig = {
    [TodoStatus.PENDING]: {
      color: 'text-slate-500 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-500/20',
      label: 'Pending',
    },
    [TodoStatus.IN_PROGRESS]: {
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-500/20',
      label: 'In Progress',
    },
    [TodoStatus.COMPLETED]: {
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-500/20',
      label: 'Completed',
    },
  };

  // todo'nun kategorisini bul - categoryId ile eşleş
  const category = categories.find((c) => c.id === todo.categoryId);

  // todo'nun etiketlerini bul
  const resolvedTags = todo.tags.map(tagId => {
    // tagId string olabilir (eski data) veya ID olabilir
    // önce managed tags içinde ID var mı bak
    const managedTag = availableTags.find(t => t.id === tagId);
    if (managedTag) return managedTag;

    // bulunamadıysa ve bir isim gibi görünüyorsa (uuid değilse) geçici obje oluştur
    // basit bir kontrol: boşluk içermiyorsa ve kısa ise belki isimdir? ama uuid de olabilir.
    // Şimdilik managedTag yoksa gösterme veya isim olarak göster
    return { id: tagId, name: tagId, color: 'gray' };
  }).filter(t => t.name !== ''); // boş olanları filtrele

  // silme işlemi - confirm ile onay al
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(todo.id);
      toast.success('Todo deleted');
    }
  };

  // durum değiştirme
  const handleStatusChange = (status: TodoStatus) => {
    updateTodo(todo.id, {
      status,
      completed: status === TodoStatus.COMPLETED,
    });
    setShowActions(false);
  };

  // dinamik öncelik ikonu
  const PriorityIcon = priorityConfig[todo.priority].icon;

  return (
    <>
      {/* ana kart - motion.div ile animasyonlu */}
      <motion.div
        layout  // layout değişince animasyonlu geçiş
        className={`
          group relative rounded-2xl p-5 transition-all duration-300
          ${todo.completed
            ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-500/20'
            : 'bg-white/80 dark:bg-[#121212]/80 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-amber-500/50'}
          shadow-soft hover:shadow-lg backdrop-blur-sm
        `}
      >
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-2 mt-0.5">
            {/* checkbox - tamamlandı durumu için */}
            <button
              onClick={() => toggleTodo(todo.id)}
              className="flex-shrink-0 transition-all duration-200 hover:scale-110"
              title={todo.completed ? "Mark as undo" : "Mark as completed"}
            >
              {todo.completed ? (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 size={16} className="text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 flex items-center justify-center group/check">
                  <Circle size={16} className="text-gray-300 dark:text-gray-600 group-hover/check:text-indigo-500" />
                </div>
              )}
            </button>

            {/* Quick Action Button (Play/Pause) */}
            {!todo.completed && (
              <button
                onClick={() => {
                  if (todo.status === TodoStatus.IN_PROGRESS) {
                    handleStatusChange(TodoStatus.PENDING);
                  } else {
                    handleStatusChange(TodoStatus.IN_PROGRESS);
                  }
                }}
                className={`flex-shrink-0 transition-all duration-200 hover:scale-110 p-1 rounded-full ${todo.status === TodoStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-amber-100 hover:text-amber-600'}`}
                title={todo.status === TodoStatus.IN_PROGRESS ? "Pause (Set to Pending)" : "Start (Set to In Progress)"}
              >
                {todo.status === TodoStatus.IN_PROGRESS ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} fill="currentColor" />
                )}
              </button>
            )}
          </div>

          {/* içerik alanı */}
          <div className="flex-1 min-w-0">
            {/* başlık */}
            <h3
              className={`font-semibold text-base ${todo.completed
                ? 'line-through text-gray-400 dark:text-gray-500'
                : 'text-gray-800 dark:text-gray-100'
                }`}
            >
              {todo.title}
            </h3>
            {/* açıklama */}
            {todo.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                {todo.description}
              </p>
            )}

            {/* meta bilgileri */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {/* öncelik badge'i */}
              <span
                className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 ${priorityConfig[todo.priority].color}`}
              >
                <PriorityIcon size={12} />
                {priorityConfig[todo.priority].label}
              </span>

              {/* durum badge'i */}
              <span className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 ${statusConfig[todo.status].color} ${statusConfig[todo.status].bg}`}>
                <Clock size={12} />
                {statusConfig[todo.status].label}
              </span>

              {/* kategori badge'i */}
              {category && (
                <span className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-medium">
                  <Folder size={12} />
                  {category.name}
                </span>
              )}

              {/* etiketler */}
              {resolvedTags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {resolvedTags.map((tag) => (
                    <span
                      key={tag.id}
                      className={`text-xs flex items-center gap-1 px-2 py-1 rounded-lg font-medium ${getTagColorClasses(tag.color)}`}
                    >
                      <Tag size={10} />
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* aksiyon butonu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <MoreHorizontal size={18} className="text-gray-400" />
            </button>

            {/* aksiyon dropdown menüsü */}
            {showActions && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowActions(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50 backdrop-blur-sm"
                >
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </div>
                  {Object.values(TodoStatus).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors text-gray-700 dark:text-gray-200 ${todo.status === status ? 'bg-indigo-50 dark:bg-indigo-500/10' : ''
                        }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${status === TodoStatus.PENDING
                          ? 'bg-slate-400'
                          : status === TodoStatus.IN_PROGRESS
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                          }`}
                      />
                      <span className="font-medium">{status.replace('_', ' ')}</span>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors text-gray-700 dark:text-gray-200"
                  >
                    <Edit2 size={16} className="text-indigo-500" />
                    <span className="font-medium">Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="font-medium">Delete</span>
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Todo"
      >
        <TodoForm initialData={todo} onSuccess={() => setIsEditModalOpen(false)} />
      </Modal>
    </>
  );
};

export default TodoItem;
