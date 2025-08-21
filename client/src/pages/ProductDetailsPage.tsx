import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { useLanguage } from '@/components/language-provider';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { SEOHead } from '@/components/SEOHead';
import { generateProductMetaTags } from '@shared/seo';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, Minus, Plus, ShoppingCart, ArrowLeft, Play, Star, Heart } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // YouTube video handling functions
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const isYouTubeVideo = (url: string) => {
    return getYouTubeId(url) !== null;
  };

  const { data: product, isLoading, error } = useProductBySlug(slug || '');

  // All hooks must be called at the top level before any conditional returns
  // Check if product is in favorites
  const { data: favoriteStatus } = useQuery({
    queryKey: ['/api/favorites/check', product?.id],
    queryFn: async () => {
      const response = await fetch(`/api/favorites/check/${product?.id}`);
      if (!response.ok) throw new Error('Failed to check favorite status');
      return response.json();
    },
    enabled: !!user && !!product?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product?.id }),
      });
      if (!response.ok) throw new Error('Failed to add to favorites');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites/check', product?.id] });
      toast({
        title: language === 'uz' ? "Sevimlilar ro'yxatiga qo'shildi" : "Добавлено в избранное",
      });
    },
    onError: (error: any) => {
      toast({
        title: language === 'uz' ? "Xatolik" : "Ошибка",
        description: error.message || (language === 'uz' ? "Sevimlilar ro'yxatiga qo'shishda xatolik" : "Ошибка при добавлении в избранное"),
        variant: "destructive",
      });
    },
  });

  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/favorites/${product?.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove from favorites');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites/check', product?.id] });
      toast({
        title: language === 'uz' ? "Sevimlilardan o'chirildi" : "Удалено из избранного",
      });
    },
    onError: (error: any) => {
      toast({
        title: language === 'uz' ? "Xatolik" : "Ошибка",
        description: error.message || (language === 'uz' ? "Sevimlilardan o'chirishda xatolik" : "Ошибка при удалении из избранного"),
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="w-full h-96 bg-muted rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-muted rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4" data-testid="text-error-title">
              Mahsulot topilmadi
            </h1>
            <p className="text-muted-foreground mb-8" data-testid="text-error-message">
              Kechirasiz, siz qidirgan mahsulot mavjud emas.
            </p>
            <Link href="/catalog">
              <Button data-testid="button-back-to-catalog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Katalogga qaytish
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const name = language === 'uz' ? product.nameUz : product.nameRu;
  const description = language === 'uz' ? product.descriptionUz : product.descriptionRu;

  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: language === 'uz' ? "Tizimga kirish talab qilinadi" : "Требуется авторизация",
        description: language === 'uz' ? "Sevimlilar ro'yxatidan foydalanish uchun tizimga kiring" : "Войдите в систему для использования избранного",
        variant: "destructive",
      });
      return;
    }

    if (favoriteStatus?.isFavorite) {
      removeFromFavoritesMutation.mutate();
    } else {
      addToFavoritesMutation.mutate();
    }
  };

  // SEO meta-teglarni generate qilish
  const seoMetaTags = generateProductMetaTags(product);
  
  const stockStatus = (product.stockQuantity || 0) > 100 ? 'inStock' : 
                     (product.stockQuantity || 0) > 0 ? 'lowStock' : 'outOfStock';
  
  const statusLabels = {
    inStock: language === 'uz' ? 'Omborda bor' : 'В наличии',
    lowStock: language === 'uz' ? 'Kam qoldi' : 'Мало осталось', 
    outOfStock: language === 'uz' ? 'Tugadi' : 'Закончилось'
  };

  const statusColors = {
    inStock: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    lowStock: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    outOfStock: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const images = product.images || [];
  const currentImage = images[selectedImageIndex] || images[0] || '/placeholder-image.jpg';

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stockQuantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleQuantityDecrease = () => {
    handleQuantityChange(quantity - 1);
  };

  const handleQuantityIncrease = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    handleQuantityChange(value);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <SEOHead seo={seoMetaTags} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="flex items-center space-x-2 mb-8" data-testid="breadcrumb-nav">
          <Link href="/catalog" className="flex items-center text-primary hover:text-primary/80 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-foreground">← Katalogga qaytish</span>
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-border">
              <img
                src={currentImage}
                alt={name}
                className="w-full h-[500px] object-cover"
                data-testid="main-product-image"
              />
              {product.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Tavsiya etiladi
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-primary shadow-lg'
                      : 'border-border hover:border-primary/50'
                  }`}
                  data-testid={`thumbnail-image-${index}`}
                >
                  <img
                    src={image}
                    alt={`${name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              
              {/* Video Thumbnail */}
              {(product as any).videoUrl && (
                <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
                  <DialogTrigger asChild>
                    <button
                      className="w-20 h-20 bg-gray-900 rounded-xl flex items-center justify-center border-2 border-border hover:border-primary/50 transition-all relative overflow-hidden"
                      data-testid="video-thumbnail"
                    >
                      {isYouTubeVideo((product as any).videoUrl) ? (
                        <>
                          <img 
                            src={`https://img.youtube.com/vi/${getYouTubeId((product as any).videoUrl)}/0.jpg`}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <Play className="w-8 h-8 text-white" />
                      )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-full">
                    <DialogTitle className="text-foreground">Mahsulot videosi</DialogTitle>
                    <div className="aspect-video">
                      {isYouTubeVideo((product as any).videoUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId((product as any).videoUrl)}?autoplay=1&rel=0`}
                          title="Product Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded-lg"
                          data-testid="youtube-video"
                        />
                      ) : (
                        <video
                          src={(product as any).videoUrl}
                          controls
                          className="w-full h-full rounded-lg"
                          data-testid="product-video"
                        >
                          Brauzeringiz video formatini qo'llab-quvvatlamaydi.
                        </video>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-8">
            {/* Product Title and Basic Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex-1 mr-4" data-testid="product-title">
                  {name}
                </h1>
                {/* Favorites Button */}
                {user && (
                  <Button
                    variant="ghost"
                    size="lg"
                    className={`p-3 rounded-full ${
                      favoriteStatus?.isFavorite 
                        ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30' 
                        : 'text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900/20'
                    }`}
                    onClick={handleToggleFavorite}
                    disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                  >
                    <Heart 
                      className={`h-6 w-6 ${favoriteStatus?.isFavorite ? 'fill-current' : ''}`}
                    />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <Badge className={statusColors[stockStatus]} data-testid="stock-status">
                  {statusLabels[stockStatus]}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  SKU: {product.id.slice(-8).toUpperCase()}
                </span>
              </div>

              {/* Price Section */}
              <div className="bg-card dark:bg-gray-800 rounded-2xl p-6 border border-border">
                <div className="flex items-baseline space-x-4">
                  <span className="text-3xl font-bold text-foreground">
                    {parseFloat(product.price).toLocaleString()} so'm
                  </span>
                  <span className="text-lg text-muted-foreground">/ {product.unit}</span>
                </div>
                {product.wholesalePrice && parseFloat(product.wholesalePrice) !== parseFloat(product.price) && (
                  <div className="mt-2">
                    <span className="text-lg text-green-600 dark:text-green-400">
                      Optom narxi: {parseFloat(product.wholesalePrice).toLocaleString()} so'm
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      (min: {product.minQuantity} {product.unit})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Tavsif</h3>
              <p className="text-muted-foreground leading-relaxed" data-testid="product-description">
                {description || 'Mahsulot tavsifi mavjud emas.'}
              </p>
            </div>

            {/* Specifications */}
            {(product as any).specifications && Object.keys((product as any).specifications).length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Xususiyatlari</h3>
                <div className="bg-card dark:bg-gray-800 rounded-2xl p-6 border border-border">
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries((product as any).specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-border/50 pb-2">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="text-foreground font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Miqdor</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-card dark:bg-gray-800 rounded-lg border border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleQuantityDecrease}
                      disabled={quantity <= 1}
                      className="h-12 w-12 p-0 hover:bg-muted"
                      data-testid="decrease-quantity"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityInputChange}
                      min="1"
                      max={product.stockQuantity || 0}
                      className="w-20 h-12 text-center border-0 bg-transparent text-lg font-semibold text-foreground"
                      data-testid="quantity-input"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleQuantityIncrease}
                      disabled={quantity >= (product.stockQuantity || 0)}
                      className="h-12 w-12 p-0 hover:bg-muted"
                      data-testid="increase-quantity"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  <span className="text-muted-foreground">
                    Mavjud: {product.stockQuantity || 0} {product.unit}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={stockStatus === 'outOfStock' || quantity < 1}
                className="w-full h-14 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                Savatga qo'shish
                <span className="ml-2">
                  ({(quantity * parseFloat(product.price)).toLocaleString()} so'm)
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}