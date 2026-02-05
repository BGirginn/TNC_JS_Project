import { useState } from 'react';
import { useTodoStore } from '../../store/todoStore';
import { TodoStatus, Priority } from '../../interfaces/todo.types';
import { X, CheckCircle, Clock, MoreVertical, Plus, Pencil, Trash2, Check, Flag, Tag as TagIcon } from 'lucide-react';

//! filtre ve kategori yönetimi bileşeni
//? durum, öncelik ve kategori bazlı filtreleme sağlar
//? ayrıca kategori CRUD işlemlerini (ekle, düzenle, sil) içerir

// Statik renk paleti - kullanıcı kategori oluştururken bunlardan seçer
// 24 önceden tanımlanmış renk - Tailwind CSS renk isimleri
const COLOR_PALETTE = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green',
  'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
  'violet', 'purple', 'fuchsia', 'pink', 'rose', 'slate',
  'gray', 'zinc', 'stone', 'neutral', 'crimson', 'coral'
];

//! renk sınıfları helper fonksiyonu - Tailwind CSS class'ları döndürür
const getColorClasses = (color: string) => {
  const map: Record<string, { gradient: string; bg: string; text: string; dot: string }> = {
    red: { gradient: 'from-red-500 to-rose-600', bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
    orange: { gradient: 'from-orange-500 to-amber-600', bg: 'bg-orange-100 dark:bg-orange-500/20', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
    amber: { gradient: 'from-amber-500 to-yellow-600', bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
    yellow: { gradient: 'from-yellow-500 to-lime-500', bg: 'bg-yellow-100 dark:bg-yellow-500/20', text: 'text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-500' },
    lime: { gradient: 'from-lime-500 to-green-500', bg: 'bg-lime-100 dark:bg-lime-500/20', text: 'text-lime-700 dark:text-lime-300', dot: 'bg-lime-500' },
    green: { gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-700 dark:text-green-300', dot: 'bg-green-500' },
    emerald: { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
    teal: { gradient: 'from-teal-500 to-cyan-600', bg: 'bg-teal-100 dark:bg-teal-500/20', text: 'text-teal-700 dark:text-teal-300', dot: 'bg-teal-500' },
    cyan: { gradient: 'from-cyan-500 to-sky-600', bg: 'bg-cyan-100 dark:bg-cyan-500/20', text: 'text-cyan-700 dark:text-cyan-300', dot: 'bg-cyan-500' },
    sky: { gradient: 'from-sky-500 to-blue-600', bg: 'bg-sky-100 dark:bg-sky-500/20', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' },
    blue: { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
    indigo: { gradient: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-100 dark:bg-indigo-500/20', text: 'text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-500' },
    violet: { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-100 dark:bg-violet-500/20', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' },
    purple: { gradient: 'from-purple-500 to-fuchsia-600', bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
    fuchsia: { gradient: 'from-fuchsia-500 to-pink-600', bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/20', text: 'text-fuchsia-700 dark:text-fuchsia-300', dot: 'bg-fuchsia-500' },
    pink: { gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-100 dark:bg-pink-500/20', text: 'text-pink-700 dark:text-pink-300', dot: 'bg-pink-500' },
    rose: { gradient: 'from-rose-500 to-red-600', bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
    slate: { gradient: 'from-slate-500 to-gray-600', bg: 'bg-slate-100 dark:bg-slate-500/20', text: 'text-slate-700 dark:text-slate-300', dot: 'bg-slate-500' },
    gray: { gradient: 'from-gray-500 to-zinc-600', bg: 'bg-gray-100 dark:bg-gray-500/20', text: 'text-gray-700 dark:text-gray-300', dot: 'bg-gray-500' },
    zinc: { gradient: 'from-zinc-500 to-neutral-600', bg: 'bg-zinc-100 dark:bg-zinc-500/20', text: 'text-zinc-700 dark:text-zinc-300', dot: 'bg-zinc-500' },
    stone: { gradient: 'from-stone-500 to-neutral-600', bg: 'bg-stone-100 dark:bg-stone-500/20', text: 'text-stone-700 dark:text-stone-300', dot: 'bg-stone-500' },
    neutral: { gradient: 'from-neutral-500 to-gray-600', bg: 'bg-neutral-100 dark:bg-neutral-500/20', text: 'text-neutral-700 dark:text-neutral-300', dot: 'bg-neutral-500' },
    crimson: { gradient: 'from-red-600 to-rose-700', bg: 'bg-red-100 dark:bg-red-600/20', text: 'text-red-800 dark:text-red-200', dot: 'bg-red-600' },
    coral: { gradient: 'from-orange-400 to-rose-500', bg: 'bg-orange-100 dark:bg-orange-400/20', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-400' },
  };
  return map[color] || map.blue;
};

//! renk seçici bileşeni - kategori rengi seçmek için
interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
}

const ColorPicker = ({ selectedColor, onSelect }: ColorPickerProps) => (
  <div className="grid grid-cols-6 gap-1 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
    {COLOR_PALETTE.map((color) => (
      <button
        key={color}
        onClick={() => onSelect(color)}
        className={`w-5 h-5 rounded-full ${getColorClasses(color).dot} hover:scale-110 transition-transform flex items-center justify-center`}
      >
        {selectedColor === color && <Check size={10} className="text-white" />}
      </button>
    ))}
  </div>
);


export const StatusPriorityFilter = () => {
  const { filter, setFilter, clearFilters } = useTodoStore();

  // aktif filtre kontrolü - temizle butonu için
  const hasActiveFilters =
    (filter.status?.length ?? 0) > 0 ||
    (filter.priority?.length ?? 0) > 0 ||
    filter.categoryId;

  return (
    <div className="bg-white/80 dark:bg-[#0a0a0a]/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-amber-500/20 shadow-soft space-y-4">
      <div className="flex items-center justify-between mb-2">
        {/* Başlık kaldırıldı */}
        <div />
        {hasActiveFilters && (
          <button onClick={clearFilters} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1 text-xs text-red-500">
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
          Status
        </label>
        <div className="flex flex-col gap-2">
          {[
            { value: TodoStatus.PENDING, label: 'Pending', icon: Clock, gradient: 'from-slate-400 to-slate-500', bg: 'bg-slate-100 dark:bg-slate-500/20', text: 'text-slate-700 dark:text-slate-300' },
            { value: TodoStatus.IN_PROGRESS, label: 'In Progress', icon: Clock, gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300' },
            { value: TodoStatus.COMPLETED, label: 'Completed', icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300' }
          ].map(({ value, label, icon: Icon, gradient, bg, text }) => {
            const isActive = filter.status?.includes(value);
            return (
              <button
                key={value}
                onClick={() => {
                  const current = filter.status || [];
                  setFilter({
                    status: current.includes(value)
                      ? current.filter((s) => s !== value)
                      : [...current, value],
                  });
                }}
                className={`
                  w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-3
                  ${isActive
                    ? `bg-gradient-to-r ${gradient} text-white shadow-md transform scale-105`
                    : `${bg} ${text} hover:shadow-sm hover:scale-102`
                  }
                `}
              >
                <Icon size={16} strokeWidth={2.5} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority Filter */}
      <div>
        <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
          Priority
        </label>
        <div className="flex flex-col gap-2">
          {[
            { value: Priority.LOW, label: 'Low', icon: Flag, gradient: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300' },
            { value: Priority.MEDIUM, label: 'Medium', icon: Flag, gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300' },
            { value: Priority.HIGH, label: 'High', icon: Flag, gradient: 'from-rose-500 to-red-600', bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300' },
          ].map(({ value, label, icon: Icon, gradient, bg, text }) => {
            const isActive = filter.priority?.includes(value);
            return (
              <button
                key={value}
                onClick={() => {
                  const current = filter.priority || [];
                  setFilter({
                    priority: current.includes(value)
                      ? current.filter((p) => p !== value)
                      : [...current, value],
                  });
                }}
                className={`
                  w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-3
                  ${isActive
                    ? `bg-gradient-to-r ${gradient} text-white shadow-md transform scale-105`
                    : `${bg} ${text} hover:shadow-sm hover:scale-102`
                  }
                `}
              >
                <Icon size={16} strokeWidth={2.5} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const CategoryFilter = () => {
  const { filter, setFilter, categories, addCategory, updateCategory, deleteCategory } = useTodoStore();

  // UI state yönetimi
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('blue');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const handleRename = (id: string) => {
    if (editName.trim()) {
      updateCategory(id, { name: editName.trim(), color: editColor });
    }
    setEditingId(null);
    setEditName('');
    setEditColor('');
    setShowColorPicker(null);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setMenuOpenId(null);
    if (filter.categoryId === id) {
      setFilter({ categoryId: undefined });
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({ name: newCategoryName.trim(), color: newCategoryColor, icon: 'Tag' });
      setNewCategoryName('');
      setNewCategoryColor('blue');
      setIsAddingCategory(false);
      setShowColorPicker(null);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-[#0a0a0a]/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-amber-500/20 shadow-soft">
      <div>
        <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
          Categories
        </label>
        <div className="flex flex-col gap-1.5">
          {/* All Categories Button */}
          <button
            onClick={() => setFilter({ categoryId: undefined })}
            className={`
              w-full px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2
              ${!filter.categoryId
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:shadow-sm'
              }
            `}
          >
            All
          </button>

          {/* Individual Category Buttons */}
          {categories.map((cat) => {
            const isActive = filter.categoryId === cat.id;
            const colors = getColorClasses(cat.color);
            const isHovered = hoveredCategory === cat.id;
            const isMenuOpen = menuOpenId === cat.id;
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={(e) => {
                  const relatedTarget = e.relatedTarget as HTMLElement;
                  if (relatedTarget?.closest?.('[data-menu-dropdown]')) return;
                  setHoveredCategory(null);
                  if (!isEditing) setMenuOpenId(null);
                }}
              >
                {isEditing ? (
                  <div className="space-y-2 mb-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(cat.id);
                        if (e.key === 'Escape') {
                          setEditingId(null);
                          setShowColorPicker(null);
                        }
                      }}
                      autoFocus
                      className="w-full px-2.5 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-amber-500 focus:outline-none"
                    />
                    {showColorPicker === cat.id && (
                      <ColorPicker
                        selectedColor={editColor}
                        onSelect={(color) => setEditColor(color)}
                      />
                    )}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setShowColorPicker(null);
                        }}
                        className="p-2 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => setShowColorPicker(showColorPicker === cat.id ? null : cat.id)}
                        className={`flex-1 py-1.5 rounded text-xs ${getColorClasses(editColor).dot} text-white`}
                      >
                        Color
                      </button>
                      <button
                        onClick={() => handleRename(cat.id)}
                        className="flex-1 py-1.5 rounded text-xs bg-amber-500 text-black font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setFilter({ categoryId: isActive ? undefined : cat.id })}
                    className={`
                      w-full px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-between
                      ${isActive
                        ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md`
                        : `${colors.bg} ${colors.text} hover:shadow-sm`
                      }
                    `}
                  >
                    <span className="truncate max-w-[120px]">{cat.name}</span>
                    {(isHovered || isMenuOpen) && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(isMenuOpen ? null : cat.id);
                        }}
                        className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-opacity"
                      >
                        <MoreVertical size={16} />
                      </div>
                    )}
                  </button>
                )}

                {/* Dropdown Menu */}
                {isMenuOpen && !isEditing && (
                  <div
                    data-menu-dropdown
                    className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[120px]"
                    onMouseLeave={() => setMenuOpenId(null)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditName(cat.name);
                        setEditColor(cat.color);
                        setEditingId(cat.id);
                        setMenuOpenId(null);
                      }}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cat.id);
                      }}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-500"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Category */}
          {isAddingCategory ? (
            <div className="space-y-2 mt-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-amber-500/30">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                  if (e.key === 'Escape') {
                    setIsAddingCategory(false);
                    setShowColorPicker(null);
                  }
                }}
                placeholder="New Category"
                autoFocus
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-amber-500"
              />
              {showColorPicker === 'new' && (
                <ColorPicker
                  selectedColor={newCategoryColor}
                  onSelect={(color) => setNewCategoryColor(color)}
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingCategory(false)}
                  className="p-2 rounded text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={() => setShowColorPicker(showColorPicker === 'new' ? null : 'new')}
                  className={`flex-1 py-1.5 rounded text-xs ${getColorClasses(newCategoryColor).dot} text-white`}
                >
                  Color
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 py-1.5 rounded text-xs bg-amber-500 text-black font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCategory(true)}
              className="w-full mt-2 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
            >
              <Plus size={16} />
              Add Category
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const TagFilter = () => {
  const { filter, setFilter, tags, addTag, updateTag, deleteTag } = useTodoStore();

  // UI state for tags
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('gray');
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const handleRename = (id: string) => {
    if (editName.trim()) {
      updateTag(id, { name: editName.trim(), color: editColor });
    }
    setEditingId(null);
    setEditName('');
    setEditColor('');
    setShowColorPicker(null);
  };

  const handleDelete = (id: string) => {
    deleteTag(id);
    setMenuOpenId(null);
    if (filter.tagId === id) {
      setFilter({ tagId: undefined });
    }
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag({ name: newTagName.trim(), color: newTagColor });
      setNewTagName('');
      setNewTagColor('gray');
      setIsAddingTag(false);
      setShowColorPicker(null);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-[#0a0a0a]/95 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-amber-500/20 shadow-soft mt-6">
      <div>
        <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
          Tags
        </label>
        <div className="flex flex-col gap-1.5">
          {/* All Tags Button - Clear tag filter */}
          {filter.tagId && (
            <button
              onClick={() => setFilter({ tagId: undefined })}
              className="w-full px-3 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500 flex items-center justify-center gap-2 mb-2"
            >
              <X size={14} />
              Clear Tag Filter
            </button>
          )}

          {/* Individual Tag Buttons */}
          {tags.map((tag) => {
            const isActive = filter.tagId === tag.id;
            const colors = getColorClasses(tag.color);
            const isHovered = hoveredTag === tag.id;
            const isMenuOpen = menuOpenId === tag.id;
            const isEditing = editingId === tag.id;

            return (
              <div
                key={tag.id}
                className="relative"
                onMouseEnter={() => setHoveredTag(tag.id)}
                onMouseLeave={(e) => {
                  const relatedTarget = e.relatedTarget as HTMLElement;
                  if (relatedTarget?.closest?.('[data-menu-dropdown]')) return;
                  setHoveredTag(null);
                  if (!isEditing) setMenuOpenId(null);
                }}
              >
                {isEditing ? (
                  <div className="space-y-2 mb-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(tag.id);
                        if (e.key === 'Escape') {
                          setEditingId(null);
                          setShowColorPicker(null);
                        }
                      }}
                      autoFocus
                      className="w-full px-2.5 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-amber-500 focus:outline-none"
                    />
                    {showColorPicker === tag.id && (
                      <ColorPicker
                        selectedColor={editColor}
                        onSelect={(color) => setEditColor(color)}
                      />
                    )}
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setShowColorPicker(null);
                        }}
                        className="p-2 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => setShowColorPicker(showColorPicker === tag.id ? null : tag.id)}
                        className={`flex-1 py-1.5 rounded text-xs ${getColorClasses(editColor).dot} text-white`}
                      >
                        Color
                      </button>
                      <button
                        onClick={() => handleRename(tag.id)}
                        className="flex-1 py-1.5 rounded text-xs bg-amber-500 text-black font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setFilter({ tagId: isActive ? undefined : tag.id })}
                    className={`
                      w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between
                      ${isActive
                        ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md`
                        : `${colors.bg} ${colors.text} hover:shadow-sm`
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <TagIcon size={14} />
                      <span className="truncate max-w-[120px]">{tag.name}</span>
                    </div>
                    {(isHovered || isMenuOpen) && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(isMenuOpen ? null : tag.id);
                        }}
                        className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-opacity"
                      >
                        <MoreVertical size={14} />
                      </div>
                    )}
                  </button>
                )}

                {/* Dropdown Menu */}
                {isMenuOpen && !isEditing && (
                  <div
                    data-menu-dropdown
                    className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[120px]"
                    onMouseLeave={() => setMenuOpenId(null)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditName(tag.name);
                        setEditColor(tag.color);
                        setEditingId(tag.id);
                        setMenuOpenId(null);
                      }}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(tag.id);
                      }}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-500"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Tag */}
          {isAddingTag ? (
            <div className="space-y-2 mt-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-amber-500/30">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag();
                  if (e.key === 'Escape') {
                    setIsAddingTag(false);
                    setShowColorPicker(null);
                  }
                }}
                placeholder="New Tag"
                autoFocus
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-amber-500"
              />
              {showColorPicker === 'new' && (
                <ColorPicker
                  selectedColor={newTagColor}
                  onSelect={(color) => setNewTagColor(color)}
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingTag(false)}
                  className="p-2 rounded text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={() => setShowColorPicker(showColorPicker === 'new' ? null : 'new')}
                  className={`flex-1 py-1.5 rounded text-xs ${getColorClasses(newTagColor).dot} text-white`}
                >
                  Color
                </button>
                <button
                  onClick={handleAddTag}
                  className="flex-1 py-1.5 rounded text-xs bg-amber-500 text-black font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingTag(true)}
              className="w-full mt-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-amber-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
            >
              <Plus size={14} />
              Add Tag
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
