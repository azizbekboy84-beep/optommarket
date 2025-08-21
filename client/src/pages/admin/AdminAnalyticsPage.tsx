import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/language-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Clock,
  MousePointer,
  Search
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AdminAnalyticsPage() {
  const { language } = useLanguage();

  // SEO Metrics
  const { data: seoMetrics, isLoading: isLoadingSeo } = useQuery({
    queryKey: ['/api/analytics/seo-metrics'],
  });

  // Google Analytics Data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['/api/analytics/google-analytics'],
  });

  // Search Console Data
  const { data: searchConsoleData, isLoading: isLoadingSearch } = useQuery({
    queryKey: ['/api/analytics/search-console'],
  });

  if (isLoadingSeo || isLoadingAnalytics || isLoadingSearch) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>
          {language === 'uz' 
            ? 'Analytics va SEO Monitoring - Admin Panel | OptomBazar.uz'
            : 'Аналитика и SEO Мониторинг - Админ-панель | OptomBazar.uz'
          }
        </title>
      </Helmet>
      <Header />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'uz' ? 'Analytics va SEO Monitoring' : 'Аналитика и SEO Мониторинг'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'uz' 
                ? 'Sayt statistikasi va SEO ko\'rsatkichlari'
                : 'Статистика сайта и SEO показатели'
              }
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'Kunlik foydalanuvchilar' : 'Ежедневные пользователи'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analyticsData as any)?.users || 0}</div>
              <p className="text-xs text-muted-foreground">
                +12% {language === 'uz' ? 'o\'tgan hafta' : 'с прошлой недели'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'Sahifa ko\'rishlar' : 'Просмотры страниц'}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analyticsData as any)?.pageViews || 0}</div>
              <p className="text-xs text-muted-foreground">
                +8% {language === 'uz' ? 'o\'tgan hafta' : 'с прошлой недели'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'Konversiya darajasi' : 'Коэффициент конверсии'}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analyticsData as any)?.conversionRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                +0.4% {language === 'uz' ? 'o\'tgan hafta' : 'с прошлой недели'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'O\'rtacha vaqt' : 'Среднее время'}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analyticsData as any)?.averageSessionDuration || '0:00'}</div>
              <p className="text-xs text-muted-foreground">
                +15s {language === 'uz' ? 'o\'tgan hafta' : 'с прошлой недели'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* SEO Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'uz' ? 'Core Web Vitals' : 'Core Web Vitals'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">LCP</span>
                <Badge variant="secondary">{(seoMetrics as any)?.coreWebVitals?.LCP}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">FID</span>
                <Badge variant="secondary">{(seoMetrics as any)?.coreWebVitals?.FID}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">CLS</span>
                <Badge variant="secondary">{(seoMetrics as any)?.coreWebVitals?.CLS}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'uz' ? 'Sahifa tezligi' : 'Скорость страниц'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {language === 'uz' ? 'Mobil' : 'Мобильный'}
                </span>
                <div className="flex items-center gap-2">
                  <Progress value={(seoMetrics as any)?.mobileScore || 0} className="w-16" />
                  <span className="text-sm">{(seoMetrics as any)?.mobileScore}/100</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {language === 'uz' ? 'Desktop' : 'Десктоп'}
                </span>
                <div className="flex items-center gap-2">
                  <Progress value={(seoMetrics as any)?.desktopScore || 0} className="w-16" />
                  <span className="text-sm">{(seoMetrics as any)?.desktopScore}/100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'uz' ? 'Indeksatsiya' : 'Индексация'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {language === 'uz' ? 'Jami sahifalar' : 'Всего страниц'}
                </span>
                <span className="font-medium">{(seoMetrics as any)?.totalPages}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {language === 'uz' ? 'Indekslangan' : 'Проиндексировано'}
                </span>
                <span className="font-medium">{(seoMetrics as any)?.indexedPages}</span>
              </div>
              <Progress 
                value={((seoMetrics as any)?.indexedPages / (seoMetrics as any)?.totalPages) * 100} 
                className="w-full" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Search Console Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'Ko\'rishlar soni' : 'Показы'}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(searchConsoleData as any)?.impressions?.toLocaleString() || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'Bosilishlar' : 'Клики'}
              </CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(searchConsoleData as any)?.clicks?.toLocaleString() || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CTR</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(searchConsoleData as any)?.clickThroughRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'O\'rtacha pozitsiya' : 'Средняя позиция'}
              </CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(searchConsoleData as any)?.averagePosition}</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Queries */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'uz' ? 'Top qidiruv so\'zlari' : 'Топ поисковых запросов'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(searchConsoleData as any)?.topQueries?.map((query: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{query.query}</p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'uz' ? 'Pozitsiya' : 'Позиция'}: {query.position}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{query.clicks} {language === 'uz' ? 'bosish' : 'клика'}</p>
                    <p className="text-sm text-muted-foreground">{query.impressions} {language === 'uz' ? 'ko\'rish' : 'показов'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}