import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { GlobalResponseInterceptor } from './common/interceptors/global-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.enableCors({
    origin: config.get<string>('server.clientUrl') || 'http://localhost:3000',
    credentials: true,
  });
  app.useGlobalPipes();
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useLogger(
    config.get<string>('server.port') === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'],
  );
  app.setGlobalPrefix('api/v1');
  await app.listen(config.get<string>('server.port') || 3000);
}
bootstrap();
