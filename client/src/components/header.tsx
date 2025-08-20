import { Button } from '@/components/ui/button';
import { useLanguage } from './language-provider';
import { Link } from 'wouter';
import logoImage from '@assets/optombazar logo_1755690917356.png';

export function Header() {
  const { language, setLanguage, t } = useLanguage();

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
            <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors" data-testid="link-home-nav">
              {t('home')}
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary font-medium transition-colors" data-testid="link-categories">
              {t('categories')}
            </Link>
            <Link href="/catalog" className="text-gray-700 hover:text-primary font-medium transition-colors" data-testid="link-catalog">
              Katalog
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary font-medium transition-colors" data-testid="link-products">
              {t('products')}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary font-medium transition-colors" data-testid="link-contact">
              {t('contact')}
            </Link>
          </nav>

          {/* Language Toggle & Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={() => setLanguage('uz')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === 'uz' 
                    ? 'text-primary bg-blue-50' 
                    : 'text-gray-500 hover:text-primary'
                }`}
                data-testid="button-language-uz"
              >
                UZ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  language === 'ru' 
                    ? 'text-primary bg-blue-50' 
                    : 'text-gray-500 hover:text-primary'
                }`}
                data-testid="button-language-ru"
              >
                RU
              </button>
            </div>
            <Button className="bg-primary text-white hover:bg-blue-700" data-testid="button-login">
              {t('login')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
