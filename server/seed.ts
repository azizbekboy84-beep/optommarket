import { readFileSync } from 'fs';
import { join } from 'path';
import { parseStringPromise } from 'xml2js';
import { storage } from './storage.js';

interface SitemapUrl {
  loc: string[];
  priority: string[];
}

interface Sitemap {
  urlset: {
    url: SitemapUrl[];
  };
}

// Helper function to convert Russian category names to Uzbek
function generateUzbekName(russianName: string): string {
  const translations: Record<string, string> = {
    'Полиэтиленовые пакеты': 'Polietilen paketlar',
    'Одноразовая посуда': 'Bir martalik idishlar',
    'Товары для дома для магазинов кафе ресторанов баров': 'Uy va do\'kon uchun tovarlar',
    'Бытовая химия': 'Maishiy kimyo',
    'Одежда': 'Kiyim-kechak',
    'Электроника': 'Elektronika',
    'Канстовары для школы и офиса все для учебы и работы': 'Maktab va ofis uchun tovarlar',
    'Товары для праздников': 'Bayram tovarlari',
    // Add more translations as needed
    'Полиэтиленовый пакет майка без рисунка': 'Rasmisiz plastik paket',
    'Фасовочные пакеты и рулоне': 'Fasovka paketlari va rulon',
    'Одноразовая пластиковая посуда': 'Bir martalik plastik idishlar',
    'Детская одежда': 'Bolalar kiyimi',
    'Женская одежда': 'Ayollar kiyimi',
    'Мужская одежда': 'Erkaklar kiyimi',
    'Бытовая техника для дома': 'Uy uchun maishiy texnika',
    'Бытовая техника для кухни': 'Oshxona uchun texnika'
  };
  
  return translations[russianName] || russianName;
}

// Helper function to create slug from Russian text
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

async function parseSitemap(): Promise<void> {
  try {
    // Read sitemap file
    const sitemapPath = join(process.cwd(), 'attached_assets', 'sitemap_1755692910221.xml');
    const xmlContent = readFileSync(sitemapPath, 'utf-8');
    
    // Parse XML
    const result: Sitemap = await parseStringPromise(xmlContent);
    const urls = result.urlset.url;
    
    console.log(`Processing ${urls.length} URLs from sitemap...`);
    
    // Extract categories from URLs
    const categoryMap = new Map<string, { nameRu: string; nameUz: string; slug: string; parentId?: string; priority: number }>();
    
    for (const url of urls) {
      const loc = url.loc[0];
      const priority = parseFloat(url.priority[0]);
      
      // Extract path from URL
      const urlPath = loc.replace('https://optombazar.uz/', '');
      const pathParts = urlPath.split('/');
      
      if (pathParts.length > 0 && pathParts[0]) {
        // Process each level of the category hierarchy
        let currentPath = '';
        let parentId: string | undefined = undefined;
        
        for (let i = 0; i < pathParts.length; i++) {
          const part = pathParts[i];
          currentPath = i === 0 ? part : `${currentPath}/${part}`;
          
          if (!categoryMap.has(currentPath)) {
            // Convert slug to readable name (basic conversion)
            const nameRu = part
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
              .replace(/dlya/g, 'для')
              .replace(/i/g, 'и');
            
            const nameUz = generateUzbekName(nameRu);
            
            categoryMap.set(currentPath, {
              nameRu,
              nameUz,
              slug: part,
              parentId,
              priority
            });
          }
          
          // Set parent for next level
          parentId = part;
        }
      }
    }
    
    console.log(`Found ${categoryMap.size} unique categories`);
    
    // Add categories to storage
    for (const [path, categoryData] of Array.from(categoryMap.entries())) {
      try {
        await storage.createCategory({
          nameUz: categoryData.nameUz,
          nameRu: categoryData.nameRu,
          slug: categoryData.slug,
          parentId: categoryData.parentId || null,
          isActive: true,
          descriptionUz: null,
          descriptionRu: null,
          image: null
        });
        console.log(`Added category: ${categoryData.nameRu} (${categoryData.slug})`);
      } catch (error) {
        console.error(`Error adding category ${categoryData.slug}:`, error);
      }
    }
    
    console.log('Categories seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  parseSitemap().then(() => {
    console.log('Seeding completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}

export { parseSitemap };