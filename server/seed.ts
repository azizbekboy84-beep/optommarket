import { storage } from './storage.js';

// Helper function to create slug from text
function createSlug(text: string): string {
  const slugMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-', '_': '-'
  };
  
  return text.toLowerCase()
    .split('')
    .map(char => slugMap[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Parse bilingual category names (format: "Russian | Uzbek")
function parseCategoryName(fullName: string): { nameRu: string; nameUz: string } {
  const parts = fullName.split('|').map(part => part.trim());
  return {
    nameRu: parts[0] || fullName,
    nameUz: parts[1] || parts[0] || fullName
  };
}

// Real bilingual categories data
const categoriesData = [
  // Main category: Plastic bags
  {
    type: 'main',
    name: 'Полиэтиленовые пакеты | Plastik paketlar'
  },
  {
    type: 'sub',
    parent: 'Полиэтиленовые пакеты | Plastik paketlar',
    name: 'Полиэтиленовый пакет "Майка" без рисунка | Rasmsiz mayka paketlar'
  },
  {
    type: 'sub',
    parent: 'Полиэтиленовые пакеты | Plastik paketlar',
    name: 'Фасовочные пакеты и рулоне | Qadoqlash paketlari va rulonlari'
  },
  {
    type: 'sub',
    parent: 'Полиэтиленовые пакеты | Plastik paketlar',
    name: 'Полиэтиленовый пакет с замком zip-lock (струна) | Zip paketlar'
  },
  {
    type: 'sub',
    parent: 'Полиэтиленовые пакеты | Plastik paketlar',
    name: 'Мусорные пакеты | Axlat uchun qoplari'
  },
  {
    type: 'sub',
    parent: 'Полиэтиленовые пакеты | Plastik paketlar',
    name: 'Пакеты с вырубной ручкой | Kesilgan tutqichli paketlar'
  },
  {
    type: 'sub',
    parent: 'Полиэтиленовые пакеты | Plastik paketlar',
    name: 'Пакеты с петлевой ручкой | Halqa tutqichili sumkalar'
  },

  // Main category: Disposable tableware
  {
    type: 'main',
    name: 'Одноразовая посуда | Bir martali ishlatiladigan idishlar'
  },
  {
    type: 'sub',
    parent: 'Одноразовая посуда | Bir martali ishlatiladigan idishlar',
    name: 'Одноразовая пластиковая посуда | Plastmassa idishlar'
  },
  {
    type: 'sub',
    parent: 'Одноразовая посуда | Bir martali ishlatiladigan idishlar',
    name: 'Одноразовые бумажные стаканы, крышки и тарелки | Stakan va tarelkalar'
  },
  {
    type: 'sub',
    parent: 'Одноразовая посуда | Bir martali ishlatiladigan idishlar',
    name: 'Контейнеры и тара для ягод, блистерная упаковка для пищевых продуктов | Oziq-ovqat va pishiriq idishlari'
  },

  // Main category: Household goods
  {
    type: 'main',
    name: 'Товары для дома для магазинов кафе ресторанов баров | Uy buyumlari va do\'kon tovarlari'
  },
  {
    type: 'sub',
    parent: 'Товары для дома для магазинов кафе ресторанов баров | Uy buyumlari va do\'kon tovarlari',
    name: 'Бытовые товары для дома | Uy uchun maishiy buyumlar'
  },
  {
    type: 'sub',
    parent: 'Товары для дома для магазинов кафе ресторанов баров | Uy buyumlari va do\'kon tovarlari',
    name: 'Товары для кафе, ресторанов и баров | Kafe va restoran tovarlari'
  },

  // Main category: Household chemicals
  {
    type: 'main',
    name: 'Бытовая химия | Maishiy kimyo'
  },
  {
    type: 'sub',
    parent: 'Бытовая химия | Maishiy kimyo',
    name: 'Моющие средства | Yuvish vositalari'
  },
  {
    type: 'sub',
    parent: 'Бытовая химия | Maishiy kimyo',
    name: 'Чистящие средства | Tozalash vositalari'
  },

  // Main category: Clothing
  {
    type: 'main',
    name: 'Одежда | Kiyim-kechak'
  },
  {
    type: 'sub',
    parent: 'Одежда | Kiyim-kechak',
    name: 'Детская одежда | Bolalar kiyimi'
  },
  {
    type: 'sub',
    parent: 'Одежда | Kiyim-kechak',
    name: 'Женская одежда | Ayollar kiyimi'
  },
  {
    type: 'sub',
    parent: 'Одежда | Kiyim-kechak',
    name: 'Мужская одежда | Erkaklar kiyimi'
  },

  // Main category: Electronics
  {
    type: 'main',
    name: 'Электроника | Elektronika'
  },
  {
    type: 'sub',
    parent: 'Электроника | Elektronika',
    name: 'Бытовая техника для дома | Uy uchun maishiy texnika'
  },
  {
    type: 'sub',
    parent: 'Электроника | Elektronika',
    name: 'Бытовая техника для кухни | Oshxona uchun texnika'
  },

  // Main category: Office supplies
  {
    type: 'main',
    name: 'Канстовары для школы и офиса все для учебы и работы | Maktab va ofis uchun tovarlar'
  },
  {
    type: 'sub',
    parent: 'Канстовары для школы и офиса все для учебы и работы | Maktab va ofis uchun tovarlar',
    name: 'Школьные принадлежности | Maktab jihozlari'
  },
  {
    type: 'sub',
    parent: 'Канстовары для школы и офиса все для учебы и работы | Maktab va ofis uchun tovarlar',
    name: 'Офисные принадлежности | Ofis jihozlari'
  },

  // Main category: Holiday items
  {
    type: 'main',
    name: 'Товары для праздников | Bayram tovarlari'
  },
  {
    type: 'sub',
    parent: 'Товары для праздников | Bayram tovarlari',
    name: 'Украшения для праздников | Bayram bezaklari'
  },
  {
    type: 'sub',
    parent: 'Товары для праздников | Bayram tovarlari',
    name: 'Подарочная упаковка | Sovg\'a qadoqlari'
  }
];

export async function seedDatabase() {
  console.log('🌱 Starting database seeding with real bilingual data...');

  try {
    // Clear existing data
    console.log('🗑️ Clearing existing categories and products...');
    
    // Create category map to store main categories first, then subcategories
    const categoryMap = new Map<string, string>(); // key: category name, value: category id
    
    // Process main categories first
    console.log('📁 Creating main categories...');
    for (const categoryData of categoriesData.filter(c => c.type === 'main')) {
      const parsed = parseCategoryName(categoryData.name);
      const slug = createSlug(parsed.nameRu);
      const categoryId = `cat-${slug}`;
      
      const category = {
        id: categoryId,
        nameUz: parsed.nameUz,
        nameRu: parsed.nameRu,
        slug,
        parentId: null,
        icon: getIconForCategory(parsed.nameRu),
        isActive: true
      };

      await storage.createCategory(category);
      categoryMap.set(categoryData.name, categoryId);
      
      console.log(`✓ Created main category: ${parsed.nameRu} | ${parsed.nameUz}`);
    }

    // Process subcategories
    console.log('📂 Creating subcategories...');
    for (const categoryData of categoriesData.filter(c => c.type === 'sub')) {
      const parsed = parseCategoryName(categoryData.name);
      const parentId = categoryMap.get(categoryData.parent!);
      const slug = createSlug(parsed.nameRu);
      const categoryId = `cat-${slug}`;
      
      if (!parentId) {
        console.warn(`⚠️ Parent category not found for: ${categoryData.name}`);
        continue;
      }

      const category = {
        id: categoryId,
        nameUz: parsed.nameUz,
        nameRu: parsed.nameRu,
        slug,
        parentId,
        icon: getIconForCategory(parsed.nameRu),
        isActive: true
      };

      await storage.createCategory(category);
      categoryMap.set(categoryData.name, categoryId);
      
      console.log(`  ✓ Created subcategory: ${parsed.nameRu} | ${parsed.nameUz}`);
    }

    // Create sample products for some categories
    console.log('📦 Creating sample products...');
    await createSampleProducts(categoryMap);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Total categories created: ${categoryMap.size}`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

// Helper function to assign icons to categories
function getIconForCategory(categoryName: string): string {
  const iconMap: Record<string, string> = {
    'Полиэтиленовые пакеты': 'Package',
    'Одноразовая посуда': 'Utensils',
    'Товары для дома': 'Folder',
    'Бытовая химия': 'Box',
    'Одежда': 'Shirt',
    'Электроника': 'Smartphone',
    'Канстовары': 'Folder',
    'Товары для праздников': 'Package'
  };
  
  // Find matching icon based on category name
  for (const [key, icon] of Object.entries(iconMap)) {
    if (categoryName.includes(key)) {
      return icon;
    }
  }
  
  return 'Folder'; // Default icon
}

// Create sample products for demonstration
async function createSampleProducts(categoryMap: Map<string, string>) {
  const sampleProducts = [
    {
      nameRu: 'Пакет майка белый 30x60',
      nameUz: 'Oq mayka paket 30x60',
      categoryName: 'Полиэтиленовый пакет "Майка" без рисунка | Rasmsiz mayka paketlar',
      price: 15.0,
      wholesalePrice: 12.0
    },
    {
      nameRu: 'Одноразовые пластиковые стаканы 200мл',
      nameUz: 'Bir martalik plastik stakanlar 200ml',
      categoryName: 'Одноразовая пластиковая посуда | Plastmassa idishlar',
      price: 25.0,
      wholesalePrice: 20.0
    },
    {
      nameRu: 'Моющее средство для посуды 500мл',
      nameUz: 'Idish yuvish vositasi 500ml',
      categoryName: 'Моющие средства | Yuvish vositalari',
      price: 35.0,
      wholesalePrice: 28.0
    }
  ];

  for (const productData of sampleProducts) {
    const categoryId = categoryMap.get(productData.categoryName);
    if (!categoryId) {
      console.warn(`⚠️ Category not found for product: ${productData.nameRu}`);
      continue;
    }

    const product = {
      id: `prod-${createSlug(productData.nameRu)}`,
      nameUz: productData.nameUz,
      nameRu: productData.nameRu,
      descriptionUz: `${productData.nameUz} - sifatli mahsulot optom narxlarda`,
      descriptionRu: `${productData.nameRu} - качественный товар по оптовым ценам`,
      slug: createSlug(productData.nameRu),
      categoryId,
      price: productData.price,
      wholesalePrice: productData.wholesalePrice,
      stockQuantity: 1000,
      images: [],
      isActive: true
    };

    await storage.createProduct(product);
    console.log(`  ✓ Created product: ${productData.nameRu} | ${productData.nameUz}`);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}