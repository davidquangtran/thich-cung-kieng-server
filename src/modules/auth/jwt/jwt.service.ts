import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: any): Promise<string> {
    return this.nestJwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret') || 'defaultSecret',
      expiresIn: this.configService.get<string>('jwt.expiresIn') || '1d',
    });
  }

  async generateRefreshToken(payload: any): Promise<string> {
    return this.nestJwtService.sign(payload, {
      secret:
        this.configService.get<string>('jwt.refreshSecret') ||
        'defaultRefreshSecret',
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
    });
  }

  async verifyToken(token: string, options?: any): Promise<any> {
    try {
      return this.nestJwtService.verify(token, options);
    } catch (error) {
      throw new Error(error.message || 'Invalid token');
    }
  }

  async decodeToken(token: string): Promise<any> {
    return this.nestJwtService.decode(token);
  }
}
