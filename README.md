# 🚀 ProTodo App - Modern Görev Yönetim Uygulaması

Bu proje, **TNC Group Figma & Web Geliştirme Eğitimi** kapsamında, eğitim sürecinde edinilen **HTML, CSS, Javascript ve ReactJS** bilgilerinin pekiştirilmesi amacıyla geliştirilmiş modern bir Todo (Yapılacaklar Listesi) uygulamasıdır.

Yönergede belirtilen temel gereksinimlerin ötesine geçilerek, gerçek dünya senaryolarına uygun, kullanıcı deneyimi (UX) yüksek ve modern teknolojilerle donatılmış bir uygulama hedeflenmiştir.

---

## 🎯 Proje Amacı ve Kapsamı

Eğitim yönergesine uygun olarak aşağıdaki temel yetenekler kazanılmış ve projeye uygulanmıştır:
*   Modern Javascript Framework (ReactJS) kullanımı.
*   Modüler dosya yapısı (**Components**, **Pages**, **Interfaces**).
*   Modern CSS Framework (**Tailwind CSS**) entegrasyonu.
*   Tam kapsamlı **CRUD** (Oluşturma, Okuma, Güncelleme, Silme) işlemleri.

## ✨ Öne Çıkan Özellikler

Bu proje standart bir Todo uygulamasından fazlasını sunar:

*   **⚡️ Gelişmiş Görev Yönetimi (CRUD):** Görev ekleme, düzenleme, silme ve tamamlama.
*   **🏷️ Etiket (Tag) ve Kategori Sistemi:** Kategorilere ve etiketlere göre renklendirilmiş, detaylı organizasyon.
*   **🔍 Akıllı Arama ve Filtreleme:** Başlık, açıklama veya etikete göre anlık arama; Durum (Bekliyor, Devam Ediyor, Tamamlandı) ve Önceliğe göre filtreleme.
*   **🖱️ Sürükle & Bırak (Drag & Drop):** Görevleri sürükleyerek kolayca sıralama imkanı.
*   **🌓 Dark/Light Mod:** Sistem tercihinize veya manuel seçiminize duyarlı karanlık mod desteği.
*   **💾 Kalıcı Hafıza (LocalStorage):** Sayfa yenilendiğinde verileriniz kaybolmaz.
*   **🎨 Modern ve Duyarlı Arayüz:** Animasyonlu geçişler (Framer Motion), responsive tasarım ve şık ikon setleri.
*   **⏯️ Hızlı Aksiyonlar:** Listeden ayrılmadan görevleri "Başlat/Durdur" (Play/Pause) özellikleri.
*   **📂 İçe/Dışa Aktarma:** Verilerinizi JSON veya CSV formatında yedekleyebilme.

## 🛠️ Kullanılan Teknolojiler

Proje geliştirilirken güncel ve popüler teknoloji yığını seçilmiştir:

*   **Core:** React 18, TypeScript, Vite
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand (Persist Middleware ile)
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Form Handling:** React Hook Form & Zod
*   **Utils:** clsx, tailwind-merge, date-fns

## 📂 Proje Yapısı

Yönergeye uygun olarak düzenli bir klasör yapısı oluşturulmuştur:

```bash
src/
├── components/     # UI bileşenleri (Button, Modal, Input vb.)
│   ├── common/     # Genel kullanımlı bileşenler
│   ├── layout/     # Header, Layout bileşenleri
│   └── todo/       # Todo'ya özgü bileşenler (List, Item, Form, Filter)
├── interfaces/     # TypeScript tip tanımları (todo.types.ts)
├── pages/          # Sayfa bileşenleri (HomePage, NotFoundPage)
├── store/          # Zustand durum yönetimi (todoStore.ts)
└── utils/          # Yardımcı fonksiyonlar
```

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için:

1.  Projeyi klonlayın:
    ```bash
    git clone https://github.com/kullaniciadi/protodo-app.git
    cd protodo-app
    ```

2.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

3.  Geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```

## ✅ Proje Çıktıları (Checklist)

*   [x] Html temelleri uygulandı.
*   [x] Tailwind CSS ile modern tasarım kodlandı.
*   [x] Javascript/TypeScript temelleri ile mantıksal kurgu yapıldı.
*   [x] ReactJS kütüphanesi component yapısında kullanıldı.
*   [x] CRUD (Ekle, Sil, Güncelle, Listele) işlemleri sorunsuz çalışıyor.
*   [x] Github üzerine yüklendi.

---

**Geliştirici Notu:** Bu proje, sadece bir ödev teslimi değil, aynı zamanda temiz kod (clean code) prensipleri, performans optimizasyonları ve kullanıcı deneyimi gözetilerek hazırlanmış profesyonel bir portfolyo çalışmasıdır.
