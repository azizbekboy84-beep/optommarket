import { useQuery } from "@tanstack/react-query";

export interface Category {
  id: string;
  nameUz: string;
  nameRu: string;
  descriptionUz?: string | null;
  descriptionRu?: string | null;
  image?: string | null;
  slug: string;
  parentId?: string | null;
  isActive: boolean;
  children: Category[];
}

export function useCategories() {
  return useQuery({
    queryKey: ["/api/categories"],
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
  });
}