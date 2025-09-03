import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const postgresConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('postgres.host'),
  port: Number(configService.get<number>('postgres.port')),
  username: configService.get<string>('postgres.username'),
  password: configService.get<string>('postgres.password'),
  database: configService.get<string>('postgres.name'),
  entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
  logger: 'advanced-console',
});
