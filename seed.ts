import { db } from './server/db.js';
import { categories, products, users, blogPosts } from './shared/schema.js';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  console.log('🌱 Ma\'lumotlar bazasini to\'ldirish boshlandi...');

  try {
    // Clear existing data
    console.log('🗑️ Eski ma\'lumotlarni tozalash...');
    await db.delete(products);
    await db.delete(categories);  
    await db.delete(blogPosts);
    await db.delete(users);

    // Insert categories
    console.log('📂 Kategoriyalarni qo\'shish...');
    const categoryData = [
      {
        id: 'polietilen-paketlar',
        nameUz: 'Plastik paketlar',
        nameRu: 'Пластиковые пакеты', 
        descriptionUz: 'Turli xil plastik paketlar: xarid uchun, oziq-ovqat uchun va boshqalar',
        descriptionRu: 'Различные пластиковые пакеты: для покупок, пищевых продуктов и другие',
        slug: 'polietilen-paketlar',
        imageUrl: 'https://optombazar.uz/image/cache/catalog/categories/polietilen-paketlar-500x500.jpg',
        isActive: true
      },
      {
        id: 'bir-martali-idishlar', 
        nameUz: 'Bir martali idishlar',
        nameRu: 'Одноразовая посуда',
        descriptionUz: 'Plastik stakanchalar, likopchalar, vilka-qoshiqlar',
        descriptionRu: 'Пластиковые стаканы, тарелки, вилки-ложки',
        slug: 'bir-martali-idishlar',
        imageUrl: 'https://optombazar.uz/image/cache/catalog/categories/bir-martali-idishlar-500x500.jpg',
        isActive: true
      },
      {
        id: 'oziq-ovqat-konteynerlar',
        nameUz: 'Oziq-ovqat konteynerlar', 
        nameRu: 'Пищевые контейнеры',
        descriptionUz: 'Oziq-ovqat saqlash uchun konteynerlar',
        descriptionRu: 'Контейнеры для хранения продуктов',
        slug: 'oziq-ovqat-konteynerlar',
        imageUrl: 'https://optombazar.uz/image/cache/catalog/categories/konteynerlar-500x500.jpg',
        isActive: true
      },
      {
        id: 'qogoz-mahsulotlar',
        nameUz: 'Qog\'oz mahsulotlar',
        nameRu: 'Бумажная продукция', 
        descriptionUz: 'Qog\'oz paketlar, salfetka, rulon qog\'ozlar',
        descriptionRu: 'Бумажные пакеты, салфетки, рулонная бумага',
        slug: 'qogoz-mahsulotlar',
        imageUrl: 'https://optombazar.uz/image/cache/catalog/categories/qogoz-500x500.jpg',
        isActive: true
      },
      {
        id: 'tozalash-vositalari',
        nameUz: 'Tozalash vositalari',
        nameRu: 'Моющие средства',
        descriptionUz: 'Idish yuvish, kir yuvish va uy tozalash vositalari',
        descriptionRu: 'Средства для мытья посуды, стирки и уборки дома',
        slug: 'tozalash-vositalari',
        imageUrl: 'https://optombazar.uz/image/cache/catalog/categories/tozalash-500x500.jpg',
        isActive: true
      }
    ];

    await db.insert(categories).values(categoryData);

    // Insert admin user
    console.log('👤 Admin foydalanuvchisini qo\'shish...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values([
      {
        id: 'admin-user-1',
        username: 'admin',
        password: hashedPassword,
        email: 'admin@optombazar.uz',
        role: 'admin'
      }
    ]);

    // Insert products
    console.log('🛍️ Mahsulotlarni qo\'shish...');
    const productData = [
      {
        id: 'prod-real-1',
        nameUz: '"Louis Vuitton" tasvirli paket 40x50 sm',
        nameRu: 'Пакеты с вырубной ручкой Louis Vuitton 40-50 см',
        descriptionUz: 'Yuqori sifatli polietilen paket, 50 mikron qalinlikda, 100 dona blokda',
        descriptionRu: 'Высококачественный полиэтиленовый пакет, толщина 50 микрон, в блоке 100 штук',
        slug: 'pakety-s-vyrubnoy-ruchkoy-louis-vuitton-40-50-sm',
        price: '1000.00',
        wholesalePrice: '900.00',
        categoryId: 'polietilen-paketlar',
        sellerId: 'admin-user-1',
        images: ['https://optombazar.uz/image/cache/catalog/products/2023/10/26/photo_2023-10-26_16-08-31-500x500.jpg'],
        stockQuantity: 500,
        minQuantity: 100,
        unit: 'dona',
        specifications: JSON.stringify({
          "O'lchami": "40x50 sm",
          "Qalinligi": "50 mikron", 
          "Material": "Yuqori bosimli polietilen (LDPE)",
          "Soni (blokda)": "100 dona",
          "Ishlab chiqaruvchi": "O'zbekiston"
        }),
        isActive: true,
        isFeatured: true
      },
      {
        id: 'prod-real-2',
        nameUz: 'Oziq-ovqat uchun streych plyonka Casper 300 m',
        nameRu: 'Стрейч-пленка Casper 300 м',
        descriptionUz: 'Oziq-ovqat mahsulotlarini saqlash uchun Casper brendi streych plyonka',
        descriptionRu: 'Стрейч-пленка бренда Casper для хранения пищевых продуктов',
        slug: 'streych-plenka-casper-300-m',
        price: '45000.00',
        wholesalePrice: '42000.00',
        categoryId: 'polietilen-paketlar',
        sellerId: 'admin-user-1',
        images: ['https://optombazar.uz/image/cache/catalog/products/2023/11/01/photo_2023-11-01_12-25-10-500x500.jpg'],
        stockQuantity: 50,
        minQuantity: 1,
        unit: 'rulon',
        specifications: JSON.stringify({
          "Uzunligi": "300 m",
          "Eni": "29 sm",
          "Qalinligi": "8 mikron",
          "Brend": "Casper",
          "Ishlab chiqaruvchi": "O'zbekiston"
        }),
        isActive: true,
        isFeatured: true
      },
      {
        id: 'prod-real-3',
        nameUz: 'Plastik bir martali stakan 200ml',
        nameRu: 'Пластиковый одноразовый стакан 200мл',
        descriptionUz: 'Shaffof plastik stakan, 200ml hajmda, 100 dona paketda',
        descriptionRu: 'Прозрачный пластиковый стакан, объем 200мл, в упаковке 100 штук',
        slug: 'plastik-bir-martali-stakan-200ml',
        price: '25000.00',
        wholesalePrice: '22000.00',
        categoryId: 'bir-martali-idishlar',
        sellerId: 'admin-user-1',
        images: ['https://optombazar.uz/image/cache/catalog/products/2023/09/15/stakan-200ml-500x500.jpg'],
        stockQuantity: 200,
        minQuantity: 50,
        unit: 'paket',
        specifications: JSON.stringify({
          "Hajmi": "200 ml",
          "Material": "PP (Polipropilen)",
          "Rangi": "Shaffof",
          "Soni": "100 dona/paket",
          "Ishlab chiqaruvchi": "Turkiya"
        }),
        isActive: true,
        isFeatured: false
      }
    ];

    await db.insert(products).values(productData);

    console.log('📝 Blog postlari hozircha qo\'shilmayapti - schema muammosi tufayli');

    console.log('✅ Ma\'lumotlar bazasi muvaffaqiyatli to\'ldirildi!');
    console.log('📊 Qo\'shildi:');
    console.log(`   - ${categoryData.length} ta kategoriya`);
    console.log(`   - ${productData.length} ta mahsulot`);  
    console.log(`   - 1 ta admin foydalanuvchisi`);

  } catch (error) {
    console.error('❌ Xato:', error);
    throw error;
  }
}

seedDatabase()
  .then(() => {
    console.log('🎉 Seed jarayoni yakunlandi!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed jarayonida xato:', error);
    process.exit(1);
  });