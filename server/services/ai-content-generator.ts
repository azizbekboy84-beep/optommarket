import { GoogleGenerativeAI } from "@google/generative-ai";

// Google Gemini AI konfiguratsiyasi
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

interface BlogPostContent {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  slug: string;
}

// Blog post mavzulari
const topics = [
  {
    uz: "Optom savdo biznesini boshlash uchun maslahatlar",
    ru: "Советы по началу оптового торгового бизнеса"
  },
  {
    uz: "Plastik idishlar va paketlar: sifat va narx balansi",
    ru: "Пластиковая посуда и пакеты: баланс качества и цены"
  },
  {
    uz: "Bir martalik idishlar bozorining istiqbollari",
    ru: "Перспективы рынка одноразовой посуды"
  },
  {
    uz: "Restoran va kafe uchun optom yetkazib berish",
    ru: "Оптовые поставки для ресторанов и кафе"
  },
  {
    uz: "Ekologik toza mahsulotlar: trend yoki zarurat",
    ru: "Экологически чистые продукты: тренд или необходимость"
  },
  {
    uz: "Optom xaridlardan qanday qilib maksimal foyda olish mumkin",
    ru: "Как получить максимальную выгоду от оптовых покупок"
  },
  {
    uz: "Kichik biznes uchun optom yetkazib beruvchilarni tanlash",
    ru: "Выбор оптовых поставщиков для малого бизнеса"
  },
  {
    uz: "Sifatli polietilen paketlar: tanlab olish mezonlari",
    ru: "Качественные полиэтиленовые пакеты: критерии выбора"
  }
];

// Slug yaratish funksiyasi
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9а-я\u0430-\u044fё\u04d1-\u04ff\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100) + '-' + Date.now();
}

// Tags generatsiya qilish
function generateTags(title: string, language: 'uz' | 'ru'): string[] {
  const commonTagsUz = [
    'optom savdo', 'biznes', 'plastik idishlar', 'bir martalik',
    'restoran', 'kafe', 'paketlar', 'sifat', 'narx', 'yetkazib berish'
  ];
  
  const commonTagsRu = [
    'оптовая торговля', 'бизнес', 'пластиковая посуда', 'одноразовая',
    'ресторан', 'кафе', 'пакеты', 'качество', 'цена', 'доставка'
  ];

  const baseTags = language === 'uz' ? commonTagsUz : commonTagsRu;
  
  // Title'dan kalit so'zlarni ajratib olish
  const titleWords = title.toLowerCase().split(' ');
  const relevantTags = baseTags.filter(tag => 
    titleWords.some(word => tag.includes(word) || word.includes(tag))
  );
  
  // 3-5 ta eng mos tegni qaytarish
  return relevantTags.slice(0, Math.min(5, Math.max(3, relevantTags.length)));
}

export async function generateBlogPost(language: 'uz' | 'ru' = 'uz'): Promise<BlogPostContent> {
  try {
    // Tasodifiy mavzu tanlash
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const topicTitle = language === 'uz' ? randomTopic.uz : randomTopic.ru;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = language === 'uz' 
      ? `OptomBazar.uz - O'zbekistondagi optom savdo platformasi uchun "${topicTitle}" mavzusida professional blog post yozing.

Talablar:
1. Jozibali va SEO-optimallashgan sarlavha yarating
2. 800-1200 so'zlik kontent yozing
3. Amaliy maslahatlar va foydali ma'lumotlar bering
4. OptomBazar.uz platformasi haqida tabiiy holda eslatib o'ting
5. Formal va professional yozuv uslubida yozing
6. O'zbek tilida yozing

Format:
SARLAVHA: [blog post sarlavhasi]
QISQACHA: [150-200 so'zlik qisqacha mazmun]
CONTENT: [asosiy kontent]`

      : `Напишите профессиональный блог-пост для OptomBazar.uz - платформы оптовой торговли в Узбекистане на тему "${topicTitle}".

Требования:
1. Создайте привлекательный и SEO-оптимизированный заголовок
2. Напишите контент объемом 800-1200 слов
3. Давайте практические советы и полезную информацию
4. Естественно упомяните платформу OptomBazar.uz
5. Пишите в формальном и профессиональном стиле
6. Пишите на русском языке

Формат:
ЗАГОЛОВОК: [заголовок блог-поста]
КРАТКОЕ: [краткое содержание 150-200 слов]
КОНТЕНТ: [основной контент]`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Javobni parslaş
    const titleMatch = response.match(/(?:SARLAVHA|ЗАГОЛОВОК):\s*(.+)/);
    const excerptMatch = response.match(/(?:QISQACHA|КРАТКОЕ):\s*([\s\S]+?)(?=(?:CONTENT|КОНТЕНТ):)/);
    const contentMatch = response.match(/(?:CONTENT|КОНТЕНТ):\s*([\s\S]+)/);

    if (!titleMatch || !contentMatch) {
      throw new Error('AI javobini parselab bo\'lmadi');
    }

    const title = titleMatch[1].trim();
    const excerpt = excerptMatch ? excerptMatch[1].trim() : title.substring(0, 150) + '...';
    const content = contentMatch[1].trim();
    const slug = generateSlug(title);
    const tags = generateTags(title, language);

    return {
      title,
      content,
      excerpt,
      tags,
      slug
    };

  } catch (error) {
    console.error('AI kontent generatsiyasida xatolik:', error);
    throw new Error('Blog post yaratishda xatolik yuz berdi');
  }
}

// Test funksiyasi
export async function testAIContentGenerator() {
  try {
    console.log('AI kontent generator test qilinmoqda...');
    
    const uzPost = await generateBlogPost('uz');
    console.log('O\'zbek tilida post yaratildi:');
    console.log('Sarlavha:', uzPost.title);
    console.log('Teglar:', uzPost.tags);
    console.log('Slug:', uzPost.slug);
    
    const ruPost = await generateBlogPost('ru');
    console.log('\nRus tilida post yaratildi:');
    console.log('Заголовок:', ruPost.title);
    console.log('Теги:', ruPost.tags);
    console.log('Слаг:', ruPost.slug);
    
    return { uzPost, ruPost };
  } catch (error) {
    console.error('Test xatoligi:', error);
    throw error;
  }
}