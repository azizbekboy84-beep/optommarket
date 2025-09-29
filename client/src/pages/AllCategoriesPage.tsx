import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useLanguage } from '@/components/language-provider';

import { ModernHeader } from '@/components/modern/ModernHeader';
import { CategoryCard } from '@/components/category-card';
import { Footer } from '@/components/footer';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, Package, Utensils, Smartphone, Shirt, Box } from 'lucide-react';
import { Category } from '@shared/schema';

// Icon mapping for categories
const getIconComponent = (iconName: string | null) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Package,
    Shirt,
    Utensils,
    Smartphone,
    Box,
    Folder,
  };
  
  return iconMap[iconName || 'Package'] || Package;
};

export default function AllCategoriesPage() {
  const { language } = useLanguage();

  // Fetch all categories
  const { data: categories = [], isLoading, error } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    },
  });

  // Group categories by parent
  const mainCategories = categories.filter(cat => !cat.parentId);
  const subcategoriesByParent = categories
    .filter(cat => cat.parentId)
    .reduce((acc, cat) => {
      if (!acc[cat.parentId!]) {
        acc[cat.parentId!] = [];
      }
      acc[cat.parentId!].push(cat);
      return acc;
    }, {} as Record<string, Category[]>);

  const pageTitle = language === 'uz' 
    ? 'Barcha Kategoriyalar - Optombazar.uz' 
    : 'Все Категории - Optombazar.uz';
  
  const pageDescription = language === 'uz'
    ? 'Optombazar.uz da barcha mahsulot kategoriyalarini ko\'ring. Plastik paketlar, bir martalik idishlar, maishiy kimyo va boshqa ko\'plab kategoriyalar.'
    : 'Просмотрите все категории товаров на Optombazar.uz. Пластиковые пакеты, одноразовая посуда, бытовая химия и многие другие категории.';

  const seoMetaTags = {
    title: pageTitle,
    description: pageDescription,
    keywords: language === 'uz' 
      ? ['kategoriyalar', 'mahsulotlar', 'optom', 'plastik paketlar', 'idishlar', 'maishiy kimyo']
      : ['категории', 'товары', 'оптом', 'пластиковые пакеты', 'посуда', 'бытовая химия'],
    canonicalUrl: 'https://optombazar.uz/categories',
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogImage: 'https://optombazar.uz/logo.png',
    ogUrl: 'https://optombazar.uz/categories',
    twitterCard: 'summary_large_image' as const,
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    twitterImage: 'https://optombazar.uz/logo.png',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDescription,
      url: 'https://optombazar.uz/categories'
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-black">
        <SEOHead seo={seoMetaTags} />
        <ModernHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-black">
        <SEOHead seo={seoMetaTags} />
        <ModernHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="text-error-title">
              {language === 'uz' ? 'Kategoriyalarni yuklashda xatolik' : 'Ошибка загрузки категорий'}
            </h1>
            <p className="text-muted-foreground" data-testid="text-error-message">
              {language === 'uz' 
                ? 'Kategoriyalarni yuklashda muammo yuz berdi. Sahifani qaytadan yuklang.'
                : 'Произошла ошибка при загрузке категорий. Обновите страницу.'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <SEOHead seo={seoMetaTags} />
      <ModernHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="text-page-title">
            {language === 'uz' ? 'Barcha Kategoriyalar' : 'Все Категории'}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-page-description">
            {language === 'uz' 
              ? 'Bizning keng qamrovli mahsulot kategoriyalarimiz bilan tanishib chiqing'
              : 'Ознакомьтесь с нашим широким ассортиментом категорий товаров'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainCategories.map((mainCategory) => {
            const IconComponent = getIconComponent(mainCategory.icon);
            const subcategories = subcategoriesByParent[mainCategory.id] || [];
            
            return (
              <Card 
                key={mainCategory.id} 
                className="h-full hover:shadow-lg transition-shadow duration-200 border-2 hover:border-blue-200 dark:hover:border-blue-800"
                data-testid={`card-category-${mainCategory.id}`}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <Link 
                        href={`/catalog?category=${mainCategory.slug}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        data-testid={`link-main-category-${mainCategory.id}`}
                      >
                        {language === 'uz' ? mainCategory.nameUz : mainCategory.nameRu}
                      </Link>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {subcategories.length} {language === 'uz' ? 'kategoriya' : 'категорий'}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  {subcategories.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        {language === 'uz' ? 'Ichki kategoriyalar:' : 'Подкатегории:'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {subcategories.map((subcategory) => (
                          <Link
                            key={subcategory.id}
                            href={`/catalog?category=${subcategory.slug}`}
                            className="inline-block"
                            data-testid={`link-subcategory-${subcategory.id}`}
                          >
                            <Badge 
                              variant="outline" 
                              className="hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer text-xs py-1 px-2"
                            >
                              {language === 'uz' ? subcategory.nameUz : subcategory.nameRu}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      {language === 'uz' 
                        ? 'Ichki kategoriyalar mavjud emas'
                        : 'Нет подкategories'}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-main-categories-count">
                  {mainCategories.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'uz' ? 'Asosiy kategoriya' : 'Основных категорий'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-total-categories-count">
                  {categories.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'uz' ? 'Jami kategoriya' : 'Всего категорий'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {language === 'uz' ? '2000+' : '2000+'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {language === 'uz' ? 'Mahsulot' : 'Товаров'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}