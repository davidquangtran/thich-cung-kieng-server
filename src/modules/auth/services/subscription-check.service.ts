import { Injectable, Logger } from '@nestjs/common';
import { UserSubscriptionService } from '../../user-subscription/user-subscription.service';
import { UserSubscriptionStatus } from 'src/common/enums/user-subscription.enum';

@Injectable()
export class SubscriptionCheckService {
  private readonly logger = new Logger(SubscriptionCheckService.name);

  constructor(
    private readonly userSubscriptionService: UserSubscriptionService,
  ) {}

  /**
   * Check and update user subscription status on login
   * @param userId - The user ID to check subscription for
   * @returns Object containing subscription status and details
   */
  async checkUserSubscriptionOnLogin(userId: string) {
    try {
      this.logger.log(`Checking subscription for user: ${userId}`);

      // Get user's subscriptions directly by userId
      const userSubscriptions = await this.userSubscriptionService.findOne(
        userId,
        [
          'subscriptionPlan',
          'subscriptionPlan.planFeatures',
          'subscriptionPlan.planFeatures.subscriptionFeature',
        ],
      );
      if (!userSubscriptions) {
        this.logger.log(
          `No subscriptions found for user: ${userId}, returning basic subscription`,
        );
        return {
          hasActiveSubscription: false,
          subscriptionStatus: 'BASIC',
          subscriptionDetails: {
            type: 'basic',
            features: 'ACCESS_BASIC_RITUALS',
          },
          message: 'Basic subscription - no paid plans found',
        };
      }

      // Check for active subscriptions
      if (userSubscriptions.status === UserSubscriptionStatus.ACTIVE) {
        // Check for expired subscriptions that need to be updated
        const now = new Date();
        if (userSubscriptions.endDate < now) {
          this.logger.log(
            `Updating expired subscription: ${userSubscriptions.id}`,
          );
          await this.userSubscriptionService.update(userSubscriptions.id, {
            status: UserSubscriptionStatus.EXPIRED,
          });
          return {
            hasActiveSubscription: false,
            subscriptionStatus: UserSubscriptionStatus.EXPIRED,
            subscriptionDetails: null,
            message: 'No active subscription found',
          };
        }

        if (userSubscriptions.endDate >= now) {
          this.logger.log(
            `Subscription is still active: ${userSubscriptions.id}`,
          );
          return {
            hasActiveSubscription: true,
            subscriptionStatus: UserSubscriptionStatus.ACTIVE,
            subscriptionDetails: {
              id: userSubscriptions.id,
              startDate: userSubscriptions.startDate,
              endDate: userSubscriptions.endDate,
              plan: userSubscriptions.subscriptionPlan
                ? {
                    name: userSubscriptions.subscriptionPlan.name,
                    price: userSubscriptions.subscriptionPlan.price,
                  }
                : null,
              daysRemaining: Math.ceil(
                (userSubscriptions.endDate.getTime() - now.getTime()) /
                  (1000 * 60 * 60 * 24),
              ),
            },
            message: 'Active subscription found',
          };
        }
      }

      if (userSubscriptions.status === UserSubscriptionStatus.PENDING) {
        // Check if user has any pending subscriptions
        return {
          hasActiveSubscription: false,
          subscriptionStatus: UserSubscriptionStatus.PENDING,
          subscriptionDetails: {
            id: userSubscriptions.id,
            status: userSubscriptions.status,
            plan: userSubscriptions.subscriptionPlan
              ? {
                  name: userSubscriptions.subscriptionPlan.name,
                  price: userSubscriptions.subscriptionPlan.price,
                }
              : null,
          },
          message: 'Subscription payment pending',
        };
      }

      // User has only expired/canceled subscriptions
      return {
        hasActiveSubscription: false,
        subscriptionStatus: UserSubscriptionStatus.EXPIRED,
        subscriptionDetails: null,
        message: 'No active subscription found',
      };
    } catch (error) {
      this.logger.error(
        `Error checking subscription for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get subscription summary for user
   * @param userId - The user ID
   * @returns Subscription summary
   */
  async getUserSubscriptionSummary(userId: string) {
    try {
      const result = await this.checkUserSubscriptionOnLogin(userId);

      return {
        ...result,
        checkTimestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Error getting subscription summary for user ${userId}: ${error.message}`,
      );
      throw error;
    }
  }
}
