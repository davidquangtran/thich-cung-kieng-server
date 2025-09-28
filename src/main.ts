import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin:
      configService.get<string>('server.clientUrl') || 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useLogger(
    configService.get<string>('server.port') === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  );
  app.setGlobalPrefix('api/v1');
  // Setup Swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('Thich Cung Kieng API')
    .setDescription(
      `
Welcome to the API documentation for the **Thich Cung Kieng**, built with **NestJS**.

This API powers various features and functionalities of the Thich Cung Kieng application.
---
`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  // Require BOTH headers when the guard is applied. In OpenAPI, putting both
  // schemes inside one security object means they are required together (AND).
  (document as any).security = [{ ApiKeyAuth: [], ApiSecretAuth: [] }];
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
  });
  await app.listen(configService.get<string>('server.port') || 3000);
}
bootstrap();
