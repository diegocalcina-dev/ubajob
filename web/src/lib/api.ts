const BASE = 'http://localhost:3001/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('ubajob-storage');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message ?? 'Erro na requisição');
  }

  return res.json();
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string; role: string }) =>
      request<{ access_token: string; user: { id: string; name: string; email: string; role: string } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { email: string; password: string }) =>
      request<{ access_token: string; user: { id: string; name: string; email: string; role: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  users: {
    me: () => request<any>('/users/me'),
  },

  jobs: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<any[]>(`/jobs${qs}`);
    },
    get: (id: string) => request<any>(`/jobs/${id}`),
    mine: () => request<any[]>('/jobs/my'),
    create: (data: any) => request<any>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
  },

  applications: {
    apply: (jobId: string, coverLetter?: string) =>
      request<any>('/applications', { method: 'POST', body: JSON.stringify({ jobId, coverLetter }) }),
    mine: () => request<any[]>('/applications/mine'),
    forJob: (jobId: string) => request<any[]>(`/applications/job/${jobId}`),
    updateStatus: (appId: string, status: string) =>
      request<any>(`/applications/${appId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
};
