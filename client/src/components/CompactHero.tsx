import { Link } from 'wouter';
import { useLanguage } from './language-provider';
import { Button } from './ui/button';

export function CompactHero() {
  const { t, language } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-red-800 dark:from-blue-800 dark:via-blue-700 dark:to-red-700 text-white py-12 lg:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-red-600/30"></div>
      
      {/* Minimalist animated background */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full animate-float"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-red-400/20 rounded-full animate-bounce-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-pulse-slow"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              OptomMarket.uz
            </h1>
            <p className="text-xl lg:text-2xl font-light mb-3 text-blue-100">
              {t('heroTitle')}
            </p>
            <p className="text-lg text-gray-200 mb-6 leading-relaxed">
              {t('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/catalog">
                <Button className="bg-gradient-to-r from-blue-600 to-red-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  {t('viewProducts')}
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-2 border-white/60 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 backdrop-blur-sm">
                  {t('becomeSeller')}
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Compact stats */}
          <div className="relative">
            <div className="glass rounded-2xl p-6 border border-white/30 shadow-modern backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-xl p-4 backdrop-blur-sm border border-white/30">
                  <div className="text-3xl font-black mb-1 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">1K+</div>
                  <div className="text-xs font-medium text-blue-50">{t('productsCount')}</div>
                </div>
                <div className="text-center bg-gradient-to-br from-red-500/40 to-red-600/40 rounded-xl p-4 backdrop-blur-sm border border-white/30">
                  <div className="text-3xl font-black mb-1 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">50+</div>
                  <div className="text-xs font-medium text-red-50">{t('sellers')}</div>
                </div>
                <div className="text-center bg-gradient-to-br from-purple-500/40 to-pink-600/40 rounded-xl p-4 backdrop-blur-sm border border-white/30">
                  <div className="text-3xl font-black mb-1 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">500+</div>
                  <div className="text-xs font-medium text-purple-50">{t('customers')}</div>
                </div>
                <div className="text-center bg-gradient-to-br from-yellow-500/40 to-orange-600/40 rounded-xl p-4 backdrop-blur-sm border border-white/30">
                  <div className="text-3xl font-black mb-1 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">24/7</div>
                  <div className="text-xs font-medium text-yellow-50">{t('support')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
