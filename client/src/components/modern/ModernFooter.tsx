import React from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../language-provider';
import { Logo } from '../Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { 
  Phone, Mail, MapPin, Clock, Facebook, Instagram, 
  Send, Youtube, Twitter, Shield, Award, Truck,
  CreditCard, Star, Users, Package, ArrowRight,
  Heart, Globe, Headphones
} from 'lucide-react';

export function ModernFooter() {
  const { language, t } = useLanguage();

  const trustSignals = [
    {
      icon: Shield,
      title: language === 'uz' ? 'Xavfsiz To\'lovlar' : 'Безопасные Платежи',
      description: language === 'uz' ? 'SSL sertifikat bilan himoyalangan' : 'Защищено SSL сертификатом'
    },
    {
      icon: Award,
      title: language === 'uz' ? 'Sifat Kafolati' : 'Гарантия Качества',
      description: language === 'uz' ? '100% sifatli mahsulotlar' : '100% качественные товары'
    },
    {
      icon: Truck,
      title: language === 'uz' ? 'Tez Yetkazib Berish' : 'Быстрая Доставка',
      description: language === 'uz' ? '1-3 kun ichida yetkazib berish' : 'Доставка за 1-3 дня'
    },
    {
      icon: Headphones,
      title: language === 'uz' ? '24/7 Qo\'llab-quvvatlash' : '24/7 Поддержка',
      description: language === 'uz' ? 'Har doim yordamga tayyormiz' : 'Всегда готовы помочь'
    }
  ];

  const quickLinks = [
    { name: language === 'uz' ? 'Bosh sahifa' : 'Главная', href: '/' },
    { name: language === 'uz' ? 'Katalog' : 'Каталог', href: '/catalog' },
    { name: language === 'uz' ? 'Kategoriyalar' : 'Категории', href: '/categories' },
    { name: language === 'uz' ? 'Blog' : 'Блог', href: '/blog' },
    { name: language === 'uz' ? 'Biz haqimizda' : 'О нас', href: '/about' },
    { name: language === 'uz' ? 'Aloqa' : 'Контакты', href: '/contact' }
  ];

  const customerLinks = [
    { name: language === 'uz' ? 'Yordamchi markaz' : 'Центр помощи', href: '/help' },
    { name: language === 'uz' ? 'Buyurtma berish' : 'Как заказать', href: '/how-to-order' },
    { name: language === 'uz' ? 'To\'lov usullari' : 'Способы оплаты', href: '/payment' },
    { name: language === 'uz' ? 'Yetkazib berish' : 'Доставка', href: '/delivery' },
    { name: language === 'uz' ? 'Qaytarish siyosati' : 'Политика возврата', href: '/returns' },
    { name: language === 'uz' ? 'Maxfiylik siyosati' : 'Политика конфиденциальности', href: '/privacy' }
  ];

  const businessLinks = [
    { name: language === 'uz' ? 'Hamkor bo\'ling' : 'Стать партнером', href: '/partnership' },
    { name: language === 'uz' ? 'Sotuvchi bo\'ling' : 'Стать продавцом', href: '/become-seller' },
    { name: language === 'uz' ? 'B2B savdo' : 'B2B торговля', href: '/b2b' },
    { name: language === 'uz' ? 'Optom narxlar' : 'Оптовые цены', href: '/wholesale' },
    { name: language === 'uz' ? 'API hujjatlari' : 'API документация', href: '/api-docs' },
    { name: language === 'uz' ? 'Biznes yechimlari' : 'Бизнес решения', href: '/business' }
  ];

  const socialLinks = [
    { icon: Send, href: 'https://t.me/optommarket', name: 'Telegram' },
    { icon: Instagram, href: 'https://instagram.com/optommarket.uz', name: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com/optommarket.uz', name: 'Facebook' },
    { icon: Youtube, href: 'https://youtube.com/@optommarket', name: 'YouTube' },
    { icon: Twitter, href: 'https://twitter.com/optommarket', name: 'Twitter' }
  ];

  const paymentMethods = [
    '/payment-uzcard.png',
    '/payment-humo.png',
    '/payment-visa.png',
    '/payment-mastercard.png',
    '/payment-click.png',
    '/payment-payme.png'
  ];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-red-900/20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

      {/* Trust signals section */}
      <div className="relative border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustSignals.map((signal, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <signal.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{signal.title}</h4>
                  <p className="text-sm text-gray-400">{signal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Company info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <Logo size="lg" variant="full" className="mb-6" />
              <p className="text-gray-400 leading-relaxed">
                {language === 'uz' 
                  ? 'O\'zbekistondagi eng yirik optom savdo platformasi. Sifatli mahsulotlar, qulay narxlar va ishonchli xizmat.'
                  : 'Крупнейшая оптовая торговая платформа Узбекистана. Качественные товары, доступные цены и надежный сервис.'
                }
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Toshkent, O'zbekiston</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-green-400" />
                <span>+998 71 123-45-67</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-red-400" />
                <span>info@optommarket.uz</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span>{language === 'uz' ? '24/7 xizmat' : '24/7 сервис'}</span>
              </div>
            </div>

            {/* Social links */}
            <div>
              <h4 className="font-semibold text-white mb-4">{language === 'uz' ? 'Ijtimoiy tarmoqlar' : 'Социальные сети'}</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-blue-600 hover:to-red-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-6">{language === 'uz' ? 'Tezkor havolalar' : 'Быстрые ссылки'}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer support */}
          <div>
            <h4 className="font-semibold text-white mb-6">{language === 'uz' ? 'Mijozlar uchun' : 'Для клиентов'}</h4>
            <ul className="space-y-3">
              {customerLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business & Newsletter */}
          <div className="space-y-8">
            {/* Business links */}
            <div>
              <h4 className="font-semibold text-white mb-6">{language === 'uz' ? 'Biznes' : 'Бизнес'}</h4>
              <ul className="space-y-3">
                {businessLinks.slice(0, 4).map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-white mb-4">{language === 'uz' ? 'Yangiliklar' : 'Новости'}</h4>
              <p className="text-gray-400 text-sm mb-4">
                {language === 'uz' 
                  ? 'Eng so\'nggi yangiliklar va maxsus takliflardan xabardor bo\'ling'
                  : 'Будьте в курсе последних новостей и специальных предложений'
                }
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder={language === 'uz' ? 'Email manzilingiz' : 'Ваш email'}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 px-4">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-black text-blue-400 mb-2">10K+</div>
              <div className="text-gray-400">{language === 'uz' ? 'Mahsulotlar' : 'Товары'}</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-400 mb-2">1K+</div>
              <div className="text-gray-400">{language === 'uz' ? 'Mijozlar' : 'Клиенты'}</div>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-400 mb-2">50+</div>
              <div className="text-gray-400">{language === 'uz' ? 'Hamkorlar' : 'Партнеры'}</div>
            </div>
            <div>
              <div className="text-3xl font-black text-red-400 mb-2">4.9</div>
              <div className="text-gray-400 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                {language === 'uz' ? 'Reyting' : 'Рейтинг'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="relative border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © 2024 OptomMarket.uz. {language === 'uz' ? 'Barcha huquqlar himoyalangan.' : 'Все права защищены.'}
            </div>

            {/* Payment methods */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">{language === 'uz' ? 'To\'lov usullari:' : 'Способы оплаты:'}</span>
              <div className="flex gap-2">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="w-8 h-6 bg-white rounded flex items-center justify-center">
                    <img src={method} alt="Payment method" className="max-w-full max-h-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Language & region */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Globe className="w-4 h-4" />
                <span>O'zbekiston</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Heart className="w-4 h-4 text-red-400" />
                <span>{language === 'uz' ? 'Mahalliy ishlab chiqarish' : 'Местное производство'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
