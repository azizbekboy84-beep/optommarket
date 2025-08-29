import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/language-provider';
import { Footer } from '@/components/footer';
import { SEOHead } from '@/components/SEOHead';
import { DEFAULT_SEO } from '@shared/seo';
import { CategoryCard } from '@/components/category-card';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Category, Product } from '@shared/schema';
import { Link } from 'wouter';
import { PushNotificationSetup } from '@/components/PushNotificationSetup';

export default function Home() {
  const { t, language } = useLanguage();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });

  const stats = [
    { value: '1K+', label: t('productsCount') },
    { value: '30+', label: t('sellers') },
    { value: '100+', label: t('customers') },
    { value: '24/7', label: t('support') },
  ];

  // Home sahifasi uchun asosiy SEO
  const homeSEO = DEFAULT_SEO;

  const features = [
    {
      icon: (
        <div className="text-6xl mb-2">💰</div>
      ),
      titleUz: "Eng Arzon Narxlar",
      titleRu: "Самые низкие цены",
      descriptionUz: "To'g'ridan-to'g'ri ishlab chiqaruvchilardan optom narxlarda xarid qiling",
      descriptionRu: "Покупайте напрямую у производителей по оптовым ценам"
    },
    {
      icon: (
        <div className="text-6xl mb-2">✅</div>
      ),
      titleUz: "Sifat Kafolati",
      titleRu: "Гарантия качества",
      descriptionUz: "Barcha mahsulotlar sertifikatlangan va 100% sifat kafolati bilan",
      descriptionRu: "Все товары сертифицированы и с гарантией качества 100%"
    },
    {
      icon: (
        <div className="text-6xl mb-2">🚚</div>
      ),
      titleUz: "Tez Yetkazib Berish",
      titleRu: "Быстрая доставка",
      descriptionUz: "O'zbekiston bo'ylab 1-3 kun ichida tez va ishonchli yetkazib berish",
      descriptionRu: "Быстрая и надежная доставка по Узбекистану за 1-3 дня"
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <SEOHead seo={homeSEO} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-red-800 dark:from-blue-800 dark:via-blue-700 dark:to-red-700 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-red-600/30"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-red-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full animate-ping"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent" data-testid="text-hero-title">
                Optombazar.uz
              </h1>
              <p className="text-2xl lg:text-3xl font-light mb-4 text-blue-100">
                {t('heroTitle')}
              </p>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed" data-testid="text-hero-description">
                {t('heroDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/catalog">
                  <button className="bg-gradient-to-r from-blue-600 to-red-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-2xl" data-testid="button-view-catalog">
                    {t('viewProducts')}
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="border-2 border-white/60 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 backdrop-blur-sm" data-testid="button-become-seller">
                    {t('becomeSeller')}
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <div className="text-3xl font-bold mb-2">1K+</div>
                    <div className="text-sm opacity-80">{t('productsCount')}</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <div className="text-3xl font-bold mb-2">30+</div>
                    <div className="text-sm opacity-80">{t('sellers')}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600/30 to-red-500/30 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <div className="text-3xl font-bold mb-2">100+</div>
                    <div className="text-sm opacity-80">{t('customers')}</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-600/30 to-blue-500/30 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-sm opacity-80">{t('support')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ommabop Mahsulotlar Section */}
      <section className="bg-background dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {language === 'uz' ? 'Ommabop Mahsulotlar' : 'Популярные Товары'}
            </h2>
            <p className="text-xl text-muted-foreground">
              {language === 'uz' ? 
                'Eng ko\'p sotib olinayotgan mahsulotlarimiz bilan tanishing' : 
                'Познакомьтесь с нашими самыми продаваемыми товарами'
              }
            </p>
          </div>
          
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse border border-border" data-testid={`skeleton-featured-${i}`}>
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={(product) => {
                    console.log('Add to cart:', product);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {language === 'uz' ? 
                  'Hozircha ommabop mahsulotlar yo\'q' : 
                  'Пока нет популярных товаров'
                }
              </p>
            </div>
          )}
          
          {featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/catalog">
                <button className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  {language === 'uz' ? 'Barcha mahsulotlar' : 'Все товары'}
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-red-800 dark:from-blue-800 dark:via-blue-700 dark:to-red-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4" data-testid="text-categories-title">
              {t('mainCategories')}
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto" data-testid="text-categories-description">
              {language === 'uz' ? 'Bizning eng mashhur mahsulot toifalarimiz bilan tanishing' : 'Знакомьтесь с нашими самыми популярными категориями товаров'}
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-3 animate-pulse h-32" data-testid={`skeleton-category-${i}`}>
                  <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-2xl"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 mx-auto w-16"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-12 mx-auto mt-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 12).map((category, index) => {
                const categoryIcons = ['📦', '🍽️', '📱', '👕', '🏠', '⚡', '🛠️', '🌿', '🎨', '📚', '🎵', '☕'];
                const categoryIcon = categoryIcons[index] || '📦';
                
                return (
                  <div 
                    key={category.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl p-3 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 h-32"
                    onClick={() => window.location.href = `/category/${category.slug}`}
                    data-testid={`category-card-${category.id}`}
                  >
                    <div className="text-center h-full flex flex-col justify-between">
                      <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center text-2xl">
                        {categoryIcon}
                      </div>
                      <h3 className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 leading-tight" data-testid={`text-category-name-${category.id}`}>
                        {language === 'uz' ? category.nameUz : category.nameRu}
                      </h3>
                      <div className="-mx-3 -mb-3 p-2 bg-gradient-to-r from-blue-500 to-red-500">
                        <span className="inline-flex items-center text-white font-medium text-[10px]">
                          {t('viewMore')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/categories">
              <button className="bg-gradient-to-r from-blue-600 to-red-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-red-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
                {language === 'uz' ? 'Barcha kategoriyalarni ko\'rish' : 'Посмотреть все категории'}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-background dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-featured-title">
                {t('featuredProducts')}
              </h2>
              <p className="text-xl text-muted-foreground" data-testid="text-featured-description">
                {t('featuredDescription')}
              </p>
            </div>
            <Link href="/products" className="hidden md:block">
              <Button variant="ghost" className="text-primary font-semibold hover:text-blue-600 dark:hover:text-blue-400" data-testid="button-view-all-products">
                {t('viewAll')} →
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card dark:bg-gray-800 border border-border rounded-xl p-6 animate-pulse" data-testid={`skeleton-product-${i}`}>
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={(product) => {
                    // TODO: Implement cart functionality
                    console.log('Add to cart:', product);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bizning Afzalliklarimiz */}
      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {language === 'uz' ? 'Bizning Afzalliklarimiz' : 'Наши Преимущества'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === 'uz' ? 
                'Nima uchun aynan Optombazar.uz ni tanlashingiz kerak' : 
                'Почему стоит выбрать именно Optombazar.uz'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card dark:bg-gray-700 rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-border" data-testid={`feature-${index}`}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-red-100 dark:from-blue-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4" data-testid={`text-feature-title-${index}`}>
                  {language === 'uz' ? feature.titleUz : feature.titleRu}
                </h3>
                <p className="text-muted-foreground" data-testid={`text-feature-description-${index}`}>
                  {language === 'uz' ? feature.descriptionUz : feature.descriptionRu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-red-800 dark:from-blue-800 dark:via-blue-700 dark:to-red-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6" data-testid="text-cta-title">
            {t('businessPartner')}
          </h2>
          <p className="text-xl text-white mb-10 max-w-3xl mx-auto leading-relaxed" data-testid="text-cta-description">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-50 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" data-testid="button-register-now">
                {t('registerNow')}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105" data-testid="button-contact-us">
                {t('contactUs')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Push Notification Setup */}
      <section className="bg-background dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PushNotificationSetup autoRequest={true} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
