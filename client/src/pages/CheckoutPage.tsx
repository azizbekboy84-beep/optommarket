import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/components/language-provider';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Percent, Tag, Truck, CreditCard, QrCode, AlertTriangle } from 'lucide-react';
import qrCodeImage from '@assets/QR to\'lov_1755750030820.jpg';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';

// Minimal zakaz miqdori (500,000 so'm)
const MINIMUM_ORDER_AMOUNT = 500000;

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'),
  customerPhone: z.string().min(9, 'Telefon raqami noto\'g\'ri formatda'),
  customerEmail: z.string().email('Email manzili noto\'g\'ri formatda').optional().or(z.literal('')),
  shippingAddress: z.string().min(10, 'Manzil kamida 10 ta belgidan iborat bo\'lishi kerak'),
  deliveryMethod: z.enum(['olib_ketish', 'kuryer'], {
    required_error: 'Yetkazib berish usulini tanlang',
  }),
  paymentMethod: z.enum(['naqd', 'karta', 'qr_kod'], {
    required_error: 'To\'lov usulini tanlang',
  }),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { language } = useLanguage();
  const { cartItems, totalAmount, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Minimal zakaz miqdorini tekshirish
  const isMinimumOrderMet = totalAmount >= MINIMUM_ORDER_AMOUNT;
  const remainingAmount = MINIMUM_ORDER_AMOUNT - totalAmount;
  
  // Agar minimal miqdor bajarilmagan bo'lsa, savatga qaytarish
  useEffect(() => {
    if (cartItems.length > 0 && !isMinimumOrderMet) {
      setTimeout(() => {
        setLocation('/cart');
      }, 3000); // 3 soniyadan keyin avtomatik qaytarish
    }
  }, [cartItems.length, isMinimumOrderMet, setLocation]);
  
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
      deliveryMethod: 'olib_ketish' as const,
      paymentMethod: 'naqd' as const,
      notes: '',
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (formData: CheckoutFormData) => {
      // Minimal zakaz miqdorini tekshirish
      if (!isMinimumOrderMet) {
        throw new Error('MINIMUM_ORDER_NOT_MET');
      }
      
      const orderData = {
        userId: 'guest-user', // For guest checkout
        totalAmount: finalAmount.toString(),
        discountId: appliedDiscount?.id || null,
        discountAmount: discountAmount.toString(),
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'kutmoqda',
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
      if (error.message === 'MINIMUM_ORDER_NOT_MET') {
        toast({
          title: language === 'uz' ? "Minimal zakaz miqdori bajarilmadi" : "Минимальная сумма заказа не выполнена",
          description: language === 'uz' ? 
            `Minimal zakaz miqdori 500,000 so'm. Yana ${remainingAmount.toLocaleString()} so'm mahsulot qo'shing.` :
            `Минимальная сумма заказа 500,000 сум. Добавьте ещё товаров на ${remainingAmount.toLocaleString()} сум.`,
          variant: "destructive",
          duration: 5000,
        });
        setLocation('/cart');
      } else {
        toast({
          title: language === 'uz' ? "Xatolik yuz berdi" : "Произошла ошибка",
          description: language === 'uz' ? 
            "Buyurtmani yuborishda xatolik yuz berdi. Qaytadan urinib ko'ring." :
            "Ошибка при отправке заказа. Попробуйте еще раз.",
          variant: "destructive",
          duration: 5000,
        });
      }
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
      const response = await fetch('/api/discounts/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode.trim().toUpperCase() }),
      });
      
      if (!response.ok) {
        throw new Error('Discount code not found');
      }
      
      const discount = await response.json();
      setAppliedDiscount(discount);
      toast({
        title: language === 'uz' ? "Muvaffaqiyat!" : "Успешно!",
        description: language === 'uz' ? "Chegirma qo'llandi" : "Скидка применена",
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
        <Header />
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
      <Header />
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

        {/* Minimal zakaz ogohlantirishi */}
        {!isMinimumOrderMet && (
          <Alert className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-300">
              {language === 'uz' ? (
                <>
                  <strong>Diqqat!</strong> Minimal zakaz miqdori 500,000 so'm. 
                  Sizning zakazingiz: <strong>{totalAmount.toLocaleString()} so'm</strong>. 
                  Yana <strong>{remainingAmount.toLocaleString()} so'm</strong> mahsulot qo'shing yoki 
                  <Link href="/cart" className="underline font-semibold ml-1">savatga qaytang</Link>.
                  <br />
                  <small className="text-xs">3 soniyadan keyin avtomatik savatga qaytarilasiz...</small>
                </>
              ) : (
                <>
                  <strong>Внимание!</strong> Минимальная сумма заказа 500,000 сум. 
                  Ваш заказ: <strong>{totalAmount.toLocaleString()} сум</strong>. 
                  Добавьте ещё товаров на <strong>{remainingAmount.toLocaleString()} сум</strong> или 
                  <Link href="/cart" className="underline font-semibold ml-1">вернитесь в корзину</Link>.
                  <br />
                  <small className="text-xs">Через 3 секунды вы автоматически вернётесь в корзину...</small>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

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

                    {/* Delivery Method */}
                    <FormField
                      control={form.control}
                      name="deliveryMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel data-testid="label-delivery-method">
                            <div className="flex items-center space-x-2">
                              <Truck className="w-4 h-4" />
                              <span>{language === 'uz' ? 'Yetkazib berish usuli' : 'Способ доставки'} *</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-4"
                            >
                              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                                <RadioGroupItem value="olib_ketish" id="pickup" />
                                <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                                  <div>
                                    <div className="font-medium">
                                      {language === 'uz' ? 'Olib ketish' : 'Самовывоз'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {language === 'uz' 
                                        ? 'Mahsulotlarni do\'kondan olib ketish' 
                                        : 'Забрать товары из магазина'
                                      }
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                                <RadioGroupItem value="kuryer" id="delivery" />
                                <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                                  <div>
                                    <div className="font-medium">
                                      {language === 'uz' ? 'Kuryer orqali' : 'Доставка курьером'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {language === 'uz' 
                                        ? 'Mahsulotlarni uyingizgacha yetkazib berish' 
                                        : 'Доставка товаров до дома'
                                      }
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Payment Method */}
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel data-testid="label-payment-method">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="w-4 h-4" />
                              <span>{language === 'uz' ? 'To\'lov usuli' : 'Способ оплаты'} *</span>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-4"
                            >
                              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                                <RadioGroupItem value="naqd" id="cash" />
                                <Label htmlFor="cash" className="flex-1 cursor-pointer">
                                  <div>
                                    <div className="font-medium">
                                      {language === 'uz' ? 'Naqd pul' : 'Наличные'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {language === 'uz' 
                                        ? 'Mahsulotni olganda naqd to\'lash' 
                                        : 'Оплата наличными при получении'
                                      }
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                                <RadioGroupItem value="karta" id="card" />
                                <Label htmlFor="card" className="flex-1 cursor-pointer">
                                  <div>
                                    <div className="font-medium">
                                      {language === 'uz' ? 'Bank kartasi' : 'Банковская карта'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {language === 'uz' 
                                        ? 'Karta orqali to\'lash' 
                                        : 'Оплата банковской картой'
                                      }
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 hover:border-blue-200">
                                <RadioGroupItem value="qr_kod" id="qr" />
                                <Label htmlFor="qr" className="flex-1 cursor-pointer">
                                  <div className="flex items-center space-x-3">
                                    <QrCode className="w-5 h-5 text-blue-600" />
                                    <div>
                                      <div className="font-medium">
                                        {language === 'uz' ? 'QR kod orqali to\'lash' : 'Оплата через QR код'}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {language === 'uz' 
                                          ? 'Akram Farmonov - Mobil bank orqali' 
                                          : 'Акрам Фармонов - Через мобильный банк'
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* QR Code Display - Show when QR payment is selected */}
                    {form.watch('paymentMethod') === 'qr_kod' && (
                      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                            <QrCode className="w-5 h-5" />
                            <span>{language === 'uz' ? 'QR kod orqali to\'lash' : 'Оплата через QR код'}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center">
                            <div className="inline-block bg-white p-4 rounded-lg shadow-sm border">
                              <img 
                                src={qrCodeImage} 
                                alt="QR Code for payment" 
                                className="w-48 h-48 mx-auto"
                                data-testid="img-qr-code"
                              />
                            </div>
                            <div className="mt-4 space-y-2">
                              <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                Akram Farmonov
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {language === 'uz' 
                                  ? 'Mobil ilovangizda QR kodni skaner qiling va to\'lovni amalga oshiring'
                                  : 'Отсканируйте QR код в мобильном приложении и совершите платеж'
                                }
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
                            <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
                              {language === 'uz' ? 'To\'lov ko\'rsatmalari:' : 'Инструкции по оплате:'}
                            </h4>
                            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                              <li>
                                {language === 'uz' 
                                  ? 'Mobil bank ilovangizni oching'
                                  : 'Откройте приложение мобильного банка'
                                }
                              </li>
                              <li>
                                {language === 'uz' 
                                  ? 'QR kod skanerini faollashtiring'
                                  : 'Активируйте сканер QR кодов'
                                }
                              </li>
                              <li>
                                {language === 'uz' 
                                  ? 'Yuqoridagi QR kodni skaner qiling'
                                  : 'Отсканируйте QR код выше'
                                }
                              </li>
                              <li>
                                {language === 'uz' 
                                  ? `To'lov miqdorini tasdiqlang: ${finalAmount.toLocaleString()} so'm`
                                  : `Подтвердите сумму платежа: ${finalAmount.toLocaleString()} сум`
                                }
                              </li>
                              <li>
                                {language === 'uz' 
                                  ? 'To\'lovni tasdiqlang va amalga oshiring'
                                  : 'Подтвердите и совершите платеж'
                                }
                              </li>
                            </ol>
                          </div>
                          
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              {language === 'uz' 
                                ? '💡 To\'lovni amalga oshirgandan so\'ng, buyurtmangiz avtomatik tasdiqlash uchun yuboriladi.'
                                : '💡 После совершения платежа ваш заказ будет автоматически отправлен на подтверждение.'
                              }
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

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