import { PrismaService } from '../infrastructure/database/prisma.service';
import { DatabaseHealthIndicator } from './database.health-indicator';

describe('DatabaseHealthIndicator', () => {
  it('reports the database as available after a successful query', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    } as unknown as PrismaService;
    const indicator = new DatabaseHealthIndicator(prisma);

    await expect(indicator.check('database')).resolves.toEqual({
      database: { status: 'up' },
    });
  });
});
