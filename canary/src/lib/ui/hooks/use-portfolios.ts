import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { Portfolio, NewPortfolio } from '@server/db/schema/portfolio';

export const portfolioKeys = {
  all: ['portfolios'] as const,
  detail: (id: string) => ['portfolios', id] as const,
};

export function portfoliosOptions() {
  return queryOptions({
    queryKey: portfolioKeys.all,
    queryFn: () => api.get<Portfolio[]>('/portfolios'),
  });
}

export function portfolioOptions(id: string) {
  return queryOptions({
    queryKey: portfolioKeys.detail(id),
    queryFn: () => api.get<Portfolio>(`/portfolios/${id}`),
    enabled: !!id,
  });
}

export function usePortfolios() {
  return useQuery(portfoliosOptions());
}

export function usePortfolio(id: string) {
  return useQuery(portfolioOptions(id));
}

export function useCreatePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewPortfolio) => api.post<Portfolio>('/portfolios', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: portfolioKeys.all }),
  });
}

export function useUpdatePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Portfolio> & { id: string }) =>
      api.put<Portfolio>(`/portfolios/${id}`, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: portfolioKeys.all });
      qc.invalidateQueries({ queryKey: portfolioKeys.detail(variables.id) });
    },
  });
}

export function useDeletePortfolio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/portfolios/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: portfolioKeys.all }),
  });
}
