import { GlobalResponseInterceptor } from './common/interceptors/global-response.interceptor';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { FirebaseModule } from './shared/firebase/firebase.module';
import { RedisModule } from './shared/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './shared/mail/mail.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { GlobalAuthGuard } from './common/guards/global-auth.guard';
import { UserModule } from './modules/user/user.module';
import { PerformanceInterceptor } from './common/interceptors/performance.interceptor';
import { JwtModule } from './modules/auth/jwt/jwt.module';

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
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: GlobalAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
})
export class AppModule { }
