import { Link, useLocation } from 'wouter';
import { Home, Grid3X3, ShoppingCart, Heart, User, Download } from 'lucide-react';
import { useLanguage } from './language-provider';
import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function MobileBottomNav() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const { cartItems } = useCart();
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  const handleInstallClick = async () => {
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

  const navItems = [
    {
      href: '/',
      icon: Home,
      labelUz: 'Bosh sahifa',
      labelRu: 'Главная',
    },
    {
      href: '/catalog',
      icon: Grid3X3,
      labelUz: 'Katalog',
      labelRu: 'Каталог',
    },
    {
      href: '/cart',
      icon: ShoppingCart,
      labelUz: 'Savat',
      labelRu: 'Корзина',
      badge: cartItemsCount > 0 ? cartItemsCount : undefined,
    },
    {
      href: '/favorites',
      icon: Heart,
      labelUz: 'Saralangan',
      labelRu: 'Избранное',
    },
    {
      href: '/profile',
      icon: User,
      labelUz: 'Kabinet',
      labelRu: 'Кабинет',
    },
  ];

  // Agar ilova o'rnatilish mumkin bo'lsa, "Yuklab olish" tugmasini qo'shish
  const finalNavItems = canInstall && !isInstalled 
    ? [
        ...navItems.slice(0, 2),
        {
          href: '#install',
          icon: Download,
          labelUz: 'Ilova',
          labelRu: 'Приложение',
          isInstallButton: true,
        },
        ...navItems.slice(2, 4),
        navItems[4] // Profile tugmasi
      ]
    : navItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black dark:bg-black border-t border-gray-800 shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {finalNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          const label = language === 'uz' ? item.labelUz : item.labelRu;

          // Ilova o'rnatish tugmasi uchun alohida handler
          if ((item as any).isInstallButton) {
            return (
              <button
                key={item.href}
                onClick={handleInstallClick}
                className="flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-colors text-green-400 hover:text-green-300 hover:bg-green-900/30"
                data-testid="button-install-mobile"
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs mt-1 leading-none">{label}</span>
              </button>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-400 bg-blue-900/30'
                    : 'text-white hover:text-blue-300'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {'badge' in item && item.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 leading-none">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}