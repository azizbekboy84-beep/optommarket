import { useEffect } from 'react';
import { usePushNotification } from '@/hooks/usePushNotification';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Loader2 } from 'lucide-react';

interface PushNotificationSetupProps {
  autoRequest?: boolean; // Avtomatik ruxsat so'rashmi
  showCard?: boolean; // Karta ko'rinishida ko'rsatishmi
}

export function PushNotificationSetup({ 
  autoRequest = false, 
  showCard = true 
}: PushNotificationSetupProps) {
  const { language } = useLanguage();
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    isLoading, 
    error,
    subscribe, 
    unsubscribe 
  } = usePushNotification();

  // Avtomatik ruxsat so'rash (faqat bir marta)
  useEffect(() => {
    if (autoRequest && isSupported && permission === 'default' && !isSubscribed) {
      const hasAskedBefore = localStorage.getItem('push-permission-asked');
      if (!hasAskedBefore) {
        // 2 soniya kutib so'rash (sahifa yuklangandan keyin)
        const timer = setTimeout(() => {
          subscribe();
          localStorage.setItem('push-permission-asked', 'true');
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [autoRequest, isSupported, permission, isSubscribed, subscribe]);

  // Agar brauzer qo'llab-quvvatlamasa
  if (!isSupported) {
    return showCard ? (
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <BellOff className="h-5 w-5" />
            {language === 'uz' ? 'Bildirishnoma qo\'llab-quvvatlanmaydi' : 'Уведомления не поддерживаются'}
          </CardTitle>
          <CardDescription className="text-yellow-600 dark:text-yellow-400">
            {language === 'uz' 
              ? 'Sizning brauzeringiz push notification\'larni qo\'llab-quvvatlamaydi'
              : 'Ваш браузер не поддерживает push-уведомления'
            }
          </CardDescription>
        </CardHeader>
      </Card>
    ) : null;
  }

  // Agar ruxsat rad etilgan bo'lsa
  if (permission === 'denied') {
    return showCard ? (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <BellOff className="h-5 w-5" />
            {language === 'uz' ? 'Bildirishnoma ruxsati rad etilgan' : 'Разрешение на уведомления отклонено'}
          </CardTitle>
          <CardDescription className="text-red-600 dark:text-red-400">
            {language === 'uz' 
              ? 'Bildirishnomalarni yoqish uchun brauzer sozlamalarida ruxsat bering'
              : 'Для включения уведомлений разрешите их в настройках браузера'
            }
          </CardDescription>
        </CardHeader>
      </Card>
    ) : null;
  }

  const handleToggleSubscription = () => {
    if (isSubscribed) {
      unsubscribe();
    } else {
      subscribe();
    }
  };

  const content = (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Bell className="h-5 w-5" />
          {language === 'uz' ? 'Yangiliklar haqida xabardor bo\'ling' : 'Будьте в курсе новостей'}
        </CardTitle>
        <CardDescription>
          {language === 'uz' 
            ? 'Yangi mahsulotlar va chegirmalar haqida birinchi bo\'lib bilib oling'
            : 'Узнавайте о новых товарах и скидках первыми'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-3 rounded">
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleToggleSubscription}
            disabled={isLoading}
            className={isSubscribed ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"}
            size="lg"
            data-testid={isSubscribed ? "button-unsubscribe-push" : "button-subscribe-push"}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSubscribed ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                {language === 'uz' ? 'Obunani bekor qilish' : 'Отписаться'}
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                {language === 'uz' ? 'Obuna bo\'lish' : 'Подписаться'}
              </>
            )}
          </Button>
          
          {isSubscribed && (
            <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-3 rounded">
              {language === 'uz' 
                ? '✓ Siz yangiliklar haqida bildirishnomalar olasiz'
                : '✓ Вы будете получать уведомления о новостях'
              }
            </div>
          )}
        </div>
      </CardContent>
    </>
  );

  return showCard ? (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
      {content}
    </Card>
  ) : (
    <div>{content}</div>
  );
}