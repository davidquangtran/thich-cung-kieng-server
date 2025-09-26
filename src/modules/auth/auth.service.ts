import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { GoogleAuthService } from './google/services/google-auth.service';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt/interfaces/jwt-payload.interface';
import { Tokens } from './jwt/interfaces/token.interface';
import { JwtService } from './jwt/jwt.service';
import { User } from '../user/entities/user.entity';
import { GoogleLoginDto } from './google/dto/google-auth.dto';
import { MailService } from 'src/shared/mail/mail.service';
import { SubscriptionCheckService } from './services/subscription-check.service';
import { LoginWithSubscriptionResponse } from './interfaces/subscription-check.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly mailService: MailService,
    // private readonly emailQueueService: EmailQueueService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly subscriptionCheckService: SubscriptionCheckService,
  ) {}
  /**
   * Generate access and refresh tokens for the user
   * @param payload JWT payload containing user information
   * @returns Tokens object containing access and refresh tokens
   */
  private async getTokens(payload: JwtPayload): Promise<Tokens> {
    const accessToken = await this.jwtService.generateAccessToken(payload);
    const refreshToken = await this.jwtService.generateRefreshToken(payload);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Handle Google login and return JWT tokens
   * @param user Data from Google OAuth
   * @returns Tokens object containing access and refresh tokens
   */
  async googleLogin(user: any): Promise<LoginWithSubscriptionResponse> {
    const existingUser = await this.usersService.findOneByOptions({
      email: user.email,
    });
    let id = existingUser ? existingUser.id : null;

    // If the user does not exist, create a new user
    if (!existingUser) {
      const newUser = await this.usersService.create(
        new User({
          email: user.email,
          fullName: user.firstName + ' ' + user.lastName,
          profilePicture: user.picture,
        }),
      );
      id = newUser.id;

      this.mailService.sendWelcomeEmail({
        email: user.email,
        name: user.fullName,
      });
    }

    if (!id) {
      throw new BadRequestException('Failed to create or find user');
    }

    const payload = {
      sub: id,
      email: user.email,
      role: existingUser?.role || 'user',
    };
    const tokens = await this.getTokens(payload);

    // if the user exists, update the refresh token
    if (id) {
      this.usersService.updateField(id, 'refreshToken', tokens.refreshToken);
    }

    // Check user subscription on login
    let subscriptionInfo: any = null;
    try {
      subscriptionInfo =
        await this.subscriptionCheckService.checkUserSubscriptionOnLogin(id);
    } catch (error) {
      console.warn('Failed to check subscription on login:', error.message);
      // Don't fail login if subscription check fails
    }

    return {
      tokens,
      subscription: subscriptionInfo,
    };
  }

  /**
   * Refresh access and refresh tokens using the provided refresh token
   * @param refreshToken Refresh token from the user
   * @returns New access and refresh tokens
   */
  async refreshTokens(refreshToken: string): Promise<Tokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    // Get data from the refresh token
    const decoded = await this.jwtService.decodeToken(refreshToken);
    console.log('Decoded refresh token:', decoded);
    if (!decoded || !decoded.sub || !decoded.email) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.usersService.findOneByOptions({
      email: decoded.email,
    });

    if (!user || !user.refreshToken || refreshToken !== user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token or user');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const tokens = await this.getTokens(payload);
    return tokens;
  }

  /**
   * Logout user by invalidating the refresh token
   * @param refreshToken Refresh token to be invalidated
   * @returns True if logout is successful, throws UnauthorizedException otherwise
   */
  async logout(refreshToken: string): Promise<boolean> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    const decoded = await this.jwtService.decodeToken(refreshToken);
    console.log('Decoded refresh token:', decoded);
    if (!decoded || !decoded.sub || !decoded.email) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOneByOptions({
      email: decoded.email,
    });
    console.log('User found:', user);
    if (!user || !user.refreshToken || refreshToken !== user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token or user');
    }

    // Clear the user's refresh token
    this.usersService.updateField(user.id, 'refreshToken', null);
    return true;
  }

  /**
   * Handle Google login from mobile app using ID token verification
   * @param googleLoginDto Data from mobile Google OAuth
   * @returns JWT tokens for application authentication
   */
  async mobileGoogleLogin(googleLoginDto: GoogleLoginDto): Promise<Tokens> {
    // Step 1: Verify the Google ID token
    const googleUser = await this.googleAuthService.verifyGoogleToken(
      googleLoginDto.id_token,
    );

    if (!googleUser) {
      throw new BadRequestException('Invalid Google token');
    }

    // Step 2: Find or create user in our system
    const existingUser = await this.usersService.findOneByOptions({
      email: googleUser.email,
    });
    let id = existingUser ? existingUser.id : null;

    // Step 3: If the user does not exist, create a new user
    if (!existingUser) {
      const newUser = await this.usersService.create(
        new User({
          email: googleUser.email,
          fullName: googleUser.name || googleUser.email.split('@')[0],
          profilePicture: googleUser.picture,
        }),
      );
      id = newUser.id;

      // Send welcome email using queue
      this.mailService.sendWelcomeEmail({
        email: newUser.email,
        name: newUser.fullName || 'User',
      });
    }

    // Step 4: Generate tokens for our application
    if (!id) {
      throw new BadRequestException('Failed to create or find user');
    }

    const payload: JwtPayload = {
      sub: id,
      email: googleUser.email,
      role: existingUser?.role || 'user',
    };

    const tokens = await this.getTokens(payload);

    // Step 5: Update the refresh token in DB
    if (id) {
      await this.usersService.updateField(
        id,
        'refreshToken',
        tokens.refreshToken,
      );
    }

    // Step 6: Check user subscription on login
    let subscriptionInfo: any = null;
    try {
      subscriptionInfo =
        await this.subscriptionCheckService.checkUserSubscriptionOnLogin(id);
    } catch (error) {
      console.warn(
        'Failed to check subscription on mobile login:',
        error.message,
      );
      // Don't fail login if subscription check fails
    }

    return {
      ...tokens,
      subscription: subscriptionInfo,
    } as any;
  }
}
