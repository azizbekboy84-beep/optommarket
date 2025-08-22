import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Gift, Sparkles } from 'lucide-react';
import { useLanguage } from '../language-provider';

export function MarketingNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if notification was already dismissed today
    const lastDismissed = localStorage.getItem('marketing-notification-dismissed');
    const today = new Date().toDateString();
    
    if (lastDismissed !== today) {
      // Show notification after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      // Remember dismissal for today
      localStorage.setItem('marketing-notification-dismissed', new Date().toDateString());
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[60] transform transition-all duration-300 ${
        isClosing ? 'translate-y-[-100%] opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 rounded-lg shadow-2xl p-1 animate-pulse">
        <div className="bg-white dark:bg-gray-900 rounded-md p-4 relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Content */}
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-gradient-to-r from-blue-600 to-red-500 rounded-full">
                <Gift className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                {language === 'uz' ? '🎉 Maxsus taklifimiz!' : '🎉 Специальное предложение!'}
              </h3>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {language === 'uz' 
                ? 'Birinchi buyurtmangizga 10% chegirma! Promo kod: YANGI2024'
                : 'Скидка 10% на первый заказ! Промокод: НОВЫЙ2024'
              }
            </p>

            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-red-500 hover:to-blue-600 text-white flex-1"
                onClick={() => {
                  window.location.href = '/catalog';
                  handleClose();
                }}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {language === 'uz' ? 'Xarid qilish' : 'Купить сейчас'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}