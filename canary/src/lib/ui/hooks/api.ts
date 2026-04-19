const BASE = '/api';

export class ApiError extends Error {
  status: number;
  why?: string;
  fix?: string;

  constructor(status: number, body: { message?: string; why?: string; fix?: string }) {
    super(body.message || `Request failed with status ${status}`);
    this.status = status;
    this.why = body.why;
    this.fix = body.fix;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string; why?: string; fix?: string };
    throw new ApiError(res.status, body);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get<T>(path: string): Promise<T> {
    return fetch(`${BASE}${path}`).then(r => handleResponse<T>(r));
  },

  post<T>(path: string, body: unknown): Promise<T> {
    return fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(r => handleResponse<T>(r));
  },

  put<T>(path: string, body: unknown): Promise<T> {
    return fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(r => handleResponse<T>(r));
  },

  delete(path: string): Promise<void> {
    return fetch(`${BASE}${path}`, { method: 'DELETE' }).then(r => handleResponse<void>(r));
  },
};
