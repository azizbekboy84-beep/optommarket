import type { Product, BlogPost, Category } from "./schema";

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage?: string;
  canonicalUrl?: string;
  structuredData?: object;
}

// Asosiy sayt meta-teglari
export const DEFAULT_SEO: SEOMetaTags = {
  title: "OptomBazar.uz - O'zbekistondagi Eng Yirik Optom Savdo Platformasi",
  description: "Polietilen paketlar, bir martalik idishlar, elektronika va kiyim-kechakni optom narxlarda xarid qiling. Ishonchli yetkazib berish va sifatli mahsulotlar OptomBazar.uz da!",
  keywords: [
    "optom savdo", "optom bozor", "polietilen paketlar", "bir martalik idishlar", 
    "optom narx", "elektronika optom", "kiyim optom", "O'zbekiston", "wholesale"
  ],
  ogTitle: "OptomBazar.uz - O'zbekistondagi Eng Yirik Optom Savdo Platformasi",
  ogDescription: "Polietilen paketlar, bir martalik idishlar va boshqa mahsulotlarni optom narxlarda xarid qiling!",
  ogImage: "/og-image.jpg",
  twitterCard: "summary_large_image",
  twitterTitle: "OptomBazar.uz - Optom Savdo Platformasi",
  twitterDescription: "O'zbekistondagi eng ishonchli optom savdo platformasi!"
};

// Mahsulot uchun meta-teglar generatori
export function generateProductMetaTags(product: Partial<Product>): SEOMetaTags {
  const title = `${product.nameUz || 'Mahsulot'} - Optom Narxda | OptomBazar.uz`;
  const description = `${product.nameUz || 'Mahsulot'}ni optom narxda xarid qiling. ${product.descriptionUz ? product.descriptionUz.substring(0, 120) + '...' : 'Sifatli mahsulot, tez yetkazib berish.'}`;
  
  const keywords = [
    (product.nameUz || '').toLowerCase(),
    'optom narx',
    'optom savdo',
    'wholesale',
    'OptomBazar'
  ];

  // Kategoriya nomlarini qo'shish
  if (product.categoryId) {
    keywords.push(`${product.categoryId} optom`);
  }

  const structuredData: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.nameUz,
    "description": product.descriptionUz,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "OptomBazar.uz"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://optombazar.uz/products/${product.slug}`,
      "priceCurrency": "UZS",
      "price": product.wholesalePrice || product.price,
      "availability": (product.stockQuantity || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "OptomBazar.uz"
      }
    }
  };

  if (product.images && product.images.length > 0) {
    structuredData.image = product.images[0];
  }

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: product.images?.[0] || DEFAULT_SEO.ogImage,
    ogUrl: `https://optombazar.uz/products/${product.slug}`,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: product.images?.[0] || DEFAULT_SEO.ogImage,
    canonicalUrl: `https://optombazar.uz/products/${product.slug}`,
    structuredData
  };
}

// Blog post uchun meta-teglar generatori
export function generateBlogPostMetaTags(post: BlogPost): SEOMetaTags {
  const title = `${post.title} | OptomBazar.uz Blog`;
  const description = post.excerpt || (post.content.substring(0, 150) + '...');
  
  const keywords = [
    'optom savdo blog',
    'biznes maslahatlari',
    'OptomBazar blog',
    'wholesale tips'
  ];

  // Blog post teglarini qo'shish
  if (post.tags) {
    keywords.push(...post.tags);
  }

  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": description,
    "author": {
      "@type": "Organization",
      "name": "OptomBazar.uz"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OptomBazar.uz",
      "logo": {
        "@type": "ImageObject",
        "url": "https://optombazar.uz/logo.png"
      }
    },
    "datePublished": post.createdAt,
    "dateModified": post.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://optombazar.uz/blog/${post.slug}`
    }
  };

  if (post.imageUrl) {
    structuredData.image = {
      "@type": "ImageObject",
      "url": post.imageUrl
    };
  }

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: post.imageUrl || DEFAULT_SEO.ogImage,
    ogUrl: `https://optombazar.uz/blog/${post.slug}`,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: post.imageUrl || DEFAULT_SEO.ogImage,
    canonicalUrl: `https://optombazar.uz/blog/${post.slug}`,
    structuredData
  };
}

// Kategoriya uchun meta-teglar generatori
export function generateCategoryMetaTags(category: Category): SEOMetaTags {
  const title = `${category.nameUz} - Optom Narxda | OptomBazar.uz`;
  const description = `${category.nameUz} kategoriyasidagi mahsulotlarni optom narxda xarid qiling. ${category.descriptionUz || 'Keng assortiment, sifatli mahsulotlar va qulay narxlar OptomBazar.uz da!'}`;
  
  const keywords = [
    category.nameUz.toLowerCase(),
    `${category.nameUz.toLowerCase()} optom`,
    'optom savdo',
    'wholesale',
    'OptomBazar'
  ];

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    "name": category.nameUz,
    "description": description,
    "url": `https://optombazar.uz/category/${category.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": category.nameUz
    }
  };

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: category.image || DEFAULT_SEO.ogImage,
    ogUrl: `https://optombazar.uz/category/${category.slug}`,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: category.image || DEFAULT_SEO.ogImage,
    canonicalUrl: `https://optombazar.uz/category/${category.slug}`,
    structuredData
  };
}

// Katalog sahifasi uchun meta-teglar
export function generateCatalogMetaTags(): SEOMetaTags {
  const title = "Katalog - Barcha Mahsulotlar | OptomBazar.uz";
  const description = "OptomBazar.uz da barcha kategoriyalar va mahsulotlarni ko'rib chiqing. Polietilen paketlar, bir martalik idishlar, elektronika va boshqa mahsulotlar optom narxlarda!";
  
  const keywords = [
    'katalog', 'mahsulotlar katalogi', 'optom katalog', 'barcha mahsulotlar',
    'polietilen paketlar', 'bir martalik idishlar', 'wholesale catalog'
  ];

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: DEFAULT_SEO.ogImage,
    ogUrl: "https://optombazar.uz/catalog",
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: DEFAULT_SEO.ogImage,
    canonicalUrl: "https://optombazar.uz/catalog"
  };
}

// Blog sahifasi uchun meta-teglar
export function generateBlogMetaTags(): SEOMetaTags {
  const title = "Blog - Biznes Maslahatlari va Yangiliklar | OptomBazar.uz";
  const description = "Optom savdo, biznes rivojlantirish va mahsulot tanlash bo'yicha foydali maqolalar. OptomBazar.uz blogida eng so'nggi yangiliklar va maslahatlar!";
  
  const keywords = [
    'optom savdo blog', 'biznes maslahatlari', 'wholesale blog', 'business tips',
    'optom biznes', 'savdo maslahatlari', 'OptomBazar blog'
  ];

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: DEFAULT_SEO.ogImage,
    ogUrl: "https://optombazar.uz/blog",
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: DEFAULT_SEO.ogImage,
    canonicalUrl: "https://optombazar.uz/blog"
  };
}

// Aloqa sahifasi uchun meta-teglar
export function generateContactMetaTags(): SEOMetaTags {
  const title = "Biz Bilan Bog'laning | OptomBazar.uz";
  const description = "OptomBazar.uz bilan bog'laning. Bizning manzil, telefon raqam va email. Savol va takliflaringizni yuboring - biz har doim yordamga tayyormiz!";
  
  const keywords = [
    'aloqa', 'bog\'laning', 'telefon', 'manzil', 'email',
    'OptomBazar aloqa', 'contact', 'support'
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Biz Bilan Bog'laning",
    "description": description,
    "url": "https://optombazar.uz/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "OptomBazar.uz",
      "telephone": "+998 71 123-45-67",
      "email": "info@optombazar.uz",
      "url": "https://optombazar.uz"
    }
  };

  return {
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: DEFAULT_SEO.ogImage,
    ogUrl: "https://optombazar.uz/contact",
    twitterCard: "summary",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: DEFAULT_SEO.ogImage,
    canonicalUrl: "https://optombazar.uz/contact",
    structuredData
  };
}