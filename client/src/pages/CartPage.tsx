import { Link } from 'wouter';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/components/language-provider';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';

// Minimal zakaz miqdori (500,000 so'm)
const MINIMUM_ORDER_AMOUNT = 500000;

export default function CartPage() {
  const { language } = useLanguage();
  const { cartItems, isLoading, itemCount, totalAmount, updateQuantity, removeFromCart } = useCart();
  
  // Minimal zakaz miqdorini tekshirish
  const isMinimumOrderMet = totalAmount >= MINIMUM_ORDER_AMOUNT;
  const remainingAmount = MINIMUM_ORDER_AMOUNT - totalAmount;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-black">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-6">
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background dark:bg-black">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4" data-testid="text-empty-cart-title">
              {language === 'uz' ? 'Savat bo\'sh' : 'Корзина пуста'}
            </h1>
            <p className="text-muted-foreground mb-8" data-testid="text-empty-cart-message">
              {language === 'uz' 
                ? 'Savatga mahsulot qo\'shing va xarid qiling!'
                : 'Добавьте товары в корзину и совершите покупку!'
              }
            </p>
            <Link href="/catalog">
              <Button data-testid="button-continue-shopping">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'uz' ? 'Xarid qilishni davom ettirish' : 'Продолжить покупки'}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleQuantityDecrease = async (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      await updateQuantity(itemId, currentQuantity - 1);
    }
  };

  const handleQuantityIncrease = async (itemId: string, currentQuantity: number, maxStock: number) => {
    if (currentQuantity < maxStock) {
      await updateQuantity(itemId, currentQuantity + 1);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-black">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/catalog">
            <Button variant="ghost" className="mb-4" data-testid="button-back-to-catalog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'uz' ? 'Katalogga qaytish' : 'Вернуться к каталогу'}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-cart-title">
            {language === 'uz' ? 'Savat' : 'Корзина'}
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-items-count">
            {itemCount} {language === 'uz' ? 'ta mahsulot' : 'товаров'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden" data-testid={`cart-item-${item.id}`}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product?.images?.[0] || '/placeholder-image.jpg'}
                        alt={language === 'uz' ? item.product?.nameUz : item.product?.nameRu}
                        className="w-20 h-20 object-cover rounded-lg"
                        data-testid={`img-cart-item-${item.id}`}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-item-name-${item.id}`}>
                        <Link href={`/products/${item.product?.slug}`} className="hover:text-primary">
                          {language === 'uz' ? item.product?.nameUz : item.product?.nameRu}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-item-price-${item.id}`}>
                        {Number(item.product?.wholesalePrice || 0).toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'} / {item.product?.unit}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityDecrease(item.id, item.quantity)}
                          disabled={item.quantity <= 1}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-3 py-1 border rounded-md bg-background text-foreground text-center min-w-[50px]" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityIncrease(item.id, item.quantity, item.product?.stockQuantity || 0)}
                          disabled={item.quantity >= (item.product?.stockQuantity || 0)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground" data-testid={`text-unit-${item.id}`}>
                          {item.product?.unit}
                        </span>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex flex-col items-end space-y-2">
                      <p className="text-lg font-bold text-foreground" data-testid={`text-total-price-${item.id}`}>
                        {(Number(item.product?.wholesalePrice || 0) * item.quantity).toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle data-testid="text-order-summary">
                  {language === 'uz' ? 'Buyurtma xulosasi' : 'Итого заказа'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span data-testid="text-subtotal-label">
                      {language === 'uz' ? 'Mahsulotlar' : 'Товары'} ({itemCount})
                    </span>
                    <span data-testid="text-subtotal-amount">
                      {totalAmount.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span data-testid="text-delivery-label">
                      {language === 'uz' ? 'Yetkazib berish' : 'Доставка'}
                    </span>
                    <span className="text-green-600" data-testid="text-delivery-amount">
                      {language === 'uz' ? 'Bepul' : 'Бесплатно'}
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span data-testid="text-total-label">
                    {language === 'uz' ? 'Jami' : 'Итого'}
                  </span>
                  <span data-testid="text-total-amount">
                    {totalAmount.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                  </span>
                </div>
                
                {/* Minimal zakaz ogohlantirishi */}
                {!isMinimumOrderMet && (
                  <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                      {language === 'uz' ? (
                        <>
                          <strong>Optom zakaz:</strong> Minimal zakaz miqdori 500,000 so'm. 
                          Yana <strong>{remainingAmount.toLocaleString()} so'm</strong> mahsulot qo'shing.
                        </>
                      ) : (
                        <>
                          <strong>Оптовый заказ:</strong> Минимальная сумма заказа 500,000 сум. 
                          Добавьте ещё товаров на <strong>{remainingAmount.toLocaleString()} сум</strong>.
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {isMinimumOrderMet ? (
                  <Link href="/checkout">
                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-red-500 hover:from-red-500 hover:to-blue-600 text-white" data-testid="button-checkout">
                      {language === 'uz' ? 'Buyurtma berish' : 'Оформить заказ'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" className="w-full" disabled data-testid="button-checkout-disabled">
                    {language === 'uz' ? 'Buyurtma berish' : 'Оформить заказ'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                
                <Link href="/catalog">
                  <Button variant="outline" size="lg" className="w-full" data-testid="button-continue-shopping">
                    {language === 'uz' ? 'Xaridni davom ettirish' : 'Продолжить покупки'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}