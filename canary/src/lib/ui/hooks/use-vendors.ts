import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { Vendor, NewVendor } from '@server/db/schema/vendor';

export const vendorKeys = {
  all: ['vendors'] as const,
  detail: (id: string) => ['vendors', id] as const,
};

export function vendorsOptions() {
  return queryOptions({
    queryKey: vendorKeys.all,
    queryFn: () => api.get<Vendor[]>('/vendors'),
  });
}

export function vendorOptions(id: string) {
  return queryOptions({
    queryKey: vendorKeys.detail(id),
    queryFn: () => api.get<Vendor>(`/vendors/${id}`),
    enabled: !!id,
  });
}

export function useVendors() {
  return useQuery(vendorsOptions());
}

export function useVendor(id: string) {
  return useQuery(vendorOptions(id));
}

export function useCreateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewVendor) => api.post<Vendor>('/vendors', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: vendorKeys.all }),
  });
}

export function useUpdateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Vendor> & { id: string }) =>
      api.put<Vendor>(`/vendors/${id}`, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: vendorKeys.all });
      qc.invalidateQueries({ queryKey: vendorKeys.detail(variables.id) });
    },
  });
}

export function useDeleteVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/vendors/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: vendorKeys.all }),
  });
}
