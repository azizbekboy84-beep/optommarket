import { useState } from 'react';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Save, 
  Copy, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Code,
  Target
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useToast } from '@/hooks/use-toast';

export default function AdminMarketingConfigPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [gtmId, setGtmId] = useState('GTM-CONTAINER-ID');
  const [fbPixelId, setFbPixelId] = useState('');
  const [googleAdsId, setGoogleAdsId] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const gtmHeadCode = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');</script>
<!-- End Google Tag Manager -->`;

  const gtmBodyCode = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

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
fbq('init', '${fbPixelId}');
fbq('track', 'PageView');
</script>
<!-- End Facebook Pixel Code -->`;

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
    
    toast({
      title: "Kod nusxalandi",
      description: "Kod clipboard'ga muvaffaqiyatli nusxalandi",
    });
  };

  const saveConfig = () => {
    // Save configuration to localStorage or send to backend
    localStorage.setItem('marketing_config', JSON.stringify({
      gtmId,
      fbPixelId,
      googleAdsId,
      savedAt: new Date().toISOString()
    }));

    toast({
      title: "Sozlamalar saqlandi",
      description: "Marketing sozlamalari muvaffaqiyatli saqlandi",
    });
  };

  return (
    <>
      <Helmet>
        <title>
          {language === 'uz' 
            ? 'Marketing Konfiguratsiya - Admin Panel | OptomBazar.uz'
            : 'Конфигурация Маркетинга - Админ-панель | OptomBazar.uz'
          }
        </title>
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'uz' ? 'Marketing Konfiguratsiya' : 'Конфигурация Маркетинга'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'uz' 
                ? 'Google Tag Manager, Facebook Pixel va boshqa marketing vositalarini sozlash'
                : 'Настройка Google Tag Manager, Facebook Pixel и других маркетинговых инструментов'
              }
            </p>
          </div>
        </div>

        {/* Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'uz' ? 'Asosiy sozlamalar' : 'Основные настройки'}
            </CardTitle>
            <CardDescription>
              {language === 'uz' 
                ? 'Marketing platformalari uchun ID va kodlarni kiriting'
                : 'Введите ID и коды для маркетинговых платформ'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gtm-id">Google Tag Manager ID</Label>
                <Input
                  id="gtm-id"
                  placeholder="GTM-XXXXXXX"
                  value={gtmId}
                  onChange={(e) => setGtmId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  {language === 'uz' 
                    ? 'GTM konteyner ID ni kiriting'
                    : 'Введите ID контейнера GTM'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fb-pixel">Facebook Pixel ID</Label>
                <Input
                  id="fb-pixel"
                  placeholder="1234567890123456"
                  value={fbPixelId}
                  onChange={(e) => setFbPixelId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  {language === 'uz' 
                    ? 'Facebook Pixel ID ni kiriting'
                    : 'Введите ID пикселя Facebook'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="google-ads">Google Ads ID</Label>
                <Input
                  id="google-ads"
                  placeholder="AW-1234567890"
                  value={googleAdsId}
                  onChange={(e) => setGoogleAdsId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  {language === 'uz' 
                    ? 'Google Ads konversiya ID'
                    : 'ID конверсии Google Ads'
                  }
                </p>
              </div>

              <div className="flex items-end">
                <Button onClick={saveConfig} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {language === 'uz' ? 'Saqlash' : 'Сохранить'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Installation Codes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Google Tag Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Google Tag Manager
              </CardTitle>
              <CardDescription>
                {language === 'uz' 
                  ? 'Bu kodlarni saytingizga joylashtiring'
                  : 'Разместите эти коды на вашем сайте'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Head kodini &lt;head&gt; ichiga</Label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(gtmHeadCode, 'gtm-head')}
                  >
                    {copiedCode === 'gtm-head' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Textarea
                  value={gtmHeadCode}
                  readOnly
                  className="font-mono text-xs h-32"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Body kodini &lt;body&gt; boshiga</Label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(gtmBodyCode, 'gtm-body')}
                  >
                    {copiedCode === 'gtm-body' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Textarea
                  value={gtmBodyCode}
                  readOnly
                  className="font-mono text-xs h-20"
                />
              </div>

              <Badge variant={gtmId !== 'GTM-CONTAINER-ID' ? 'default' : 'secondary'} className="w-full justify-center">
                {gtmId !== 'GTM-CONTAINER-ID' 
                  ? (language === 'uz' ? 'Konfiguratsiya qilindi' : 'Настроено') + ' ✓'
                  : (language === 'uz' ? 'Konfiguratsiya kerak' : 'Требуется настройка')
                }
              </Badge>
            </CardContent>
          </Card>

          {/* Facebook Pixel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
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
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Pixel kodi</Label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(fbPixelCode, 'fb-pixel')}
                    disabled={!fbPixelId}
                  >
                    {copiedCode === 'fb-pixel' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Textarea
                  value={fbPixelCode}
                  readOnly
                  className="font-mono text-xs h-40"
                />
              </div>

              <Badge variant={fbPixelId ? 'default' : 'secondary'} className="w-full justify-center">
                {fbPixelId 
                  ? (language === 'uz' ? 'Konfiguratsiya qilindi' : 'Настроено') + ' ✓'
                  : (language === 'uz' ? 'Pixel ID kiriting' : 'Введите Pixel ID')
                }
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Events Setup */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'uz' ? 'Konversiya hodisalari' : 'События конверсии'}
            </CardTitle>
            <CardDescription>
              {language === 'uz' 
                ? 'Kuzatiladigan asosiy hodisalar'
                : 'Основные отслеживаемые события'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  event: 'PageView',
                  description: language === 'uz' ? 'Sahifa ko\'rish' : 'Просмотр страницы',
                  status: 'active'
                },
                {
                  event: 'ViewContent',
                  description: language === 'uz' ? 'Mahsulot ko\'rish' : 'Просмотр товара',
                  status: 'active'
                },
                {
                  event: 'AddToCart',
                  description: language === 'uz' ? 'Savatga qo\'shish' : 'Добавление в корзину',
                  status: 'active'
                },
                {
                  event: 'InitiateCheckout',
                  description: language === 'uz' ? 'Buyurtma boshlash' : 'Начало заказа',
                  status: 'active'
                },
                {
                  event: 'Purchase',
                  description: language === 'uz' ? 'Xarid yakunlash' : 'Завершение покупки',
                  status: 'active'
                },
                {
                  event: 'CompleteRegistration',
                  description: language === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Регистрация',
                  status: 'active'
                }
              ].map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.event}</h4>
                    <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                      {item.status === 'active' ? 'Faol' : 'Nofaol'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Helpful Links */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'uz' ? 'Foydali havolalar' : 'Полезные ссылки'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <ExternalLink className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Google Tag Manager</div>
                  <div className="text-sm text-muted-foreground">tagmanager.google.com</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <ExternalLink className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Facebook Events Manager</div>
                  <div className="text-sm text-muted-foreground">business.facebook.com</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <ExternalLink className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Google Ads</div>
                  <div className="text-sm text-muted-foreground">ads.google.com</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <ExternalLink className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Google Analytics</div>
                  <div className="text-sm text-muted-foreground">analytics.google.com</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}