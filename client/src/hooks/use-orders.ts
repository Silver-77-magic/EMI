import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type Order, type InsertOrderItem } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";

type CreateOrderInput = {
  items: Omit<InsertOrderItem, "orderId">[];
  totalAmount: number;
};

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOrderInput) => {
      const res = await apiRequest("POST", "/api/orders", data);
      return res.json() as Promise<Order>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/orders");
      return res.json() as Promise<Order[]>;
    },
  });
}
