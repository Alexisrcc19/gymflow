import { UserRole } from '../../generated/prisma/enums';

export enum Permission {
  DashboardRead = 'dashboard:read',
  MemberCreate = 'member:create',
  MemberRead = 'member:read',
  MemberUpdate = 'member:update',
  MemberDeactivate = 'member:deactivate',
  TrainerManage = 'trainer:manage',
  MembershipPlanManage = 'membership-plan:manage',
  MembershipAssign = 'membership:assign',
  MembershipRead = 'membership:read',
  AttendanceCreate = 'attendance:create',
  AttendanceRead = 'attendance:read',
  ExerciseRead = 'exercise:read',
  ExerciseManage = 'exercise:manage',
  RoutineCreate = 'routine:create',
  RoutineUpdate = 'routine:update',
  RoutineAssign = 'routine:assign',
  RoutineRead = 'routine:read',
  ProgressCreate = 'progress:create',
}

export const ROLE_PERMISSIONS: Readonly<
  Record<UserRole, readonly Permission[]>
> = {
  [UserRole.ADMIN]: Object.values(Permission),
  [UserRole.TRAINER]: [
    Permission.DashboardRead,
    Permission.MemberRead,
    Permission.MemberUpdate,
    Permission.MembershipRead,
    Permission.AttendanceCreate,
    Permission.AttendanceRead,
    Permission.ExerciseRead,
    Permission.RoutineCreate,
    Permission.RoutineUpdate,
    Permission.RoutineAssign,
    Permission.RoutineRead,
    Permission.ProgressCreate,
  ],
  [UserRole.MEMBER]: [
    Permission.MemberRead,
    Permission.MemberUpdate,
    Permission.MembershipRead,
    Permission.AttendanceRead,
    Permission.ExerciseRead,
    Permission.RoutineRead,
    Permission.ProgressCreate,
  ],
};
