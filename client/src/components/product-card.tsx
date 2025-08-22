import React, { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from './language-provider';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const name = language === 'uz' ? product.nameUz : product.nameRu;
  const description = language === 'uz' ? product.descriptionUz : product.descriptionRu;
  
  const stockStatus = (product.stockQuantity || 0) > 100 ? 'inStock' : 
                     (product.stockQuantity || 0) > 0 ? 'lowStock' : 'outOfStock';
  
  const statusColors = {
    inStock: 'text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/30',
    lowStock: 'text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900/30',
    outOfStock: 'text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/30'
  };

  // Check if product is in favorites
  const { data: favoriteStatus } = useQuery({
    queryKey: ['/api/favorites/check', product.id],
    queryFn: () => apiRequest(`/api/favorites/check/${product.id}`),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: () => apiRequest('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ productId: product.id }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites/check', product.id] });
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
    mutationFn: () => apiRequest(`/api/favorites/${product.id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites/check', product.id] });
      toast({
        title: language === 'uz' ? "Sevimlilar ro'yxatidan o'chirildi" : "Удалено из избранного",
      });
    },
    onError: (error: any) => {
      toast({
        title: language === 'uz' ? "Xatolik" : "Ошибка",
        description: error.message || (language === 'uz' ? "Sevimlilar ro'yxatidan o'chirishda xatolik" : "Ошибка при удалении из избранного"),
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(product.id, product.minQuantity || 1);
      if (onAddToCart) {
        onAddToCart(product);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-card border border-border rounded-xl hover:shadow-lg transition-all group cursor-pointer relative" data-testid={`card-product-${product.id}`}>
        {/* Favorites Button */}
        {user && (
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 z-10 p-2 rounded-full ${
              favoriteStatus?.isFavorite 
                ? 'text-red-500 hover:text-red-600 bg-card/80 hover:bg-card/90' 
                : 'text-muted-foreground hover:text-red-500 bg-card/80 hover:bg-card/90'
            }`}
            onClick={handleToggleFavorite}
            disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
          >
            <Heart 
              className={`h-5 w-5 ${favoriteStatus?.isFavorite ? 'fill-current' : ''}`}
            />
          </Button>
        )}
        
        {product.images && product.images.length > 0 && (
          <img 
            src={product.images[0]} 
            alt={name} 
            className="w-full h-48 object-cover rounded-t-xl"
            data-testid={`img-product-${product.id}`}
          />
        )}
        <div className="p-6">
          <h3 className="font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors" data-testid={`text-product-name-${product.id}`}>
            {name}
          </h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-3" data-testid={`text-product-description-${product.id}`}>
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
              {Number(product.wholesalePrice).toLocaleString()} so'm
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              / {product.minQuantity} {product.unit}
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[stockStatus]}`} data-testid={`status-product-stock-${product.id}`}>
            {t(stockStatus)}
          </span>
        </div>
        <Button 
          className="w-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground" 
          onClick={handleAddToCart}
          disabled={(product.stockQuantity || 0) === 0}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          {t('addToCart')}
        </Button>
        </div>
      </div>
    </Link>
  );
}
