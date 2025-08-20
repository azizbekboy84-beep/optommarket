import { Link } from 'wouter';
import { useLanguage } from './language-provider';
import { useCart } from '@/context/CartContext';
import { Product } from '@shared/schema';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  
  const name = language === 'uz' ? product.nameUz : product.nameRu;
  const description = language === 'uz' ? product.descriptionUz : product.descriptionRu;
  
  const stockStatus = (product.stockQuantity || 0) > 100 ? 'inStock' : 
                     (product.stockQuantity || 0) > 0 ? 'lowStock' : 'outOfStock';
  
  const statusColors = {
    inStock: 'text-green-800 bg-green-100',
    lowStock: 'text-yellow-800 bg-yellow-100',
    outOfStock: 'text-red-800 bg-red-100'
  };

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

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all group cursor-pointer" data-testid={`card-product-${product.id}`}>
        {product.images && product.images.length > 0 && (
          <img 
            src={product.images[0]} 
            alt={name} 
            className="w-full h-48 object-cover rounded-t-xl"
            data-testid={`img-product-${product.id}`}
          />
        )}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors" data-testid={`text-product-name-${product.id}`}>
            {name}
          </h3>
        {description && (
          <p className="text-sm text-gray-600 mb-3" data-testid={`text-product-description-${product.id}`}>
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
              {Number(product.wholesalePrice).toLocaleString()} so'm
            </span>
            <span className="text-sm text-gray-500 ml-1">
              / {product.minQuantity} {product.unit}
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[stockStatus]}`} data-testid={`status-product-stock-${product.id}`}>
            {t(stockStatus)}
          </span>
        </div>
        <Button 
          className="w-full bg-gray-100 text-gray-700 hover:bg-primary hover:text-white" 
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
