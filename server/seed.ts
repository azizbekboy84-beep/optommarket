import { randomUUID } from "crypto";

// Real data from Optombazar.uz website
export const realCategories = [
  // Main categories
  {
    id: "polietilen-paketlar",
    nameUz: "Plastik paketlar",
    nameRu: "Полиэтиленовые пакеты",
    descriptionUz: "Har xil o'lcham va qalinlikdagi polietilen paketlar",
    descriptionRu: "Полиэтиленовые пакеты различных размеров и толщин",
    slug: "polietilen-paketlar",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "Package",
    parentId: null
  },
  {
    id: "bir-martali-idishlar",
    nameUz: "Bir martali ishlatiladigan idishlar",
    nameRu: "Одноразовая посуда",
    descriptionUz: "Plastik va qog'ozdan yasalgan bir martali idishlar",
    descriptionRu: "Одноразовая посуда из пластика и бумаги",
    slug: "bir-martali-idishlar",
    image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "UtensilsCrossed",
    parentId: null
  },
  {
    id: "uy-kimyoviy-moddalari",
    nameUz: "Uy kimyoviy moddalari",
    nameRu: "Бытовая химия",
    descriptionUz: "Tozalash va parvarish uchun kimyoviy vositalar",
    descriptionRu: "Химические средства для уборки и ухода",
    slug: "uy-kimyoviy-moddalari",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "Sparkles",
    parentId: null
  },
  {
    id: "elektronika",
    nameUz: "Elektronika",
    nameRu: "Электроника",
    descriptionUz: "Maishiy texnika va elektron qurilmalar",
    descriptionRu: "Бытовая техника и электронные устройства",
    slug: "elektronika",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "Smartphone",
    parentId: null
  },
  {
    id: "kiyim-kechak",
    nameUz: "Kiyim-kechak",
    nameRu: "Одежда",
    descriptionUz: "Erkaklar, ayollar va bolalar kiyimlari",
    descriptionRu: "Мужская, женская и детская одежда",
    slug: "kiyim-kechak",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "Shirt",
    parentId: null
  },
  {
    id: "kantstovarlar",
    nameUz: "Kantstovarlar",
    nameRu: "Канцтовары",
    descriptionUz: "Yozish va chizish uchun buyumlar",
    descriptionRu: "Товары для письма и рисования",
    slug: "kantstovarlar",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "PenTool",
    parentId: null
  },

  // Subcategories for Plastik paketlar
  {
    id: "mayka-paketlar",
    nameUz: "Rasmsiz mayka paketlar",
    nameRu: "Полиэтиленовый пакет \"Майка\" без рисунка",
    descriptionUz: "Oddiy mayka shaklidagi plastik paketlar",
    descriptionRu: "Обычные пластиковые пакеты в форме майки",
    slug: "mayka-paketlar",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "ShoppingBag",
    parentId: "polietilen-paketlar"
  },
  {
    id: "zip-paketlar",
    nameUz: "Zip paketlar",
    nameRu: "Полиэтиленовый пакет с замком zip-lock (струна)",
    descriptionUz: "Zip qulfli polietilen paketlar",
    descriptionRu: "Полиэтиленовые пакеты с zip замком",
    slug: "zip-paketlar",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "Package",
    parentId: "polietilen-paketlar"
  },
  {
    id: "kesilgan-tutqichli-paketlar",
    nameUz: "Kesilgan tutqichli paketlar",
    nameRu: "Пакеты с вырубной ручкой",
    descriptionUz: "Kesilgan tutqichga ega plastik paketlar",
    descriptionRu: "Пластиковые пакеты с вырубной ручкой",
    slug: "kesilgan-tutqichli-paketlar",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "Grip",
    parentId: "polietilen-paketlar"
  },

  // Subcategories for Bытовая химия
  {
    id: "yuvish-vositalari",
    nameUz: "Yuvish vositalari",
    nameRu: "Средства для стирки",
    descriptionUz: "Kir yuvish uchun kukunlar va suyuqliklar",
    descriptionRu: "Порошки и жидкости для стирки",
    slug: "yuvish-vositalari",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "Shirt",
    parentId: "uy-kimyoviy-moddalari"
  },
  {
    id: "tozalash-vositalari",
    nameUz: "Tozalash uchun tovarlar",
    nameRu: "Товары для уборки (тряпки, губки, салфетки, скатерти)",
    descriptionUz: "Tozalash uchun latta, gubka va boshqa buyumlar",
    descriptionRu: "Тряпки, губки и другие товары для уборки",
    slug: "tozalash-vositalari",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    icon: "Sparkles",
    parentId: "uy-kimyoviy-moddalari"
  }
];

export const realProducts = [
  {
    id: randomUUID(),
    nameUz: "\"Louis Vuitton\" tasvirli paket 40x50 sm",
    nameRu: "Пакеты с вырубной ручкой Louis Vuitton 40-50 см",
    descriptionUz: "Yuqori sifatli polietilen paket, 50 mikron qalinlikda, 100 dona blokda",
    descriptionRu: "Высококачественный полиэтиленовый пакет, толщина 50 микрон, в блоке 100 штук",
    slug: "pakety-s-vyrubnoy-ruchkoy-louis-vuitton-40-50-sm",
    price: "1000.00",
    wholesalePrice: "900.00",
    categoryId: "kesilgan-tutqichli-paketlar",
    sellerId: "admin-user-1",
    images: ["https://optombazar.uz/image/cache/catalog/products/2023/10/26/photo_2023-10-26_16-08-31-500x500.jpg"],
    stockQuantity: 14000,
    minQuantity: 100,
    wholesaleMinQuantity: 1400,
    unit: "dona",
    specifications: {
      "O'lchami": "40x50 sm",
      "Qalinligi": "50 mikron",
      "Material": "Yuqori bosimli polietilen (LDPE)",
      "Soni (blokda)": "100 dona",
      "Ishlab chiqaruvchi": "O'zbekiston"
    },
    videoUrl: null
  },
  {
    id: randomUUID(),
    nameUz: "Oziq-ovqat uchun streych plyonka Casper 300 m",
    nameRu: "Стрейч-пленка Casper 300 м",
    descriptionUz: "Oziq-ovqat mahsulotlarini saqlash uchun Casper brendi streych plyonka",
    descriptionRu: "Стрейч-пленка бренда Casper для хранения пищевых продуктов",
    slug: "streych-plenka-casper-300-m",
    price: "45000.00",
    wholesalePrice: "42000.00",
    categoryId: "polietilen-paketlar",
    sellerId: "admin-user-1",
    images: ["https://optombazar.uz/image/cache/catalog/products/2023/11/01/photo_2023-11-01_12-25-10-500x500.jpg"],
    stockQuantity: 50,
    minQuantity: 1,
    wholesaleMinQuantity: 10,
    unit: "rulon",
    specifications: {
      "Uzunligi": "300 m",
      "Eni": "29 sm",
      "Qalinligi": "8 mikron",
      "Brend": "Casper",
      "Ishlab chiqaruvchi": "O'zbekiston"
    },
    videoUrl: null
  },
  {
    id: randomUUID(),
    nameUz: "Ariel 1.5 kg kir yuvish kukuni",
    nameRu: "Ariel 1.5 кг стиральный порошок",
    descriptionUz: "Avtomat kir yuvish mashinasi uchun Ariel brendi kukuni",
    descriptionRu: "Стиральный порошок Ariel для автоматических стиральных машин",
    slug: "ariel-15-kg-stiralnyy-poroshok",
    price: "45000.00",
    wholesalePrice: "42000.00",
    categoryId: "yuvish-vositalari",
    sellerId: "admin-user-1",
    images: ["https://optombazar.uz/image/cache/catalog/products/2024/02/10/photo_2024-02-10_13-09-51-500x500.jpg"],
    stockQuantity: 120,
    minQuantity: 1,
    wholesaleMinQuantity: 5,
    unit: "dona",
    specifications: {
      "Og'irligi": "1.5 kg",
      "Turi": "Avtomat",
      "Brend": "Ariel"
    },
    videoUrl: null
  },
  {
    id: randomUUID(),
    nameUz: "Plastik bir martali stakan 200ml",
    nameRu: "Пластиковый одноразовый стакан 200мл",
    descriptionUz: "Shaffof plastikdan yasalgan bir martali stakan",
    descriptionRu: "Одноразовый стакан из прозрачного пластика",
    slug: "plastik-bir-martali-stakan-200ml",
    price: "12000.00",
    wholesalePrice: "11000.00",
    categoryId: "bir-martali-idishlar",
    sellerId: "admin-user-1",
    images: ["https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"],
    stockQuantity: 1000,
    minQuantity: 50,
    wholesaleMinQuantity: 200,
    unit: "paket",
    specifications: {
      "Hajmi": "200ml",
      "Material": "PP plastik",
      "Soni (paketda)": "50 dona",
      "Ranglar": "Shaffof"
    },
    videoUrl: null
  },
  {
    id: randomUUID(),
    nameUz: "Qog'oz tarelka 23sm diametr",
    nameRu: "Бумажная тарелка диаметр 23см",
    descriptionUz: "Ekologik toza qog'ozdan yasalgan bir martali tarelka",
    descriptionRu: "Одноразовая тарелка из экологически чистой бумаги",
    slug: "qogoz-tarelka-23sm-diametr",
    price: "15000.00",
    wholesalePrice: "14000.00",
    categoryId: "bir-martali-idishlar",
    sellerId: "admin-user-1",
    images: ["https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"],
    stockQuantity: 500,
    minQuantity: 25,
    wholesaleMinQuantity: 100,
    unit: "paket",
    specifications: {
      "Diametri": "23 sm",
      "Material": "Karton qog'oz",
      "Soni (paketda)": "25 dona",
      "Ranglar": "Oq"
    },
    videoUrl: null
  }
];

export const realBlogPosts = [
  {
    id: randomUUID(),
    title: "Moliyaviy savodxonlik bo'yicha to'liq tushuncha",
    content: `Moliyaviy savodxonlik - bu shaxsning o'z moliyaviy resurslarini samarali boshqarish, investitsiya qilish va moliyaviy xavflardan himoyalanish bo'yicha bilim va ko'nikmalar majmuasidir.

Bu maqolada moliyaviy savodxonlikning asosiy printsiplari, ahamiyati va uni oshirish yo'llari haqida batafsil ma'lumot beriladi.

## Moliyaviy savodxonlikning asosiy qismlari:

1. **Byudjet tuzish va nazorat qilish**
2. **Jamg'arish va investitsiya**
3. **Qarzlarni boshqarish**
4. **Sug'urta va xavfsizlik**
5. **Pensiya rejalashtirish**

Moliyaviy savodxonlik bizning kundalik hayotimizda muhim rol o'ynaydi va kelajakda barqaror moliyaviy holatga erishishimizga yordam beradi.`,
    excerpt: "Moliyaviy savodxonlik haqida bilish kerak bo'lgan barcha narsalar",
    imageUrl: "https://optombazar.uz/image/cache/catalog/blog/2023/11/04/moliyaviy-savodxonlik-haqida-toliq-tushuncha-750x422.png",
    slug: "moliyaviy-savodxonlik-bo-yicha-to-liq-tushuncha",
    tags: ["moliya", "savodxonlik", "investitsiya", "byudjet"],
    language: "uz",
    isPublished: true,
    isAutoGenerated: false,
    source: "admin"
  },
  {
    id: randomUUID(),
    title: "Ramazon taqvimi 2024 Toshkent shahri",
    content: `2024 yilgi Ramazon oyi taqvimi Toshkent shahri uchun tayyorlandi. Bu taqvim orqali siz har kunlik ro'za tutish vaqtlarini aniq bilib olishingiz mumkin.

## Ramazon oyining ahamiyati

Ramazon oyi musulmonlar uchun eng muqaddas oylardan biridir. Bu oyda ro'za tutish, Qur'on o'qish va ibodatga ko'proq vaqt ajratish tavsiya etiladi.

## 2024 yil Ramazon taqvimi xususiyatlari:

- Ramazon oyining boshlangichi
- Saharlik va iftorlik vaqtlari
- Laylat ul-Qadr kechalari
- Hayit sanasi

Toshkent shahri uchun ro'za vaqtlari mintaqaviy geografik joylashuvga qarab aniqlanadi.`,
    excerpt: "2024 yil Ramazon oyi taqvimi Toshkent shahri uchun",
    imageUrl: "https://optombazar.uz/image/cache/catalog/blog/2024/02/29/ramazon-taqvimi-2024-toshkent-750x422.png",
    slug: "ramazon-taqvimi-2024-toshkent-shahri",
    tags: ["ramazon", "taqvim", "toshkent", "roza"],
    language: "uz",
    isPublished: true,
    isAutoGenerated: false,
    source: "admin"
  },
  {
    id: randomUUID(),
    title: "Ulgurji savdo platformasida muvaffaqiyat sirlari",
    content: `Optombazar.uz - O'zbekistondagi yetakchi ulgurji savdo platformasi. Bu maqolada platformada muvaffaqiyatli savdo qilish sirlari haqida gaplashamiz.

## Platformaning afzalliklari:

1. **Keng mahsulot assortimenti** - 10,000+ mahsulot
2. **Raqobatbardosh narxlar** - To'g'ridan-to'g'ri ishlab chiqaruvchilardan
3. **Tez yetkazib berish** - Butun O'zbekiston bo'ylab
4. **Sifat kafolati** - Barcha mahsulotlar sertifikatlangan

## Savdo qilish uchun maslahatlar:

- Bozorni o'rganing
- Sifatli mahsulotlarni tanlang
- Mijozlar bilan aloqani rivojlantiring
- Marketing strategiyasini ishlab chiqing

Muvaffaqiyatli biznes uchun to'g'ri platformani tanlash muhim qadam hisoblanadi.`,
    excerpt: "Ulgurji savdoda muvaffaqiyat qozonish yo'llari",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=750&h=422",
    slug: "ulgurji-savdo-platformasida-muvaffaqiyat-sirlari",
    tags: ["ulgurji", "savdo", "biznes", "muvaffaqiyat"],
    language: "uz",
    isPublished: true,
    isAutoGenerated: false,
    source: "admin"
  }
];