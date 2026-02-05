import { forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

//! yeniden kullanılabilir buton bileşeni
//? forwardRef kullanarak ref'i dışarıdan alabiliyoruz - form kütüphaneleri için gerekli

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gradient';  // buton tipleri
  size?: 'sm' | 'md' | 'lg';          // boyut seçenekleri
  loading?: boolean;                   // yüklenme durumu - spinner gösterir
  icon?: ReactNode;                    // sol tarafta ikon
  children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => {
    // temel stiller - tüm butonlarda ortak
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-lg';

    // varyant stilleri - her tip için farklı renk ve efektler
    const variants = {
      primary: 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black shadow-amber-500/25',
      secondary: 'bg-white/80 dark:bg-[#121212]/80 hover:bg-white dark:hover:bg-[#1a1a1a] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-amber-500/20',
      danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-red-500/25',
      ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 shadow-none',
      gradient: 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-600 text-black shadow-amber-500/25',
    };

    // boyut stilleri - padding ve font size
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -1 }}   // hover'da hafif büyüme ve yukarı kayma
        whileTap={{ scale: 0.98 }}             // tıklamada küçülme efekti
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={loading || disabled}          // loading varsa da disabled yap
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />  // yüklenme spinner'ı
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>   // ikon varsa göster
        ) : null}
        {children}
      </motion.button>
    );
  }
);

// react devtools'ta görünen isim
Button.displayName = 'Button';
export default Button;
