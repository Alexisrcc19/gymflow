import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'argon2';

import {
  PrismaClient,
  UserRole,
  UserStatus,
} from '../src/generated/prisma/client';

const databaseUrl = requiredEnvironmentValue('DATABASE_URL');
const adminEmail = requiredEnvironmentValue('SEED_ADMIN_EMAIL')
  .trim()
  .toLowerCase();
const adminPassword = requiredEnvironmentValue('SEED_ADMIN_PASSWORD');

if (adminPassword.length < 12) {
  throw new Error('SEED_ADMIN_PASSWORD must contain at least 12 characters');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function seed(): Promise<void> {
  const passwordHash = await hash(adminPassword);

  await prisma.$transaction(async (transaction) => {
    const gym = await transaction.gym.upsert({
      where: { slug: 'gymflow-demo' },
      create: {
        name: 'GymFlow Demo',
        slug: 'gymflow-demo',
        timezone: 'America/Guayaquil',
        currency: 'USD',
        codeSequence: { create: {} },
      },
      update: {
        name: 'GymFlow Demo',
        timezone: 'America/Guayaquil',
        currency: 'USD',
      },
      select: { id: true },
    });

    await transaction.gymCodeSequence.upsert({
      where: { gymId: gym.id },
      create: { gymId: gym.id },
      update: {},
    });

    await transaction.user.upsert({
      where: { email: adminEmail },
      create: {
        gymId: gym.id,
        email: adminEmail,
        passwordHash,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      update: {
        gymId: gym.id,
        passwordHash,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
        deactivatedAt: null,
      },
    });
  });

  console.info(`Seeded GymFlow demo access for ${adminEmail}`);
}

function requiredEnvironmentValue(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

seed()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : 'Seed failed');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
