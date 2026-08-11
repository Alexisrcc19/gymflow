import type { AuthResponse, AuthUser } from './auth-types';

export class AuthApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

export class AuthApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      body: JSON.stringify({ email, password }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    });
  }

  refresh(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/refresh', { method: 'POST' });
  }

  async logout(): Promise<void> {
    await this.request<void>('/auth/logout', { method: 'POST' });
  }

  me(accessToken: string): Promise<AuthUser> {
    return this.request<AuthUser>('/auth/me', {
      headers: { authorization: `Bearer ${accessToken}` },
    });
  }

  fetch(
    path: string,
    accessToken: string,
    init: RequestInit = {},
  ): Promise<Response> {
    const headers = new Headers(init.headers);
    headers.set('authorization', `Bearer ${accessToken}`);

    return fetch(`${this.baseUrl}${path}`, {
      ...init,
      credentials: 'include',
      headers,
    });
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new AuthApiError(await errorMessage(response), response.status);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join('. ');
    if (body.message) return body.message;
  } catch {
    // The API may return an empty or non-JSON error response.
  }

  return 'No se pudo completar la solicitud';
}
