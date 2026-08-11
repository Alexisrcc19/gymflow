import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupOpenApi(app: INestApplication): void {
  const configuration = new DocumentBuilder()
    .setTitle('GymFlow API')
    .setDescription('API for GymFlow gym management operations.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, configuration);

  SwaggerModule.setup('docs', app, documentFactory, {
    customSiteTitle: 'GymFlow API Documentation',
    jsonDocumentUrl: 'docs/openapi.json',
  });
}
