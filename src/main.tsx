import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// localStorage'daki eski verileri temizle - version uyumsuzluğunu önlemek için
const STORAGE_VERSION = 'v2';
const currentVersion = localStorage.getItem('protodo-version');
if (currentVersion !== STORAGE_VERSION) {
  localStorage.removeItem('protodo-storage');
  localStorage.removeItem('protodo-theme');
  localStorage.setItem('protodo-version', STORAGE_VERSION);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
