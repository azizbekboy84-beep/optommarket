import React, { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../language-provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  ShoppingCart, Plus, Minus, Trash2, ArrowRight, 
  Package, Truck, Shield, CreditCard, X, Heart
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
  minQuantity: number;
}

interface ModernShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export function ModernShoppingCart({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem 
}: ModernShoppingCartProps) {
  const { language } = useLanguage();
  const [promoCode, setPromoCode] = useState('');

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500000 ? 0 : 50000; // Free shipping over 500k
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl">
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-500 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {language === 'uz' ? 'Savat' : 'Корзина'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {items.length} {language === 'uz' ? 'mahsulot' : 'товаров'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'uz' ? 'Savat bo\'sh' : 'Корзина пуста'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {language === 'uz' 
                    ? 'Mahsulotlarni qo\'shish uchun katalogga o\'ting'
                    : 'Перейдите в каталог, чтобы добавить товары'
                  }
                </p>
                <Link href="/catalog">
                  <Button className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600">
                    {language === 'uz' ? 'Katalogga o\'tish' : 'Перейти в каталог'}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.jpg';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {item.price.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'} / {item.unit}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0"
                              onClick={() => onUpdateQuantity(item.id, Math.max(item.minQuantity, item.quantity - 1))}
                              disabled={item.quantity <= item.minQuantity}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'uz' ? 'Jami' : 'Итого'}:
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {(item.price * item.quantity).toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
              
              {/* Promo Code */}
              <div className="flex gap-2">
                <Input
                  placeholder={language === 'uz' ? 'Promo kod' : 'Промо код'}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  {language === 'uz' ? 'Qo\'llash' : 'Применить'}
                </Button>
              </div>

              {/* Order Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'uz' ? 'Mahsulotlar' : 'Товары'}:
                  </span>
                  <span className="font-semibold">
                    {subtotal.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'uz' ? 'Yetkazib berish' : 'Доставка'}:
                  </span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 
                      ? (language === 'uz' ? 'Bepul' : 'Бесплатно')
                      : `${shipping.toLocaleString()} ${language === 'uz' ? 'so\'m' : 'сум'}`
                    }
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between text-lg font-bold">
                  <span>{language === 'uz' ? 'Jami' : 'Итого'}:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {total.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                  </span>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>{language === 'uz' ? 'Xavfsiz' : 'Безопасно'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-blue-500" />
                  <span>{language === 'uz' ? 'Tez' : 'Быстро'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-purple-500" />
                  <span>{language === 'uz' ? 'Qulay' : 'Удобно'}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white font-bold py-3 rounded-xl group"
                  onClick={onClose}
                >
                  {language === 'uz' ? 'Buyurtma berish' : 'Оформить заказ'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Continue Shopping */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClose}
              >
                {language === 'uz' ? 'Xaridni davom ettirish' : 'Продолжить покупки'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
