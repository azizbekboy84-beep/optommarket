import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { User, Package, Calendar, DollarSign } from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product?: {
    nameUz: string;
    nameRu: string;
    images?: string[];
  };
}

interface Order {
  id: string;
  userId: string;
  totalAmount: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending: 'Kutilmoqda',
  confirmed: 'Tasdiqlangan',
  shipped: 'Jo\'natildi',
  delivered: 'Yetkazildi',
  cancelled: 'Bekor qilindi',
};

export default function ProfilePage() {
  const { user } = useAuth();

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const response = await fetch('/api/my-orders');
      if (!response.ok) {
        throw new Error('Buyurtmalar tarixini olishda xatolik');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mening akkauntim</h1>
          <p className="text-gray-600">Shaxsiy ma'lumotlaringiz va buyurtmalar tarixi</p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Shaxsiy ma'lumotlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Foydalanuvchi nomi</label>
                <p className="text-lg text-gray-900">{user?.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg text-gray-900">{user?.email}</p>
              </div>
              {user?.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Telefon</label>
                  <p className="text-lg text-gray-900">{user.phone}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Ro'yxatdan o'tgan sana</label>
                <p className="text-lg text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Buyurtmalar tarixi
              <Badge variant="secondary" className="ml-2">
                {orders.length} ta buyurtma
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-center py-8">
                <p className="text-red-600">Xatolik yuz berdi: {error instanceof Error ? error.message : 'Noma\'lum xatolik'}</p>
              </div>
            )}
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">Hali buyurtmalar yo'q</p>
                <p className="text-gray-500">Birinchi buyurtmangizni bering!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <div>
                          <h3 className="font-semibold text-gray-900">#{order.id.slice(0, 8)}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
                        >
                          {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                        </Badge>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-semibold text-gray-900">
                            <DollarSign className="h-4 w-4" />
                            {parseFloat(order.totalAmount).toLocaleString('uz-UZ')} so'm
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Mijoz nomi</label>
                        <p className="text-gray-900">{order.customerName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Telefon</label>
                        <p className="text-gray-900">{order.customerPhone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-600">Yetkazib berish manzili</label>
                        <p className="text-gray-900">{order.shippingAddress}</p>
                      </div>
                      {order.notes && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-600">Izoh</label>
                          <p className="text-gray-900">{order.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">Mahsulotlar</label>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {item.product?.nameUz || 'Mahsulot nomi topilmadi'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} dona × {parseFloat(item.unitPrice).toLocaleString('uz-UZ')} so'm
                                </p>
                              </div>
                              <p className="font-medium text-gray-900">
                                {parseFloat(item.totalPrice).toLocaleString('uz-UZ')} so'm
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}