import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';

export function useRelatedProducts(productId: string) {
  return useQuery<Product[]>({
    queryKey: ['related-products', productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}/related`);
      if (!response.ok) {
        throw new Error('Failed to fetch related products');
      }
      return response.json();
    },
    enabled: !!productId, // Only run if productId is provided
  });
}