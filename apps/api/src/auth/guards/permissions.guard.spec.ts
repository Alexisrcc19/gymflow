import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '../../generated/prisma/enums';
import { Permission } from '../domain/permission';
import { PermissionsGuard } from './permissions.guard';

describe('PermissionsGuard', () => {
  function contextFor(role: UserRole): ExecutionContext {
    return {
      getHandler: () => () => undefined,
      getClass: () => class TestController {},
      switchToHttp: () => ({
        getRequest: () => ({ user: { id: 'user-id', gymId: 'gym-id', role } }),
      }),
    } as unknown as ExecutionContext;
  }

  it('allows a role with the required permission', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Permission.MemberCreate]),
    } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);

    expect(guard.canActivate(contextFor(UserRole.ADMIN))).toBe(true);
  });

  it('rejects a role without the required permission', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Permission.MemberCreate]),
    } as unknown as Reflector;
    const guard = new PermissionsGuard(reflector);

    expect(() => guard.canActivate(contextFor(UserRole.MEMBER))).toThrow(
      ForbiddenException,
    );
  });
});
