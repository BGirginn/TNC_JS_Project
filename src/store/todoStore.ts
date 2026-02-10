import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, TodoFilter, Category, Tag, TodoStatus, TodoStats } from '../interfaces/todo.types';

//! zustand kullanarak global state yönetimi yapıyoruz
//? redux'a göre daha basit, boilerplate kod yazmana gerek yok

type TodoImportInput = Omit<Todo, 'id' | 'position' | 'createdAt' | 'updatedAt'> & {
  createdAt?: Date | string | number;
};

interface TodoState {
  // durum değişkenleri - state
  todos: Todo[];                 // tüm todolar bu dizide tutulur
  categories: Category[];        // kategoriler
  tags: Tag[];                   // etiketler (managed)
  filter: TodoFilter;            // aktif filtreler
  searchQuery: string;           // arama metni

  // CRUD işlemleri - temel veritabanı operasyonları
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'position'>) => void;  // ekleme
  updateTodo: (id: string, updates: Partial<Todo>) => void;   // güncelleme
  deleteTodo: (id: string) => void;                           // silme
  getTodos: () => Todo[];                                     // listeleme

  // yardımcı fonksiyonlar
  toggleTodo: (id: string) => void;          // todo'yu tamamla/tamamlanmadı yap
  getFilteredTodos: () => Todo[];            // filtrelenmiş todoları getir

  // kategori yönetimi
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;

  // etiket yönetimi
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, updates: Partial<Omit<Tag, 'id'>>) => void;
  deleteTag: (id: string) => void;

  // filtreleme ve arama
  setFilter: (filter: Partial<TodoFilter>) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;                  // tüm filtreleri temizle

  // sürükle bırak - drag & drop
  reorderTodos: (startIndex: number, endIndex: number) => void;

  // dışarıdan veri aktarma
  importTodos: (todos: TodoImportInput[]) => void;

  // istatistikler
  getStats: () => TodoStats;
}

//! persist middleware'i kullanınca veriler localStorage'a kaydedilir
//? sayfa yenilenince veriler kaybolmaz, kalıcı olur
export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      // başlangıç değerleri - initial state
      todos: [],
      categories: [
        // varsayılan kategoriler
        { id: '1', name: 'Work', color: 'blue', icon: 'Briefcase' },
        { id: '2', name: 'Personal', color: 'green', icon: 'User' },
        { id: '3', name: 'Shopping', color: 'purple', icon: 'ShoppingCart' },
        { id: '4', name: 'Health', color: 'red', icon: 'Heart' },
      ],
      tags: [
        // varsayılan etiketler
        { id: '1', name: 'Urgent', color: 'red' },
        { id: '2', name: 'Later', color: 'gray' },
        { id: '3', name: 'Important', color: 'amber' },
      ],
      filter: {},
      searchQuery: '',

      // CREATE - yeni todo ekleme işlemi
      //! Omit kullanarak id, createdAt gibi alanları dışarıda bırakıyoruz, bunlar otomatik oluşturulur
      addTodo: (todo) => {
        const newTodo: Todo = {
          ...todo,                              // gelen verileri spread et
          id: crypto.randomUUID(),              // benzersiz id oluştur
          position: get().todos.length,         // en sona ekle
          createdAt: new Date(),                // şu anki tarih
          updatedAt: new Date(),
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));  // state'e ekle
      },

      // READ - tüm todoları getir
      getTodos: () => get().todos,

      // UPDATE - var olan todo'yu güncelle
      //? Partial<Todo> kullanınca sadece değişen alanları gönderebilirsin
      updateTodo: (id, updates) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...updates, updatedAt: new Date() } : todo
          ),
        }));
      },

      // DELETE - todo'yu sil
      //! filter ile id eşleşmeyen todoları alıyoruz, yani silinen hariç hepsi kalıyor
      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      // tamamlanma durumunu değiştir - checkbox tıklanınca çalışır
      toggleTodo: (id) => {
        const todo = get().todos.find((t) => t.id === id);
        if (todo) {
          get().updateTodo(id, {
            completed: !todo.completed,  // tersine çevir
            status: !todo.completed ? TodoStatus.COMPLETED : TodoStatus.PENDING,
          });
        }
      },

      // filtrelenmiş todoları getir - arama ve filtrelere göre
      getFilteredTodos: () => {
        const { todos, filter, searchQuery, tags } = get(); // tags'i de al
        let filtered = [...todos];  // orijinal diziyi bozmamak için kopyala

        // arama filtresi - başlık, açıklama veya etiketlerde ara
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (todo) =>
              todo.title.toLowerCase().includes(query) ||
              todo.description?.toLowerCase().includes(query) ||
              // Tag ID'si üzerinden tag ismini bulup arama
              todo.tags.some((tagId) => {
                const tag = tags.find(t => t.id === tagId);
                return tag?.name.toLowerCase().includes(query) || tagId.toLowerCase().includes(query);
              })
          );
        }

        // durum filtresi - pending, in_progress, completed
        if (filter.status?.length) {
          filtered = filtered.filter((todo) => filter.status?.includes(todo.status));
        }

        // öncelik filtresi - low, medium, high
        if (filter.priority?.length) {
          filtered = filtered.filter((todo) => filter.priority?.includes(todo.priority));
        }

        // kategori filtresi
        if (filter.categoryId) {
          filtered = filtered.filter((todo) => todo.categoryId === filter.categoryId);
        }

        // etiket filtresi
        if (filter.tagId) {
          filtered = filtered.filter((todo) => todo.tags.includes(filter.tagId!)); // tags artık ID tutuyor
        }

        // pozisyona göre sırala ve döndür
        return filtered.sort((a, b) => a.position - b.position);
      },

      // filtre ayarla - Partial kullanınca sadece değişen filtreyi gönderebilirsin
      setFilter: (newFilter) => {
        set((state) => ({ filter: { ...state.filter, ...newFilter } }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),

      // tüm filtreleri temizle
      clearFilters: () => set({ filter: {}, searchQuery: '' }),

      // sürükle bırak ile sıralama değiştir
      //! dnd-kit kütüphanesiyle entegre çalışır
      reorderTodos: (startIndex, endIndex) => {
        const todos = [...get().todos];
        const filteredTodos = get().getFilteredTodos();

        // filtrelenmiş listedeki indexleri gerçek indexlere çevir
        const movedItem = filteredTodos[startIndex];
        const targetItem = filteredTodos[endIndex];

        const actualStartIndex = todos.findIndex(t => t.id === movedItem.id);
        const actualEndIndex = todos.findIndex(t => t.id === targetItem.id);

        // splice ile elemanı çıkar ve yeni yerine koy
        const [removed] = todos.splice(actualStartIndex, 1);
        todos.splice(actualEndIndex, 0, removed);

        // pozisyonları güncelle
        const updatedTodos = todos.map((todo, index) => ({
          ...todo,
          position: index,
        }));

        set({ todos: updatedTodos });
      },

      // dışarıdan todo aktar - JSON veya CSV'den
      importTodos: (importedTodos) => {
        const currentLength = get().todos.length;
        const newTodos = importedTodos.map((todo, index) => ({
          ...todo,
          id: crypto.randomUUID(),                    // yeni id ver, çakışma olmasın
          position: currentLength + index,            // mevcut todoların sonuna ekle
          createdAt: (() => {
            const raw = todo.createdAt;
            if (!raw) return new Date();
            if (raw instanceof Date) return raw;
            const d = new Date(String(raw));
            return Number.isNaN(d.getTime()) ? new Date() : d;
          })(),
          updatedAt: new Date(),
        }));
        set((state) => ({ todos: [...state.todos, ...newTodos] }));
      },

      // kategori ekle
      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, { ...category, id: crypto.randomUUID() }],
        }));
      },

      // kategori güncelle (rename)
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        }));
      },

      // kategori sil
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
      },

      // etiket ekle
      addTag: (tag) => {
        set((state) => ({
          tags: [...state.tags, { ...tag, id: crypto.randomUUID() }],
        }));
      },

      // etiket güncelle
      updateTag: (id, updates) => {
        set((state) => ({
          tags: state.tags.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      // etiket sil
      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
          // silinen etiketi todolardan da çıkar
          todos: state.todos.map(todo => ({
            ...todo,
            tags: todo.tags.filter(tagId => tagId !== id)
          }))
        }));
      },

      // istatistikleri hesapla - header'daki progress için kullanılır
      getStats: () => {
        const todos = get().todos;
        const completed = todos.filter((t) => t.completed).length;
        return {
          total: todos.length,
          completed,
          pending: todos.filter((t) => t.status === TodoStatus.PENDING).length,
          inProgress: todos.filter((t) => t.status === TodoStatus.IN_PROGRESS).length,
          completionRate: todos.length ? Math.round((completed / todos.length) * 100) : 0,
        };
      },
    }),
    {
      name: 'protodo-storage',  // localStorage'daki key ismi
      partialize: (state) => ({     // neleri kaydedeceğini seç
        todos: state.todos,
        categories: state.categories,
        tags: state.tags  // tags'i de kaydet
      }),
    }
  )
);
