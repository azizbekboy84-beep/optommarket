import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '../../hooks/use-toast';
import { Product, InsertProduct } from '@shared/schema';

interface ProductFormData {
  nameUz: string;
  nameRu: string;
  descriptionUz: string;
  descriptionRu: string;
  categoryId: string;
  sellerId: string;
  price: string;
  wholesalePrice: string;
  minQuantity: number;
  stockQuantity: number;
  unit: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
}

const defaultFormData: ProductFormData = {
  nameUz: '',
  nameRu: '',
  descriptionUz: '',
  descriptionRu: '',
  categoryId: 'cat-1',
  sellerId: 'seller-1',
  price: '0',
  wholesalePrice: '0',
  minQuantity: 1,
  stockQuantity: 0,
  unit: 'dona',
  slug: '',
  isActive: true,
  isFeatured: false,
};

export default function AdminProductsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await fetch('/api/admin/products');
      if (!response.ok) {
        throw new Error('Mahsulotlarni yuklab bo\'lmadi');
      }
      return response.json();
    },
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Mahsulot yaratib bo\'lmadi');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Muvaffaqiyat', description: 'Mahsulot yaratildi' });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: 'Xatolik', description: 'Mahsulot yaratishda xatolik', variant: 'destructive' });
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProduct> }) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Mahsulotni yangilab bo\'lmadi');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Muvaffaqiyat', description: 'Mahsulot yangilandi' });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: 'Xatolik', description: 'Mahsulotni yangilashda xatolik', variant: 'destructive' });
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Mahsulotni o\'chirib bo\'lmadi');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Muvaffaqiyat', description: 'Mahsulot o\'chirildi' });
    },
    onError: () => {
      toast({ title: 'Xatolik', description: 'Mahsulotni o\'chirishda xatolik', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: InsertProduct = {
      ...formData,
      price: formData.price,
      wholesalePrice: formData.wholesalePrice,
      images: null,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      nameUz: product.nameUz,
      nameRu: product.nameRu,
      descriptionUz: product.descriptionUz || '',
      descriptionRu: product.descriptionRu || '',
      categoryId: product.categoryId,
      sellerId: product.sellerId,
      price: product.price,
      wholesalePrice: product.wholesalePrice,
      minQuantity: product.minQuantity || 1,
      stockQuantity: product.stockQuantity || 0,
      unit: product.unit,
      slug: product.slug,
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData(defaultFormData);
  };

  const handleDelete = (id: string) => {
    if (confirm('Mahsulotni o\'chirishni tasdiqlaysizmi?')) {
      deleteMutation.mutate(id);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Mahsulotlarni boshqarish</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData(defaultFormData)}>
                <Plus className="h-4 w-4 mr-2" />
                Yangi mahsulot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nameUz">Nomi (O'zbek)</Label>
                    <Input
                      id="nameUz"
                      value={formData.nameUz}
                      onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameRu">Nomi (Rus)</Label>
                    <Input
                      id="nameRu"
                      value={formData.nameRu}
                      onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="descriptionUz">Tavsif (O'zbek)</Label>
                    <Textarea
                      id="descriptionUz"
                      value={formData.descriptionUz}
                      onChange={(e) => setFormData({ ...formData, descriptionUz: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionRu">Tavsif (Rus)</Label>
                    <Textarea
                      id="descriptionRu"
                      value={formData.descriptionRu}
                      onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Narxi</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="wholesalePrice">Optom narxi</Label>
                    <Input
                      id="wholesalePrice"
                      type="number"
                      step="0.01"
                      value={formData.wholesalePrice}
                      onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Birlik</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="minQuantity">Min miqdor</Label>
                    <Input
                      id="minQuantity"
                      type="number"
                      value={formData.minQuantity}
                      onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stockQuantity">Ombordagi miqdor</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Faol</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    />
                    <Label htmlFor="isFeatured">Tavsiya etilgan</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Bekor qilish
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingProduct ? 'Yangilash' : 'Yaratish'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Barcha mahsulotlar ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Yuklanmoqda...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomi</TableHead>
                    <TableHead>Narxi</TableHead>
                    <TableHead>Miqdor</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.nameUz}</div>
                          <div className="text-sm text-gray-500">{product.nameRu}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{parseFloat(product.price).toLocaleString()} so'm</div>
                          <div className="text-sm text-gray-500">
                            Optom: {parseFloat(product.wholesalePrice).toLocaleString()} so'm
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.stockQuantity} {product.unit}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {product.isActive ? (
                            <Badge variant="default">Faol</Badge>
                          ) : (
                            <Badge variant="secondary">Nofaol</Badge>
                          )}
                          {product.isFeatured && (
                            <Badge variant="outline">Tavsiya</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete(product.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}