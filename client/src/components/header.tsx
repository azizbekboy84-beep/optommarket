import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from './language-provider';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'wouter';
import { useCategories } from '@/hooks/useCategories';
import { ChevronDown, ShoppingCart, User, Settings } from 'lucide-react';
import logoImage from '@assets/optombazar logo_1755690917356.png';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
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

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="link-home-nav">
              Bosh sahifa
            </Link>
            
            {/* Dynamic Categories Dropdown */}
            <div className="relative group">
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center" data-testid="link-categories">
                Kategoriyalar
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
              
              {/* Dropdown Menu */}
              {!categoriesLoading && categories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {categories.slice(0, 6).map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        data-testid={`link-category-${category.slug}`}
                      >
                        {language === 'uz' ? category.nameUz : category.nameRu}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        href="/categories"
                        className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                        data-testid="link-all-categories"
                      >
                        Barcha kategoriyalar →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/catalog" className="text-gray-700 hover:text-red-600 font-medium transition-colors" data-testid="link-catalog">
              Katalog
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" data-testid="link-products">
              Mahsulotlar
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors" data-testid="link-contact">
              Aloqa
            </Link>
          </nav>

          {/* Cart & Language Toggle & Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Link href="/cart">
              <Button 
                variant="outline" 
                size="sm" 
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs"
                    data-testid="badge-cart-count"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={() => setLanguage('uz')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === 'uz' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-blue-600'
                }`}
                data-testid="button-language-uz"
              >
                UZ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === 'ru' 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-gray-500 hover:text-red-600'
                }`}
                data-testid="button-language-ru"
              >
                RU
              </button>
            </div>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    data-testid="button-user-menu"
                  >
                    <User className="h-4 w-4" />
                    {user?.username}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Mening akkauntim
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    Chiqish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button 
                    variant="outline"
                    size="sm"
                    data-testid="button-login"
                  >
                    Kirish
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-red-500 text-white hover:from-red-500 hover:to-blue-600 transition-all duration-300"
                    size="sm"
                    data-testid="button-register"
                  >
                    Ro'yxatdan o'tish
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
