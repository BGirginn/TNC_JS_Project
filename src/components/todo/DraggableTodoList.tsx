import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTodoStore } from '../../store/todoStore';
import { Todo } from '../../interfaces/todo.types';
import TodoItem from './TodoItem';
import { GripVertical, Package, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

//! sürüklenebilir todo listesi bileşeni
//? dnd-kit kütüphanesi kullanılarak drag & drop özelliği sağlanır
//? kullanıcılar todoları sürükleyerek sıralamayı değiştirebilir

// sürüklenebilir tek eleman bileşeni
const SortableTodoItem = ({ todo }: { todo: Todo }) => {
  // useSortable hook'u ile elemanı sürüklenebilir yap
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  });

  // css transform stilleri - sürükleme sırasında pozisyon değişimi
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,   // sürüklenirken opaklık düşer
    zIndex: isDragging ? 1000 : 1,   // sürüklenirken en üstte görünür
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* sürükleme tutamacı - grip handle */}
      {/* sadece buradan tutarak sürüklenebilir */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <GripVertical size={20} className="text-gray-400" />
        </div>
      </div>
      <TodoItem todo={todo} />
    </div>
  );
};

const DraggableTodoList = () => {
  const { getFilteredTodos, reorderTodos } = useTodoStore();
  const todos = getFilteredTodos();

  // sensörler - drag işlemini algılamak için
  //? pointer sensor: mouse ve touch için
  //? keyboard sensor: klavye erişilebilirliği için
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,   // 8px sürükledikten sonra algılamaya başla (yanlışlıkla tıklamayı önler)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // sürükleme bittiğinde çalışır
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // eğer farklı bir elemanın üzerine bırakıldıysa
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);
      reorderTodos(oldIndex, newIndex);  // store'da sırayı güncelle
    }
  };

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-gray-400"
      >
        <div className="relative">
          <Package size={80} className="mb-4 text-gray-300 dark:text-gray-600" />
          <Sparkles
            size={24}
            className="absolute -top-2 -right-2 text-primary-500 animate-pulse"
          />
        </div>
        <p className="text-xl font-medium text-gray-600 dark:text-gray-400">No todos found</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Create your first todo to get started!
        </p>
      </motion.div>
    );
  }

  return (
    // DndContext: drag & drop context'i
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {/* SortableContext: sıralanabilir liste konteynerı */}
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 pl-8">
          <AnimatePresence mode="popLayout">
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                layout
              >
                <SortableTodoItem todo={todo} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
};


export default DraggableTodoList;
