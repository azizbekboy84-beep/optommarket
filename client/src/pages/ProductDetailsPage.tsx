import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useProductBySlug } from '@/hooks/useProductBySlug';
import { useLanguage } from '@/components/language-provider';
import { useCart } from '@/context/CartContext';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, error } = useProductBySlug(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-error-title">
              Mahsulot topilmadi
            </h1>
            <p className="text-gray-600 mb-8" data-testid="text-error-message">
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
  
  const stockStatus = (product.stockQuantity || 0) > 100 ? 'inStock' : 
                     (product.stockQuantity || 0) > 0 ? 'lowStock' : 'outOfStock';
  
  const statusLabels = {
    inStock: language === 'uz' ? 'Omborda bor' : 'В наличии',
    lowStock: language === 'uz' ? 'Kam qoldi' : 'Мало осталось', 
    outOfStock: language === 'uz' ? 'Tugadi' : 'Закончилось'
  };

  const statusColors = {
    inStock: 'bg-green-100 text-green-800',
    lowStock: 'bg-yellow-100 text-yellow-800',
    outOfStock: 'bg-red-100 text-red-800'
  };

  const images = product.images || [];
  const currentImage = images[selectedImageIndex] || images[0] || '/placeholder-image.jpg';

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantity < (product.stockQuantity || 0)) {
      setQuantity(quantity + 1);
    }
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/catalog">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Katalogga qaytish
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative">
              <img
                src={currentImage}
                alt={name}
                className="w-full h-96 object-cover rounded-lg border"
                data-testid="img-product-main"
              />
              {product.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-blue-600" data-testid="badge-featured">
                  {language === 'uz' ? 'Tavsiya etiladi' : 'Рекомендуется'}
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto" data-testid="gallery-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side - Product Details */}
          <div className="space-y-6">
            {/* Product Name and Status */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="text-product-name">
                {name}
              </h1>
              <Badge className={statusColors[stockStatus]} data-testid="badge-stock-status">
                {statusLabels[stockStatus]}
              </Badge>
            </div>

            {/* Prices */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-blue-600" data-testid="text-wholesale-price">
                  {Number(product.wholesalePrice).toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                </span>
                <span className="text-sm text-gray-500" data-testid="text-wholesale-label">
                  {language === 'uz' ? 'Optom narxi' : 'Оптовая цена'}
                </span>
              </div>
              {Number(product.price) !== Number(product.wholesalePrice) && (
                <div className="flex items-center space-x-4">
                  <span className="text-xl text-gray-500 line-through" data-testid="text-retail-price">
                    {Number(product.price).toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                  </span>
                  <span className="text-sm text-gray-500" data-testid="text-retail-label">
                    {language === 'uz' ? 'Chakana narxi' : 'Розничная цена'}
                  </span>
                </div>
              )}
            </div>

            {/* Minimum Quantity */}
            <div className="text-sm text-gray-600" data-testid="text-min-quantity">
              {language === 'uz' ? 'Minimal miqdor' : 'Минимальное количество'}: {product.minQuantity} {product.unit}
            </div>

            {/* Description */}
            {description && (
              <div>
                <h3 className="text-lg font-semibold mb-2" data-testid="text-description-title">
                  {language === 'uz' ? 'Tavsif' : 'Описание'}
                </h3>
                <p className="text-gray-700 leading-relaxed" data-testid="text-product-description">
                  {description}
                </p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && typeof product.specifications === 'object' && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3" data-testid="text-specifications-title">
                  {language === 'uz' ? 'Xususiyatlari' : 'Характеристики'}
                </h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full" data-testid="table-specifications">
                    <tbody>
                      {Object.entries(product.specifications as Record<string, string>).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                            {key}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" data-testid="label-quantity">
                {language === 'uz' ? 'Miqdor' : 'Количество'}
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuantityDecrease}
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 border rounded-md bg-white text-center min-w-[60px]" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuantityIncrease}
                  disabled={quantity >= (product.stockQuantity || 0)}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-500" data-testid="text-unit">
                  {product.unit}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={stockStatus === 'outOfStock'}
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {stockStatus === 'outOfStock' 
                ? (language === 'uz' ? 'Tugagan' : 'Закончилось')
                : (language === 'uz' ? 'Savatga qo\'shish' : 'Добавить в корзину')
              }
            </Button>

            {/* Stock Info */}
            <div className="text-sm text-gray-600" data-testid="text-stock-info">
              {language === 'uz' ? 'Omborda' : 'В наличии'}: {product.stockQuantity} {product.unit}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}