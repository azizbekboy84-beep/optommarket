import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from './language-provider';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'wouter';
import { ChevronDown, ShoppingCart, User, Settings, Search, Phone, Globe } from 'lucide-react';
import logoImage from '@assets/optombazar logo_1755690917356.png';

export function Header() {
  const { language, setLanguage } = useLanguage();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="hidden md:block sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            {/* Phone */}
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+998 (71) 123-45-67</span>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 text-primary-foreground hover:bg-primary-foreground/10">
                    <Globe className="h-4 w-4 mr-1" />
                    {language === 'uz' ? '🇺🇿 O\'zbek' : '🇷🇺 Русский'}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage('uz')}>
                    🇺🇿 O'zbek tili
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('ru')}>
                    🇷🇺 Русский язык
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="bg-background shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center" data-testid="link-home">
                <div className="flex-shrink-0 flex items-center">
                  <img 
                    src={logoImage} 
                    alt="Optombazar.uz" 
                    className="h-10 w-auto"
                  />
                </div>
              </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex items-center space-x-8">
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
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative w-full">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }} className="flex">
                    <Input
                      type="text"
                      placeholder={language === 'uz' ? 'Qidiruv...' : 'Поиск...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 pr-10"
                      data-testid="input-search"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="ml-1 bg-gradient-to-r from-blue-600 to-red-500 hover:from-red-500 hover:to-blue-600"
                      data-testid="button-search"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="outline" size="sm" className="relative" data-testid="button-cart">
                  <ShoppingCart className="h-4 w-4" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" data-testid="button-user-menu">
                      <User className="h-4 w-4 mr-1" />
                      {user?.username}
                      <ChevronDown className="h-3 w-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" data-testid="link-profile">
                        <User className="mr-2 h-4 w-4" />
                        {language === 'uz' ? 'Profil' : 'Профиль'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" data-testid="link-orders">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {language === 'uz' ? 'Buyurtmalar' : 'Заказы'}
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" data-testid="link-admin">
                            <Settings className="mr-2 h-4 w-4" />
                            {language === 'uz' ? 'Admin panel' : 'Админ панель'}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} data-testid="button-logout">
                      {language === 'uz' ? 'Chiqish' : 'Выйти'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button size="sm" data-testid="button-login">
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