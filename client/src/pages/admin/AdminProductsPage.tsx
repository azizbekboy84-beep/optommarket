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
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Plus, Edit, Trash2, ArrowLeft, X, Image, Video } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '../../hooks/use-toast';
import { Product, InsertProduct } from '@shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

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
  wholesaleMinQuantity: number;
  stockQuantity: number;
  unit: string;
  specifications: string;
  image1: string;
  image2: string;
  image3: string;
  videoUrl: string;
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
  wholesaleMinQuantity: 1,
  stockQuantity: 0,
  unit: 'dona',
  specifications: '{}',
  image1: '',
  image2: '',
  image3: '',
  videoUrl: '',
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

  // Fetch categories for dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) {
        throw new Error('Kategoriyalarni yuklab bo\'lmadi');
      }
      return response.json();
    },
  });

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
    
    let specifications = {};
    try {
      specifications = JSON.parse(formData.specifications || '{}');
    } catch {
      toast({ title: 'Xatolik', description: 'Xususiyatlari maydoni noto\'g\'ri JSON formatida', variant: 'destructive' });
      return;
    }
    
    // Prepare images array
    const images: string[] = [];
    if (formData.image1.trim()) images.push(formData.image1.trim());
    if (formData.image2.trim()) images.push(formData.image2.trim());
    if (formData.image3.trim()) images.push(formData.image3.trim());
    
    const productData: InsertProduct = {
      ...formData,
      price: formData.price,
      wholesalePrice: formData.wholesalePrice,
      specifications: specifications,
      images: images.length > 0 ? images : null,
      videoUrl: formData.videoUrl.trim() || null,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createMutation.mutate(productData);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    const images = (product as any).images || [];
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
      wholesaleMinQuantity: (product as any).wholesaleMinQuantity || 1,
      stockQuantity: product.stockQuantity || 0,
      unit: product.unit,
      specifications: JSON.stringify((product as any).specifications || {}),
      image1: images[0] || '',
      image2: images[1] || '',
      image3: images[2] || '',
      videoUrl: (product as any).videoUrl || '',
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
    <div className="min-h-screen bg-background text-foreground py-8">
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
            <h1 className="text-3xl font-bold text-foreground">Mahsulotlarni boshqarish</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Yangi mahsulot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nameUz" className="text-foreground">Nomi (O'zbek)</Label>
                      <Input
                        id="nameUz"
                        value={formData.nameUz}
                        onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                        required
                        className="bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameRu" className="text-foreground">Nomi (Rus)</Label>
                      <Input
                        id="nameRu"
                        value={formData.nameRu}
                        onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                        required
                        className="bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descriptionUz" className="text-foreground">Tavsifi (O'zbek)</Label>
                      <Textarea
                        id="descriptionUz"
                        value={formData.descriptionUz}
                        onChange={(e) => setFormData({ ...formData, descriptionUz: e.target.value })}
                        rows={3}
                        className="bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="descriptionRu" className="text-foreground">Tavsifi (Rus)</Label>
                      <Textarea
                        id="descriptionRu"
                        value={formData.descriptionRu}
                        onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                        rows={3}
                        className="bg-background text-foreground"
                      />
                    </div>
                  </div>

                  {/* Pricing and Details */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="categoryId" className="text-foreground">Kategoriya</Label>
                      <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                        <SelectTrigger className="bg-background text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card text-card-foreground">
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.nameUz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price" className="text-foreground">Narx (so'm)</Label>
                        <Input
                          id="price"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                          className="bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wholesalePrice" className="text-foreground">Optom narx (so'm)</Label>
                        <Input
                          id="wholesalePrice"
                          value={formData.wholesalePrice}
                          onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                          required
                          className="bg-background text-foreground"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="minQuantity" className="text-foreground">Min miqdor (chakana)</Label>
                        <Input
                          id="minQuantity"
                          type="number"
                          value={formData.minQuantity}
                          onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 1 })}
                          className="bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <Label htmlFor="wholesaleMinQuantity" className="text-foreground">Min miqdor (optom)</Label>
                        <Input
                          id="wholesaleMinQuantity"
                          type="number"
                          value={formData.wholesaleMinQuantity}
                          onChange={(e) => setFormData({ ...formData, wholesaleMinQuantity: parseInt(e.target.value) || 1 })}
                          className="bg-background text-foreground"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stockQuantity" className="text-foreground">Sklad miqdori</Label>
                        <Input
                          id="stockQuantity"
                          type="number"
                          value={formData.stockQuantity}
                          onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                          className="bg-background text-foreground"
                        />
                      </div>
                      <div>
                        <Label htmlFor="unit" className="text-foreground">O'lchov birligi</Label>
                        <Input
                          id="unit"
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          required
                          className="bg-background text-foreground"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Mahsulot rasmlari (maksimal 3 ta)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="image1" className="text-foreground">1-rasm URL</Label>
                      <Input
                        id="image1"
                        value={formData.image1}
                        onChange={(e) => setFormData({ ...formData, image1: e.target.value })}
                        placeholder="https://example.com/image1.jpg"
                        className="bg-background text-foreground"
                      />
                      {formData.image1 && (
                        <img src={formData.image1} alt="Rasm 1" className="mt-2 w-full h-20 object-cover rounded border" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="image2" className="text-foreground">2-rasm URL</Label>
                      <Input
                        id="image2"
                        value={formData.image2}
                        onChange={(e) => setFormData({ ...formData, image2: e.target.value })}
                        placeholder="https://example.com/image2.jpg"
                        className="bg-background text-foreground"
                      />
                      {formData.image2 && (
                        <img src={formData.image2} alt="Rasm 2" className="mt-2 w-full h-20 object-cover rounded border" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="image3" className="text-foreground">3-rasm URL</Label>
                      <Input
                        id="image3"
                        value={formData.image3}
                        onChange={(e) => setFormData({ ...formData, image3: e.target.value })}
                        placeholder="https://example.com/image3.jpg"
                        className="bg-background text-foreground"
                      />
                      {formData.image3 && (
                        <img src={formData.image3} alt="Rasm 3" className="mt-2 w-full h-20 object-cover rounded border" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Video Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Mahsulot videosi (ixtiyoriy)
                  </h3>
                  <div>
                    <Label htmlFor="videoUrl" className="text-foreground">Video URL</Label>
                    <Input
                      id="videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://example.com/video.mp4"
                      className="bg-background text-foreground"
                    />
                    {formData.videoUrl && (
                      <video src={formData.videoUrl} className="mt-2 w-full max-w-md h-40 object-cover rounded border" controls />
                    )}
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="specifications" className="text-foreground">Xususiyatlari (JSON format)</Label>
                    <Textarea
                      id="specifications"
                      value={formData.specifications}
                      onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                      placeholder='{"material": "plastik", "rang": "oq"}'
                      rows={3}
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug" className="text-foreground">URL slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      className="bg-background text-foreground"
                    />
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive" className="text-foreground">Faol</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                      />
                      <Label htmlFor="isFeatured" className="text-foreground">Bosh sahifada ko'rsatish</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Bekor qilish
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-primary text-primary-foreground"
                  >
                    {editingProduct ? 'Saqlash' : 'Qo\'shish'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-foreground">Mahsulotlar ro'yxati</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Yuklanmoqda...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Rasm</TableHead>
                    <TableHead className="text-foreground">Nomi</TableHead>
                    <TableHead className="text-foreground">Kategoriya</TableHead>
                    <TableHead className="text-foreground">Narx</TableHead>
                    <TableHead className="text-foreground">Sklad</TableHead>
                    <TableHead className="text-foreground">Holat</TableHead>
                    <TableHead className="text-foreground">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {((product as any).images && (product as any).images[0]) ? (
                          <img 
                            src={(product as any).images[0]} 
                            alt={product.nameUz} 
                            className="w-10 h-10 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded border flex items-center justify-center">
                            <Image className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-foreground">{product.nameUz}</TableCell>
                      <TableCell className="text-foreground">{product.categoryId}</TableCell>
                      <TableCell className="text-foreground">{parseFloat(product.price).toLocaleString()} so'm</TableCell>
                      <TableCell className="text-foreground">{product.stockQuantity}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            data-testid={`edit-product-${product.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            data-testid={`delete-product-${product.id}`}
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