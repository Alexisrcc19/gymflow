import { UserRole } from '../../generated/prisma/enums';
import { Permission, ROLE_PERMISSIONS } from './permission';

describe('role permissions', () => {
  it('grants all declared permissions to administrators', () => {
    expect(ROLE_PERMISSIONS[UserRole.ADMIN]).toEqual(Object.values(Permission));
  });

  it('does not grant administrative permissions to members', () => {
    expect(ROLE_PERMISSIONS[UserRole.MEMBER]).not.toContain(
      Permission.MemberCreate,
    );
    expect(ROLE_PERMISSIONS[UserRole.MEMBER]).not.toContain(
      Permission.MembershipAssign,
    );
  });
});
