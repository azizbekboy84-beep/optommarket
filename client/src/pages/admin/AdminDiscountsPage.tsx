import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Header } from '../../components/header';
import { Footer } from '../../components/footer';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Textarea } from '../../components/ui/textarea';
import { Trash2, Edit, Plus, Copy, Calendar, Percent, dollarSign } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { apiRequest } from '../../lib/queryClient';

const discountFormSchema = z.object({
  code: z.string().min(3, 'Kod kamida 3 ta belgidan iborat bo\'lishi kerak').max(20),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().min(1, 'Qiymat 1 dan katta bo\'lishi kerak'),
{{ ... }}
  isActive: true,
});

// Barcha chegirmalarni olish
const { data: discountsData, isLoading } = useQuery<Discount[]>({
  queryKey: ['/api/discounts'],
});

const discounts = discountsData ?? [];

// Yangi chegirma yaratish yoki tahrirlash
const createOrUpdateMutation = useMutation({
  mutationFn: async (data: DiscountFormData) => {
    const requestData = {
      ...data,
      validFrom: new Date(data.validFrom).toISOString(),
      validUntil: new Date(data.validUntil).toISOString(),
    };

    if (editingDiscount) {
      const response = await apiRequest<Discount>('PUT', `/api/discounts/${editingDiscount.id}`, requestData);
      return response.data;
    } else {
      const response = await apiRequest<Discount>('POST', '/api/discounts', requestData);
      return response.data;
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/discounts'] });
    setIsDialogOpen(false);
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Xatolik!',
        description: error.message || 'Chegirmani o\'chirishda xatolik',
        variant: 'destructive',
      });
    },
  });

  const openCreateDialog = () => {
    setEditingDiscount(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const openEditDialog = (discount: Discount) => {
    setEditingDiscount(discount);
    form.reset({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      validFrom: new Date(discount.validFrom).toISOString().split('T')[0],
      validUntil: new Date(discount.validUntil).toISOString().split('T')[0],
      maxUses: discount.maxUses,
      targetType: discount.targetType,
      isActive: discount.isActive,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: DiscountFormData) => {
    createOrUpdateMutation.mutate(data);
  };

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Nusxalandi!',
      description: `Chegirma kodi "${code}" nusxalandi`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ');
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chegirmalar boshqaruvi</h1>
            <p className="text-gray-600">
              Platformada foydalaniladigan chegirmalar va kuponlarni boshqaring
            </p>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Yangi chegirma qo'shish
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Jami chegirmalar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{discounts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Faol chegirmalar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {discounts.filter((d: Discount) => d.isActive && !isExpired(d.validUntil)).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Muddati tugagan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {discounts.filter((d: Discount) => isExpired(d.validUntil)).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ishlatilgan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {discounts.reduce((sum: number, d: Discount) => sum + d.usedCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Barcha chegirmalar</CardTitle>
            <CardDescription>
              Platformadagi barcha chegirmalar ro'yxati
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Yuklanmoqda...</div>
            ) : discounts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Hech qanday chegirma topilmadi
              </div>
            ) : (
              <div className="space-y-4">
                {discounts.map((discount: Discount) => (
                  <div key={discount.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyDiscountCode(discount.code)}
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-3 w-3" />
                          {discount.code}
                        </Button>
                        <div className="flex items-center gap-2">
                          {discount.type === 'percentage' ? (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              {discount.value}%
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {discount.value.toLocaleString()} so'm
                            </Badge>
                          )}
                          {discount.isActive && !isExpired(discount.validUntil) ? (
                            <Badge variant="default">Faol</Badge>
                          ) : isExpired(discount.validUntil) ? (
                            <Badge variant="destructive">Muddati tugagan</Badge>
                          ) : (
                            <Badge variant="secondary">Nofaol</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(discount)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(discount.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Boshlanish:</span> {formatDate(discount.validFrom)}
                      </div>
                      <div>
                        <span className="font-medium">Tugash:</span> {formatDate(discount.validUntil)}
                      </div>
                      <div>
                        <span className="font-medium">Foydalanish:</span> {discount.usedCount}
                        {discount.maxUses > 0 && ` / ${discount.maxUses}`}
                      </div>
                      <div>
                        <span className="font-medium">Maqsad:</span>{' '}
                        {discount.targetType === 'all_products' ? 'Barcha mahsulotlar' : 
                         discount.targetType === 'specific_products' ? 'Tanlangan mahsulotlar' : 
                         'Tanlangan kategoriyalar'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDiscount ? 'Chegirmani tahrirlash' : 'Yangi chegirma yaratish'}
              </DialogTitle>
              <DialogDescription>
                Chegirma ma'lumotlarini to'ldiring
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chegirma kodi</FormLabel>
                      <FormControl>
                        <Input placeholder="YANGI10" {...field} style={{ textTransform: 'uppercase' }} />
                      </FormControl>
                      <FormDescription>
                        Foydalanuvchilar ushbu kodni kiritadilar
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Turi</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Turni tanlang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Foiz (%)</SelectItem>
                            <SelectItem value="fixed">Aniq summa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qiymati</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="10"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="validFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boshlanish sanasi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="validUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tugash sanasi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maksimal foydalanish soni</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0 = cheksiz"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        0 = cheksiz foydalanish
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qo'llanish doirasi</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all_products">Barcha mahsulotlar</SelectItem>
                          <SelectItem value="specific_products">Tanlangan mahsulotlar</SelectItem>
                          <SelectItem value="specific_categories">Tanlangan kategoriyalar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Faol holat</FormLabel>
                        <FormDescription>
                          Chegirma foydalanish uchun ochiq bo'ladimi?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Bekor qilish
                  </Button>
                  <Button type="submit" disabled={createOrUpdateMutation.isPending}>
                    {createOrUpdateMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}