import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

import { PrismaService } from '../infrastructure/database/prisma.service';

@Injectable()
export class DatabaseHealthIndicator {
  constructor(private readonly prisma: PrismaService) {}

  async check(key: string): Promise<HealthIndicatorResult> {
    await this.prisma.$queryRaw`SELECT 1`;

    return { [key]: { status: 'up' } };
  }
}
