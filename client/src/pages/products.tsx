import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/language-provider';

import { ModernHeader } from '@/components/modern/ModernHeader';
import { Footer } from '@/components/footer';
import { SEOHead } from '@/components/SEOHead';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Category } from '@shared/schema';
import { Search } from 'lucide-react';
export default function Products() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name');

  // Get category from URL params if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedCategory && selectedCategory !== 'all') params.set('categoryId', selectedCategory);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });

  const handleSearch = () => {
    // The query will automatically refetch when searchQuery changes
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-page-title">
            {t('products')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" data-testid="text-page-description">
            {selectedCategory 
              ? `${categories.find(c => c.id === selectedCategory)?.nameUz || ''} kategoriyasidagi mahsulotlar`
              : 'Barcha optom mahsulotlarni ko\'ring'
            }
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
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
                      {category.nameUz}
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
          <p className="text-gray-600" data-testid="text-results-count">
            {sortedProducts.length} ta mahsulot topildi
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse" data-testid={`skeleton-product-${i}`}>
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <div className="text-gray-400 text-lg mb-4">
              {searchQuery 
                ? `"${searchQuery}" bo'yicha hech narsa topilmadi`
                : 'Mahsulotlar topilmadi'
              }
            </div>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')} variant="outline" data-testid="button-clear-search">
                Qidiruvni tozalash
              </Button>
            )}
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
