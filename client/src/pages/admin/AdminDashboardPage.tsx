import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Package, ShoppingCart, Users, BarChart3 } from 'lucide-react';
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
              <Button className="w-full" disabled>
                Tez orada...
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tezkor amallar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}