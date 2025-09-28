import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Package, ShoppingCart, Users, BarChart3, Folder, FileText, Percent, Bell, Megaphone, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Salom, {user?.username}! Platformani boshqarish uchun quyidagi bo'limlardan foydalaning.
          </p>
        </div>

        {/* Quick Actions - Highlighted */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="h-6 w-6 text-blue-600" />
            Tezkor Qo'shish
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/products">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-lg">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Yangi Mahsulot Qo'shish</h3>
                      <p className="text-sm text-gray-600">Katalogga yangi mahsulot qo'shing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/categories">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-green-200 hover:border-green-400 bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-600 rounded-lg">
                      <Folder className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Yangi Kategoriya Qo'shish</h3>
                      <p className="text-sm text-gray-600">Mahsulotlar uchun yangi kategoriya yarating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/blog">
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-purple-200 hover:border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 rounded-lg">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Yangi Blog Post</h3>
                      <p className="text-sm text-gray-600">Blog uchun yangi maqola yozing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Admin Navigation Cards */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Boshqaruv Bo'limlari</h2>
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

            {/* Categories Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-green-600" />
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

            {/* Orders Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-orange-600" />
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

            {/* Blog Management */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
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

            {/* Marketing Dashboard */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-red-600" />
                  Marketing
                </CardTitle>
                <CardDescription>
                  Reklama kampaniyalari va avtomatlashtirish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/marketing">
                  <Button className="w-full">
                    Marketing boshqarish
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Analytics & SEO */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
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

            {/* Push Notifications */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-pink-600" />
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

            {/* Reports */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-teal-600" />
                  Hisobotlar
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
        </div>
      </div>
      <Footer />
    </div>
  );
}
