import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../language-provider';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Logo } from '../Logo';
import { ThemeToggle } from '../theme-toggle';
import { UzbekistanFlag, RussiaFlag } from '../ui/flag-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Search, ShoppingCart, User, Heart, Menu, X, ChevronDown,
  MapPin, Phone, Mail, Clock, Truck, Shield, Award, Languages
} from 'lucide-react';

interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  slug: string;
  parentId: string | null;
}

export function ModernHeader() {
  const [, setLocation] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { cartItems = [] } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isAuthenticated = !!user;
  const cartItemsCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

  // Fetch favorites count
  const { data: favoritesData } = useQuery<any[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });
  const favoritesCount = Array.isArray(favoritesData) ? favoritesData.length : 0;

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  const mainCategories = categories.filter(cat => !cat.parentId).slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-red-500 text-white py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Toshkent, O'zbekiston</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+998 71 123-45-67</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@optommarket.uz</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>24/7 Xizmat</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Bepul Yetkazib Berish</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Logo size="lg" variant="full" />
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full relative">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={language === 'uz' ? 'Mahsulot qidirish...' : 'Поиск товаров...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-3 rounded-full border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 dark:bg-gray-800"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              
              {/* Search - Mobile */}
              <Button variant="ghost" size="sm" className="lg:hidden p-2">
                <Search className="w-5 h-5" />
              </Button>

              {/* Wishlist */}
              <Link href="/favorites">
                <Button variant="ghost" size="sm" className="relative p-2 hidden sm:flex">
                  <Heart className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                      {favoritesCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative p-2">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Account */}
              {isAuthenticated ? (
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 p-2">
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">{user?.username}</span>
                    <ChevronDown className="w-4 h-4 hidden lg:inline" />
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        {language === 'uz' ? 'Profil' : 'Профиль'}
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        {language === 'uz' ? 'Buyurtmalar' : 'Заказы'}
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {language === 'uz' ? 'Chiqish' : 'Выйти'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <User className="w-4 h-4 mr-2" />
                    {language === 'uz' ? 'Kirish' : 'Войти'}
                  </Button>
                </Link>
              )}

              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Languages className="w-5 h-5" />
                    <span className="hidden lg:inline ml-2">{language === 'uz' ? 'O\'zbek' : 'Русский'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => setLanguage('uz')} 
                    className="gap-2 cursor-pointer"
                  >
                    <UzbekistanFlag className="w-5 h-5" />
                    O'zbek
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLanguage('ru')} 
                    className="gap-2 cursor-pointer"
                  >
                    <RussiaFlag className="w-5 h-5" />
                    Русский
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop */}
        <div className="hidden lg:block border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between py-4">
              
              {/* Categories Menu */}
              <div className="flex items-center space-x-8">
                <div className="relative group">
                  <Button variant="ghost" className="flex items-center gap-2 font-medium">
                    <Menu className="w-4 h-4" />
                    {language === 'uz' ? 'Kategoriyalar' : 'Категории'}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  
                  {/* Mega Menu */}
                  <div className="absolute left-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        {mainCategories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                              {(language === 'uz' ? category.nameUz : category.nameRu).charAt(0)}
                            </div>
                            <span className="text-sm font-medium">
                              {language === 'uz' ? category.nameUz : category.nameRu}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          href="/categories"
                          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                        >
                          {language === 'uz' ? 'Barcha kategoriyalar →' : 'Все категории →'}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Navigation Links */}
                <Link href="/catalog" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                  {language === 'uz' ? 'Katalog' : 'Каталог'}
                </Link>
                <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                  {language === 'uz' ? 'Blog' : 'Блог'}
                </Link>
                <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                  {language === 'uz' ? 'Aloqa' : 'Контакты'}
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>{language === 'uz' ? 'Xavfsiz To\'lov' : 'Безопасная Оплата'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span>{language === 'uz' ? 'Sifat Kafolati' : 'Гарантия Качества'}</span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Logo size="md" variant="full" />
                <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={language === 'uz' ? 'Qidirish...' : 'Поиск...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10"
                  />
                  <Button type="submit" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-4">
                <Link href="/catalog" className="block py-2 text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  {language === 'uz' ? 'Katalog' : 'Каталог'}
                </Link>
                <Link href="/categories" className="block py-2 text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  {language === 'uz' ? 'Kategoriyalar' : 'Категории'}
                </Link>
                <Link href="/blog" className="block py-2 text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  {language === 'uz' ? 'Blog' : 'Блог'}
                </Link>
                <Link href="/contact" className="block py-2 text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  {language === 'uz' ? 'Aloqa' : 'Контакты'}
                </Link>
              </nav>

              {/* Mobile User Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                
                {/* Language Selector */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {language === 'uz' ? 'Til' : 'Язык'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant={language === 'uz' ? 'default' : 'outline'}
                      onClick={() => setLanguage('uz')}
                      className="flex-1 gap-2"
                    >
                      <UzbekistanFlag className="w-4 h-4" />
                      O'zbek
                    </Button>
                    <Button
                      variant={language === 'ru' ? 'default' : 'outline'}
                      onClick={() => setLanguage('ru')}
                      className="flex-1 gap-2"
                    >
                      <RussiaFlag className="w-4 h-4" />
                      Русский
                    </Button>
                  </div>
                </div>

                {!isAuthenticated && (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">
                      {language === 'uz' ? 'Kirish' : 'Войти'}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
