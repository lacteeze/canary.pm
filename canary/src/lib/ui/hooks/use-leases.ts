import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { Lease, NewLease } from '@server/db/schema/lease';

export const leaseKeys = {
  all: ['leases'] as const,
  detail: (id: string) => ['leases', id] as const,
};

export function leasesOptions() {
  return queryOptions({
    queryKey: leaseKeys.all,
    queryFn: () => api.get<Lease[]>('/leases'),
  });
}

export function leaseOptions(id: string) {
  return queryOptions({
    queryKey: leaseKeys.detail(id),
    queryFn: () => api.get<Lease>(`/leases/${id}`),
    enabled: !!id,
  });
}

export function useLeases() {
  return useQuery(leasesOptions());
}

export function useLease(id: string) {
  return useQuery(leaseOptions(id));
}

export function useCreateLease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewLease) => api.post<Lease>('/leases', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: leaseKeys.all }),
  });
}

export function useUpdateLease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Lease> & { id: string }) =>
      api.put<Lease>(`/leases/${id}`, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: leaseKeys.all });
      qc.invalidateQueries({ queryKey: leaseKeys.detail(variables.id) });
    },
  });
}

export function useDeleteLease() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/leases/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: leaseKeys.all }),
  });
}
