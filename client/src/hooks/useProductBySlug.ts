import { useQuery } from "@tanstack/react-query";
import { Product } from "./useProducts";

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ["/api/products", slug],
    queryFn: async (): Promise<Product> => {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Mahsulot topilmadi");
        }
        throw new Error("Mahsulot ma'lumotlarini yuklashda xatolik");
      }
      return response.json();
    },
    enabled: !!slug, // Only run query if slug exists
  });
}