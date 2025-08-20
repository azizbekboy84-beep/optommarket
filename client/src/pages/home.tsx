import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/language-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CategoryCard } from '@/components/category-card';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Category, Product } from '@shared/schema';
import { Link } from 'wouter';

export default function Home() {
  const { t, language } = useLanguage();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true }],
  });

  const stats = [
    { value: '50K+', label: t('productsCount') },
    { value: '1000+', label: t('sellers') },
    { value: '10K+', label: t('customers') },
    { value: '24/7', label: t('support') },
  ];

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
        </svg>
      ),
      titleUz: "Eng Arzon Narxlar",
      titleRu: "Самые низкие цены",
      descriptionUz: "To'g'ridan-to'g'ri ishlab chiqaruvchilardan xarid qiling va optom narxlaridan foydalaning",
      descriptionRu: "Покупайте напрямую у производителей и пользуйтесь оптовыми ценами"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      titleUz: "Sifat Kafolati",
      titleRu: "Гарантия качества",
      descriptionUz: "Barcha mahsulotlar tekshirilgan va sifat sertifikatiga ega. 100% qoniqish kafolati",
      descriptionRu: "Все товары проверены и имеют сертификат качества. 100% гарантия удовлетворения"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      titleUz: "Tez Yetkazib Berish",
      titleRu: "Быстрая доставка",
      descriptionUz: "O'zbekiston bo'ylab 1-3 kun ichida yetkazib berish. Katta buyurtmalar uchun maxsus chegirmalar",
      descriptionRu: "Доставка по Узбекистану в течение 1-3 дней. Специальные скидки на крупные заказы"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-400/20 rounded-full animate-ping"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent" data-testid="text-hero-title">
                Optombazar.uz
              </h1>
              <p className="text-2xl lg:text-3xl font-light mb-4 text-blue-100">
                O'zbekistondagi eng yirik optom savdo platformasi
              </p>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed" data-testid="text-hero-description">
                Polietilen paketlar, bir martalik idish-tovoq, elektronika va kiyim-kechak kabi mahsulotlarni optom narxlarda xarid qiling
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/catalog">
                  <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-2xl" data-testid="button-view-catalog">
                    Katalogni ko'rish
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="border-2 border-white/60 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm" data-testid="button-become-seller">
                    Sotuvchi bo'lish
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <div className="text-3xl font-bold mb-2">50K+</div>
                    <div className="text-sm opacity-80">Mahsulotlar</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/30 to-pink-600/30 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <div className="text-3xl font-bold mb-2">1000+</div>
                    <div className="text-sm opacity-80">Sotuvchilar</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/30 to-teal-600/30 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <div className="text-3xl font-bold mb-2">10K+</div>
                    <div className="text-sm opacity-80">Mijozlar</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/30 to-red-600/30 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                    <div className="text-3xl font-bold mb-2">24/7</div>
                    <div className="text-sm opacity-80">Qo'llab-quvvatlash</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Bizning afzalliklarimiz</h2>
            <p className="text-xl text-gray-600">Nima uchun aynan Optombazar.uz ni tanlashingiz kerak</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" data-testid={`feature-${index}`}>
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center" data-testid={`text-feature-title-${index}`}>
                  {language === 'uz' ? feature.titleUz : feature.titleRu}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed" data-testid={`text-feature-description-${index}`}>
                  {language === 'uz' ? feature.descriptionUz : feature.descriptionRu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-categories-title">
              Asosiy kategoriyalar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-testid="text-categories-description">
              Bizning eng mashhur mahsulot toifalarimiz bilan tanishing
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 animate-pulse" data-testid={`skeleton-category-${i}`}>
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-3xl"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3 mx-auto w-32"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 mx-auto w-48"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-24 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 hover:from-blue-50 hover:to-indigo-100 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={() => window.location.href = `/category/${category.slug}`}
                  data-testid={`category-card-${category.id}`}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-300">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3" data-testid={`text-category-name-${category.id}`}>
                      {language === 'uz' ? category.nameUz : category.nameRu}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      Yuqori sifatli mahsulotlar eng yaxshi narxlarda
                    </p>
                    <div className="mt-6">
                      <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium group-hover:bg-indigo-100 group-hover:text-indigo-800 transition-colors">
                        Ko'rish →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/categories">
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">
                Barcha kategoriyalarni ko'rish
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-featured-title">
                {t('featuredProducts')}
              </h2>
              <p className="text-xl text-gray-600" data-testid="text-featured-description">
                {t('featuredDescription')}
              </p>
            </div>
            <Link href="/products" className="hidden md:block">
              <Button variant="ghost" className="text-primary font-semibold hover:text-blue-700" data-testid="button-view-all-products">
                {t('viewAll')} →
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse" data-testid={`skeleton-product-${i}`}>
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
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

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-why-choose-title">
              {t('whyChooseUs')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-testid="text-why-choose-description">
              {t('whyDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow" data-testid={`feature-${index}`}>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4" data-testid={`text-feature-title-${index}`}>
                  {feature.titleUz}
                </h3>
                <p className="text-gray-600" data-testid={`text-feature-description-${index}`}>
                  {feature.descriptionUz}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6" data-testid="text-cta-title">
            {t('businessPartner')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto" data-testid="text-cta-description">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-gray-50" data-testid="button-register-now">
              {t('registerNow')}
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary" data-testid="button-contact-us">
              {t('contactUs')}: +998 90 123 45 67
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
