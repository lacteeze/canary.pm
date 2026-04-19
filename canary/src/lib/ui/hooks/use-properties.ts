import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { Property, NewProperty } from '@server/db/schema/property';

export const propertyKeys = {
  all: ['properties'] as const,
  detail: (id: string) => ['properties', id] as const,
};

export function propertiesOptions() {
  return queryOptions({
    queryKey: propertyKeys.all,
    queryFn: () => api.get<Property[]>('/properties'),
  });
}

export function propertyOptions(id: string) {
  return queryOptions({
    queryKey: propertyKeys.detail(id),
    queryFn: () => api.get<Property>(`/properties/${id}`),
    enabled: !!id,
  });
}

export function useProperties() {
  return useQuery(propertiesOptions());
}

export function useProperty(id: string) {
  return useQuery(propertyOptions(id));
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewProperty) => api.post<Property>('/properties', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: propertyKeys.all }),
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Property> & { id: string }) =>
      api.put<Property>(`/properties/${id}`, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: propertyKeys.all });
      qc.invalidateQueries({ queryKey: propertyKeys.detail(variables.id) });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/properties/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: propertyKeys.all }),
  });
}
