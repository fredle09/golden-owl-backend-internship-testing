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

  app.enableCors({
    origin: (origin, callback) => {
      console.log('>> Origin:', origin);
      // Regular expression to match any origin starting with https://golden-owl
      const allowedRegex = /^(https:\/\/golden-owl-frontend-internship-testing.*)$/;

      // Check if the origin is either localhost:3000 or matches the regex for golden-owl
      if (typeof origin === "undefined" || origin === 'http://localhost:3000' || allowedRegex.test(origin)) {
        callback(null, true);  // Allow the request
      } else {
        callback(new Error('Not allowed by CORS'));  // Reject the request
      }
    },
    methods: 'GET,POST,PUT,DELETE',  // Allow specific HTTP methods (optional)
    allowedHeaders: 'Content-Type, Authorization',  // Allow specific headers (optional)
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
