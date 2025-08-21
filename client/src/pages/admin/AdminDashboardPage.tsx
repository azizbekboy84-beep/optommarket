import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Package, ShoppingCart, Users, BarChart3, Folder, FileText, Percent, Bell, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Salom, {user?.username}! Platformani boshqarish uchun quyidagi bo'limlardan foydalaning.
          </p>
        </div>

        {/* Admin Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Mahsulotlar
              </CardTitle>
              <CardDescription>
                Mahsulotlarni qo'shish, tahrirlash va o'chirish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/products">
                <Button className="w-full">
                  Mahsulotlarni boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Orders Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Buyurtmalar
              </CardTitle>
              <CardDescription>
                Buyurtmalarni ko'rish va holatini boshqarish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/orders">
                <Button className="w-full">
                  Buyurtmalarni boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Categories Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-orange-600" />
                Kategoriyalar
              </CardTitle>
              <CardDescription>
                Katalog tuzilmasini boshqarish va tahrirlash
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/categories">
                <Button className="w-full">
                  Kategoriyalarni boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Blog Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Blog
              </CardTitle>
              <CardDescription>
                Blog postlarini yaratish va boshqarish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/blog">
                <Button className="w-full">
                  Blog'ni boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Discounts Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-yellow-600" />
                Chegirmalar
              </CardTitle>
              <CardDescription>
                Kuponlar va chegirmalarni boshqarish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/discounts">
                <Button className="w-full">
                  Chegirmalarni boshqarish
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Push Bildirishnomalar
              </CardTitle>
              <CardDescription>
                Foydalanuvchilarga bildirishnomalar yuborish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/push-notifications">
                <Button className="w-full">
                  Bildirishnomalar yuborish
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Analytics & SEO */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Analytics va SEO
              </CardTitle>
              <CardDescription>
                Google Analytics va SEO monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/analytics">
                <Button className="w-full">
                  Analytics ko'rish
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Marketing Dashboard */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-purple-600" />
                Marketing Dashboard
              </CardTitle>
              <CardDescription>
                Reklama kampaniyalari va konversiya tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/marketing">
                <Button className="w-full">
                  Marketing ko'rish
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Statistika
              </CardTitle>
              <CardDescription>
                Platform statistikasi va hisobotlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/reports">
                <Button className="w-full">
                  Hisobotlarni ko'rish
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tezkor amallar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Yangi mahsulot qo'shish</h3>
                      <p className="text-sm text-gray-600">Katalogga yangi mahsulot qo'shing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/orders">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Buyurtmalarni ko'rish</h3>
                      <p className="text-sm text-gray-600">Kelib tushgan buyurtmalarni tekshirish</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/blog">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Blog post yaratish</h3>
                      <p className="text-sm text-gray-600">Yangi blog maqolasi yozish</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}