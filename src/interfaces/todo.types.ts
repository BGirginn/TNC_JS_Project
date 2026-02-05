// öncelik seviyeleri - görevin ne kadar acil olduğunu belirler
//! enum kullanınca sabit değerler tanımlarsın, string yerine type-safe olur
export enum Priority {
  LOW = 'low',             // düşük öncelik - acil değil (ikon: ArrowDown veya benzeri)
  MEDIUM = 'medium',       // orta öncelik - normal işler
  HIGH = 'high',           // yüksek öncelik - acil yapılması lazım
}

// görevin hangi aşamada olduğunu gösterir
export enum TodoStatus {
  PENDING = 'pending',         // beklemede - henüz başlanmadı
  IN_PROGRESS = 'in_progress', // devam ediyor - üzerinde çalışılıyor  
  COMPLETED = 'completed',     // tamamlandı - bitti artık
}

//? interface'ler objelerin şeklini tanımlar, typescript'te tip güvenliği sağlar

// kategori yapısı - görevleri gruplamak için kullanılır
export interface Category {
  id: string;        // benzersiz kimlik
  name: string;      // kategori adı
  color: string;     // renk kodu
  icon: string;      // ikon ismi
}

// etiket yapısı - görevleri etiketlemek için (yeni özellik)
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// ana görev yapısı - uygulamanın temel veri modeli
//! burası en önemli interface, tüm görev işlemleri buna göre yapılır
export interface Todo {
  id: string;              // benzersiz kimlik - crypto.randomUUID() ile oluşturulur
  title: string;           // başlık - zorunlu alan
  description?: string;    // açıklama - opsiyonel, ? işareti opsiyonel demek
  completed: boolean;      // tamamlandı mı - true/false
  priority: Priority;      // öncelik seviyesi - yukarıdaki enum'dan
  status: TodoStatus;      // durum - pending, in_progress, completed
  categoryId?: string;     // kategori id'si - opsiyonel
  tags: string[];          // etiketler - dizi olarak tutulur
  dueDate?: Date;          // bitiş tarihi - opsiyonel
  position: number;        // sıralama pozisyonu - drag&drop için kullanılır
  createdAt: Date;         // oluşturulma tarihi
  updatedAt: Date;         // güncellenme tarihi
}

// filtreleme için kullanılan interface
export interface TodoFilter {
  status?: TodoStatus[];   // durum filtresi
  priority?: Priority[];   // öncelik filtresi
  categoryId?: string;     // kategori filtresi
  tagId?: string;          // etiket filtresi (yeni)
  searchQuery?: string;    // arama metni
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// istatistik yapısı - dashboard'da gösterilir
export interface TodoStats {
  total: number;           // toplam görev sayısı
  completed: number;       // tamamlanan
  pending: number;         // bekleyen
  inProgress: number;      // devam eden
  completionRate: number;  // tamamlanma yüzdesi - %75 falan
}

// form input yapısı - yeni görev eklerken kullanılır
export interface TodoFormInput {
  title: string;
  description?: string;
  priority: Priority;
  categoryId?: string;
  tags?: string;           // virgülle ayrılmış string olarak alınır, sonra diziye çevrilir
}

//! Türkçe alias'lar - eğitim amaçlı, kodda hem türkçe hem ingilizce kullanılabilir
export type Oncelik = Priority;
export type Durum = TodoStatus;
export type Kategori = Category;
export type Gorev = Todo;
export type GorevFiltre = TodoFilter;
export type GorevIstatistik = TodoStats;
export type GorevFormInput = TodoFormInput;
