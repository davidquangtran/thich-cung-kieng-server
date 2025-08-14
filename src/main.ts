import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalHttpExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useLogger(
    config.get<string>('server.port') === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  );
  app.setGlobalPrefix('api/v1');
  await app.listen(config.get<string>('server.port') || 3000);
}
bootstrap();
