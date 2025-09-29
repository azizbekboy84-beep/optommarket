import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/components/language-provider';

import { ModernHeader } from '@/components/modern/ModernHeader';
import { Footer } from '@/components/footer';
import { SEOHead } from '@/components/SEOHead';
import { generateCatalogMetaTags } from '@shared/seo';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronRight } from 'lucide-react';

export default function Catalog() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name');

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: products = [], isLoading } = useProducts(selectedCategory, searchQuery);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return Number(a.wholesalePrice) - Number(b.wholesalePrice);
      case 'price-high':
        return Number(b.wholesalePrice) - Number(a.wholesalePrice);
      case 'name':
      default:
        return a.nameUz.localeCompare(b.nameUz);
    }
  });

  // SEO meta-teglarni generate qilish
  const catalogSEO = generateCatalogMetaTags();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SEOHead seo={catalogSEO} />
      <ModernHeader />
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-page-title">
            Katalog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-testid="text-page-description">
            Barcha optom mahsulotlarni bir joydan ko'ring va o'zingizga keraklisini toping
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <Input
                  placeholder="Mahsulot qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  data-testid="input-search"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Kategoriya tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="option-all-categories">Barcha kategoriyalar</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} data-testid={`option-category-${category.id}`}>
                      {language === 'uz' ? category.nameUz : category.nameRu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="select-sort">
                  <SelectValue placeholder="Saralash" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name" data-testid="option-sort-name">Nomi bo'yicha</SelectItem>
                  <SelectItem value="price-low" data-testid="option-sort-price-low">Arzondan qimmgatga</SelectItem>
                  <SelectItem value="price-high" data-testid="option-sort-price-high">Qimmatdan arzonga</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 font-medium" data-testid="text-results-count">
            {sortedProducts.length} ta mahsulot topildi
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-pulse" data-testid={`skeleton-product-${i}`}>
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-4">
              {searchQuery 
                ? `"${searchQuery}" bo'yicha hech narsa topilmadi`
                : 'Mahsulotlar topilmadi'
              }
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product) => (
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

      <Footer />
    </div>
  );
}