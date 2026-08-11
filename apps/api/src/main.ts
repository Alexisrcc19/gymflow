import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { EnvironmentVariables, parseCorsOrigins } from './config/environment';
import { setupOpenApi } from './infrastructure/openapi/setup-openapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = app.get(ConfigService<EnvironmentVariables, true>);
  const port = config.get('PORT', { infer: true });
  const swaggerEnabled = config.get('SWAGGER_ENABLED', { infer: true });

  app.use(helmet());
  app.enableCors({
    credentials: true,
    origin: parseCorsOrigins(config.get('CORS_ORIGINS', { infer: true })),
  });
  app.enableShutdownHooks();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  if (swaggerEnabled) setupOpenApi(app);

  await app.listen(port, '0.0.0.0');
  Logger.log(`GymFlow API listening on port ${port}`, 'Bootstrap');
}

void bootstrap();
