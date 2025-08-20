import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Package, User, Phone, MapPin } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '../../hooks/use-toast';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product?: {
    nameUz: string;
    nameRu: string;
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

const statusOptions = [
  { value: 'pending', label: 'Kutilmoqda' },
  { value: 'confirmed', label: 'Tasdiqlangan' },
  { value: 'shipped', label: 'Jo\'natildi' },
  { value: 'delivered', label: 'Yetkazildi' },
  { value: 'cancelled', label: 'Bekor qilindi' },
];

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all orders
  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) {
        throw new Error('Buyurtmalarni yuklab bo\'lmadi');
      }
      return response.json();
    },
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error('Buyurtma statusini yangilab bo\'lmadi');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Muvaffaqiyat', description: 'Buyurtma statusi yangilandi' });
    },
    onError: () => {
      toast({ title: 'Xatolik', description: 'Status yangilashda xatolik', variant: 'destructive' });
    },
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Buyurtmalarni boshqarish</h1>
          </div>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Barcha buyurtmalar ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Yuklanmoqda...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Hali buyurtmalar yo'q</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-6">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">#{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold">
                            {parseFloat(order.totalAmount).toLocaleString('uz-UZ')} so'm
                          </p>
                        </div>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue>
                              <Badge className={statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
                                {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Mijoz</p>
                          <p className="font-medium">{order.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Telefon</p>
                          <p className="font-medium">{order.customerPhone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Manzil</p>
                          <p className="font-medium">{order.shippingAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Mahsulotlar</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Mahsulot</TableHead>
                              <TableHead>Miqdor</TableHead>
                              <TableHead>Narxi</TableHead>
                              <TableHead>Jami</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {item.product?.nameUz || 'Mahsulot nomi topilmadi'}
                                </TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                  {parseFloat(item.unitPrice).toLocaleString('uz-UZ')} so'm
                                </TableCell>
                                <TableCell>
                                  {parseFloat(item.totalPrice).toLocaleString('uz-UZ')} so'm
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {/* Notes */}
                    {order.notes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-gray-600">Izoh:</p>
                        <p className="text-gray-900">{order.notes}</p>
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