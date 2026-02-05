import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTodoStore } from '../../store/todoStore';
import Input from '../common/Input';

//! arama bileşeni - todo listesinde gerçek zamanlı arama yapar
//? debounce kullanarak kullanıcı yazmayı bıraktıktan 300ms sonra arama yapılır
//? bu sayede her tuş vuruşunda store güncellenmez, performans artar

//! custom debounce hook - değer değişimini geciktirir
//? kullanıcı yazmaya devam edince timer sıfırlanır
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay ms sonra değeri güncelle
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    // cleanup - yeni değer gelince önceki timer'ı iptal et
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const TodoSearch = () => {
  // zustand store'dan arama değeri ve setter'ı al
  const { searchQuery, setSearchQuery } = useTodoStore();

  // local state - anlık input değeri için
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // debounce edilmiş değer - 300ms gecikmeyle
  const debouncedQuery = useDebounce(localQuery, 300);

  // focus durumu - glow efekti için
  const [isFocused, setIsFocused] = useState(false);

  // debounce edilmiş değer değişince store'u güncelle
  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  return (
    <div className="relative">
      {/* Focus glow efekti - gradient blur */}
      <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg transition-opacity duration-300 ${isFocused ? 'opacity-20' : 'opacity-0'}`} />

      <div className="relative">
        <Input
          placeholder="Search todos by title, description, or tags..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          // sol tarafta büyüteç ikonu
          leftIcon={<Search size={20} className={`transition-colors ${isFocused ? 'text-indigo-500' : ''}`} />}
          // sağ tarafta X butonu - sadece metin varken göster
          rightIcon={
            localQuery ? (
              <button
                onClick={() => setLocalQuery('')}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-110"
              >
                <X size={16} />
              </button>
            ) : undefined
          }
        />
      </div>
    </div>
  );
};

export default TodoSearch;
