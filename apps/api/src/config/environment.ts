import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  NODE_ENV!: NodeEnvironment;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65_535)
  PORT!: number;

  @IsString()
  CORS_ORIGINS!: string;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  SWAGGER_ENABLED!: boolean;

  @IsString()
  DATABASE_URL!: string;
}

const defaults: Record<keyof EnvironmentVariables, unknown> = {
  NODE_ENV: NodeEnvironment.Development,
  PORT: 3333,
  CORS_ORIGINS: 'http://localhost:4200',
  SWAGGER_ENABLED: true,
  DATABASE_URL:
    'postgresql://gymflow:gymflow_dev@localhost:5433/gymflow?schema=public',
};

export function validateEnvironment(
  configuration: Record<string, unknown>,
): EnvironmentVariables {
  const environment = plainToInstance(
    EnvironmentVariables,
    { ...defaults, ...configuration },
    { enableImplicitConversion: false },
  );
  const errors = validateSync(environment, {
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    const messages = errors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );
    throw new Error(
      `Invalid environment configuration: ${messages.join('; ')}`,
    );
  }

  return environment;
}

export function parseCorsOrigins(value: string): string[] {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
