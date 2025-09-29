import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/components/language-provider';
import { ProductCard } from '@/components/product-card';
import { ModernHeader } from '@/components/modern/ModernHeader';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { language } = useLanguage();

  // Fetch favorites
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['/api/favorites'],
    queryFn: async () => {
      const response = await fetch('/api/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ModernHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'uz' ? 'Sevimlilar' : 'Избранное'}
            </h1>
            <p className="text-gray-600 mb-8">
              {language === 'uz' 
                ? 'Sevimlilar ro\'yxatini ko\'rish uchun tizimga kiring'
                : 'Войдите в систему, чтобы просмотреть избранное'
              }
            </p>
            <div className="space-x-4">
              <Link href="/auth/login">
                <Button>
                  {language === 'uz' ? 'Tizimga kirish' : 'Войти'}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'uz' ? 'Bosh sahifa' : 'Главная'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'uz' ? 'Orqaga' : 'Назад'}
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-red-500" />
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'uz' ? 'Sevimlilar' : 'Избранное'}
                </h1>
              </div>
            </div>
            {favorites && favorites.length > 0 && (
              <p className="text-sm text-gray-600">
                {language === 'uz' 
                  ? `${favorites.length} ta mahsulot`
                  : `${favorites.length} товаров`
                }
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite: any) => (
              <ProductCard 
                key={favorite.product.id} 
                product={favorite.product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {language === 'uz' ? 'Sevimlilar ro\'yxati bo\'sh' : 'Список избранного пуст'}
            </h2>
            <p className="text-gray-600 mb-8">
              {language === 'uz' 
                ? 'Mahsulotlarni sevimlilar ro\'yxatiga qo\'shing va keyinroq ularni bu yerda ko\'ring'
                : 'Добавляйте товары в избранное и просматривайте их здесь позже'
              }
            </p>
            <div className="space-x-4">
              <Link href="/products">
                <Button>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {language === 'uz' ? 'Mahsulotlarni ko\'rish' : 'Посмотреть товары'}
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  {language === 'uz' ? 'Bosh sahifa' : 'Главная'}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}