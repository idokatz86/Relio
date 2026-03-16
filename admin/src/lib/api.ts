/**
 * Relio Admin Dashboard API Client
 * 
 * Connects to /api/v1/admin/* endpoints.
 * All data is Tier 3 only — no raw messages, no clinical profiles.
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io';

async function adminFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('relio_admin_token');
  const res = await fetch(`${API_BASE}/api/v1/admin${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (res.status === 401) throw new Error('Unauthorized');
  if (res.status === 403) throw new Error('Admin access required');
  if (!res.ok) throw new Error(`API error: ${res.status}`);

  return res.json();
}

export const api = {
  overview: () => adminFetch<any>('/stats/overview'),
  users: (page = 1, limit = 20, phase?: string) =>
    adminFetch<any>(`/users?page=${page}&limit=${limit}${phase ? `&phase=${phase}` : ''}`),
  couples: () => adminFetch<any>('/couples'),
  phases: () => adminFetch<any>('/phases'),
  subscriptions: () => adminFetch<any>('/subscriptions'),
  pipeline: () => adminFetch<any>('/pipeline'),
  safety: () => adminFetch<any>('/safety'),
  feedback: (page = 1, limit = 20, type?: string) =>
    adminFetch<any>(`/feedback?page=${page}&limit=${limit}${type ? `&type=${type}` : ''}`),
  health: () => adminFetch<any>('/health'),
  audit: () => adminFetch<any>('/audit'),
};
