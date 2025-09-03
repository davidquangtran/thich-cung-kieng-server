import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from './jwt/jwt.module';
import { UserModule } from '../user/user.module';
import { GoogleStrategy } from './google/strategies/google.strategy';
import { GoogleAuthService } from './google/services/google-auth.service';

@Module({
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, GoogleAuthService, AuthService],
  exports: [AuthService, GoogleAuthService],
})
export class AuthModule {}
