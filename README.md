# ProTodo

Modern, hızlı ve kullanımı keyifli bir görev yönetim uygulaması. Kategori ve etiket sistemi, gelişmiş filtreleme, arama, sürükle bırak sıralama, kalıcı depolama ve JSON/CSV içe dışa aktarma ile “basit todo”nun ötesine geçer.

## Ekran Goruntuleri

<p align="center">
  <img alt="ProTodo - Ana ekran" src="./Screenshot%202026-02-10%20at%2013.56.47.png" width="840" />
</p>

<p align="center">
  <img alt="ProTodo - Filtreler ve aksiyonlar" src="./Screenshot%202026-02-10%20at%2014.11.16.png" width="840" />
</p>

## Ozellikler

- CRUD: Ekle, duzenle, sil, tamamla.
- Durum ve oncelik: `pending`, `in_progress`, `completed` ile akisa uygun takip.
- Etiket ve kategori: Renkli kategori/etiket yonetimi, filtreleme.
- Arama: Baslik, aciklama ve etiket adlarinda anlik arama.
- Drag and drop: Listeyi surukleyerek siralama (dnd-kit).
- Kalici veri: Zustand `persist` ile localStorage.
- Import/export: JSON ve CSV ile yedekleme ve tasima.

## Teknoloji Yigini

- React + TypeScript + Vite
- Tailwind CSS
- Zustand (persist)
- Framer Motion
- React Hook Form + Zod
- Papaparse (CSV)
- Lucide Icons

## Proje Yapisi

```bash
src/
  components/
    common/
    layout/
    todo/
  interfaces/
  pages/
  store/
  utils/
```

## Kurulum

```bash
npm install
```

## Calistirma

```bash
npm run dev
```

## Build ve Kontrol

```bash
npm run lint
npm run build
```

## Import/Export Notlari

- CSV import/export `papaparse` ile yapilir.
- CSV export, Excel/Sheets tarafinda formula injection riskine karsi belirli baslangic karakterlerini (`=`, `+`, `-`, `@`) otomatik olarak sanitize eder.

## Lisans

Egitim ve portfolyo amacli ornek calisma.
