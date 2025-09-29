import { useLanguage } from './language-provider';

export function PageLoader() {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center space-y-6">
        {/* Animated logo */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-red-500 rounded-2xl animate-pulse" />
          <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-red-500 rounded-2xl blur-xl opacity-50 animate-ping" />
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            OptomMarket.uz
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'uz' ? 'Yuklanmoqda...' : 'Загрузка...'}
          </p>
        </div>
        
        {/* Loading bar */}
        <div className="w-48 mx-auto">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-red-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 100%; margin-left: 0%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
