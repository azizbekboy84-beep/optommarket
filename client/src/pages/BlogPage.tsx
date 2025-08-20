import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { Link } from 'wouter';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '@shared/schema';

export default function BlogPage() {
  // Fetch blog posts
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const response = await fetch('/api/blog/posts');
      if (!response.ok) {
        throw new Error('Blog postlarini yuklab bo\'lmadi');
      }
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              OptomBazar Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Optom savdo sohasidagi yangiliklar, maslahatlar va eng so'nggi trendlar haqida bilib oling
            </p>
          </div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Blog postlari yuklanmoqda...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hozircha blog postlari yo'q
              </h3>
              <p className="text-gray-500">
                Tez orada qiziqarli maqolalar bilan qaytamiz!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
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
                      <CardTitle className="group-hover:text-blue-600 transition-colors duration-300">
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
                          <span>Batafsil</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}