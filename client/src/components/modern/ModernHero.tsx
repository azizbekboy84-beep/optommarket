import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../language-provider';
import { Button } from '../ui/button';
import { HeroLogo } from '../Logo';
import { 
  ArrowRight, Play, Star, Users, Package, Truck, 
  Shield, Award, TrendingUp, Zap
} from 'lucide-react';

export function ModernHero() {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: language === 'uz' ? 'O\'zbekistondagi Eng Yirik Optom Platformasi' : 'Крупнейшая Оптовая Платформа Узбекистана',
      subtitle: language === 'uz' ? 'Sifatli mahsulotlar, qulay narxlar, ishonchli xizmat' : 'Качественные товары, доступные цены, надежный сервис',
      image: '/hero-bg-1.jpg',
      cta: language === 'uz' ? 'Katalogni Ko\'rish' : 'Смотреть Каталог',
      features: [
        { icon: Package, text: language === 'uz' ? '10,000+ Mahsulot' : '10,000+ Товаров' },
        { icon: Users, text: language === 'uz' ? '1,000+ Mijoz' : '1,000+ Клиентов' },
        { icon: Truck, text: language === 'uz' ? 'Tez Yetkazib Berish' : 'Быстрая Доставка' }
      ]
    },
    {
      title: language === 'uz' ? 'Biznesingizni Rivojlantiring' : 'Развивайте Свой Бизнес',
      subtitle: language === 'uz' ? 'Professional yondashuvlar va zamonaviy yechimlar' : 'Профессиональные подходы и современные решения',
      image: '/hero-bg-2.jpg',
      cta: language === 'uz' ? 'Hamkor Bo\'ling' : 'Стать Партнером',
      features: [
        { icon: TrendingUp, text: language === 'uz' ? 'Biznes Rivojlantirish' : 'Развитие Бизнеса' },
        { icon: Shield, text: language === 'uz' ? 'Xavfsiz To\'lovlar' : 'Безопасные Платежи' },
        { icon: Award, text: language === 'uz' ? 'Sifat Kafolati' : 'Гарантия Качества' }
      ]
    }
  ];

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative min-h-[450px] lg:min-h-[550px] overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-red-800">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-red-800/90 z-10" />
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full animate-float" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-red-400/20 rounded-full animate-bounce-slow" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/20 rounded-full animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-yellow-400/20 rounded-full animate-float" style={{animationDelay: '2s'}} />
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full py-12 lg:py-16">
          
          {/* Left content */}
          <div className="text-white space-y-8">
            {/* Logo */}
            <div className="mb-8">
              <HeroLogo />
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-black leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  {currentHero.title}
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 font-light leading-relaxed">
                {currentHero.subtitle}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentHero.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-50">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalog">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl group">
                  {currentHero.cta}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2 border-white/60 text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm group">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {language === 'uz' ? 'Video Ko\'rish' : 'Смотреть Видео'}
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-blue-100">4.9/5 (1,200+ sharh)</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-blue-100">{language === 'uz' ? 'Tez Xizmat' : 'Быстрый Сервис'}</span>
              </div>
            </div>
          </div>

          {/* Right content - Stats Dashboard */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-2xl p-6 text-center border border-white/30">
                  <div className="text-3xl font-black text-white mb-2">10K+</div>
                  <div className="text-sm text-blue-100">{language === 'uz' ? 'Mahsulotlar' : 'Товары'}</div>
                </div>
                <div className="bg-gradient-to-br from-red-500/40 to-red-600/40 rounded-2xl p-6 text-center border border-white/30">
                  <div className="text-3xl font-black text-white mb-2">1K+</div>
                  <div className="text-sm text-red-100">{language === 'uz' ? 'Mijozlar' : 'Клиенты'}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/40 to-green-600/40 rounded-2xl p-6 text-center border border-white/30">
                  <div className="text-3xl font-black text-white mb-2">50+</div>
                  <div className="text-sm text-green-100">{language === 'uz' ? 'Hamkorlar' : 'Партнеры'}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/40 to-purple-600/40 rounded-2xl p-6 text-center border border-white/30">
                  <div className="text-3xl font-black text-white mb-2">24/7</div>
                  <div className="text-sm text-purple-100">{language === 'uz' ? 'Qo\'llab-quvvatlash' : 'Поддержка'}</div>
                </div>
              </div>

              {/* Live Activity */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {language === 'uz' ? 'Jonli Faollik' : 'Живая Активность'}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-blue-100">
                    <span>{language === 'uz' ? 'Bugungi buyurtmalar' : 'Заказы сегодня'}</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="flex justify-between text-blue-100">
                    <span>{language === 'uz' ? 'Onlayn foydalanuvchilar' : 'Онлайн пользователи'}</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex justify-between text-blue-100">
                    <span>{language === 'uz' ? 'Yangi mahsulotlar' : 'Новые товары'}</span>
                    <span className="font-semibold">15</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400/30 rounded-full animate-ping" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400/30 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-30">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-xs mb-2 rotate-90 origin-center">
            {language === 'uz' ? 'Pastga' : 'Вниз'}
          </span>
          <div className="w-px h-8 bg-white/30 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
