import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { useLanguage } from './language-provider';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function AppInstallPrompt() {
  const { language, t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const translations = {
    uz: {
      installApp: 'Ilovani o\'rnatish',
      appTitle: 'OptomBazar.uz ilovasini o\'rnating',
      appDescription: 'Tez va qulay foydalanish uchun ilovamizni telefoningizga yoki kompyuteringizga o\'rnating. Offline rejimda ham ishlay olasiz!',
      installButton: 'O\'rnatish',
      laterButton: 'Keyinroq',
      benefits: [
        'Tez ochiladi va ishlay boshlaydi',
        'Internetga bog\'lanmasdan ham ishlaydi',
        'Push bildirishnomalar olasiz',
        'Telefon menyusida o\'z o\'rni bo\'ladi'
      ],
      installInstructions: {
        android: 'Chrome: Menyuga boring → "Bosh sahifaga qo\'shish"',
        ios: 'Safari: Baham berish tugmasini bosing → "Bosh sahifaga qo\'shish"',
        desktop: 'Brauzer manzil qatorida o\'rnatish tugmasini bosing'
      }
    },
    ru: {
      installApp: 'Установить приложение',
      appTitle: 'Установите приложение OptomBazar.uz',
      appDescription: 'Установите наше приложение на телефон или компьютер для быстрого и удобного использования. Работает даже без интернета!',
      installButton: 'Установить',
      laterButton: 'Позже',
      benefits: [
        'Быстро открывается и работает',
        'Работает без подключения к интернету',
        'Получайте push-уведомления',
        'Имеет свое место в меню телефона'
      ],
      installInstructions: {
        android: 'Chrome: Войдите в меню → "Добавить на главный экран"',
        ios: 'Safari: Нажмите кнопку поделиться → "На экран Домой"',
        desktop: 'Нажмите кнопку установки в адресной строке браузера'
      }
    }
  };

  const currentTranslations = translations[language];

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Faqat mobil qurilmalarda avtomatik ko'rsatish
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile && !localStorage.getItem('app-install-dismissed')) {
        setTimeout(() => setShowDialog(true), 3000); // 3 soniyadan keyin ko'rsatish
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowDialog(false);
    };

    // PWA allaqachon o'rnatilganligini tekshirish
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('Foydalanuvchi ilovani o\'rnatdi');
        } else {
          console.log('Foydalanuvchi o\'rnatishni rad etdi');
          localStorage.setItem('app-install-dismissed', 'true');
        }
        
        setDeferredPrompt(null);
        setShowDialog(false);
      } catch (error) {
        console.error('O\'rnatishda xatolik:', error);
      }
    }
  };

  const handleDismiss = () => {
    setShowDialog(false);
    localStorage.setItem('app-install-dismissed', 'true');
  };

  const getUserAgent = () => {
    const ua = navigator.userAgent;
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'ios';
    if (ua.includes('Android')) return 'android';
    return 'desktop';
  };

  if (isInstalled) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-blue-500 text-white">
              <Download className="h-5 w-5" />
            </div>
            {currentTranslations.appTitle}
          </DialogTitle>
          <DialogDescription className="text-base">
            {currentTranslations.appDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Afzalliklar */}
          <div className="space-y-2">
            {currentTranslations.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* O'rnatish yo'riqnomasi */}
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {getUserAgent() === 'desktop' ? (
                <Monitor className="h-4 w-4" />
              ) : (
                <Smartphone className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {language === 'uz' ? 'Qanday o\'rnatish kerak:' : 'Как установить:'}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {currentTranslations.installInstructions[getUserAgent()]}
            </p>
          </div>

          {/* Tugmalar */}
          <div className="flex gap-2">
            {deferredPrompt && (
              <Button 
                onClick={handleInstallClick} 
                className="flex-1"
                data-testid="button-install-app"
              >
                <Download className="h-4 w-4 mr-2" />
                {currentTranslations.installButton}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={handleDismiss}
              className="flex-1"
              data-testid="button-dismiss-install"
            >
              {currentTranslations.laterButton}
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={handleDismiss}
          data-testid="button-close-install"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Header va boshqa joylarda foydalanish uchun mini tugma
export function AppInstallButton({ variant = "outline" }: { variant?: "outline" | "ghost" | "default" }) {
  const { language } = useLanguage();
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const buttonText = language === 'uz' ? 'Ilovani o\'rnatish' : 'Установить';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setCanInstall(true);
      (window as any).deferredPrompt = e;
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    // PWA allaqachon o'rnatilganligini tekshirish
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setCanInstall(false);
        }
        
        (window as any).deferredPrompt = null;
      } catch (error) {
        console.error('O\'rnatishda xatolik:', error);
      }
    }
  };

  if (isInstalled || !canInstall) return null;

  return (
    <Button 
      variant={variant} 
      size="sm" 
      onClick={handleClick}
      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white border-0"
      data-testid="button-install-app-mini"
    >
      <Download className="h-4 w-4" />
      <span>{buttonText}</span>
    </Button>
  );
}