import { useQuery } from "@tanstack/react-query";
import { api, type Product } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

export function useProducts() {
  return useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/products");
      return res.json() as Promise<Product[]>;
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [`/api/products/${id}`],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/products/${id}`);
      return res.json() as Promise<Product>;
    },
    enabled: !!id,
  });
}
