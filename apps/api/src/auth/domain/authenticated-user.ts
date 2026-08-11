import { UserRole } from '../../generated/prisma/enums';

export interface AuthenticatedUser {
  id: string;
  gymId: string;
  role: UserRole;
}

export interface AccessTokenPayload {
  sub: string;
  gymId: string;
  role: UserRole;
}
