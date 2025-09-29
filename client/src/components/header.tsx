import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from './language-provider';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { 
  Search, ShoppingCart, User, Heart, Phone, Mail, 
  Facebook, Instagram, ChevronDown, Folder, BookOpen, 
  MessageCircle, Settings, Menu, X
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Logo } from './Logo';

interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  slug: string;
  parentId: string | null;
}

export function Header() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const { user, logout } = useAuth();
  const { cartItems = [] } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = !!user;
  const cartItemsCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  // Fetch categories for navigation
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    },
  });

  // Get main categories (no parent) - show more categories  
  const mainCategories = categories.filter(cat => !cat.parentId).slice(0, 12);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            {/* Contact Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+998 90 123 45 67</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@optommarket.uz</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Social Media & Mobile Apps */}
              <div className="flex items-center space-x-3">
                <a href="https://www.facebook.com/optommarket.uz" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-blue-200 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://www.instagram.com/optommarket_uz/" target="_blank" rel="noopener noreferrer"
                   className="hover:text-blue-200 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://t.me/optommarketuz" target="_blank" rel="noopener noreferrer"
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
              <Logo size="md" variant="full" />
            </Link>
          </div>

          {/* Main Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-6 ml-8">
            {/* Primary Navigation Links */}
            <Link 
              href="/catalog" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <Folder className="h-4 w-4" />
              {language === 'uz' ? 'Katalog' : 'Каталог'}
            </Link>
            
            <Link 
              href="/blog" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <BookOpen className="h-4 w-4" />
              {language === 'uz' ? 'Blog' : 'Блог'}
            </Link>
            
            <Link 
              href="/contact" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <MessageCircle className="h-4 w-4" />
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

            {/* Favorites */}
            {user && (
              <Link href="/favorites">
                <Button variant="ghost" size="sm">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Shopping Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <div className="hidden md:block">
              {user ? (
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

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 space-y-2">
            <Link 
              href="/catalog" 
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {language === 'uz' ? 'Katalog' : 'Каталог'}
            </Link>
            <Link 
              href="/blog" 
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {language === 'uz' ? 'Blog' : 'Блог'}
            </Link>
            <Link 
              href="/contact" 
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {language === 'uz' ? 'Aloqa' : 'Контакты'}
            </Link>
            
            {!user ? (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="/login" 
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'uz' ? 'Kirish' : 'Войти'}
                </Link>
                <Link 
                  href="/register" 
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Регистрация'}
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="/profile" 
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'uz' ? 'Profil' : 'Профиль'}
                </Link>
                <Link 
                  href="/orders" 
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === 'uz' ? 'Buyurtmalar' : 'Заказы'}
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {language === 'uz' ? 'Admin panel' : 'Админ панель'}
                  </Link>
                )}
                <button 
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {language === 'uz' ? 'Chiqish' : 'Выйти'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
