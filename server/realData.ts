// Real Optombazar.uz data - ESM compatible version
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
    parentId: null,
    isActive: true,
    createdAt: new Date()
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
    parentId: null,
    isActive: true,
    createdAt: new Date()
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
    parentId: null,
    isActive: true,
    createdAt: new Date()
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
    parentId: null,
    isActive: true,
    createdAt: new Date()
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
    parentId: null,
    isActive: true,
    createdAt: new Date()
  }
];

export const realProducts = [
  {
    id: "prod-real-1",
    nameUz: "\"Louis Vuitton\" tasvirli paket 40x50 sm",
    nameRu: "Пакеты с вырубной ручкой Louis Vuitton 40-50 см",
    descriptionUz: "Yuqori sifatli polietilen paket, 50 mikron qalinlikda, 100 dona blokda",
    descriptionRu: "Высококачественный полиэтиленовый пакет, толщина 50 микрон, в блоке 100 штук",
    slug: "pakety-s-vyrubnoy-ruchkoy-louis-vuitton-40-50-sm",
    price: "1000.00",
    wholesalePrice: "900.00",
    categoryId: "polietilen-paketlar",
    sellerId: "admin-user-1",
    images: ["https://optombazar.uz/image/cache/catalog/products/2023/10/26/photo_2023-10-26_16-08-31-500x500.jpg"],
    stockQuantity: 500,
    minQuantity: 100,
    unit: "dona",
    specifications: JSON.stringify({
      "O'lchami": "40x50 sm",
      "Qalinligi": "50 mikron",
      "Material": "Yuqori bosimli polietilen (LDPE)",
      "Soni (blokda)": "100 dona",
      "Ishlab chiqaruvchi": "O'zbekiston"
    }),
    videoUrl: null,
    isActive: true,
    isFeatured: true,
    createdAt: new Date()
  },
  {
    id: "prod-real-2",
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
    unit: "rulon",
    specifications: JSON.stringify({
      "Uzunligi": "300 m",
      "Eni": "29 sm",
      "Qalinligi": "8 mikron",
      "Brend": "Casper",
      "Ishlab chiqaruvchi": "O'zbekiston"
    }),
    videoUrl: null,
    isActive: true,
    isFeatured: true,
    createdAt: new Date()
  },
  {
    id: "prod-real-3",
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
    unit: "paket",
    specifications: JSON.stringify({
      "Hajmi": "200ml",
      "Material": "PP plastik",
      "Soni (paketda)": "50 dona",
      "Ranglar": "Shaffof"
    }),
    videoUrl: null,
    isActive: true,
    isFeatured: true,
    createdAt: new Date()
  }
];

export const realBlogPosts = [
  {
    id: "blog-real-1",
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
    source: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];