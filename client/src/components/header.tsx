import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from './language-provider';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './theme-toggle';
import { Link, useLocation } from 'wouter';
import { ChevronDown, ShoppingCart, User, Settings, Search, Phone, Facebook, Instagram, Mail } from 'lucide-react';
import logoImage from '@assets/optombazar logo_1755690917356.png';

// Desktop Header Component  
export function Header() {
  const { language, setLanguage } = useLanguage();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b shadow-lg">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            {/* Contact Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+998 71 123-45-67</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@optombazar.uz</span>
              </div>
            </div>
            
            {/* User Authentication & Social Media */}
            <div className="flex items-center space-x-4">
              {/* Social Media & Mobile Apps */}
              <div className="flex items-center space-x-3">
                <a href="https://www.facebook.com/profile.php?id=61556254109850&locale=ru_RU" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-blue-200 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://www.instagram.com/optombazar_uz/" target="_blank" rel="noopener noreferrer"
                   className="hover:text-blue-200 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://t.me/optombazaruzb" target="_blank" rel="noopener noreferrer"
                   className="hover:text-blue-200 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16l-1.58 7.44c-.12.54-.44.67-.89.42l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.43 4.33-3.91c.19-.17-.04-.26-.29-.1L9.39 13.47l-2.4-.75c-.52-.16-.53-.52.11-.77l9.39-3.61c.43-.16.81.1.67.76z"/>
                  </svg>
                </a>
                
                <div className="h-4 w-px bg-white/30 mx-2"></div>
                
                {/* Mobile Apps */}
                <a href="https://apps.apple.com/uz/app/optom-bazar/id6477342838" target="_blank" rel="noopener noreferrer"
                   className="hover:text-blue-200 transition-colors" title="App Store">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.uzmobdev.optom_bazar" target="_blank" rel="noopener noreferrer"
                   className="hover:text-blue-200 transition-colors" title="Google Play">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </a>
              </div>
              
              <div className="h-4 w-px bg-white/30"></div>
              
              {/* Authentication Links */}
              {!isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="hover:text-blue-200 transition-colors">
                    {language === 'uz' ? 'Kirish' : 'Войти'}
                  </Link>
                  <span className="text-white/50">|</span>
                  <Link href="/register" className="hover:text-blue-200 transition-colors">
                    {language === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Регистрация'}
                  </Link>
                </div>
              ) : (
                <Link href="/profile" className="hover:text-blue-200 transition-colors">
                  <User className="h-4 w-4 inline mr-1" />
                  {language === 'uz' ? 'Kabinet' : 'Кабинет'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="Optombazar.uz" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Main Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalog" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              {language === 'uz' ? 'Katalog' : 'Каталог'}
            </Link>
            <Link href="/blog" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              {language === 'uz' ? 'Blog' : 'Блог'}
            </Link>
            <Link href="/contact" className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              {language === 'uz' ? 'Aloqa' : 'Контакты'}
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Bar - Responsive width */}
            <div className="flex-1 max-w-xs md:max-w-md">
              <form onSubmit={handleSearch} className="flex">
                <Input
                  type="text"
                  placeholder={language === 'uz' ? 'Qidiruv...' : 'Поиск...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="ml-1 bg-gradient-to-r from-blue-600 to-red-500 hover:from-red-500 hover:to-blue-600"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {language === 'uz' ? '🇺🇿 Uz' : '🇷🇺 Ru'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('uz')}>
                  🇺🇿 O'zbek
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ru')}>
                  🇷🇺 Русский
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart - Hidden on mobile */}
            <Link href="/cart" className="hidden md:block">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu - Hidden on mobile */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-1" />
                      {user?.username}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        {language === 'uz' ? 'Profil' : 'Профиль'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {language === 'uz' ? 'Buyurtmalar' : 'Заказы'}
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <Settings className="mr-2 h-4 w-4" />
                            {language === 'uz' ? 'Admin panel' : 'Админ панель'}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      {language === 'uz' ? 'Chiqish' : 'Выйти'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button size="sm">
                    <User className="h-4 w-4 mr-1" />
                    {language === 'uz' ? 'Kirish' : 'Войти'}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}