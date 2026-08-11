import { Test } from '@nestjs/testing';
import { HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { DatabaseHealthIndicator } from './database.health-indicator';

describe('HealthController', () => {
  it('delegates process checks to Terminus', async () => {
    const result = {
      status: 'ok' as const,
      info: { memory_heap: { status: 'up' as const } },
      error: {},
      details: { memory_heap: { status: 'up' as const } },
    };
    const health = { check: jest.fn().mockResolvedValue(result) };
    const memory = { checkHeap: jest.fn() };
    const database = { check: jest.fn() };
    const module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: health },
        { provide: MemoryHealthIndicator, useValue: memory },
        { provide: DatabaseHealthIndicator, useValue: database },
      ],
    }).compile();

    await expect(module.get(HealthController).check()).resolves.toEqual(result);
    expect(health.check).toHaveBeenCalledTimes(1);
  });
});
