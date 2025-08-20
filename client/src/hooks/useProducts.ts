import { useQuery } from "@tanstack/react-query";

export interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz?: string | null;
  descriptionRu?: string | null;
  categoryId: string;
  sellerId: string;
  price: string;
  wholesalePrice: string;
  minQuantity: number;
  stockQuantity: number;
  unit: string;
  images: string[] | null;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date | null;
}

export function useProducts(categoryId?: string, search?: string) {
  return useQuery({
    queryKey: ["/api/products", categoryId, search],
    queryFn: async (): Promise<Product[]> => {
      const params = new URLSearchParams();
      if (categoryId && categoryId !== 'all') params.set('categoryId', categoryId);
      if (search) params.set('search', search);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });
}