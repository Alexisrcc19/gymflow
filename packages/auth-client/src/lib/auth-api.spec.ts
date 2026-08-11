import { afterEach, describe, expect, it, vi } from 'vitest';

import { AuthApi } from './auth-api';

describe('AuthApi', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('sends cookies and normalizes a trailing slash in the API URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: 'token',
          expiresIn: 900,
          user: { id: '1', gymId: '2', email: 'a@b.co', role: 'ADMIN' },
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await new AuthApi('http://localhost:3333/api/v1/').login(
      'a@b.co',
      'password',
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:3333/api/v1/auth/login',
      expect.objectContaining({ credentials: 'include', method: 'POST' }),
    );
  });

  it('returns a typed API error without exposing response internals', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Invalid email or password' }), {
          status: 401,
        }),
      ),
    );

    await expect(
      new AuthApi('http://localhost').login('a@b.co', 'password'),
    ).rejects.toEqual(
      expect.objectContaining({
        message: 'Invalid email or password',
        status: 401,
      }),
    );
  });
});
