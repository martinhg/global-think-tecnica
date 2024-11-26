import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJsdoc from 'swagger-jsdoc';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Documentation',
        description: 'Users API',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:3000', description: 'localhost' }],
    },
    apis: ['./docs/**/*.yaml'],
  };

  const swaggerSpec = swaggerJsdoc(options);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  await app.listen(process.env.PORT);
}
bootstrap();
