import { DatabaseStorage } from "../database-storage";

export class SitemapGenerator {
  private storage: DatabaseStorage;

  constructor(storage: DatabaseStorage) {
    this.storage = storage;
  }

  async generateSitemap(): Promise<string> {
    const baseUrl = 'https://optombazar.uz';
    const currentDate = new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Asosiy sahifalar -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/catalog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

`;

    try {
      // Kategoriyalarni sitemap'ga qo'shish
      const categories = await this.storage.getCategories();
      for (const category of categories) {
        if (category.isActive && category.slug) {
          sitemap += `  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
        }
      }

      // Mahsulotlarni sitemap'ga qo'shish
      const products = await this.storage.getProducts();
      for (const product of products) {
        if (product.isActive && product.slug) {
          const productLastMod = product.createdAt ? product.createdAt.toISOString() : currentDate;
          sitemap += `  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${productLastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>`;
          
          // Mahsulot rasmlarini qo'shish
          if (product.images && product.images.length > 0) {
            for (const image of product.images) {
              sitemap += `
    <image:image>
      <image:loc>${image}</image:loc>
      <image:title>${product.nameUz}</image:title>
      <image:caption>${product.descriptionUz || ''}</image:caption>
    </image:image>`;
            }
          }
          sitemap += `
  </url>
`;
        }
      }

      // Blog postlarni sitemap'ga qo'shish
      const blogPosts = await this.storage.getBlogPosts();
      for (const post of blogPosts) {
        if (post.isPublished && post.slug) {
          const postLastMod = post.updatedAt ? post.updatedAt.toISOString() : 
                              (post.createdAt ? post.createdAt.toISOString() : currentDate);
          sitemap += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${postLastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>`;
          
          // Blog post rasmini qo'shish
          if (post.imageUrl) {
            sitemap += `
    <image:image>
      <image:loc>${post.imageUrl}</image:loc>
      <image:title>${post.title}</image:title>
      <image:caption>${post.excerpt || ''}</image:caption>
    </image:image>`;
          }
          sitemap += `
  </url>
`;
        }
      }

    } catch (error) {
      console.error('Sitemap generatsiya xatoligi:', error);
    }

    sitemap += '</urlset>';
    return sitemap;
  }

  generateRobotsTxt(): string {
    const baseUrl = 'https://optombazar.uz';
    
    return `User-agent: *
Allow: /

# Asosiy sahifalar
Allow: /
Allow: /catalog
Allow: /blog
Allow: /contact
Allow: /products/
Allow: /category/
Allow: /blog/

# Static fayllar
Allow: /assets/
Allow: /images/
Allow: /*.css
Allow: /*.js
Allow: /*.png
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.gif
Allow: /*.svg
Allow: /*.webp
Allow: /*.ico

# Admin panelni bloklash
Disallow: /admin/
Disallow: /api/

# Vaqtinchalik sahifalar
Disallow: /cart
Disallow: /checkout
Disallow: /profile
Disallow: /login
Disallow: /register

# Sitemap'ni ko'rsatish
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay (ixtiyoriy)
Crawl-delay: 1

# Maxsus bot'lar uchun qoidalar
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

User-agent: YandexBot
Allow: /
Crawl-delay: 1`;
  }

  async generateSitemapIndex(): Promise<string> {
    const baseUrl = 'https://optombazar.uz';
    const currentDate = new Date().toISOString();

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;
  }
}