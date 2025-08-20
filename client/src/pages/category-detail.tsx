import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/language-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { CategoryCard } from '@/components/category-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product, Category } from '@shared/schema';
import { Search } from 'lucide-react';

interface CategoryDetailProps {
  params: {
    slug: string;
  };
}

export default function CategoryDetail({ params }: CategoryDetailProps) {
  const categorySlug = params.slug;
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Get category by slug
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const currentCategory = categories.find(cat => cat.slug === categorySlug);
  const subcategories = categories.filter(cat => cat.parentId === currentCategory?.id);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { 
      search: searchQuery || undefined,
      categoryId: currentCategory?.id || undefined 
    }],
    enabled: !!currentCategory
  });

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

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategoriya topilmadi</h1>
          <p className="text-gray-600">Ushbu kategoriya mavjud emas yoki o'chirilgan.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryName = language === 'uz' ? currentCategory.nameUz : currentCategory.nameRu;
  const categoryDescription = language === 'uz' ? currentCategory.descriptionUz : currentCategory.descriptionRu;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Hero */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-category-title">
                {categoryName}
              </h1>
              {categoryDescription && (
                <p className="text-xl text-gray-600 mb-6" data-testid="text-category-description">
                  {categoryDescription}
                </p>
              )}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>{products.length} mahsulot</span>
                <span>{subcategories.length} subcategory</span>
              </div>
            </div>
            {currentCategory.image && (
              <div className="lg:order-first">
                <img 
                  src={currentCategory.image} 
                  alt={categoryName}
                  className="w-full h-64 object-cover rounded-lg"
                  data-testid="img-category-hero"
                />
              </div>
            )}
          </div>
        </div>

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sub-kategoriyalar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subcategories.map((subcategory) => (
                <CategoryCard 
                  key={subcategory.id} 
                  category={subcategory}
                  onClick={() => {
                    // Navigate to subcategory
                    window.location.href = `/category/${subcategory.slug}`;
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Mahsulot qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
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
                : 'Bu kategoriyada mahsulotlar topilmadi'
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