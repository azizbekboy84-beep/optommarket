import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ChevronLeft, Package, Shirt, Utensils, Smartphone, Box, Folder, Grid3x3 } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
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
    Grid3x3,
  };
  
  const IconComponent = iconName ? iconMap[iconName] : Package;
  return IconComponent || Package;
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
  const getCategoryChildren = (parentId: string) => 
    categories.filter(cat => cat.parentId === parentId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'uz' ? 'Xatolik yuz berdi' : 'Произошла ошибка'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'uz' ? 'Kategoriyalarni yuklab bo\'lmadi' : 'Не удалось загрузить категории'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              {language === 'uz' ? 'Bosh sahifa' : 'Главная'}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {language === 'uz' ? 'Barcha kategoriyalar' : 'Все категории'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {language === 'uz' 
                ? 'Bizning mahsulotlar katalogini ko\'rib chiqing'
                : 'Просмотрите наш каталог товаров'
              }
            </p>
          </div>
        </div>

        {/* Categories Grid - Ultra compact for 12 items */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3">
          {mainCategories.map((category) => {
            const children = getCategoryChildren(category.id);
            const IconComponent = getIconComponent(category.icon);
            
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow h-40">
                <CardHeader className="pb-1 pt-2 px-2">
                  <CardTitle className="flex flex-col items-center gap-1 text-center">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs leading-tight line-clamp-2 h-8">
                        {language === 'uz' ? category.nameUz : category.nameRu}
                      </h3>
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-1 px-2 pb-2">
                  {children.length > 0 ? (
                    <>
                      <div className="flex items-center justify-center mb-1">
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">
                          {children.length}
                        </Badge>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-[10px] text-gray-600 dark:text-gray-400 line-clamp-1">
                          {children.slice(0, 1).map((child) => (
                            language === 'uz' ? child.nameUz : child.nameRu
                          )).join('')}
                          {children.length > 1 && ' +' + (children.length - 1)}
                        </div>
                      </div>
                      
                      <Link href={`/catalog?category=${category.slug}`}>
                        <Button variant="outline" size="sm" className="w-full mt-1 text-[10px] h-5">
                          {language === 'uz' ? 'Ko\'rish' : 'См.'} →
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="py-1 flex-1 flex items-end">
                      <Link href={`/catalog?category=${category.slug}`} className="w-full">
                        <Button variant="default" size="sm" className="w-full text-[10px] h-5">
                          {language === 'uz' ? 'Ko\'rish' : 'См.'} →
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {mainCategories.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {language === 'uz' ? 'Kategoriyalar topilmadi' : 'Категории не найдены'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'uz' ? 'Hozircha kategoriyalar qo\'shilmagan' : 'Пока что категории не добавлены'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}