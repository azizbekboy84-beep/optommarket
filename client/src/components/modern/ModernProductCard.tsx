import React, { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../language-provider';
import { OptimizedImage } from '../OptimizedImage';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Heart, ShoppingCart, Eye, Star, Truck, Shield, 
  Zap, TrendingUp, Package, Users
} from 'lucide-react';

interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz?: string;
  descriptionRu?: string;
  price: string;
  wholesalePrice: string;
  minQuantity: number;
  stockQuantity: number;
  unit: string;
  images?: string[];
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
}

interface ModernProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export function ModernProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist,
  variant = 'default' 
}: ModernProductCardProps) {
  const { language } = useLanguage();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const productName = language === 'uz' ? product.nameUz : product.nameRu;
  const productDescription = language === 'uz' ? product.descriptionUz : product.descriptionRu;
  const images = product.images || ['/placeholder-product.jpg'];
  
  const wholesalePrice = Number(product.wholesalePrice);
  const retailPrice = Number(product.price);
  const discount = retailPrice > wholesalePrice ? Math.round(((retailPrice - wholesalePrice) / retailPrice) * 100) : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const cardClasses = {
    default: "group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden",
    compact: "group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden",
    featured: "group bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-2 border-blue-200 dark:border-blue-800 overflow-hidden relative"
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div 
        className={cardClasses[variant]}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Featured badge */}
        {variant === 'featured' && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              {language === 'uz' ? 'TOP' : 'ТОП'}
            </Badge>
          </div>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-red-500 text-white font-bold px-2 py-1 rounded-full shadow-lg">
              -{discount}%
            </Badge>
          </div>
        )}

        {/* Image container */}
        <div className="relative overflow-hidden">
          <div className="aspect-square relative">
            <OptimizedImage
              src={images[currentImageIndex]}
              alt={productName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              priority={variant === 'featured'}
              onError={(e) => {
                e.currentTarget.src = '/placeholder-product.jpg';
              }}
            />
            
            {/* Image overlay on hover */}
            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Quick action buttons */}
            <div className={`absolute top-4 left-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
              <Button
                size="sm"
                variant="secondary"
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                onClick={handleWishlist}
                aria-label={language === 'uz' ? 'Sevimlilarga qo\'shish' : 'Добавить в избранное'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              >
                <Eye className="w-4 h-4 text-gray-600" />
              </Button>
            </div>

            {/* Image indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Product name */}
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {productName}
          </h3>

          {/* Description */}
          {productDescription && variant !== 'compact' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {productDescription}
            </p>
          )}

          {/* Features */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              <span>{language === 'uz' ? 'Min' : 'Мин'}: {product.minQuantity} {product.unit}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{language === 'uz' ? 'Stok' : 'Склад'}: {product.stockQuantity}</span>
            </div>
          </div>

          {/* Price section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {wholesalePrice.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                </div>
                {discount > 0 && (
                  <div className="text-sm text-gray-500 line-through">
                    {retailPrice.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'uz' ? 'Optom narx' : 'Оптовая цена'}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  {language === 'uz' ? 'Tejash' : 'Экономия'}: {discount}%
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-green-500" />
              <span>{language === 'uz' ? 'Tez yetkazib berish' : 'Быстрая доставка'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-blue-500" />
              <span>{language === 'uz' ? 'Kafolat' : 'Гарантия'}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group"
              aria-label={`${productName} ${language === 'uz' ? 'savatga qo\'shish' : 'добавить в корзину'}`}
            >
              <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              {language === 'uz' ? 'Savatga' : 'В корзину'}
            </Button>
            {variant === 'featured' && (
              <Button
                variant="outline"
                className="px-4 border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl"
              >
                <Zap className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1 ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>
                {product.stockQuantity > 0 
                  ? (language === 'uz' ? 'Mavjud' : 'В наличии')
                  : (language === 'uz' ? 'Tugagan' : 'Нет в наличии')
                }
              </span>
            </div>
            {product.isFeatured && (
              <div className="flex items-center gap-1 text-yellow-600">
                <TrendingUp className="w-3 h-3" />
                <span>{language === 'uz' ? 'Ommabop' : 'Популярный'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </Link>
  );
}
