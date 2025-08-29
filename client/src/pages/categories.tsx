import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/language-provider';
import { Footer } from '@/components/footer';

import { CategoryCard } from '@/components/category-card';
import { Category } from '@shared/schema';
import { useLocation } from 'wouter';

export default function Categories() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleCategoryClick = (category: Category) => {
    setLocation(`/products?category=${category.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
            {t('categories')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-testid="text-page-description">
            {t('categoriesDescription')}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse" data-testid={`skeleton-category-${i}`}>
                <div className="w-full h-32 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <div className="text-gray-400 text-lg">
              {t('language') === 'uz' ? 'Kategoriyalar topilmadi' : 'Категории не найдены'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
