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
  const { t } = useLanguage();

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true }],
  });

  const stats = [
    { value: '50K+', label: t('products') },
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
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6" data-testid="text-hero-title">
                {t('heroTitle').split(' ').slice(0, 2).join(' ')}<br />
                <span className="text-blue-200">{t('heroTitle').split(' ').slice(2).join(' ')}</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed" data-testid="text-hero-description">
                {t('heroDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button className="bg-white text-blue-700 hover:bg-gray-50" data-testid="button-view-products">
                    {t('viewProducts')}
                  </Button>
                </Link>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-700" data-testid="button-become-seller">
                  {t('becomeSeller')}
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern warehouse with organized inventory" 
                className="rounded-xl shadow-2xl"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2" data-testid={`text-stat-value-${index}`}>
                  {stat.value}
                </div>
                <div className="text-gray-600" data-testid={`text-stat-label-${index}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="text-categories-title">
              {t('mainCategories')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-testid="text-categories-description">
              {t('categoriesDescription')}
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse" data-testid={`skeleton-category-${i}`}>
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <CategoryCard 
                  key={category.id} 
                  category={category} 
                  onClick={() => window.location.href = `/categories/${category.slug}`}
                />
              ))}
            </div>
          )}
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
