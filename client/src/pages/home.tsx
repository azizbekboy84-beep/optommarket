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
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchInterval: 30000, // Refetch every 30 seconds
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
        
        {/* Enhanced animated background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-red-400/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-purple-400/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-12 h-12 bg-yellow-400/20 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        
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
              {/* Background decorative elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-red-600/20 rounded-3xl blur-xl animate-pulse-slow"></div>
              
              <div className="relative glass rounded-3xl p-8 border border-white/30 shadow-modern backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-6">
                  {/* Products Card */}
                  <div className="group relative bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-2xl p-6 backdrop-blur-sm border border-white/30 transform hover:scale-110 hover:rotate-1 transition-all duration-500 hover:shadow-glow overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-2xl"></div>
                    <div className="absolute top-2 right-2 w-8 h-8 bg-blue-400/30 rounded-full animate-ping"></div>
                    <div className="relative z-10">
                      <div className="text-4xl font-black mb-2 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-sm">1K+</div>
                      <div className="text-sm font-medium opacity-90 text-blue-50 group-hover:text-white transition-colors">{t('productsCount')}</div>
                    </div>
                  </div>

                  {/* Sellers Card */}
                  <div className="group relative bg-gradient-to-br from-red-500/40 to-red-600/40 rounded-2xl p-6 backdrop-blur-sm border border-white/30 transform hover:scale-110 hover:-rotate-1 transition-all duration-500 hover:shadow-glow overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-transparent rounded-2xl"></div>
                    <div className="absolute top-2 right-2 w-6 h-6 bg-red-400/30 rounded-full animate-bounce"></div>
                    <div className="relative z-10">
                      <div className="text-4xl font-black mb-2 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent drop-shadow-sm">30+</div>
                      <div className="text-sm font-medium opacity-90 text-red-50 group-hover:text-white transition-colors">{t('sellers')}</div>
                    </div>
                  </div>

                  {/* Customers Card */}
                  <div className="group relative bg-gradient-to-br from-purple-500/40 to-pink-600/40 rounded-2xl p-6 backdrop-blur-sm border border-white/30 transform hover:scale-110 hover:rotate-1 transition-all duration-500 hover:shadow-glow overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent rounded-2xl"></div>
                    <div className="absolute top-2 right-2 w-7 h-7 bg-purple-400/30 rounded-full animate-pulse"></div>
                    <div className="relative z-10">
                      <div className="text-4xl font-black mb-2 bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-sm">100+</div>
                      <div className="text-sm font-medium opacity-90 text-purple-50 group-hover:text-white transition-colors">{t('customers')}</div>
                    </div>
                  </div>

                  {/* Support Card */}
                  <div className="group relative bg-gradient-to-br from-yellow-500/40 to-orange-600/40 rounded-2xl p-6 backdrop-blur-sm border border-white/30 transform hover:scale-110 hover:-rotate-1 transition-all duration-500 hover:shadow-glow overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-2xl"></div>
                    <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-400/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    <div className="relative z-10">
                      <div className="text-4xl font-black mb-2 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent drop-shadow-sm">24/7</div>
                      <div className="text-sm font-medium opacity-90 text-yellow-50 group-hover:text-white transition-colors">{t('support')}</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float"></div>
                  <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
                  <div className="absolute bottom-1/4 left-3/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
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
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6" data-testid="text-categories-title">
              {t('mainCategories')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed" data-testid="text-categories-description">
              {language === 'uz' ? 'Bizning eng mashhur mahsulot toifalarimiz bilan tanishing va kerakli mahsulotni oson toping' : 'Знакомьтесь с нашими самыми популярными категориями товаров и легко найдите нужный продукт'}
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-8 animate-pulse shadow-lg border border-gray-100 dark:border-gray-700" data-testid={`skeleton-category-${i}`}>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 mx-auto w-24"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {categories.slice(0, 10).map((category, index) => {
                const categoryColors = [
                  'from-blue-500 to-blue-600',
                  'from-emerald-500 to-emerald-600', 
                  'from-purple-500 to-purple-600',
                  'from-orange-500 to-orange-600',
                  'from-pink-500 to-pink-600',
                  'from-indigo-500 to-indigo-600',
                  'from-teal-500 to-teal-600',
                  'from-red-500 to-red-600',
                  'from-yellow-500 to-yellow-600',
                  'from-cyan-500 to-cyan-600'
                ];
                const categoryIcons = [
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" /></svg>,
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" /></svg>,
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m3 0H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1z" /></svg>,
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                ];
                
                const colorClass = categoryColors[index % categoryColors.length];
                const IconComponent = categoryIcons[index % categoryIcons.length];
                
                return (
                  <div 
                    key={category.id}
                    className="group bg-white dark:bg-gray-800 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2 shadow-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 relative overflow-hidden"
                    onClick={() => window.location.href = `/category/${category.slug}`}
                    data-testid={`category-card-${category.id}`}
                  >
                    {/* Background glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                    
                    <div className="relative z-10 text-center">
                      {/* Icon */}
                      <div className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-gradient-to-br ${colorClass} rounded-2xl text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                        {IconComponent}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" data-testid={`text-category-name-${category.id}`}>
                        {language === 'uz' ? category.nameUz : category.nameRu}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        {language === 'uz' ? category.descriptionUz || 'Turli xil mahsulotlar' : category.descriptionRu || 'Различные товары'}
                      </p>
                      
                      {/* Action button */}
                      <div className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                        {t('viewMore')}
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/categories">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                {language === 'uz' ? 'Barcha kategoriyalarni ko\'rish' : 'Посмотреть все категории'}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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
              <div key={index} className="group bg-card/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-modern hover:shadow-glow transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-border/50 hover:border-blue-400/50" data-testid={`feature-${index}`}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-red-100 dark:from-blue-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-glow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" data-testid={`text-feature-title-${index}`}>
                  {language === 'uz' ? feature.titleUz : feature.titleRu}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300" data-testid={`text-feature-description-${index}`}>
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
