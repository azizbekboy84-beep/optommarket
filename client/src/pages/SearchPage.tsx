import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Link } from 'wouter';
import { Search, Package, FileText, Calendar, User, ArrowRight } from 'lucide-react';
import { Product, BlogPost } from '@shared/schema';
import { useLanguage } from '../components/language-provider';

interface SearchResults {
  products: Product[];
  blogPosts: BlogPost[];
}

export default function SearchPage() {
  const [, params] = useRoute('/search');
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('q') || '';
  const { language } = useLanguage();

  // Fetch search results
  const { data: results, isLoading, error } = useQuery<SearchResults>({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) {
        return { products: [], blogPosts: [] };
      }
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Qidiruvda xatolik');
      }
      return response.json();
    },
    enabled: !!query.trim(),
  });

  const totalResults = (results?.products?.length || 0) + (results?.blogPosts?.length || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Search className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Qidiruv natijalari
              </h1>
            </div>
            {query && (
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <p className="text-lg text-gray-700">
                  <span className="font-medium">Qidiruv so'zi:</span> "{query}"
                </p>
                {!isLoading && (
                  <p className="text-sm text-gray-500 mt-1">
                    {totalResults > 0 
                      ? `${totalResults} ta natija topildi`
                      : 'Hech narsa topilmadi'
                    }
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Qidirilmoqda...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="text-red-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Qidiruvda xatolik
              </h3>
              <p className="text-gray-500">
                Qidiruv jarayonida xatolik yuz berdi. Iltimos, qayta urinib ko'ring.
              </p>
            </div>
          )}

          {/* No Query */}
          {!query.trim() && !isLoading && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Qidiruv so'zini kiriting
              </h3>
              <p className="text-gray-500">
                Mahsulotlar va blog postlari orasidan qidirish uchun yuqoridagi qidiruv maydonidan foydalaning.
              </p>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && !error && query.trim() && results && (
            <>
              {totalResults === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Hech narsa topilmadi
                  </h3>
                  <p className="text-gray-500 mb-6">
                    "{query}" so'zi bo'yicha hech qanday natija topilmadi. <br />
                    Boshqa kalit so'zlar bilan qidirib ko'ring.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/products">
                      <Button variant="outline">
                        <Package className="h-4 w-4 mr-2" />
                        Barcha mahsulotlar
                      </Button>
                    </Link>
                    <Link href="/blog">
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Blog maqolalari
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Products Section */}
                  {results.products && results.products.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <Package className="h-6 w-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">
                          Topilgan mahsulotlar ({results.products.length})
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.products.map((product) => (
                          <Link key={product.id} href={`/products/${product.slug}`}>
                            <Card className="h-full hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
                              {product.images && product.images[0] && (
                                <div className="relative overflow-hidden rounded-t-lg">
                                  <img 
                                    src={product.images[0]} 
                                    alt={language === 'uz' ? product.nameUz : product.nameRu}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <CardHeader>
                                <CardTitle className="group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                  {language === 'uz' ? product.nameUz : product.nameRu}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {language === 'uz' ? product.descriptionUz : product.descriptionRu}
                                </p>
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <p className="text-lg font-bold text-green-600">
                                      {Number(product.wholesalePrice).toLocaleString()} so'm
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Min: {product.minQuantity} {product.unit}
                                    </p>
                                  </div>
                                  <Badge variant={(product.stockQuantity || 0) > 0 ? "default" : "secondary"}>
                                    {(product.stockQuantity || 0) > 0 ? 'Mavjud' : 'Tugagan'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all duration-300">
                                  <span>Batafsil</span>
                                  <ArrowRight className="h-4 w-4" />
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Blog Posts Section */}
                  {results.blogPosts && results.blogPosts.length > 0 && (
                    <section>
                      <div className="flex items-center gap-3 mb-6">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">
                          Topilgan maqolalar ({results.blogPosts.length})
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.blogPosts.map((post) => (
                          <Link key={post.id} href={`/blog/${post.slug}`}>
                            <Card className="h-full hover:shadow-xl transition-shadow duration-300 group cursor-pointer overflow-hidden">
                              {post.imageUrl && (
                                <div className="relative overflow-hidden">
                                  <img 
                                    src={post.imageUrl} 
                                    alt={post.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                                </div>
                              )}
                              <CardHeader>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(post.createdAt!).toLocaleDateString('uz-UZ')}</span>
                                  {post.isPublished && (
                                    <Badge variant="default" className="ml-auto">
                                      Chop etilgan
                                    </Badge>
                                  )}
                                </div>
                                <CardTitle className="group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                  {post.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-600 line-clamp-3 mb-4">
                                  {post.content.substring(0, 150)}...
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <User className="h-4 w-4" />
                                    <span>OptomBazar</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all duration-300">
                                    <span>O'qish</span>
                                    <ArrowRight className="h-4 w-4" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}