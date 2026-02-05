import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

//! yeniden kullanılabilir input bileşeni
//? sol/sağ ikon desteği, hata mesajı gösterimi ve label var

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;           // üstteki etiket
  error?: string;           // hata mesajı - validation'dan gelir
  leftIcon?: ReactNode;     // sol tarafta ikon - arama ikonu falan
  rightIcon?: ReactNode;    // sağ tarafta ikon - temizle butonu falan
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {/* label varsa göster */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            {label}
          </label>
        )}
        {/* input container - group class'ı ile focus durumunu yakalıyoruz */}
        <div className="relative group">
          {/* sol ikon - absolute pozisyonla ortalanır */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-400 group-focus-within:text-amber-500 transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl
              ${leftIcon ? 'pl-12' : ''}   
              ${rightIcon ? 'pr-12' : ''}  
              ${error
                ? 'border-2 border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border border-gray-200 dark:border-gray-700/50 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/20'}
              bg-white/80 dark:bg-[#121212]/80 backdrop-blur-sm
              text-gray-900 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              shadow-sm hover:shadow-md focus:shadow-lg
              ${className}
            `}
            {...props}  // geri kalan tüm props'ları aktar - onChange, value falan
          />
          {/* sağ ikon */}
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
          {/* focus'ta gradient glow efekti - -z-10 ile arkada kalır */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 opacity-0 group-focus-within:opacity-100 -z-10 blur-sm transition-opacity" style={{ margin: '-2px' }} />
        </div>
        {/* hata mesajı */}
        {error && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-red-500" />  {/* kırmızı nokta */}
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
