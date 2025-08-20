import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from './language-provider';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
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
    <header className="sticky top-0 z-40 bg-background shadow-md">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2 hidden md:block">
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
              {/* Social Media */}
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
            <Link href="/catalog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              {language === 'uz' ? 'Katalog' : 'Каталог'}
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              {language === 'uz' ? 'Blog' : 'Блог'}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
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