import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PayosService } from './payos.service';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../../modules/payment/payment.service';
import { PaymentLogService } from '../../modules/payment-log/payment-log.service';
import { UserSubscriptionService } from '../../modules/user-subscription/user-subscription.service';
import { SubscriptionPlanService } from '../../modules/subscription-plan/subscription-plan.service';
import { UserService } from '../../modules/user/user.service';
import { PaymentStatus } from '../../common/enums/payment.enum';
import { PaymentProvider } from '../../common/enums/payment-provider.enum';
import { UserSubscriptionStatus } from '../../common/enums/user-subscription.enum';

@Injectable()
export class PayosIntegrationService {
  private readonly logger = new Logger(PayosIntegrationService.name);

  constructor(
    private readonly payosService: PayosService,
    private readonly configService: ConfigService,
    private readonly paymentService: PaymentService,
    private readonly paymentLogService: PaymentLogService,
    private readonly userSubscriptionService: UserSubscriptionService,
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly userService: UserService,
  ) {}

  /**
   * Generate unique order code
   */
  private generateOrderCode(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Get default return and cancel URLs
   */
  private getDefaultUrls() {
    const baseUrl =
      this.configService.get<string>('server.clientUrl') ||
      'http://localhost:3000';
    return {
      returnUrl: `${baseUrl}/payment/success`,
      cancelUrl: `${baseUrl}/payment/cancel`,
    };
  }

  /**
   * Create subscription payment with business context
   */
  async createSubscriptionPayment(
    planId: string,
    userId: string,
    options: {
      returnUrl?: string;
      cancelUrl?: string;
    } = {},
  ) {
    try {
      // Get plan and user data from real services
      const plan = await this.subscriptionPlanService.findOne(planId);
      const user = await this.userService.findOne(userId);

      if (!plan) {
        throw new NotFoundException(
          `Subscription plan with ID ${planId} not found`,
        );
      }

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const orderCode = this.generateOrderCode('SUB');
      const urls =
        options.returnUrl && options.cancelUrl
          ? { returnUrl: options.returnUrl, cancelUrl: options.cancelUrl }
          : this.getDefaultUrls();

      this.logger.log(
        `Creating subscription payment for user: ${user.email}, plan: ${plan.name}`,
      );

      // Create UserSubscription first (PENDING status)
      const userSubscription = await this.userSubscriptionService.create({
        userId,
        subscriptionPlanId: planId,
        startDate: new Date(),
        endDate: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000),
        status: UserSubscriptionStatus.PENDING,
        autoRenew: false,
      });

      // Create Payment record
      const payment = await this.paymentService.create({
        userId,
        userSubscriptionId: userSubscription.id,
        totalAmount: plan.price,
        currency: 'VND',
        provider: PaymentProvider.PAYOS,
        transactionCode: orderCode.toString(),
        status: PaymentStatus.INITIATED,
      });

      // Create initial payment log
      await this.paymentLogService.create({
        paymentId: payment.id,
        oldStatus: PaymentStatus.PENDING,
        newStatus: PaymentStatus.INITIATED,
        description: `Payment initiated for subscription plan: ${plan.name}`,
      });

      // Create PayOS payment link
      const paymentResult = await this.payosService.createSubscriptionPayment(
        orderCode,
        plan.name,
        plan.price,
        user.email,
        urls.returnUrl,
        urls.cancelUrl,
      );

      return {
        orderCode,
        paymentId: payment.id,
        userSubscriptionId: userSubscription.id,
        paymentLink: paymentResult.checkoutUrl,
        qrCode: paymentResult.qrCode,
        planInfo: {
          id: plan.id,
          name: plan.name,
          price: plan.price,
          durationDays: plan.durationDays,
        },
        userInfo: {
          id: user.id,
          email: user.email,
        },
        paymentInfo: paymentResult,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create subscription payment: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Handle payment webhook with business logic
   */
  async handlePaymentWebhook(webhookData: any) {
    try {
      this.logger.log(
        `Processing payment webhook for order: ${webhookData.orderCode}`,
      );

      // Verify webhook signature
      const verification = await this.payosService.handleWebhook(webhookData);

      if (!verification.isValid) {
        this.logger.warn(
          `Invalid webhook signature for order: ${webhookData.orderCode}`,
        );
        return { success: false, message: 'Invalid webhook signature' };
      }

      const { data } = verification;

      if (!data) {
        this.logger.error('Webhook data is undefined');
        return { success: false, message: 'Invalid webhook data' };
      }

      // Determine payment type from order code
      const orderCode = data.orderCode.toString();

      if (orderCode.includes('SUB_')) {
        await this.handleSubscriptionPayment(data);
      } else {
        this.logger.warn(`Unknown payment type for order: ${orderCode}`);
      }

      // Update payment status in database
      // Example: await this.paymentLogService.updateByOrderCode(orderCode, {
      //   status: data.code === '00' ? 'PAID' : 'FAILED',
      //   paidAt: data.code === '00' ? new Date() : null,
      //   failureReason: data.code !== '00' ? data.desc : null,
      // });

      return { success: true, paymentType: 'SUBSCRIPTION', data };
    } catch (error) {
      this.logger.error(`Failed to handle payment webhook: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle successful subscription payment
   */
  private async handleSubscriptionPayment(webhookData: any) {
    try {
      const orderCode = webhookData.orderCode.toString();

      // Find payment by transaction code (order code)
      const payment = await this.paymentService.findOneByOptions({
        transactionCode: orderCode,
      });

      if (!payment) {
        this.logger.warn(`Payment not found for order code: ${orderCode}`);
        return;
      }

      if (webhookData.code === '00') {
        // Success
        this.logger.log(`Subscription payment successful: ${orderCode}`);

        // Update payment status to COMPLETED
        await this.paymentService.update(payment.id, {
          status: PaymentStatus.COMPLETED,
        });

        // Create payment log for completion
        await this.paymentLogService.create({
          paymentId: payment.id,
          oldStatus: PaymentStatus.INITIATED as any,
          newStatus: PaymentStatus.COMPLETED as any,
          description: `Payment completed successfully via PayOS. Reference: ${webhookData.reference}`,
        });

        // Activate user subscription
        await this.userSubscriptionService.update(payment.userSubscriptionId, {
          status: UserSubscriptionStatus.ACTIVE,
        });

        this.logger.log(
          `Subscription activated for user subscription ID: ${payment.userSubscriptionId}`,
        );

        // TODO: Send confirmation email
        // await this.mailService.sendSubscriptionConfirmation(userEmail);
      } else {
        this.logger.warn(
          `Subscription payment failed: ${orderCode} - ${webhookData.desc}`,
        );

        // Update payment status to FAILED
        await this.paymentService.update(payment.id, {
          status: PaymentStatus.FAILED,
        });

        // Create payment log for failure
        await this.paymentLogService.create({
          paymentId: payment.id,
          oldStatus: PaymentStatus.INITIATED as any,
          newStatus: PaymentStatus.FAILED as any,
          description: `Payment failed: ${webhookData.desc}`,
        });

        // Update user subscription to CANCELED
        await this.userSubscriptionService.update(payment.userSubscriptionId, {
          status: UserSubscriptionStatus.CANCELED,
        });
      }
    } catch (error) {
      this.logger.error(
        `Failed to handle subscription payment: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Check payment status and update business logic
   */
  async checkAndUpdatePaymentStatus(orderCode: string) {
    try {
      const status = await this.payosService.checkPaymentStatus(orderCode);

      if (status.isPaid) {
        // Get payment info for webhook simulation
        const paymentInfo = await this.payosService.getPaymentInfo(orderCode);

        // Simulate webhook data for manual status updates
        const webhookData = {
          orderCode: parseInt(orderCode.split('_')[1]) || orderCode,
          amount: paymentInfo.amount,
          description: paymentInfo.description,
          accountNumber: paymentInfo.accountNumber || '',
          reference: paymentInfo.reference || orderCode,
          transactionDateTime: new Date().toISOString(),
          currency: paymentInfo.currency || 'VND',
          paymentLinkId: paymentInfo.paymentLinkId || '',
          code: '00', // Success code
          desc: 'Payment completed successfully',
        };

        // Process as webhook
        await this.handlePaymentWebhook(webhookData);
      }

      return status;
    } catch (error) {
      this.logger.error(`Failed to check payment status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get detailed subscription payment information
   */
  async getSubscriptionPaymentDetails(paymentId: string) {
    try {
      // Get payment with relations
      const payment = await this.paymentService.findOneWithRelations(
        paymentId,
        [
          'userSubscription',
          'userSubscription.subscriptionPlan',
          'user',
          'paymentLogs',
        ],
      );

      if (!payment) {
        throw new NotFoundException(`Payment with ID ${paymentId} not found`);
      }

      return {
        payment: {
          id: payment.id,
          totalAmount: payment.totalAmount,
          currency: payment.currency,
          provider: payment.provider,
          transactionCode: payment.transactionCode,
          status: payment.status,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
        },
        subscription: payment.userSubscription
          ? {
              id: payment.userSubscription.id,
              startDate: payment.userSubscription.startDate,
              endDate: payment.userSubscription.endDate,
              status: payment.userSubscription.status,
              autoRenew: payment.userSubscription.autoRenew,
              plan: payment.userSubscription.subscriptionPlan
                ? {
                    id: payment.userSubscription.subscriptionPlan.id,
                    name: payment.userSubscription.subscriptionPlan.name,
                    description:
                      payment.userSubscription.subscriptionPlan.description,
                    price: payment.userSubscription.subscriptionPlan.price,
                    durationDays:
                      payment.userSubscription.subscriptionPlan.durationDays,
                  }
                : null,
            }
          : null,
        user: payment.user
          ? {
              id: payment.user.id,
              email: payment.user.email,
              // Add other safe user fields as needed
            }
          : null,
        paymentLogs:
          payment.paymentLogs?.map((log) => ({
            id: log.id,
            oldStatus: log.oldStatus,
            newStatus: log.newStatus,
            description: log.description,
            createdAt: log.createdAt,
          })) || [],
      };
    } catch (error) {
      this.logger.error(
        `Failed to get subscription payment details: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get user's subscription payments
   */
  async getUserSubscriptionPayments(userId: string) {
    try {
      // Get all payments for the user with PayOS provider
      const payments = await this.paymentService.findAll(
        { page: 1, limit: 100 }, // Basic filter
        ['userSubscription', 'userSubscription.subscriptionPlan'],
        [],
      );

      // Filter by userId and provider
      const userPayments =
        payments?.data?.filter(
          (payment) =>
            payment.userId === userId &&
            payment.provider === PaymentProvider.PAYOS,
        ) || [];

      return userPayments.map((payment) => ({
        id: payment.id,
        totalAmount: payment.totalAmount,
        currency: payment.currency,
        transactionCode: payment.transactionCode,
        status: payment.status,
        createdAt: payment.createdAt,
        subscription: payment.userSubscription
          ? {
              id: payment.userSubscription.id,
              startDate: payment.userSubscription.startDate,
              endDate: payment.userSubscription.endDate,
              status: payment.userSubscription.status,
              plan: payment.userSubscription.subscriptionPlan
                ? {
                    name: payment.userSubscription.subscriptionPlan.name,
                    price: payment.userSubscription.subscriptionPlan.price,
                    durationDays:
                      payment.userSubscription.subscriptionPlan.durationDays,
                  }
                : null,
            }
          : null,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get user subscription payments: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Cancel a pending payment
   */
  async cancelSubscriptionPayment(paymentId: string, reason?: string) {
    try {
      const payment = await this.paymentService.findOne(paymentId);

      if (!payment) {
        throw new NotFoundException(`Payment with ID ${paymentId} not found`);
      }

      if (payment.status !== PaymentStatus.PENDING) {
        throw new BadRequestException('Can only cancel pending payments');
      }

      // Try to cancel with PayOS if possible
      try {
        if (payment.transactionCode) {
          await this.payosService.cancelLink(
            parseInt(payment.transactionCode),
            reason,
          );
        }
      } catch (error) {
        this.logger.warn(
          `Failed to cancel PayOS payment link: ${error.message}`,
        );
        // Continue with local cancellation even if PayOS cancellation fails
      }

      // Update payment status
      const updatedPayment = await this.paymentService.update(paymentId, {
        status: PaymentStatus.CANCELLED as any,
      });

      // Log the cancellation
      await this.paymentLogService.create({
        paymentId,
        oldStatus: PaymentStatus.PENDING as any,
        newStatus: PaymentStatus.CANCELLED as any,
        description: reason || 'Payment cancelled by user',
      } as any);

      return updatedPayment;
    } catch (error) {
      this.logger.error(
        `Failed to cancel subscription payment: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Get payment statistics for a user
   */
  async getUserPaymentStats(userId: string) {
    try {
      const payments = await this.paymentService.findAll(
        { page: 1, limit: 100 },
        [],
        [],
      );

      const userPayments =
        payments?.data?.filter(
          (payment) =>
            payment.userId === userId &&
            payment.provider === PaymentProvider.PAYOS,
        ) || [];

      const stats = {
        totalPayments: userPayments.length,
        successfulPayments: userPayments.filter(
          (p) => p.status === PaymentStatus.COMPLETED,
        ).length,
        pendingPayments: userPayments.filter(
          (p) => p.status === PaymentStatus.PENDING,
        ).length,
        failedPayments: userPayments.filter(
          (p) => p.status === PaymentStatus.FAILED,
        ).length,
        cancelledPayments: userPayments.filter(
          (p) => p.status === PaymentStatus.CANCELLED,
        ).length,
        totalAmount: userPayments
          .filter((p) => p.status === PaymentStatus.COMPLETED)
          .reduce((sum, p) => sum + p.totalAmount, 0),
        lastPaymentDate:
          userPayments.length > 0
            ? Math.max(
                ...userPayments.map((p) => new Date(p.createdAt).getTime()),
              )
            : null,
      };

      return stats;
    } catch (error) {
      this.logger.error(`Failed to get user payment stats: ${error.message}`);
      throw error;
    }
  }
}
