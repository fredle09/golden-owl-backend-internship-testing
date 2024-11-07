import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable versioning globally
  app.enableVersioning({
    type: VersioningType.URI, // We are using URI versioning like /api/v1
    defaultVersion: '1',       // Default to version 1
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
