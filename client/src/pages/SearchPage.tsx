import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/components/language-provider";
import { ModernHeader } from "@/components/modern/ModernHeader";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product, BlogPost } from "@shared/schema";

interface SearchResult {
  products: Product[];
  blogPosts: BlogPost[];
}

export default function SearchPage() {
  const [location, navigate] = useLocation();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  // Extract search query from URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q') || '';

  const { data: searchResults, isLoading, error } = useQuery<SearchResult>({
    queryKey: ['/api/search', query],
    queryFn: async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Qidiruv muvaffaqiyatsiz');
      }
      return response.json();
    },
    enabled: !!query,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const BlogPostCard = ({ post }: { post: SearchResult['blogPosts'][0] }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        )}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.content.substring(0, 150)}...
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(post.createdAt || '').toLocaleDateString(language === 'uz' ? 'uz-UZ' : 'ru-RU')}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernHeader />
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-6 md:mb-8">
        <div className="flex gap-2 max-w-md mx-auto">
          <Input
            type="text"
            placeholder={language === 'uz' ? 'Qidirish...' : 'Поиск...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm md:text-base"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {query && (
        <div>
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 px-2">
            {language === 'uz' ? `Qidiruv natijalari: "${query}"` : `Результаты поиска: "${query}"`}
          </h1>

          {isLoading && (
            <div className="flex items-center justify-center py-8 md:py-12">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin" />
              <span className="ml-2 text-sm md:text-base">
                {language === 'uz' ? 'Qidirilmoqda...' : 'Идет поиск...'}
              </span>
            </div>
          )}

          {error && (
            <div className="text-center py-8 md:py-12">
              <p className="text-sm md:text-base text-red-500">
                {language === 'uz' ? 'Qidirishda xatolik yuz berdi' : 'Произошла ошибка при поиске'}
              </p>
            </div>
          )}

          {searchResults && !isLoading && (
            <div className="space-y-6 md:space-y-8">
              {/* Products section */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                  {language === 'uz' ? 'Topilgan mahsulotlar' : 'Найденные товары'}
                  {searchResults.products.length > 0 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({searchResults.products.length})
                    </span>
                  )}
                </h2>
                
                {searchResults.products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {searchResults.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-muted-foreground">
                    {language === 'uz' ? 'Mahsulotlar topilmadi' : 'Товары не найдены'}
                  </p>
                )}
              </section>

              {/* Blog posts section */}
              <section>
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
                  {language === 'uz' ? 'Topilgan maqolalar' : 'Найденные статьи'}
                  {searchResults.blogPosts.length > 0 && (
                    <span className="text-muted-foreground ml-2">
                      ({searchResults.blogPosts.length})
                    </span>
                  )}
                </h2>
                
                {searchResults.blogPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {searchResults.blogPosts.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-muted-foreground">
                    {language === 'uz' ? 'Maqolalar topilmadi' : 'Статьи не найдены'}
                  </p>
                )}
              </section>

              {/* No results message */}
              {searchResults.products.length === 0 && searchResults.blogPosts.length === 0 && (
                <div className="text-center py-8 md:py-12">
                  <p className="text-base md:text-lg text-muted-foreground mb-2">
                    {language === 'uz' ? 'Hech narsa topilmadi' : 'Ничего не найдено'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'uz'
                      ? 'Boshqa kalit so\'zlar bilan qayta urinib ko\'ring'
                      : 'Попробуйте использовать другие ключевые слова'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-8 md:py-12">
          <Search className="h-12 w-12 md:h-16 md:w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-base md:text-lg text-muted-foreground">
            {language === 'uz' ? 'Qidiruv so\'zini kiriting' : 'Введите поисковый запрос'}
          </p>
        </div>
      )}
      </div>
    </div>
  );
}