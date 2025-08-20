import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Image,
  Clock,
  BarChart3
} from 'lucide-react';

interface SEOCheck {
  id: string;
  title: string;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  recommendation?: string;
  value?: string;
}

interface PageSEOAnalysis {
  url: string;
  title: string;
  score: number;
  checks: SEOCheck[];
  lastChecked: Date;
}

export default function AdminSEOPage() {
  const [analysisUrl, setAnalysisUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PageSEOAnalysis | null>(null);

  // Sayt SEO hisobotlarini olish
  const { data: seoReport, isLoading } = useQuery({
    queryKey: ['admin-seo-report'],
    queryFn: async () => {
      const response = await fetch('/api/admin/seo/report');
      if (!response.ok) {
        throw new Error('SEO hisobotni yuklab bo\'lmadi');
      }
      return response.json();
    },
  });

  // Sahifani SEO jihatdan tahlil qilish
  const analyzePage = async () => {
    if (!analysisUrl) return;
    
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/admin/seo/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: analysisUrl })
      });
      
      if (!response.ok) {
        throw new Error('Tahlil amalga oshirilmadi');
      }
      
      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('SEO tahlil xatoligi:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SEO Monitoring va Tahlil
          </h1>
          <p className="text-gray-600">
            Sayt sahifalarining SEO holatini kuzatib boring va optimallashtiring
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Umumiy Ko'rinish</TabsTrigger>
            <TabsTrigger value="analyzer">Sahifa Tahlili</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap Monitor</TabsTrigger>
            <TabsTrigger value="reports">Hisobotlar</TabsTrigger>
          </TabsList>

          {/* Umumiy ko'rinish */}
          <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* SEO metrikalar */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Umumiy SEO Ball</p>
                          <p className="text-2xl font-bold text-green-600">85/100</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Indexlangan Sahifalar</p>
                          <p className="text-2xl font-bold text-blue-600">247</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Ichki Linklar</p>
                          <p className="text-2xl font-bold text-purple-600">1,523</p>
                        </div>
                        <LinkIcon className="h-8 w-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Optimallashgan Rasmlar</p>
                          <p className="text-2xl font-bold text-orange-600">92%</p>
                        </div>
                        <Image className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* So'nggi SEO tekshiruvlari */}
                <Card>
                  <CardHeader>
                    <CardTitle>So'nggi SEO Tekshiruvlari</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { page: '/catalog', score: 88, issues: 2, lastCheck: '5 daqiqa oldin' },
                        { page: '/products/polietilen-paketlar', score: 92, issues: 1, lastCheck: '15 daqiqa oldin' },
                        { page: '/blog/optom-savdo-maslahatlari', score: 95, issues: 0, lastCheck: '1 soat oldin' },
                        { page: '/category/plastik-idishlar', score: 76, issues: 3, lastCheck: '2 soat oldin' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                              {item.score}
                            </div>
                            <div>
                              <p className="font-medium">{item.page}</p>
                              <p className="text-sm text-gray-500">
                                {item.issues > 0 ? `${item.issues} ta muammo` : 'Muammolar yo\'q'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {item.lastCheck}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Sahifa tahlili */}
          <TabsContent value="analyzer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sahifa SEO Tahlili</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Input
                    placeholder="Tahlil qilinadigan sahifa URL manzili..."
                    value={analysisUrl}
                    onChange={(e) => setAnalysisUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={analyzePage}
                    disabled={isAnalyzing || !analysisUrl}
                    className="min-w-[120px]"
                  >
                    {isAnalyzing ? 'Tahlil...' : 'Tahlil Qilish'}
                  </Button>
                </div>

                {analysisResult && (
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Tahlil Natijasi</h3>
                      <div className="flex items-center space-x-4">
                        <div className={`text-3xl font-bold ${getScoreColor(analysisResult.score)}`}>
                          {analysisResult.score}/100
                        </div>
                        <Progress value={analysisResult.score} className="w-32" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {analysisResult.checks.map((check) => (
                        <div key={check.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                          {getStatusIcon(check.status)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{check.title}</h4>
                              <Badge variant={
                                check.status === 'pass' ? 'default' : 
                                check.status === 'warning' ? 'secondary' : 'destructive'
                              }>
                                {check.status === 'pass' ? 'O\'tdi' : 
                                 check.status === 'warning' ? 'Ogohlantirish' : 'Xatolik'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{check.description}</p>
                            {check.value && (
                              <p className="text-sm text-blue-600 mt-1">Qiymat: {check.value}</p>
                            )}
                            {check.recommendation && (
                              <div className="mt-2 p-3 bg-blue-50 rounded">
                                <p className="text-sm text-blue-800">
                                  <strong>Tavsiya:</strong> {check.recommendation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sitemap monitor */}
          <TabsContent value="sitemap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Holati</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">sitemap.xml</h4>
                      <p className="text-sm text-gray-500">Oxirgi yangilanish: Bugun 14:30</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Faol</Badge>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ko'rish
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">robots.txt</h4>
                      <p className="text-sm text-gray-500">Oxirgi tekshiruv: Bugun 12:15</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Faol</Badge>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ko'rish
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Jami sahifalar</p>
                        <p className="text-2xl font-bold">247</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Mahsulotlar</p>
                        <p className="text-2xl font-bold">156</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Blog postlar</p>
                        <p className="text-2xl font-bold">43</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hisobotlar */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Hisobotlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    SEO hisobotlari avtomatik ravishda har hafta yaratiladi va sizga email orqali yuboriladi.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Haftalik SEO Hisobot', date: '18 Yanvar 2025', score: 87 },
                      { title: 'Haftalik SEO Hisobot', date: '11 Yanvar 2025', score: 84 },
                      { title: 'Haftalik SEO Hisobot', date: '4 Yanvar 2025', score: 82 },
                      { title: 'Haftalik SEO Hisobot', date: '28 Dekabr 2024', score: 79 }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{report.title}</h4>
                          <p className="text-sm text-gray-500">{report.date}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                            {report.score}/100
                          </span>
                          <Button variant="outline" size="sm">
                            Yuklab olish
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}