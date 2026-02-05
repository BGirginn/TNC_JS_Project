import { CheckSquare, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import ThemeToggle from './ThemeToggle.tsx';
import { useTodoStore } from '../../store/todoStore';

const AnimatedCounter = ({ value }: { value: number }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <span className="text-xl font-medium text-yellow-400 flex items-center">
      <motion.span>{display}</motion.span>%
    </span>
  );
};

const Header = () => {
  const { getStats } = useTodoStore();
  const stats = getStats();

  return (
    <header className="sticky top-0 z-30 glass shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Simple line icon - no background */}
            <CheckSquare className="text-amber-400" size={28} strokeWidth={2} />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-amber-300" style={{ fontFamily: "'Caveat', 'Segoe Script', cursive" }}>
                ProTodo
              </h1>
              <p className="text-xs text-gray-500 dark:text-amber-400/70 font-medium tracking-wide">
                Smart Task Manager
              </p>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center gap-3">
            {/* Progress Ring / Counter */}
            {stats.total > 0 && (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#09090b] border-2 border-yellow-500/20 shadow-xl min-w-[180px]">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl">
                  <AnimatedCounter value={stats.completionRate} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-200 dark:text-gray-100">
                    {stats.completed}/{stats.total}
                  </span>
                  <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp size={10} />
                    completed
                  </span>
                </div>
              </div>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
