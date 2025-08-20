import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Users, ShoppingCart, Eye, Search, DollarSign, Package } from "lucide-react";

interface ReportsSummary {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  popularProducts: Array<{
    id: string;
    name: string;
    views: number;
    orders: number;
    revenue: number;
  }>;
  recentActivity: number;
}

interface UserActivityReport {
  dailyVisits: Array<{ date: string; visits: number; uniqueUsers: number }>;
  weeklyStats: Array<{ week: string; visits: number; registrations: number }>;
  monthlyStats: Array<{ month: string; visits: number; registrations: number }>;
}

interface SalesReport {
  dailySales: Array<{ date: string; orders: number; revenue: number }>;
  topProducts: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
    category: string;
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
}

interface PopularProductsReport {
  mostViewed: Array<{
    id: string;
    name: string;
    views: number;
    category: string;
  }>;
  mostAddedToCart: Array<{
    id: string;
    name: string;
    cartAdds: number;
    category: string;
  }>;
  mostOrdered: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
    category: string;
  }>;
}

interface SearchTermsReport {
  topSearches: Array<{
    term: string;
    count: number;
    resultsAvg: number;
  }>;
  noResultSearches: Array<{
    term: string;
    count: number;
  }>;
  recentSearches: Array<{
    term: string;
    timestamp: string;
    results: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<string>("30");

  // API queries
  const { data: summary, isLoading: summaryLoading } = useQuery<ReportsSummary>({
    queryKey: ['/api/admin/reports/summary'],
  });

  const { data: userActivity, isLoading: userActivityLoading } = useQuery<UserActivityReport>({
    queryKey: ['/api/admin/reports/user-activity'],
  });

  const { data: salesReport, isLoading: salesLoading } = useQuery<SalesReport>({
    queryKey: ['/api/admin/reports/sales'],
  });

  const { data: popularProducts, isLoading: popularProductsLoading } = useQuery<PopularProductsReport>({
    queryKey: ['/api/admin/reports/popular-products'],
  });

  const { data: searchTerms, isLoading: searchTermsLoading } = useQuery<SearchTermsReport>({
    queryKey: ['/api/admin/reports/search-terms'],
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Summary cards data
  const summaryCards = [
    {
      title: "Jami foydalanuvchilar",
      value: summary?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Jami buyurtmalar",
      value: summary?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Jami daromad",
      value: formatCurrency(summary?.totalRevenue || 0),
      icon: DollarSign,
      color: "bg-yellow-500",
    },
    {
      title: "So'nggi faollik",
      value: summary?.recentActivity || 0,
      icon: Activity,
      color: "bg-purple-500",
    },
  ];

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4">Hisobotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hisobotlar va Analitika</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="7">So'nggi 7 kun</option>
          <option value="30">So'nggi 30 kun</option>
          <option value="90">So'nggi 90 kun</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-4 w-4 text-white p-1 rounded ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Umumiy ko'rinish</TabsTrigger>
          <TabsTrigger value="activity">Foydalanuvchi faolligi</TabsTrigger>
          <TabsTrigger value="sales">Sotishlar</TabsTrigger>
          <TabsTrigger value="products">Ommabop mahsulotlar</TabsTrigger>
          <TabsTrigger value="search">Qidiruv so'zlari</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kunlik tashriflar</CardTitle>
                <CardDescription>So'nggi 30 kundagi tashriflar</CardDescription>
              </CardHeader>
              <CardContent>
                {userActivityLoading ? (
                  <div className="h-64 flex items-center justify-center">Yuklanmoqda...</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userActivity?.dailyVisits}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="visits" stroke="#8884d8" />
                      <Line type="monotone" dataKey="uniqueUsers" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eng ommabop mahsulotlar</CardTitle>
                <CardDescription>Ko'rinish va buyurtmalar bo'yicha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary?.popularProducts.slice(0, 5).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.views} ko'rinish • {product.orders} buyurtma
                        </p>
                      </div>
                      <Badge variant="outline">
                        {formatCurrency(product.revenue)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Activity Tab */}
        <TabsContent value="activity">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Haftalik statistika</CardTitle>
              </CardHeader>
              <CardContent>
                {userActivityLoading ? (
                  <div className="h-64 flex items-center justify-center">Yuklanmoqda...</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userActivity?.weeklyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visits" fill="#8884d8" />
                      <Bar dataKey="registrations" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Oylik statistika</CardTitle>
              </CardHeader>
              <CardContent>
                {userActivityLoading ? (
                  <div className="h-64 flex items-center justify-center">Yuklanmoqda...</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={userActivity?.monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visits" fill="#8884d8" />
                      <Bar dataKey="registrations" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kunlik sotishlar</CardTitle>
              </CardHeader>
              <CardContent>
                {salesLoading ? (
                  <div className="h-64 flex items-center justify-center">Yuklanmoqda...</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesReport?.dailySales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eng ko'p sotilgan mahsulotlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mahsulot</TableHead>
                        <TableHead>Buyurtmalar</TableHead>
                        <TableHead>Daromad</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesReport?.topProducts.slice(0, 5).map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                          </TableCell>
                          <TableCell>{product.orders}</TableCell>
                          <TableCell>{formatCurrency(product.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kategoriyalar bo'yicha sotish</CardTitle>
                </CardHeader>
                <CardContent>
                  {salesLoading ? (
                    <div className="h-64 flex items-center justify-center">Yuklanmoqda...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={salesReport?.topCategories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => entry.name}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {salesReport?.topCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Popular Products Tab */}
        <TabsContent value="products">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Eng ko'p ko'rilgan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularProducts?.mostViewed.slice(0, 10).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <Badge variant="secondary">{product.views}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Eng ko'p savatga qo'shilgan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularProducts?.mostAddedToCart.slice(0, 10).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <Badge variant="secondary">{product.cartAdds}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Eng ko'p buyurtma qilingan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularProducts?.mostOrdered.slice(0, 10).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        <p className="text-xs text-green-600">{formatCurrency(product.revenue)}</p>
                      </div>
                      <Badge variant="secondary">{product.orders}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Search Terms Tab */}
        <TabsContent value="search">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Eng ko'p qidirilgan so'zlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Qidiruv so'zi</TableHead>
                      <TableHead>Miqdor</TableHead>
                      <TableHead>O'rtacha natija</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchTerms?.topSearches.slice(0, 10).map((term, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{term.term}</TableCell>
                        <TableCell>{term.count}</TableCell>
                        <TableCell>{term.resultsAvg}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Natija bermagan qidiruvlar</CardTitle>
                <CardDescription>Bu so'zlar uchun mahsulot qo'shish kerak</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchTerms?.noResultSearches.slice(0, 10).map((term, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <p className="font-medium">{term.term}</p>
                      <Badge variant="destructive">{term.count} marta</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}