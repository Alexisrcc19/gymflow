import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PasswordService } from '../../auth/password.service';
import type { AuthenticatedUser } from '../../auth/domain/authenticated-user';
import { Prisma, UserRole, UserStatus } from '../../generated/prisma/client';
import { AssignmentStatus, ProfileStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { formatMemberCode } from '../domain/member-code';
import type { CreateMemberDto } from '../presentation/dto/create-member.dto';
import type { ListMembersQueryDto } from '../presentation/dto/list-members-query.dto';
import type { UpdateMemberDto } from '../presentation/dto/update-member.dto';

const memberSelect = {
  id: true,
  memberCode: true,
  firstName: true,
  lastName: true,
  birthDate: true,
  phone: true,
  status: true,
  joinedAt: true,
  createdAt: true,
  updatedAt: true,
  deactivatedAt: true,
  user: { select: { email: true } },
} satisfies Prisma.MemberProfileSelect;

@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
  ) {}

  async create(actor: AuthenticatedUser, input: CreateMemberDto) {
    const passwordHash = await this.passwords.hash(input.password);

    try {
      return await this.prisma.$transaction(async (transaction) => {
        const sequence = await transaction.gymCodeSequence.upsert({
          where: { gymId: actor.gymId },
          create: {
            gymId: actor.gymId,
            nextMemberNumber: 2,
          },
          update: { nextMemberNumber: { increment: 1 } },
          select: { nextMemberNumber: true },
        });

        const user = await transaction.user.create({
          data: {
            gymId: actor.gymId,
            email: input.email,
            passwordHash,
            role: UserRole.MEMBER,
            status: UserStatus.ACTIVE,
          },
          select: { id: true },
        });

        return transaction.memberProfile.create({
          data: {
            gymId: actor.gymId,
            userId: user.id,
            memberCode: formatMemberCode(sequence.nextMemberNumber - 1),
            firstName: input.firstName,
            lastName: input.lastName,
            birthDate: input.birthDate ? dateOnly(input.birthDate) : undefined,
            phone: input.phone,
            joinedAt: dateOnly(input.joinedAt ?? currentDate()),
          },
          select: memberSelect,
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe una cuenta con ese correo');
      }
      throw error;
    }
  }

  async list(actor: AuthenticatedUser, query: ListMembersQueryDto) {
    const where: Prisma.MemberProfileWhereInput = {
      ...this.accessScope(actor),
      status: query.status,
      ...(query.search
        ? {
            OR: [
              { memberCode: { contains: query.search, mode: 'insensitive' } },
              { firstName: { contains: query.search, mode: 'insensitive' } },
              { lastName: { contains: query.search, mode: 'insensitive' } },
              {
                user: {
                  email: { contains: query.search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
    };
    const skip = (query.page - 1) * query.pageSize;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.memberProfile.findMany({
        where,
        select: memberSelect,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        skip,
        take: query.pageSize,
      }),
      this.prisma.memberProfile.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }

  async get(actor: AuthenticatedUser, id: string) {
    const member = await this.prisma.memberProfile.findFirst({
      where: { id, ...this.accessScope(actor) },
      select: memberSelect,
    });
    if (!member) throw new NotFoundException('Miembro no encontrado');
    return member;
  }

  async update(actor: AuthenticatedUser, id: string, input: UpdateMemberDto) {
    await this.get(actor, id);
    return this.prisma.memberProfile.update({
      where: { id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        birthDate: input.birthDate ? dateOnly(input.birthDate) : undefined,
        phone: input.phone,
      },
      select: memberSelect,
    });
  }

  async deactivate(actor: AuthenticatedUser, id: string) {
    await this.get(actor, id);
    const now = new Date();

    return this.prisma.$transaction(async (transaction) => {
      const profile = await transaction.memberProfile.findUniqueOrThrow({
        where: { id },
        select: { userId: true },
      });
      const member = await transaction.memberProfile.update({
        where: { id },
        data: { status: ProfileStatus.INACTIVE, deactivatedAt: now },
        select: memberSelect,
      });
      await transaction.user.update({
        where: { id: profile.userId },
        data: { status: UserStatus.INACTIVE, deactivatedAt: now },
      });
      return member;
    });
  }

  private accessScope(
    actor: AuthenticatedUser,
  ): Prisma.MemberProfileWhereInput {
    const gymScope = { gymId: actor.gymId };
    if (actor.role === UserRole.ADMIN) return gymScope;
    if (actor.role === UserRole.MEMBER)
      return { ...gymScope, userId: actor.id };

    return {
      ...gymScope,
      trainerAssignments: {
        some: {
          status: AssignmentStatus.ACTIVE,
          trainer: { userId: actor.id },
        },
      },
    };
  }
}

function dateOnly(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function currentDate(): string {
  return new Date().toISOString().slice(0, 10);
}
