import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { NewPerson } from '@server/db/schema/person';

/** Person with joined user fields from the API */
export type PersonWithUser = {
  id: string;
  userId: string | null;
  phone: string | null;
  role: 'owner' | 'tenant' | 'vendor' | 'manager';
  since: number | null;
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
  email: string | null;
  image: string | null;
};

export const personKeys = {
  all: ['people'] as const,
  byRole: (role: string) => ['people', { role }] as const,
  detail: (id: string) => ['people', id] as const,
};

export function peopleOptions(role?: string) {
  const path = role ? `/people?role=${role}` : '/people';
  return queryOptions({
    queryKey: role ? personKeys.byRole(role) : personKeys.all,
    queryFn: () => api.get<PersonWithUser[]>(path),
  });
}

export function personOptions(id: string) {
  return queryOptions({
    queryKey: personKeys.detail(id),
    queryFn: () => api.get<PersonWithUser>(`/people/${id}`),
    enabled: !!id,
  });
}

export function usePeople(role?: string) {
  return useQuery(peopleOptions(role));
}

export function usePerson(id: string) {
  return useQuery(personOptions(id));
}

export function useCreatePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewPerson) => api.post<PersonWithUser>('/people', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: personKeys.all }),
  });
}

export function useUpdatePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<PersonWithUser> & { id: string }) =>
      api.put<PersonWithUser>(`/people/${id}`, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: personKeys.all });
      qc.invalidateQueries({ queryKey: personKeys.detail(variables.id) });
    },
  });
}

export function useDeletePerson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/people/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: personKeys.all }),
  });
}
