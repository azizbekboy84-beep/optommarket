import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Footer } from '../components/footer';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { Link } from 'wouter';
import { BlogPost } from '@shared/schema';

export default function BlogPostPage() {
  const [, params] = useRoute('/blog/:slug');
  const slug = params?.slug;

  // Fetch blog post by slug
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug topilmadi');
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) {
        throw new Error('Blog post topilmadi');
      }
      return response.json();
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Blog post yuklanmoqda...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">

        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Blog post topilmadi
              </h3>
              <p className="text-gray-500 mb-8">
                Siz qidirayotgan maqola mavjud emas yoki o'chirilgan bo'lishi mumkin.
              </p>
              <Link href="/blog">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Blog'ga qaytish
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 150) + '...',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link nusxalandi!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Blog'ga qaytish
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <article className="bg-white rounded-xl shadow-lg overflow-hidden">
            {post.imageUrl && (
              <div className="relative">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            )}
            
            <div className="p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.createdAt!).toLocaleDateString('uz-UZ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>OptomBazar</span>
                </div>
                {post.isPublished && (
                  <Badge variant="default">
                    Chop etilgan
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="ml-auto"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Ulashish
                </Button>
              </div>

              {/* Article Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {post.title}
              </h1>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    So'nggi yangilanish: {new Date(post.updatedAt!).toLocaleDateString('uz-UZ')}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Ulashish
                    </Button>
                    <Link href="/blog">
                      <Button>
                        Boshqa maqolalar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Boshqa maqolalar</h2>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Ko'proq qiziqarli maqolalar uchun</p>
              <Link href="/blog">
                <Button variant="outline">
                  Barcha maqolalarni ko'rish
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}