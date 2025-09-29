import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { SEOMetaTags } from '@shared/seo';

interface SEOOptimizerProps {
  seo: SEOMetaTags;
  children?: React.ReactNode;
}

export function SEOOptimizer({ seo, children }: SEOOptimizerProps) {
  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords.join(', ')} />
        
        {/* Canonical URL */}
        {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="OptomMarket.uz" />
        {seo.ogUrl && <meta property="og:url" content={seo.ogUrl} />}
        {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
        {seo.ogImage && <meta property="og:image:alt" content={seo.ogTitle} />}
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:title" content={seo.twitterTitle} />
        <meta name="twitter:description" content={seo.twitterDescription} />
        {seo.twitterImage && <meta name="twitter:image" content={seo.twitterImage} />}
        <meta name="twitter:site" content="@optommarket" />
        <meta name="twitter:creator" content="@optommarket" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="hIZ7DGmAUZT117-8ekyYnjYQHvH3sP2d1IaI-IKm4T0" />
        
        {/* Language and Locale */}
        <meta property="og:locale" content="uz_UZ" />
        <meta property="og:locale:alternate" content="ru_RU" />
        <html lang="uz" />
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* Performance Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://optommarket.uz" />
        
        {/* Structured Data */}
        {seo.structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(seo.structuredData)}
          </script>
        )}
        
        {/* Organization Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "OptomMarket.uz",
            "url": "https://optommarket.uz",
            "logo": "https://optommarket.uz/logo.png",
            "description": "O'zbekistondagi eng yirik optom savdo platformasi",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "UZ",
              "addressLocality": "Toshkent",
              "addressRegion": "Toshkent"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+998-71-123-45-67",
              "contactType": "customer service",
              "availableLanguage": ["uz", "ru"]
            },
            "sameAs": [
              "https://t.me/optommarket",
              "https://instagram.com/optommarket.uz"
            ]
          })}
        </script>
        
        {/* Website Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "OptomMarket.uz",
            "url": "https://optommarket.uz",
            "description": "O'zbekistondagi eng yirik optom savdo platformasi",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://optommarket.uz/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
      {children}
    </>
  );
}

// Breadcrumb component for better SEO
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function SEOBreadcrumb({ items }: SEOBreadcrumbProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {item.name}
                </span>
              ) : (
                <a 
                  href={item.url} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
