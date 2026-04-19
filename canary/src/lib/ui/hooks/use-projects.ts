import { queryOptions, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import type { Project, NewProject } from '@server/db/schema/project';

export const projectKeys = {
  all: ['projects'] as const,
  detail: (id: string) => ['projects', id] as const,
};

export function projectsOptions() {
  return queryOptions({
    queryKey: projectKeys.all,
    queryFn: () => api.get<Project[]>('/projects'),
  });
}

export function projectOptions(id: string) {
  return queryOptions({
    queryKey: projectKeys.detail(id),
    queryFn: () => api.get<Project>(`/projects/${id}`),
    enabled: !!id,
  });
}

export function useProjects() {
  return useQuery(projectsOptions());
}

export function useProject(id: string) {
  return useQuery(projectOptions(id));
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: NewProject) => api.post<Project>('/projects', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Project> & { id: string }) =>
      api.put<Project>(`/projects/${id}`, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: projectKeys.all });
      qc.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}
