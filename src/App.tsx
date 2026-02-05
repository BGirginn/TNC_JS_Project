import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLayoutEffect, lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from './store/themeStore';
import Header from './components/layout/Header';

//! React.lazy ile dinamik import - code splitting
//? Bu sayede sayfalar sadece ihtiyaç duyulduğunda yüklenir, ilk yükleme hızlanır
const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Sayfa yüklenirken gösterilecek loading bileşeni
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
      <p className="text-gray-500 dark:text-gray-400 font-medium">Yükleniyor...</p>
    </div>
  </div>
);

//! ana uygulama bileşeni - tüm routing ve layout burada tanımlanır
function App() {
  // zustand'dan tema bilgisini al - selector kullanarak sadece theme'i dinle
  const theme = useThemeStore((state) => state.theme);

  //? useLayoutEffect kullanıyoruz çünkü useEffect'te sayfa render olduktan sonra çalışır
  //? bu da tema değişirken flash (yanıp sönme) oluşturur, useLayoutEffect ile bu önlenir
  useLayoutEffect(() => {
    const html = document.documentElement;

    // transition class'ını ekle - animasyon için
    html.classList.add('theme-transition');

    // tema class'ını güncelle
    html.classList.toggle('dark', theme === 'dark');

    // animasyon bittikten sonra transition class'ını kaldır - performans için
    const timeout = setTimeout(() => {
      html.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timeout);
  }, [theme]);

  return (
    <BrowserRouter>
      {/* ana container - min-h-screen ile tam ekran yüksekliği, dark mode için jet black */}
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <Header />

        {/* ana içerik alanı - container ile ortalanır, padding ile kenarlardan boşluk */}
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* path="/" ana sayfa route'u */}
              <Route path="/" element={<HomePage />} />
              {/* path="*" bulunamayan sayfalar için 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        {/* toast bildirimleri - react-hot-toast kütüphanesi */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,  // 3 saniye sonra otomatik kapanır
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
