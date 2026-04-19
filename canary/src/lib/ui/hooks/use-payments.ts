import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { Payment, NewPayment } from '@server/db/schema/payment';

export const paymentKeys = {
  all: ['payments'] as const,
  detail: (id: string) => ['payments', id] as const,
};

export function paymentsOptions() {
  return queryOptions({
    queryKey: paymentKeys.all,
    queryFn: () => api.get<Payment[]>('/payments'),
  });
}

export function paymentOptions(id: string) {
  return queryOptions({
    queryKey: paymentKeys.detail(id),
    queryFn: () => api.get<Payment>(`/payments/${id}`),
    enabled: !!id,
  });
}

export function usePayments() {
  return useQuery(paymentsOptions());
}

export function usePayment(id: string) {
  return useQuery(paymentOptions(id));
}

export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewPayment) => api.post<Payment>('/payments', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.all }),
  });
}

export function useUpdatePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Payment> & { id: string }) =>
      api.put<Payment>(`/payments/${id}`, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: paymentKeys.all });
      qc.invalidateQueries({ queryKey: paymentKeys.detail(variables.id) });
    },
  });
}

export function useDeletePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/payments/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.all }),
  });
}
