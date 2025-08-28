import { useLocation, Link } from 'wouter';
import { CheckCircle, Package, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

export default function OrderSuccessPage() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Extract order ID from URL parameters if available
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const orderId = urlParams.get('orderId') || 'Noma\'lum';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600 mb-2">
              Buyurtma muvaffaqiyatli qabul qilindi!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Buyurtma raqami:</strong> {orderId.slice(0, 8)}...
              </p>
              <p className="text-gray-600">
                Tez orada siz bilan bog'lanamiz va buyurtmangizni tasdiqlash uchun aloqaga chiqamiz.
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyingi qadamlar:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    1
                  </div>
                  <p className="text-gray-700">Bizning menejerlarimiz 15 daqiqa ichida siz bilan bog'lanadi</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    2
                  </div>
                  <p className="text-gray-700">Buyurtma tafsilotlari va yetkazib berish sanasi tasdiqlash</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                    3
                  </div>
                  <p className="text-gray-700">Mahsulotlar belgilangan vaqtda yetkazib beriladi</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/" className="flex-1">
                <Button className="w-full" variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Bosh sahifaga qaytish
                </Button>
              </Link>
              
              {isAuthenticated && (
                <Link href="/profile" className="flex-1">
                  <Button className="w-full">
                    <Package className="mr-2 h-4 w-4" />
                    Buyurtmalar tarixi
                  </Button>
                </Link>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mt-6">
              <p className="text-blue-800 text-sm">
                <strong>Eslatma:</strong> Agar 30 daqiqa ichida aloqa bo'lmasa, 
                iltimos +998 99 644 84 44 raqamiga qo'ng'iroq qiling, yoki{' '}
                <a href="https://t.me/akramjon0011" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  https://t.me/akramjon0011
                </a>{' '}
                telegram orqali yozing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}