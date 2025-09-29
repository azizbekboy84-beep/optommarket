import { storage } from '../storage.js';

// Sitemap XML generatori
export async function generateSitemap(): Promise<string> {
  const baseUrl = 'https://optommarket.uz';
  
  // Asosiy sahifalar
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/catalog', priority: '0.9', changefreq: 'daily' },
    { url: '/categories', priority: '0.8', changefreq: 'weekly' },
    { url: '/blog', priority: '0.7', changefreq: 'daily' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/about', priority: '0.5', changefreq: 'monthly' },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Asosiy sahifalarni qo'shish
  for (const page of staticPages) {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  try {
    // Kategoriyalarni qo'shish
    const categories = await storage.getCategories();
    for (const category of categories) {
      sitemap += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }

    // Mahsulotlarni qo'shish
    const products = await storage.getProducts();
    for (const product of products) {
      if (product.isActive) {
        sitemap += `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${product.createdAt ? new Date(product.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    }

    // Blog postlarni qo'shish
    const blogPosts = await storage.getBlogPosts();
    for (const post of blogPosts) {
      if (post.isPublished) {
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
      }
    }
  } catch (error) {
    console.error('Sitemap generatsiyasida xatolik:', error);
  }

  sitemap += `
</urlset>`;

  return sitemap;
}