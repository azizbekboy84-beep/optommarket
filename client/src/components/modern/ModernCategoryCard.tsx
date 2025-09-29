import React, { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../language-provider';
import { Badge } from '../ui/badge';
import { 
  ArrowRight, Package, TrendingUp, Star, Users,
  ShoppingBag, Layers, Grid, Box
} from 'lucide-react';

interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz?: string;
  descriptionRu?: string;
  image?: string;
  icon?: string;
  slug: string;
  isActive: boolean;
  productCount?: number;
}

interface ModernCategoryCardProps {
  category: Category;
  variant?: 'default' | 'large' | 'compact' | 'featured';
  showProductCount?: boolean;
}

export function ModernCategoryCard({ 
  category, 
  variant = 'default',
  showProductCount = true 
}: ModernCategoryCardProps) {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const categoryName = language === 'uz' ? category.nameUz : category.nameRu;
  const categoryDescription = language === 'uz' ? category.descriptionUz : category.descriptionRu;

  // Icon mapping for categories
  const getIconComponent = (iconName?: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'package': Package,
      'shopping-bag': ShoppingBag,
      'layers': Layers,
      'grid': Grid,
      'box': Box,
    };
    return iconMap[iconName || 'package'] || Package;
  };

  const IconComponent = getIconComponent(category.icon);

  // Color schemes for different categories
  const colorSchemes = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-emerald-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
    'from-teal-500 to-teal-600',
    'from-red-500 to-red-600',
    'from-yellow-500 to-yellow-600',
    'from-cyan-500 to-cyan-600'
  ];

  const colorIndex = category.id.charCodeAt(0) % colorSchemes.length;
  const colorScheme = colorSchemes[colorIndex];

  const cardVariants = {
    default: "group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden",
    large: "group relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 dark:border-gray-700 overflow-hidden",
    compact: "group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 overflow-hidden",
    featured: "group relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border-2 border-blue-200 dark:border-blue-800 overflow-hidden"
  };

  const paddingVariants = {
    default: "p-6",
    large: "p-8",
    compact: "p-4",
    featured: "p-8"
  };

  return (
    <Link href={`/category/${category.slug}`}>
      <div 
        className={cardVariants[variant]}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Featured badge */}
        {variant === 'featured' && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              {language === 'uz' ? 'TOP' : 'ТОП'}
            </Badge>
          </div>
        )}

        {/* Image section */}
        {variant !== 'compact' && (
          <div className="relative overflow-hidden">
            {category.image ? (
              <div className="aspect-video relative">
                <img
                  src={category.image}
                  alt={categoryName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-category.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            ) : (
              <div className={`aspect-video bg-gradient-to-br ${colorScheme} flex items-center justify-center relative overflow-hidden`}>
                <IconComponent className="w-16 h-16 text-white/80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full" />
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full" />
              </div>
            )}

            {/* Overlay content on image */}
            <div className="absolute inset-0 flex items-end p-4">
              <div className={`transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                {showProductCount && category.productCount && (
                  <Badge className="bg-white/90 text-gray-900 font-semibold">
                    {category.productCount} {language === 'uz' ? 'mahsulot' : 'товаров'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content section */}
        <div className={paddingVariants[variant]}>
          {/* Icon for compact variant */}
          {variant === 'compact' && (
            <div className={`w-12 h-12 bg-gradient-to-br ${colorScheme} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
          )}

          {/* Category name */}
          <h3 className={`font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 ${
            variant === 'large' ? 'text-2xl mb-3' : 
            variant === 'compact' ? 'text-lg mb-2' : 
            'text-xl mb-3'
          }`}>
            {categoryName}
          </h3>

          {/* Description */}
          {categoryDescription && variant !== 'compact' && (
            <p className={`text-gray-600 dark:text-gray-400 mb-4 ${
              variant === 'large' ? 'text-base' : 'text-sm'
            } line-clamp-2`}>
              {categoryDescription}
            </p>
          )}

          {/* Stats row */}
          <div className="flex items-center justify-between mb-4">
            {showProductCount && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Package className="w-4 h-4" />
                <span>
                  {category.productCount || 0} {language === 'uz' ? 'mahsulot' : 'товаров'}
                </span>
              </div>
            )}
            
            {variant === 'featured' && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span>{language === 'uz' ? 'Ommabop' : 'Популярная'}</span>
              </div>
            )}
          </div>

          {/* Action area */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {variant !== 'compact' && (
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>{Math.floor(Math.random() * 100) + 50}+ {language === 'uz' ? 'xaridor' : 'покупателей'}</span>
                </div>
              )}
            </div>

            {/* Arrow indicator */}
            <div className={`flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium transition-all duration-300 ${
              isHovered ? 'translate-x-1' : 'translate-x-0'
            }`}>
              <span className={variant === 'compact' ? 'text-sm' : 'text-base'}>
                {language === 'uz' ? 'Ko\'rish' : 'Смотреть'}
              </span>
              <ArrowRight className={`transition-transform duration-300 ${
                variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'
              } ${isHovered ? 'translate-x-1' : ''}`} />
            </div>
          </div>

          {/* Progress bar for featured variant */}
          {variant === 'featured' && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>{language === 'uz' ? 'Faollik darajasi' : 'Уровень активности'}</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`bg-gradient-to-r ${colorScheme} h-2 rounded-full transition-all duration-1000 ${
                  isHovered ? 'w-[85%]' : 'w-[70%]'
                }`} />
              </div>
            </div>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Decorative corner element */}
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${colorScheme} opacity-10 transition-all duration-500 ${
          isHovered ? 'scale-150 opacity-20' : 'scale-100 opacity-10'
        }`} style={{ clipPath: 'polygon(100% 0%, 0% 0%, 100% 100%)' }} />
      </div>
    </Link>
  );
}
