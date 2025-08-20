import { readFileSync } from 'fs';
import { storage } from './storage.js';

// Test mahsulotlari uchun placeholder rasmlar
const productImages = [
  'https://via.placeholder.com/400x300/3B82F6/ffffff?text=Mahsulot+1',
  'https://via.placeholder.com/400x300/EF4444/ffffff?text=Mahsulot+2', 
  'https://via.placeholder.com/400x300/10B981/ffffff?text=Mahsulot+3',
  'https://via.placeholder.com/400x300/F59E0B/ffffff?text=Mahsulot+4',
  'https://via.placeholder.com/400x300/8B5CF6/ffffff?text=Mahsulot+5',
  'https://via.placeholder.com/400x300/F97316/ffffff?text=Mahsulot+6'
];

// Mahsulot nomlari (Uzbekcha/Ruscha)
const productNames = [
  { uz: 'Yuqori sifatli plastik idishlar', ru: 'Качественная пластиковая посуда' },
  { uz: 'Chiroyli qog\'oz paketlar', ru: 'Красивые бумажные пакеты' },
  { uz: 'Mustahkam polietilen o\'ramlar', ru: 'Прочные полиэтиленовые обертки' },
  { uz: 'Professional oshxona anjomlari', ru: 'Профессиональные кухонные принадлежности' },
  { uz: 'Ekologik toza mahsulotlar', ru: 'Экологически чистые продукты' },
  { uz: 'Zamonaviy dizaynli tovarlar', ru: 'Товары современного дизайна' },
  { uz: 'Arzon narxdagi sifatli buyumlar', ru: 'Качественные товары по низким ценам' },
  { uz: 'Restoran uchun maxsus anjomlar', ru: 'Специальные принадлежности для ресторанов' },
  { uz: 'Kafe va qahvaxonalar uchun tovarlar', ru: 'Товары для кафе и кофеен' },
  { uz: 'Uy xo\'jaligi uchun foydali narsalar', ru: 'Полезные вещи для домашнего хозяйства' },
  { uz: 'Ofis uchun zarur materiallar', ru: 'Необходимые материалы для офиса' },
  { uz: 'Bolalar uchun xavfsiz o\'yinchoqlar', ru: 'Безопасные игрушки для детей' },
  { uz: 'Sport uchun professional jihozlar', ru: 'Профессиональное спортивное оборудование' },
  { uz: 'Elektron aksessuarlar to\'plami', ru: 'Набор электронных аксессуаров' },
  { uz: 'Modali ayollar kiyimi', ru: 'Модная женская одежда' },
  { uz: 'Erkaklar uchun klassik kiyim', ru: 'Классическая мужская одежда' },
  { uz: 'Bolalar kiyimlari kolleksiyasi', ru: 'Коллекция детской одежды' },
  { uz: 'Maishiy texnika ehtiyot qismlari', ru: 'Запчасти для бытовой техники' },
  { uz: 'Avtomobil uchun foydali aksessuarlar', ru: 'Полезные автомобильные аксессуары' },
  { uz: 'Bog\'dorchilik uchun asboblar', ru: 'Инструменты для садоводства' }
];

function getRandomPrice(): string {
  const basePrice = Math.floor(Math.random() * 50000) + 5000; // 5000-55000
  return basePrice.toString();
}

function getRandomWholesalePrice(price: string): string {
  const retail = parseInt(price);
  const wholesale = Math.floor(retail * 0.7); // 30% discount for wholesale
  return wholesale.toString();
}

function getRandomQuantity(): number {
  return Math.floor(Math.random() * 1000) + 50; // 50-1050
}

function getRandomMinQuantity(): number {
  return Math.floor(Math.random() * 20) + 1; // 1-21
}

function createSlug(nameUz: string): string {
  return nameUz
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-|-$/g, '');
}

async function seedProducts(): Promise<void> {
  try {
    console.log('Starting products seeding...');
    
    // Get all categories
    const categories = await storage.getCategories();
    if (categories.length === 0) {
      console.log('No categories found. Please run category seeding first.');
      return;
    }
    
    console.log(`Found ${categories.length} categories`);
    
    // Create 2-3 products for each category (limit to first 8 categories to avoid too many products)
    const categoriesToUse = categories.slice(0, 8);
    let productCount = 0;
    
    for (const category of categoriesToUse) {
      const productsPerCategory = Math.floor(Math.random() * 2) + 2; // 2-3 products per category
      
      for (let i = 0; i < productsPerCategory; i++) {
        const randomName = productNames[Math.floor(Math.random() * productNames.length)];
        const price = getRandomPrice();
        const wholesalePrice = getRandomWholesalePrice(price);
        const stockQuantity = getRandomQuantity();
        const minQuantity = getRandomMinQuantity();
        
        // Get 2-3 random images
        const imageCount = Math.floor(Math.random() * 2) + 2;
        const images: string[] = [];
        for (let j = 0; j < imageCount; j++) {
          images.push(productImages[Math.floor(Math.random() * productImages.length)]);
        }
        
        const productData = {
          nameUz: `${randomName.uz} ${i + 1}`,
          nameRu: `${randomName.ru} ${i + 1}`,
          descriptionUz: `${randomName.uz} uchun mukammal tanlov. Yuqori sifat va arzon narx.`,
          descriptionRu: `Отличный выбор для ${randomName.ru.toLowerCase()}. Высокое качество и доступная цена.`,
          categoryId: category.id,
          sellerId: 'default-seller',
          price,
          wholesalePrice,
          minQuantity,
          stockQuantity,
          unit: 'dona',
          images,
          slug: createSlug(`${randomName.uz}-${i + 1}`),
          isActive: true,
          isFeatured: Math.random() > 0.7, // 30% chance to be featured
        };
        
        await storage.createProduct(productData);
        productCount++;
        console.log(`Added product: ${productData.nameUz} (Category: ${category.nameUz})`);
      }
    }
    
    console.log(`Successfully seeded ${productCount} products!`);
    
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProducts().then(() => {
    console.log('Products seeding completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Products seeding failed:', error);
    process.exit(1);
  });
}

export { seedProducts };