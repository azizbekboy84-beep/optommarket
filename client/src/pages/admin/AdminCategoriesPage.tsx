import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { Plus, Edit, Trash2, ArrowLeft, Folder } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '../../hooks/use-toast';
import { Category, InsertCategory } from '@shared/schema';

interface CategoryFormData {
  nameUz: string;
  nameRu: string;
  descriptionUz: string;
  descriptionRu: string;
  slug: string;
  image: string;
  icon: string;
  parentId: string;
  isActive: boolean;
}

const defaultFormData: CategoryFormData = {
  nameUz: '',
  nameRu: '',
  descriptionUz: '',
  descriptionRu: '',
  slug: '',
  image: '',
  icon: '',
  parentId: 'none',
  isActive: true,
};

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData);

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) {
        throw new Error('Kategoriyalarni yuklab bo\'lmadi');
      }
      return response.json();
    },
  });

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Kategoriya yaratib bo\'lmadi');
      }
      return response.json();
    },
    onSuccess: () => {
      // Admin paneldagi cache'ni yangilash
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      // Asosiy saytdagi cache'ni ham yangilash
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      toast({ title: 'Muvaffaqiyat', description: 'Kategoriya yaratildi va saytda ko\'rsatildi' });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: 'Xatolik', description: 'Kategoriya yaratishda xatolik', variant: 'destructive' });
    },
  });

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertCategory> }) => {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Kategoriyani yangilab bo\'lmadi');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Muvaffaqiyat', description: 'Kategoriya yangilandi' });
      handleCloseDialog();
    },
    onError: () => {
      toast({ title: 'Xatolik', description: 'Kategoriyani yangilashda xatolik', variant: 'destructive' });
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Kategoriyani o\'chirib bo\'lmadi');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Muvaffaqiyat', description: 'Kategoriya o\'chirildi' });
    },
    onError: () => {
      toast({ title: 'Xatolik', description: 'Kategoriyani o\'chirishda xatolik', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData: InsertCategory = {
      ...formData,
      parentId: formData.parentId === 'none' ? null : formData.parentId || null,
      image: formData.image || null,
      icon: formData.icon || null,
      descriptionUz: formData.descriptionUz || null,
      descriptionRu: formData.descriptionRu || null,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: categoryData });
    } else {
      createMutation.mutate(categoryData);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nameUz: category.nameUz,
      nameRu: category.nameRu,
      descriptionUz: category.descriptionUz || '',
      descriptionRu: category.descriptionRu || '',
      slug: category.slug,
      image: category.image || '',
      icon: category.icon || '',
      parentId: category.parentId || 'none',
      isActive: category.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData(defaultFormData);
  };

  // Slug yaratish funksiyasi
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Faqat harflar, raqamlar, bo'sh joy va tire
      .replace(/\s+/g, '-') // Bo'sh joylarni tire bilan almashtirish
      .replace(/-+/g, '-') // Bir nechta tireni bitta tire bilan almashtirish
      .trim()
      .replace(/^-|-$/g, ''); // Boshi va oxiridagi tireni olib tashlash
  };

  // Nom o'zgarganda slug'ni avtomatik yangilash
  const handleNameChange = (field: 'nameUz' | 'nameRu', value: string) => {
    const newFormData = { ...formData, [field]: value };
    
    // Agar slug bo'sh bo'lsa yoki avvalgi nomdan yaratilgan bo'lsa, yangi slug yaratish
    if (!formData.slug || formData.slug === generateSlug(formData.nameUz)) {
      newFormData.slug = generateSlug(value);
    }
    
    setFormData(newFormData);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return 'Asosiy kategoriya';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.nameUz : 'Noma\'lum';
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
            <h1 className="text-3xl font-bold text-gray-900">Kategoriyalarni boshqarish</h1>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData(defaultFormData)} className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Yangi Kategoriya Qo'shish
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya qo\'shish'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nameUz">Nomi (O'zbek)</Label>
                    <Input
                      id="nameUz"
                      value={formData.nameUz}
                      onChange={(e) => handleNameChange('nameUz', e.target.value)}
                      required
                      placeholder="Kategoriya nomini kiriting"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameRu">Nomi (Rus)</Label>
                    <Input
                      id="nameRu"
                      value={formData.nameRu}
                      onChange={(e) => handleNameChange('nameRu', e.target.value)}
                      required
                      placeholder="Kategoriya nomini kiriting (rus tilida)"
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      placeholder="avtomatik-yaratiladi"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Kategoriya nomini yozsangiz, avtomatik yaratiladi
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="image">Rasm URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="icon">Ikona nomi (Lucide React)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Package, Shirt, Utensils, Smartphone..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Masalan: Package, Shirt, Utensils, Smartphone, Box, etc.
                  </p>
                </div>

                <div>
                  <Label htmlFor="parentId">Asosiy kategoriya</Label>
                  <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Asosiy kategoriyani tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Asosiy kategoriya</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nameUz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Faol</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Bekor qilish
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingCategory ? 'Yangilash' : 'Yaratish'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>Barcha kategoriyalar ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Yuklanmoqda...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomi</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Asosiy kategoriya</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium">{category.nameUz}</div>
                            <div className="text-sm text-gray-500">{category.nameRu}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell>{getParentName(category.parentId)}</TableCell>
                      <TableCell>
                        {category.isActive ? (
                          <Badge variant="default">Faol</Badge>
                        ) : (
                          <Badge variant="secondary">Nofaol</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" disabled={deleteMutation.isPending}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Kategoriyani o'chirish</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Haqiqatan ham "{category.nameUz}" kategoriyasini o'chirmoqchimisiz? 
                                  Bu amalni bekor qilib bo'lmaydi.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(category.id)}>
                                  O'chirish
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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