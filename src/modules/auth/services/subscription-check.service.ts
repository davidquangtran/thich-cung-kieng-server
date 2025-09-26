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

      // Get user's subscriptions with relations
      const subscriptions = await this.userSubscriptionService.findAll(
        { page: 1, limit: 10 },
        ['subscriptionPlan', 'payment'],
        [],
      );

      // Filter subscriptions for this user
      const userSubscriptions =
        subscriptions?.data?.filter((sub) => sub.userId === userId) || [];

      if (userSubscriptions.length === 0) {
        this.logger.log(`No subscriptions found for user: ${userId}`);
        return {
          hasActiveSubscription: false,
          subscriptionStatus: null,
          subscriptionDetails: null,
          message: 'No subscriptions found',
        };
      }

      // Check for active subscriptions
      const activeSubscriptions = userSubscriptions.filter(
        (sub) => sub.status === UserSubscriptionStatus.ACTIVE,
      );

      // Check for expired subscriptions that need to be updated
      const now = new Date();
      const expiredActiveSubscriptions = activeSubscriptions.filter(
        (sub) => new Date(sub.endDate) < now,
      );

      // Update expired subscriptions
      for (const expiredSub of expiredActiveSubscriptions) {
        this.logger.log(`Updating expired subscription: ${expiredSub.id}`);
        await this.userSubscriptionService.update(expiredSub.id, {
          status: UserSubscriptionStatus.EXPIRED as any,
        });
        expiredSub.status = UserSubscriptionStatus.EXPIRED;
      }

      // Get currently active subscriptions (not expired)
      const currentlyActive = activeSubscriptions.filter(
        (sub) => new Date(sub.endDate) >= now,
      );

      if (currentlyActive.length > 0) {
        // Sort by end date to get the latest subscription
        currentlyActive.sort(
          (a, b) =>
            new Date(b.endDate).getTime() - new Date(a.endDate).getTime(),
        );

        const latestSubscription = currentlyActive[0];

        this.logger.log(
          `Active subscription found for user ${userId}: ${latestSubscription.id}`,
        );

        return {
          hasActiveSubscription: true,
          subscriptionStatus: UserSubscriptionStatus.ACTIVE,
          subscriptionDetails: {
            id: latestSubscription.id,
            startDate: latestSubscription.startDate,
            endDate: latestSubscription.endDate,
            autoRenew: latestSubscription.autoRenew,
            plan: latestSubscription.subscriptionPlan
              ? {
                  id: latestSubscription.subscriptionPlan.id,
                  name: latestSubscription.subscriptionPlan.name,
                  price: latestSubscription.subscriptionPlan.price,
                  durationDays:
                    latestSubscription.subscriptionPlan.durationDays,
                }
              : null,
            daysRemaining: Math.ceil(
              (new Date(latestSubscription.endDate).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          },
          message: 'Active subscription found',
        };
      }

      // Check if user has any pending subscriptions
      const pendingSubscriptions = userSubscriptions.filter(
        (sub) => sub.status === UserSubscriptionStatus.PENDING,
      );

      if (pendingSubscriptions.length > 0) {
        const latestPending = pendingSubscriptions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];

        return {
          hasActiveSubscription: false,
          subscriptionStatus: UserSubscriptionStatus.PENDING,
          subscriptionDetails: {
            id: latestPending.id,
            status: latestPending.status,
            plan: latestPending.subscriptionPlan
              ? {
                  name: latestPending.subscriptionPlan.name,
                  price: latestPending.subscriptionPlan.price,
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
