import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTodoStore } from '../../store/todoStore';
import { Priority, TodoStatus, Todo } from '../../interfaces/todo.types';
import Button from '../common/Button';
import Input from '../common/Input';
import toast from 'react-hot-toast';
import { Plus, Save, Zap, Folder, Tags, Tag as TagIcon } from 'lucide-react';

//! zod ile form validation şeması tanımlıyoruz
//? zod kullanarak runtime'da type-safe validation yapabilirsin
const todoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).default([]),  // array of tag IDs
});

// zod şemasından typescript tipi çıkar - z.infer kullanarak
type TodoFormData = z.infer<typeof todoSchema>;

interface TodoFormProps {
  initialData?: Todo;      // düzenleme modunda mevcut todo verileri
  onSuccess?: () => void;  // başarılı işlem sonrası callback - modal kapatmak için falan
}

//! hem ekleme hem düzenleme için kullanılan form bileşeni
const TodoForm = ({ initialData, onSuccess }: TodoFormProps) => {
  const { addTodo, updateTodo, categories, tags: availableTags } = useTodoStore();
  const isEditing = !!initialData;  // initialData varsa düzenleme modu, yoksa ekleme modu

  // react-hook-form kurulumu
  //? zodResolver ile zod şemasını react-hook-form'a bağlıyoruz
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      // düzenleme modunda mevcut değerler, yoksa boş
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || Priority.MEDIUM,
      categoryId: initialData?.categoryId || '',
      tags: initialData?.tags || [],
    },
  });

  const selectedTags = watch('tags') || [];

  const toggleTag = (tagId: string) => {
    const current = selectedTags;
    const updated = current.includes(tagId)
      ? current.filter((t: string) => t !== tagId)
      : [...current, tagId];
    setValue('tags', updated);
  };

  // form gönderildiğinde çalışır
  const onSubmit = (data: TodoFormData) => {
    if (isEditing) {
      updateTodo(initialData.id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        categoryId: data.categoryId || undefined,
        tags: data.tags,
      });
      toast.success('Todo updated successfully!');
    } else {
      addTodo({
        title: data.title,
        description: data.description,
        completed: false,
        priority: data.priority,
        status: TodoStatus.PENDING,
        categoryId: data.categoryId || undefined,
        tags: data.tags,
      });
      toast.success('Todo added successfully!');
      reset();
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* başlık input'u - zorunlu alan */}
      <Input
        label="Title *"
        placeholder="What needs to be done?"
        error={errors.title?.message}   // zod'dan gelen hata mesajı
        {...register('title')}          // react-hook-form'a bağla
      />

      {/* açıklama textarea'sı */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Description
        </label>
        <textarea
          placeholder="Add more details about this task..."
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700/50 rounded-xl bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-500 transition-all duration-200 resize-none shadow-sm hover:shadow-md"
          rows={3}
          {...register('description')}
        />
      </div>

      {/* öncelik ve kategori - yan yana grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Zap size={14} className="text-amber-500" />
            Priority
          </label>
          {/* select için custom ok ikonu - appearance-none ile default ok gizlenir, bg-[url] ile svg eklenir */}
          <select
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700/50 rounded-xl bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-500 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4AF37%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:1rem]"
            {...register('priority')}
          >
            <option value={Priority.LOW}>🟢 Low Priority</option>
            <option value={Priority.MEDIUM}>🟡 Medium Priority</option>
            <option value={Priority.HIGH}>🔴 High Priority</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Folder size={14} className="text-violet-500" />
            Category
          </label>
          <select
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700/50 rounded-xl bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-500 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4AF37%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:1rem]"
            {...register('categoryId')}
          >
            <option value="">No category</option>
            {/* kategorileri map ile listele */}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Select Tags */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
          <Tags size={14} className="text-amber-500" />
          Tags
        </label>
        {availableTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-1.5
                    ${isSelected
                      ? 'bg-amber-100 border-amber-500 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300'
                      : 'bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-amber-400'
                    }
                  `}
                >
                  <TagIcon size={12} className={isSelected ? 'fill-current' : ''} />
                  {tag.name}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">
            No tags available. Add tags from the sidebar filter menu.
          </p>
        )}
      </div>

      {/* submit butonu - isEditing'e göre farklı text ve ikon */}
      <Button
        type="submit"
        variant="gradient"
        loading={isSubmitting}   // submit sırasında spinner göster
        className="w-full"
        icon={isEditing ? <Save size={18} /> : <Plus size={18} />}
      >
        {isEditing ? 'Update Todo' : 'Add Todo'}
      </Button>
    </form>
  );
};

export default TodoForm;
