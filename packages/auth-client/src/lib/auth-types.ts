export type UserRole = 'ADMIN' | 'TRAINER' | 'MEMBER';

export interface AuthUser {
  id: string;
  gymId: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
