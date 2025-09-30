import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../language-provider';
import { SEOOptimizer } from '../SEOOptimizer';
import { DEFAULT_SEO } from '@shared/seo';
import { ModernHeader } from './ModernHeader';
import { ModernHero } from './ModernHero';
import { ModernProductCard } from './ModernProductCard';
import { ModernCategoryCard } from './ModernCategoryCard';
import { ModernFooter } from './ModernFooter';
import { Button } from '../ui/button';
import { ProductCardSkeleton, CompactCategoryCardSkeleton } from '../SkeletonLoader';
// Local interfaces to handle null vs undefined differences
interface LocalCategory {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz?: string | null;
  descriptionRu?: string | null;
  slug: string;
  isActive: boolean | null;
  icon?: string | null;
  parentId?: string | null;
  image?: string | null;
}

interface LocalProduct {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz?: string | null;
  descriptionRu?: string | null;
  price: string;
  wholesalePrice: string;
  minQuantity: number;
  stockQuantity: number;
  unit: string;
  images?: string[];
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
}
import { Link } from 'wouter';
import { 
  ArrowRight, TrendingUp, Star, Users, Package, 
  Shield, Award, Truck, Zap, Clock, Heart
} from 'lucide-react';

export default function ModernHomePage() {
  const { t, language } = useLanguage();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<LocalCategory[]>({
    queryKey: ['/api/categories'],
  });

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<LocalProduct[]>({
    queryKey: ['/api/products/featured'],
    // Override defaults for featured products
    staleTime: 2 * 60 * 1000, // 2 minutes - featured products change often
    gcTime: 5 * 60 * 1000, // 5 minutes in cache
  });

  const features = [
    {
      icon: Shield,
      titleUz: "Xavfsiz To'lovlar",
      titleRu: "Безопасные Платежи",
      descriptionUz: "SSL sertifikat va bank darajasidagi xavfsizlik",
      descriptionRu: "SSL сертификат и банковский уровень безопасности"
    },
    {
      icon: Award,
      titleUz: "Sifat Kafolati",
      titleRu: "Гарантия Качества",
      descriptionUz: "Barcha mahsulotlar sertifikatlangan va tekshirilgan",
      descriptionRu: "Все товары сертифицированы и проверены"
    },
    {
      icon: Truck,
      titleUz: "Tez Yetkazib Berish",
      titleRu: "Быстрая Доставка",
      descriptionUz: "O'zbekiston bo'ylab 1-3 kun ichida yetkazib berish",
      descriptionRu: "Доставка по Узбекистану за 1-3 дня"
    },
    {
      icon: Clock,
      titleUz: "24/7 Qo'llab-quvvatlash",
      titleRu: "24/7 Поддержка",
      descriptionUz: "Har doim sizning xizmatingizdamiz",
      descriptionRu: "Всегда к вашим услугам"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden max-w-full">
      <SEOOptimizer seo={DEFAULT_SEO} />
      
      {/* Header */}
      <ModernHeader />

      {/* Hero Section - Reduced height */}
      <ModernHero />

      {/* Featured Categories - Compact */}
      <section className="py-6 md:py-8 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
              {language === 'uz' ? 'Ommabop Kategoriyalar' : 'Популярные Категории'}
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              {language === 'uz' 
                ? 'Eng ko\'p qidirilayotgan mahsulot kategoriyalari bilan tanishing'
                : 'Познакомьтесь с самыми популярными категориями товаров'
              }
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {[...Array(12)].map((_, i) => (
                <CompactCategoryCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {categories.slice(0, 12).map((category, index) => (
                <ModernCategoryCard
                  key={category.id}
                  category={category as any}
                  variant="compact"
                  showProductCount={false}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-6 md:mt-8">
            <Link href="/categories">
              <Button variant="outline" className="group text-sm md:text-base">
                {language === 'uz' ? 'Barcha kategoriyalar' : 'Все категории'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-6 md:py-8 bg-gradient-to-r from-blue-50/50 to-red-50/50 dark:bg-gradient-to-r dark:from-gray-900/50 dark:to-gray-800/50 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'uz' ? 'Tavsiya Etilgan Mahsulotlar' : 'Рекомендуемые Товары'}
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {language === 'uz' 
                  ? 'Eng sifatli va ommabop mahsulotlarimiz'
                  : 'Наши самые качественные и популярные товары'
                }
              </p>
            </div>
            <Link href="/catalog" className="w-full md:w-auto">
              <Button className="w-full md:w-auto items-center gap-2 bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-sm md:text-base">
                {language === 'uz' ? 'Barchasini ko\'rish' : 'Смотреть все'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <ModernProductCard
                  key={product.id}
                  product={product as any}
                  variant={index === 0 ? 'featured' : 'default'}
                  onAddToCart={(product) => {
                    console.log('Add to cart:', product);
                  }}
                  onAddToWishlist={(product) => {
                    console.log('Add to wishlist:', product);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-base md:text-lg">
                {language === 'uz' 
                  ? 'Hozircha tavsiya etilgan mahsulotlar yo\'q'
                  : 'Пока нет рекомендуемых товаров'
                }
              </p>
            </div>
          )}

          <div className="text-center mt-6 md:mt-8 md:hidden">
            <Link href="/catalog">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-sm md:text-base">
                {language === 'uz' ? 'Barchasini ko\'rish' : 'Смотреть все'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-6 md:py-8 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
              {language === 'uz' ? 'Nima uchun OptomMarket.uz?' : 'Почему OptomMarket.uz?'}
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
              {language === 'uz' 
                ? 'Bizning afzalliklarimiz va nima uchun minglab mijozlar bizni tanlaganini bilib oling'
                : 'Узнайте о наших преимуществах и почему тысячи клиентов выбирают нас'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-gray-50 dark:bg-gray-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:bg-gradient-to-br hover:from-blue-50 hover:to-red-50 dark:hover:from-blue-900/20 dark:hover:to-red-900/20 transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-red-500 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'uz' ? feature.titleUz : feature.titleRu}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {language === 'uz' ? feature.descriptionUz : feature.descriptionRu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 md:py-8 bg-gradient-to-r from-blue-600 to-red-500 text-white w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div className="group">
              <div className="text-2xl md:text-4xl font-black mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-sm md:text-base text-blue-100">{language === 'uz' ? 'Mahsulotlar' : 'Товары'}</div>
            </div>
            <div className="group">
              <div className="text-2xl md:text-4xl font-black mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300">1K+</div>
              <div className="text-sm md:text-base text-blue-100">{language === 'uz' ? 'Mijozlar' : 'Клиенты'}</div>
            </div>
            <div className="group">
              <div className="text-2xl md:text-4xl font-black mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-sm md:text-base text-blue-100">{language === 'uz' ? 'Hamkorlar' : 'Партнеры'}</div>
            </div>
            <div className="group">
              <div className="text-2xl md:text-4xl font-black mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center gap-1 md:gap-2">
                4.9
                <Star className="w-4 h-4 md:w-6 md:h-6 text-yellow-400 fill-current" />
              </div>
              <div className="text-sm md:text-base text-blue-100">{language === 'uz' ? 'Reyting' : 'Рейтинг'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-10 bg-gray-900 text-white w-full overflow-hidden">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center w-full">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
            {language === 'uz' ? 'Biznesingizni Rivojlantiring' : 'Развивайте Свой Бизнес'}
          </h2>
          <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-2">
            {language === 'uz' 
              ? 'OptomMarket.uz bilan hamkorlik qiling va biznesingizni yangi bosqichga olib chiqing'
              : 'Сотрудничайте с OptomMarket.uz и выведите свой бизнес на новый уровень'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link href="/partnership" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl group">
                {language === 'uz' ? 'Hamkor Bo\'ling' : 'Стать Партнером'}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl">
                {language === 'uz' ? 'Bog\'lanish' : 'Связаться'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <ModernFooter />
    </div>
  );
}
