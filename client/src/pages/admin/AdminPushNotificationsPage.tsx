import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '@/components/language-provider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Users, Bell, BellRing } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Helmet } from 'react-helmet-async';

interface PushNotificationData {
  title: string;
  body: string;
  url?: string;
}

export default function AdminPushNotificationsPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [notificationData, setNotificationData] = useState<PushNotificationData>({
    title: '',
    body: '',
    url: '/',
  });

  // Obunchilar sonini olish
  const { data: subscribersCount, isLoading: isLoadingCount } = useQuery({
    queryKey: ['/api/push/subscribers-count'],
  });

  // Push notification yuborish
  const sendNotificationMutation = useMutation({
    mutationFn: (data: PushNotificationData) => 
      apiRequest('/api/push/send', 'POST', data),
    onSuccess: (response: any) => {
      toast({
        title: language === 'uz' ? 'Muvaffaqiyat!' : 'Успех!',
        description: language === 'uz' 
          ? `${response.successCount || 0} ta foydalanuvchiga bildirishnoma yuborildi`
          : `Уведомление отправлено ${response.successCount || 0} пользователям`,
      });
      
      // Formani tozalash
      setNotificationData({
        title: '',
        body: '',
        url: '/',
      });
      
      // Cache yangilash
      queryClient.invalidateQueries({ queryKey: ['/api/push/subscribers-count'] });
    },
    onError: (error: any) => {
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: error.message || 'Bildirishnoma yuborishda xatolik yuz berdi',
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (field: keyof PushNotificationData, value: string) => {
    setNotificationData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!notificationData.title.trim() || !notificationData.body.trim()) {
      toast({
        title: language === 'uz' ? 'Xatolik' : 'Ошибка',
        description: language === 'uz' 
          ? 'Sarlavha va matn maydonlari to\'ldirilishi shart'
          : 'Заголовок и текст обязательны для заполнения',
        variant: 'destructive',
      });
      return;
    }

    sendNotificationMutation.mutate(notificationData);
  };

  return (
    <>
      <Helmet>
        <title>
          {language === 'uz' 
            ? 'Push Bildirishnomalar - Admin Panel | OptomBazar.uz'
            : 'Push-уведомления - Админ-панель | OptomBazar.uz'
          }
        </title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <BellRing className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'uz' ? 'Push Bildirishnomalar' : 'Push-уведомления'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'uz' 
                ? 'Foydalanuvchilarga bildirishnomalar yuborish'
                : 'Отправка уведомлений пользователям'
              }
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Obunchilar statistikasi */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'Jami obunchilar' : 'Всего подписчиков'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingCount ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  (subscribersCount as any)?.count || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'uz' 
                  ? 'Faol push notification obunachilari'
                  : 'Активные подписчики push-уведомлений'
                }
              </p>
            </CardContent>
          </Card>

          {/* Bildirishnoma yuborish formi */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                {language === 'uz' ? 'Yangi bildirishnoma yuborish' : 'Отправить новое уведомление'}
              </CardTitle>
              <CardDescription>
                {language === 'uz' 
                  ? 'Barcha obunachilarga bildirishnoma yuborish uchun quyidagi formani to\'ldiring'
                  : 'Заполните форму для отправки уведомления всем подписчикам'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendNotification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notification-title">
                    {language === 'uz' ? 'Sarlavha' : 'Заголовок'} *
                  </Label>
                  <Input
                    id="notification-title"
                    value={notificationData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={language === 'uz' ? 'Bildirishnoma sarlavhasi' : 'Заголовок уведомления'}
                    maxLength={100}
                    data-testid="input-notification-title"
                  />
                  <p className="text-sm text-gray-500">
                    {notificationData.title.length}/100
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-body">
                    {language === 'uz' ? 'Matn' : 'Текст'} *
                  </Label>
                  <Textarea
                    id="notification-body"
                    value={notificationData.body}
                    onChange={(e) => handleInputChange('body', e.target.value)}
                    placeholder={language === 'uz' ? 'Bildirishnoma matni' : 'Текст уведомления'}
                    rows={4}
                    maxLength={300}
                    data-testid="textarea-notification-body"
                  />
                  <p className="text-sm text-gray-500">
                    {notificationData.body.length}/300
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-url">
                    {language === 'uz' ? 'Havola (ixtiyoriy)' : 'Ссылка (необязательно)'}
                  </Label>
                  <Input
                    id="notification-url"
                    value={notificationData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    placeholder={language === 'uz' ? 'Masalan: /products/yangi-mahsulot' : 'Например: /products/novyy-tovar'}
                    data-testid="input-notification-url"
                  />
                  <p className="text-sm text-gray-500">
                    {language === 'uz' 
                      ? 'Foydalanuvchi bildirishnomani bosganda ochilishi kerak bo\'lgan sahifa'
                      : 'Страница, которая откроется при нажатии на уведомление'
                    }
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={sendNotificationMutation.isPending || ((subscribersCount as any)?.count || 0) === 0}
                    className="flex items-center gap-2"
                    data-testid="button-send-notification"
                  >
                    {sendNotificationMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                    {language === 'uz' ? 'Yuborish' : 'Отправить'}
                    {(subscribersCount as any)?.count && (
                      <span className="bg-white/20 px-2 py-1 rounded text-xs">
                        {(subscribersCount as any).count}
                      </span>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setNotificationData({ title: '', body: '', url: '/' })}
                    disabled={sendNotificationMutation.isPending}
                    data-testid="button-clear-form"
                  >
                    {language === 'uz' ? 'Tozalash' : 'Очистить'}
                  </Button>
                </div>

                {((subscribersCount as any)?.count || 0) === 0 && (
                  <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded">
                    {language === 'uz' 
                      ? 'Hozircha hech kim push notification\'larga obuna bo\'lmagan'
                      : 'Пока никто не подписался на push-уведомления'
                    }
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Bildirishnoma tavsiyalari */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'uz' ? 'Bildirishnoma yozish bo\'yicha tavsiyalar' : 'Советы по написанию уведомлений'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">
                  {language === 'uz' ? 'Yaxshi misollar:' : 'Хорошие примеры:'}
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• {language === 'uz' ? 'Yangi mahsulot: Premium paketlar 20% chegirma!' : 'Новый товар: Премиум пакеты скидка 20%!'}</li>
                  <li>• {language === 'uz' ? 'Buyurtmangiz tayyor! #12345' : 'Ваш заказ готов! #12345'}</li>
                  <li>• {language === 'uz' ? 'Blog: Qishloq xo\'jaligi mahsulotlari haqida yangi maqola' : 'Блог: Новая статья о сельхозпродукции'}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">
                  {language === 'uz' ? 'Qoidalar:' : 'Правила:'}
                </h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• {language === 'uz' ? 'Qisqa va aniq yozing' : 'Пишите кратко и ясно'}</li>
                  <li>• {language === 'uz' ? 'Foydali ma\'lumot bering' : 'Предоставляйте полезную информацию'}</li>
                  <li>• {language === 'uz' ? 'Spam qilmang' : 'Не спамьте'}</li>
                  <li>• {language === 'uz' ? 'Harakatga chaqirish qo\'shing' : 'Добавьте призыв к действию'}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}