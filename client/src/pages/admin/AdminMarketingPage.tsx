import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/components/language-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Megaphone, 
  Target, 
  TrendingUp, 
  Eye,
  MousePointer,
  DollarSign,
  Users,
  Settings,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AdminMarketingPage() {
  const { language } = useLanguage();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Marketing metrics
  const { data: marketingMetrics, isLoading } = useQuery({
    queryKey: ['/api/marketing/metrics'],
  });

  // GTM Configuration codes
  const gtmCode = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-CONTAINER-ID');</script>
<!-- End Google Tag Manager -->`;

  const fbPixelCode = `<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<!-- End Facebook Pixel Code -->`;

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {language === 'uz' 
            ? 'Marketing Dashboard - Admin Panel | OptomBazar.uz'
            : 'Маркетинг Панель - Админ-панель | OptomBazar.uz'
          }
        </title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Megaphone className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'uz' ? 'Marketing Dashboard' : 'Маркетинг Панель'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'uz' 
                ? 'Reklama kampaniyalari va konversiyalarni boshqarish'
                : 'Управление рекламными кампаниями и конверсиями'
              }
            </p>
          </div>
        </div>

        {/* Marketing Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'Reklama xarajatlari' : 'Расходы на рекламу'}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(marketingMetrics as any)?.adSpend?.toLocaleString() || 0} UZS</div>
              <p className="text-xs text-muted-foreground">
                {language === 'uz' ? 'Bu oy' : 'В этом месяце'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(marketingMetrics as any)?.roas || '3.2'}x</div>
              <p className="text-xs text-muted-foreground">
                Return on Ad Spend
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'Konversiya darajasi' : 'Коэффициент конверсии'}
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(marketingMetrics as any)?.conversionRate || 2.8}%</div>
              <p className="text-xs text-muted-foreground">
                +0.3% {language === 'uz' ? 'o\'tgan hafta' : 'с прошлой недели'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === 'uz' ? 'Yangi mijozlar' : 'Новые клиенты'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(marketingMetrics as any)?.newCustomers || 147}</div>
              <p className="text-xs text-muted-foreground">
                {language === 'uz' ? 'Bu hafta' : 'На этой неделе'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {language === 'uz' ? 'Kampaniya ko\'rsatkichlari' : 'Показатели кампаний'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: 'Google Ads - Optom mahsulotlar',
                  impressions: 12560,
                  clicks: 834,
                  ctr: 6.6,
                  conversions: 23,
                  cost: 2850000
                },
                {
                  name: 'Facebook - Ulgurji savdo',
                  impressions: 8945,
                  clicks: 567,
                  ctr: 6.3,
                  conversions: 18,
                  cost: 1950000
                },
                {
                  name: 'Instagram - Biznes mahsulotlar',
                  impressions: 5670,
                  clicks: 289,
                  ctr: 5.1,
                  conversions: 8,
                  cost: 890000
                }
              ].map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{campaign.name}</h4>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>CTR: {campaign.ctr}%</span>
                      <span>{campaign.conversions} konversiya</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{campaign.cost.toLocaleString()} UZS</p>
                    <p className="text-sm text-muted-foreground">{campaign.clicks} bosish</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Setup Codes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Google Tag Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Google Tag Manager
              </CardTitle>
              <CardDescription>
                {language === 'uz' 
                  ? 'Barcha marketing kodlarini boshqarish uchun GTM kodi'
                  : 'GTM код для управления всеми маркетинговыми кодами'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{language === 'uz' ? 'Container ID' : 'ID контейнера'}</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value="GTM-CONTAINER-ID" 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>{language === 'uz' ? 'Head kodi' : 'Код для Head'}</Label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(gtmCode, 'gtm')}
                  >
                    {copiedCode === 'gtm' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                  {gtmCode}
                </pre>
              </div>
              <Badge variant="secondary" className="w-full justify-center">
                {language === 'uz' ? 'O\'rnatilgan' : 'Установлен'} ✓
              </Badge>
            </CardContent>
          </Card>

          {/* Facebook Pixel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Facebook Pixel
              </CardTitle>
              <CardDescription>
                {language === 'uz' 
                  ? 'Facebook va Instagram reklamalarini kuzatish'
                  : 'Отслеживание рекламы Facebook и Instagram'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Pixel ID</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    placeholder="YOUR_PIXEL_ID" 
                    className="font-mono text-sm"
                  />
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>{language === 'uz' ? 'Pixel kodi' : 'Код пикселя'}</Label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(fbPixelCode, 'fb')}
                  >
                    {copiedCode === 'fb' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                  {fbPixelCode}
                </pre>
              </div>
              <Badge variant="outline" className="w-full justify-center">
                {language === 'uz' ? 'Sozlanmagan' : 'Не настроен'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {language === 'uz' ? 'Konversiya maqsadlari' : 'Цели конверсии'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: language === 'uz' ? 'Xarid' : 'Покупка',
                  description: language === 'uz' ? 'Buyurtma yakunlandi' : 'Заказ завершен',
                  value: 'purchase',
                  conversions: 45,
                  rate: 2.8
                },
                {
                  name: language === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Регистрация',
                  description: language === 'uz' ? 'Yangi foydalanuvchi' : 'Новый пользователь',
                  value: 'sign_up',
                  conversions: 127,
                  rate: 8.4
                },
                {
                  name: language === 'uz' ? 'Aloqa' : 'Контакт',
                  description: language === 'uz' ? 'Aloqa formasi yuborildi' : 'Форма контакта отправлена',
                  value: 'contact',
                  conversions: 89,
                  rate: 5.6
                }
              ].map((goal, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{goal.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{goal.conversions}</span>
                    <Badge variant="secondary">{goal.rate}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}