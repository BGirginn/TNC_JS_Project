import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 dark:from-indigo-900 dark:to-purple-900 hover:scale-105 active:scale-95 shadow-soft overflow-hidden transition-transform duration-200"
      aria-label="Toggle theme"
    >
      {/* Animated Icon */}
      <div className="relative flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 180, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {isDark ? (
              <Sun size={22} className="text-amber-400" />
            ) : (
              <Moon size={22} className="text-indigo-600" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </button>
  );
};

export default ThemeToggle;
