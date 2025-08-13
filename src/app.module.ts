import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { FirebaseModule } from './shared/firebase/firebase.module';
import { RedisModule } from './shared/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './shared/mail/mail.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GlobalHttpExceptionFilter } from './common/filters/global-exception.filter';
import { GlobalAuthGuard } from './common/guards/global-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    FirebaseModule,
    RedisModule,
    AuthModule,
    MailModule,
    JwtModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
  ],
})
export class AppModule {}
