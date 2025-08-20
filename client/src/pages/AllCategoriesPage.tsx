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

        {/* Categories Grid - More compact */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mainCategories.map((category) => {
            const children = getCategoryChildren(category.id);
            const IconComponent = getIconComponent(category.icon);
            
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="flex flex-col items-center gap-2 text-center">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">
                        {language === 'uz' ? category.nameUz : category.nameRu}
                      </h3>
                      {(category.descriptionUz || category.descriptionRu) && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-normal mt-1 line-clamp-2">
                          {language === 'uz' ? category.descriptionUz : category.descriptionRu}
                        </p>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-2 px-4 pb-4">
                  {children.length > 0 ? (
                    <>
                      <div className="flex items-center justify-center mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {children.length} {language === 'uz' ? 'ichki' : 'под'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 max-h-24 overflow-y-auto text-center">
                        {children.slice(0, 3).map((child) => (
                          <Link 
                            key={child.id} 
                            href={`/catalog?category=${child.slug}`}
                          >
                            <div className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer truncate">
                              {language === 'uz' ? child.nameUz : child.nameRu}
                            </div>
                          </Link>
                        ))}
                        {children.length > 3 && (
                          <div className="text-xs text-gray-400">+{children.length - 3} {language === 'uz' ? 'yana' : 'ещё'}</div>
                        )}
                      </div>
                      
                      <Link href={`/catalog?category=${category.slug}`}>
                        <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7">
                          {language === 'uz' ? 'Ko\'rish' : 'Смотреть'} →
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <div className="py-2">
                      <Link href={`/catalog?category=${category.slug}`}>
                        <Button variant="default" size="sm" className="w-full text-xs h-7">
                          {language === 'uz' ? 'Ko\'rish' : 'Смотреть'} →
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