import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/components/language-provider';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Percent, Tag } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
  customerPhone: z.string().min(9, 'Telefon raqami noto\'g\'ri formatda'),
  customerEmail: z.string().email('Email manzili noto\'g\'ri formatda').optional().or(z.literal('')),
  shippingAddress: z.string().min(10, 'Manzil kamida 10 ta belgidan iborat bo\'lishi kerak'),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { language } = useLanguage();
  const { cartItems, totalAmount, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Discount state
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  
  // Calculate final amounts with discount
  const discountAmount = appliedDiscount ? 
    (appliedDiscount.type === 'percentage' ? 
      (totalAmount * appliedDiscount.value / 100) : 
      appliedDiscount.value) : 0;
  const finalAmount = Math.max(0, totalAmount - discountAmount);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      shippingAddress: '',
      notes: '',
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (formData: CheckoutFormData) => {
      const orderData = {
        userId: 'guest-user', // For guest checkout
        totalAmount: finalAmount.toString(),
        discountId: appliedDiscount?.id || null,
        discountAmount: discountAmount.toString(),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || null,
        shippingAddress: formData.shippingAddress,
        notes: formData.notes || null,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product?.wholesalePrice || '0',
          totalPrice: (Number(item.product?.wholesalePrice || 0) * item.quantity).toString(),
        })),
      };

      const sessionId = localStorage.getItem('cart-session-id') || 'anonymous';
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': sessionId,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return response.json();
    },
    onSuccess: (order) => {
      toast({
        title: language === 'uz' ? "Buyurtma muvaffaqiyatli qabul qilindi!" : "Заказ успешно принят!",
        description: language === 'uz' ? 
          `Buyurtma raqami: ${order.id}. Tez orada siz bilan bog'lanamiz.` :
          `Номер заказа: ${order.id}. Мы свяжемся с вами в ближайшее время.`,
        duration: 5000,
      });
      
      // Redirect to success page
      setLocation('/order-success');
    },
    onError: (error) => {
      toast({
        title: language === 'uz' ? "Xatolik yuz berdi" : "Произошла ошибка",
        description: language === 'uz' ? 
          "Buyurtmani yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring." :
          "Ошибка при отправке заказа. Попробуйте еще раз.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Apply discount code
  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      toast({
        title: language === 'uz' ? "Xatolik" : "Ошибка", 
        description: language === 'uz' ? "Chegirma kodini kiriting" : "Введите код скидки",
        variant: "destructive",
      });
      return;
    }
    
    setIsApplyingDiscount(true);
    try {
      const discount = await apiRequest('/api/discounts/apply', {
        method: 'POST',
        body: JSON.stringify({ code: discountCode.trim().toUpperCase() }),
      });
      
      setAppliedDiscount(discount);
      toast({
        title: language === 'uz' ? "Muvaffaqiyat!" : "Успешно!",
        description: discount.message || (language === 'uz' ? "Chegirma qo'llandi" : "Скидка применена"),
      });
    } catch (error: any) {
      toast({
        title: language === 'uz' ? "Xatolik" : "Ошибка",
        description: error.message || (language === 'uz' ? "Chegirma kodi noto'g'ri" : "Неверный код скидки"),
        variant: "destructive",
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  // Remove applied discount
  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    toast({
      title: language === 'uz' ? "Chegirma olib tashlandi" : "Скидка удалена",
    });
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      await createOrderMutation.mutateAsync(data);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="text-empty-cart-title">
              {language === 'uz' ? 'Savat bo\'sh' : 'Корзина пуста'}
            </h1>
            <p className="text-gray-600 mb-8" data-testid="text-empty-cart-message">
              {language === 'uz' 
                ? 'Buyurtma berish uchun savatga mahsulot qo\'shing.'
                : 'Добавьте товары в корзину для оформления заказа.'
              }
            </p>
            <Link href="/catalog">
              <Button data-testid="button-go-to-catalog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'uz' ? 'Katalogga o\'tish' : 'Перейти к каталогу'}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart">
            <Button variant="ghost" className="mb-4" data-testid="button-back-to-cart">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'uz' ? 'Savatga qaytish' : 'Вернуться в корзину'}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-checkout-title">
            {language === 'uz' ? 'Buyurtmani rasmiylashtirish' : 'Оформление заказа'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-delivery-info-title">
                  {language === 'uz' ? 'Yetkazib berish ma\'lumotlari' : 'Информация о доставке'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-customer-name">
                            {language === 'uz' ? 'To\'liq ism' : 'Полное имя'} *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={language === 'uz' ? 'Ismingizni kiriting' : 'Введите ваше имя'}
                              data-testid="input-customer-name"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-customer-phone">
                            {language === 'uz' ? 'Telefon raqam' : 'Номер телефона'} *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={language === 'uz' ? '+998 90 123 45 67' : '+998 90 123 45 67'}
                              data-testid="input-customer-phone"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-customer-email">
                            {language === 'uz' ? 'Email (ixtiyoriy)' : 'Email (необязательно)'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder={language === 'uz' ? 'example@email.com' : 'example@email.com'}
                              data-testid="input-customer-email"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-shipping-address">
                            {language === 'uz' ? 'Yetkazib berish manzili' : 'Адрес доставки'} *
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={language === 'uz' ? 
                                'Viloyat, tuman, ko\'cha va uy raqamini kiriting' :
                                'Введите область, район, улицу и номер дома'
                              }
                              className="min-h-[100px]"
                              data-testid="input-shipping-address"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-notes">
                            {language === 'uz' ? 'Qo\'shimcha izoh (ixtiyoriy)' : 'Дополнительные комментарии (необязательно)'}
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={language === 'uz' ? 
                                'Buyurtma haqida qo\'shimcha ma\'lumot...' :
                                'Дополнительная информация о заказе...'
                              }
                              data-testid="input-notes"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                      data-testid="button-place-order"
                    >
                      {isSubmitting ? (
                        language === 'uz' ? 'Yuborilmoqda...' : 'Отправляется...'
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          {language === 'uz' ? 'Buyurtmani tasdiqlash' : 'Подтвердить заказ'}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
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
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm" data-testid={`order-item-${item.id}`}>
                      <div className="flex-1">
                        <p className="font-medium" data-testid={`text-item-name-${item.id}`}>
                          {language === 'uz' ? item.product?.nameUz : item.product?.nameRu}
                        </p>
                        <p className="text-gray-500" data-testid={`text-item-details-${item.id}`}>
                          {item.quantity} × {Number(item.product?.wholesalePrice || 0).toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                        </p>
                      </div>
                      <span className="font-medium" data-testid={`text-item-total-${item.id}`}>
                        {(Number(item.product?.wholesalePrice || 0) * item.quantity).toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {/* Discount Code Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {language === 'uz' ? 'Chegirma kodi' : 'Код скидки'}
                    </span>
                  </div>
                  
                  {!appliedDiscount ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder={language === 'uz' ? 'Kodni kiriting' : 'Введите код'}
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="flex-1"
                        disabled={isApplyingDiscount}
                      />
                      <Button 
                        onClick={applyDiscount}
                        disabled={isApplyingDiscount || !discountCode.trim()}
                        size="sm"
                      >
                        {isApplyingDiscount ? 
                          (language === 'uz' ? 'Tekshirish...' : 'Проверка...') :
                          (language === 'uz' ? 'Qo\'llash' : 'Применить')
                        }
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {appliedDiscount.type === 'percentage' ? (
                            <>
                              <Percent className="h-3 w-3" />
                              {appliedDiscount.value}%
                            </>
                          ) : (
                            <>
                              {appliedDiscount.value.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                            </>
                          )}
                        </Badge>
                        <span className="text-sm font-medium text-green-700">
                          {appliedDiscount.code}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={removeDiscount}
                        className="text-red-600 hover:text-red-700"
                      >
                        {language === 'uz' ? 'Olib tashlash' : 'Удалить'}
                      </Button>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span data-testid="text-subtotal-label">
                      {language === 'uz' ? 'Mahsulotlar' : 'Товары'}
                    </span>
                    <span data-testid="text-subtotal-amount">
                      {totalAmount.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                    </span>
                  </div>
                  
                  {appliedDiscount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>
                        {language === 'uz' ? 'Chegirma' : 'Скидка'} ({appliedDiscount.code})
                      </span>
                      <span>
                        -{discountAmount.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                      </span>
                    </div>
                  )}
                  
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
                  <span data-testid="text-total-amount" className={appliedDiscount ? 'text-green-600' : ''}>
                    {finalAmount.toLocaleString()} {language === 'uz' ? 'so\'m' : 'сум'}
                  </span>
                </div>
                
                {appliedDiscount && (
                  <div className="text-xs text-gray-500 text-center">
                    {language === 'uz' ? 
                      `${discountAmount.toLocaleString()} so'm chegirma qo'llandi` :
                      `Применена скидка ${discountAmount.toLocaleString()} сум`
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}