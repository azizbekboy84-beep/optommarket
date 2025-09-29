import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../language-provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, X, Clock, TrendingUp, ArrowRight, 
  Package, Filter, Star, Users
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'product' | 'category';
  name: string;
  description?: string;
  price?: number;
  image?: string;
  slug: string;
  category?: string;
  rating?: number;
  sales?: number;
}

interface ModernSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModernSearchModal({ isOpen, onClose }: ModernSearchModalProps) {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState([
    'Polietilen paketlar',
    'Bir martalik idishlar', 
    'Elektronika',
    'Kiyim-kechak',
    'Oziq-ovqat mahsulotlari'
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search function with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Mock search results - replace with actual API call
        const mockResults: SearchResult[] = [
          {
            id: '1',
            type: 'product',
            name: 'Polietilen paket 30x40',
            description: 'Yuqori sifatli polietilen paketlar',
            price: 15000,
            image: '/product-1.jpg',
            slug: 'polietilen-paket-30x40',
            category: 'Paketlar',
            rating: 4.8,
            sales: 150
          },
          {
            id: '2',
            type: 'category',
            name: 'Bir martalik idishlar',
            description: '200+ mahsulot',
            slug: 'bir-martalik-idishlar'
          }
        ].filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
        );

        setResults(mockResults);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    // Navigate to search results
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Search Modal */}
      <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          
          {/* Search Header */}
          <div className="flex items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder={language === 'uz' ? 'Mahsulot, kategoriya yoki brend qidiring...' : 'Поиск товаров, категорий или брендов...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(query);
                  }
                }}
                className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400"
              />
              {isLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Search Content */}
          <div className="max-h-96 overflow-y-auto">
            
            {/* Search Results */}
            {query.trim() && (
              <div className="p-6">
                {results.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {language === 'uz' ? 'Qidiruv natijalari' : 'Результаты поиска'}
                    </h3>
                    {results.map((result) => (
                      <Link
                        key={result.id}
                        href={result.type === 'product' ? `/products/${result.slug}` : `/category/${result.slug}`}
                        onClick={onClose}
                      >
                        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer">
                          {/* Result Image */}
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                            {result.image ? (
                              <img
                                src={result.image}
                                alt={result.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Result Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {result.name}
                            </h4>
                            {result.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {result.description}
                              </p>
                            )}
                            {result.type === 'product' && (
                              <div className="flex items-center gap-4 mt-1">
                                {result.price && (
                                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {result.price.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                                  </span>
                                )}
                                {result.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-xs text-gray-500">{result.rating}</span>
                                  </div>
                                )}
                                {result.sales && (
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">{result.sales}+ sotildi</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Result Type Badge */}
                          <Badge variant={result.type === 'product' ? 'default' : 'secondary'} className="text-xs">
                            {result.type === 'product' 
                              ? (language === 'uz' ? 'Mahsulot' : 'Товар')
                              : (language === 'uz' ? 'Kategoriya' : 'Категория')
                            }
                          </Badge>

                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : !isLoading ? (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {language === 'uz' 
                        ? 'Hech narsa topilmadi. Boshqa kalit so\'z bilan qidiring.'
                        : 'Ничего не найдено. Попробуйте другие ключевые слова.'
                      }
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Default Content (when no search query) */}
            {!query.trim() && (
              <div className="p-6 space-y-6">
                
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {language === 'uz' ? 'So\'nggi qidiruvlar' : 'Недавние поиски'}
                      </h3>
                      <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="text-gray-500 hover:text-red-500">
                        {language === 'uz' ? 'Tozalash' : 'Очистить'}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearch(search)}
                          className="rounded-full"
                        >
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {language === 'uz' ? 'Ommabop qidiruvlar' : 'Популярные поиски'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSearch(search)}
                        className="rounded-full bg-gradient-to-r from-blue-50 to-red-50 hover:from-blue-100 hover:to-red-100 dark:from-blue-900/20 dark:to-red-900/20 border-blue-200 dark:border-blue-800"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {language === 'uz' ? 'Tezkor havolalar' : 'Быстрые ссылки'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/catalog" onClick={onClose}>
                      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer">
                        <Package className="w-8 h-8 text-blue-500 mb-2" />
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {language === 'uz' ? 'Barcha mahsulotlar' : 'Все товары'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {language === 'uz' ? '10,000+ mahsulot' : '10,000+ товаров'}
                        </p>
                      </div>
                    </Link>
                    <Link href="/categories" onClick={onClose}>
                      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer">
                        <Filter className="w-8 h-8 text-green-500 mb-2" />
                        <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                          {language === 'uz' ? 'Kategoriyalar' : 'Категории'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {language === 'uz' ? '50+ kategoriya' : '50+ категорий'}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
