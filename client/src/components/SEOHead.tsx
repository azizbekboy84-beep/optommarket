import { Helmet } from 'react-helmet-async';
import type { SEOMetaTags } from '@shared/seo';

interface SEOHeadProps {
  seo: SEOMetaTags;
}

export function SEOHead({ seo }: SEOHeadProps) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      
      {/* Canonical URL */}
      {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.ogTitle} />
      <meta property="og:description" content={seo.ogDescription} />
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      {seo.ogUrl && <meta property="og:url" content={seo.ogUrl} />}
      <meta property="og:site_name" content="OptomBazar.uz" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={seo.twitterCard} />
      <meta name="twitter:title" content={seo.twitterTitle} />
      <meta name="twitter:description" content={seo.twitterDescription} />
      {seo.twitterImage && <meta name="twitter:image" content={seo.twitterImage} />}
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="uz" />
      <meta name="author" content="OptomBazar.uz" />
      
      {/* Structured Data */}
      {seo.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(seo.structuredData)}
        </script>
      )}
    </Helmet>
  );
}