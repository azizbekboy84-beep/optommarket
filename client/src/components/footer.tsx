import { useLanguage } from './language-provider';
import logoImage from '@assets/optombazar logo_1755690917356.png';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-black dark:bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img 
                src={logoImage} 
                alt="Optombazar.uz" 
                className="h-10 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-white text-sm mb-4">
              O'zbekiston uchun ishonchli optom bozor platformasi. Sizning biznesingiz uchun eng yaxshi yechimlar.
            </p>
            
            {/* Mobile Apps Section */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Mobil ilovalarimiz</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://apps.apple.com/uz/app/optom-bazar/id6477342838" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-black hover:bg-gray-800 transition-colors rounded-lg px-4 py-2 w-fit"
                  data-testid="link-app-store"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-white">{language === 'uz' ? 'Yuklab oling' : 'Скачать в'}</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                
                <a 
                  href="https://play.google.com/store/apps/details?id=com.uzmobdev.optom_bazar" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center bg-black hover:bg-gray-800 transition-colors rounded-lg px-4 py-2 w-fit"
                  data-testid="link-google-play"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-white">{language === 'uz' ? 'Oling' : 'Доступно в'}</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-social-twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-social-facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" data-testid="link-social-instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.098.118.112.221.083.343-.09.379-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors" data-testid="link-footer-about">{t('aboutUs')}</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors" data-testid="link-footer-categories">{t('categories')}</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors" data-testid="link-footer-products">{t('products')}</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors" data-testid="link-footer-seller">{t('becomeSellerFooter')}</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors" data-testid="link-footer-help">{t('help')}</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('categories')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors" data-testid="link-footer-category-bags">Polietilen Paketlar</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors" data-testid="link-footer-category-disposable">Bir Martalik Idishlar</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors" data-testid="link-footer-category-electronics">Elektronika</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors" data-testid="link-footer-category-clothing">Kiyim-Kechak</a></li>
              <li><a href="#" className="text-white hover:text-gray-300 transition-colors" data-testid="link-footer-category-other">Boshqa Kategoriyalar</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contactInfo')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span className="text-white" data-testid="text-phone">+998996448444</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span className="text-white" data-testid="text-email">akramjon2504@gmail.com</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-white" data-testid="text-address">{t('address')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-sm" data-testid="text-copyright">
            {t('copyright')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors" data-testid="link-privacy">{t('privacyPolicy')}</a>
            <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors" data-testid="link-terms">{t('termsOfUse')}</a>
            <a href="#" className="text-white hover:text-gray-300 text-sm transition-colors" data-testid="link-cookies">{t('cookiePolicy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
