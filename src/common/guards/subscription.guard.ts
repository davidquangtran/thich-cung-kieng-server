import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SubscriptionCheckService } from 'src/modules/auth/services/subscription-check.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  private readonly logger = new Logger(SubscriptionGuard.name);

  constructor(
    private readonly checkSubscriptionService: SubscriptionCheckService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('No user found in request');
      return false;
    }

    try {
      const subscriptionResult =
        await this.checkSubscriptionService.checkUserSubscriptionOnLogin(
          user.id,
        );

      // Check if user has active subscription
      if (subscriptionResult.hasActiveSubscription) {
        this.logger.log(
          `User ${user.id} has active subscription - access granted`,
        );
        // Attach subscription info to request for use in controllers
        request.subscription = subscriptionResult;
        return true;
      } else {
        this.logger.warn(
          `User ${user.id} does not have active subscription - access denied`,
        );
        this.logger.warn(
          `Subscription status: ${subscriptionResult.subscriptionStatus}`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error(
        `Error checking subscription for user ${user.id}: ${error.message}`,
      );
      return false;
    }
  }
}
