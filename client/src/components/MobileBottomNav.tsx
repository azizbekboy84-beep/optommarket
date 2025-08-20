import { Link, useLocation } from 'wouter';
import { Home, Grid3X3, ShoppingCart, Heart, User } from 'lucide-react';
import { useLanguage } from './language-provider';
import { useCart } from '@/context/CartContext';

export function MobileBottomNav() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const { cartItems } = useCart();

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
      href: '/wishlist',
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          const label = language === 'uz' ? item.labelUz : item.labelRu;

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && (
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