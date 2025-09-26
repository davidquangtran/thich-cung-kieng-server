import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayOS, WebhookData } from '@payos/node';
import { CreatePaymentRequest } from './dto/payos-payment-request.dto';

@Injectable()
export class PayosService {
  private readonly logger = new Logger(PayosService.name);
  private readonly payosClient: any;

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('payos.clientId');
    const apiKey = this.configService.get<string>('payos.apiKey');
    const checksumKey = this.configService.get<string>('payos.checksumKey');

    if (!clientId || !apiKey || !checksumKey) {
      throw new Error('PayOS credentials are not configured properly');
    }

    this.payosClient = new PayOS({
      clientId,
      apiKey,
      checksumKey,
      timeout: 30000,
      maxRetries: 3,
      logLevel: 'info',
      logger: console,
    });

    this.logger.log('PayOS service initialized successfully');
  }
  /**
   * Create a payment link
   */
  async createPaymentLink(data: CreatePaymentRequest): Promise<any> {
    try {
      this.logger.log(`Creating payment link for order: ${data.orderCode}`);

      const paymentData = {
        orderCode: data.orderCode,
        amount: data.amount,
        description: data.description,
        returnUrl: data.returnUrl,
        cancelUrl: data.cancelUrl,
        ...(data.items && { items: data.items }),
        ...(data.buyerName && { buyerName: data.buyerName }),
        ...(data.buyerEmail && { buyerEmail: data.buyerEmail }),
        ...(data.buyerPhone && { buyerPhone: data.buyerPhone }),
        ...(data.buyerAddress && { buyerAddress: data.buyerAddress }),
        ...(data.expiredAt && { expiredAt: data.expiredAt }),
      };

      const result = await this.payosClient.createPaymentLink(paymentData);
      this.logger.log(
        `Payment link created successfully: ${result.checkoutUrl}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to create payment link: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Backward compatible method for existing code
   */
  async createPaymentLinkLegacy(
    orderCode: string | number,
    amount: number,
    description: string,
    returnUrl: string,
    cancelUrl: string,
    items?: Array<{ name: string; quantity: number; price: number }>,
  ) {
    const data: CreatePaymentRequest = {
      orderCode,
      amount,
      description,
      returnUrl,
      cancelUrl,
      items,
    };
    return this.createPaymentLink(data);
  }

  /**
   * Get payment information by orderCode
   */
  async getPaymentInfo(orderCode: string | number) {
    try {
      this.logger.log(`Getting payment info for order: ${orderCode}`);
      const result =
        await this.payosClient.getPaymentLinkInformation(orderCode);
      return result;
    } catch (error) {
      this.logger.error(`Failed to get payment info: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancel a payment link
   */
  async cancelLink(orderCode: string | number, reason?: string) {
    try {
      this.logger.log(`Cancelling payment link for order: ${orderCode}`);
      const result = await this.payosClient.cancelPaymentLink(
        orderCode,
        reason,
      );
      this.logger.log(`Payment link cancelled successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to cancel payment link: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify webhook signature and data
   */
  verifyWebhook(webhookData: WebhookData): boolean {
    try {
      const isValid = this.payosClient.verifyPaymentWebhookData(webhookData);
      this.logger.log(`Webhook verification result: ${isValid}`);
      return isValid;
    } catch (error) {
      this.logger.error(`Webhook verification failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Confirm webhook URL
   */
  async confirmWebhookUrl(url: string) {
    try {
      this.logger.log(`Confirming webhook URL: ${url}`);
      const result = await this.payosClient.confirmWebhook(url);
      this.logger.log(`Webhook URL confirmed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to confirm webhook URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get transaction information
   */
  async getTransactionInfo(transactionId: string) {
    try {
      this.logger.log(`Getting transaction info for ID: ${transactionId}`);
      const result =
        await this.payosClient.getPaymentLinkInformation(transactionId);
      return result;
    } catch (error) {
      this.logger.error(`Failed to get transaction info: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(
    orderCode: string | number,
  ): Promise<{ status: string; isPaid: boolean }> {
    try {
      const paymentInfo = await this.getPaymentInfo(orderCode);
      const isPaid = paymentInfo.status === 'PAID';

      this.logger.log(
        `Payment status for order ${orderCode}: ${paymentInfo.status}`,
      );

      return {
        status: paymentInfo.status,
        isPaid,
      };
    } catch (error) {
      this.logger.error(`Failed to check payment status: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate QR code for payment
   */
  async generateQRCode(orderCode: string | number): Promise<string> {
    try {
      const paymentInfo = await this.getPaymentInfo(orderCode);
      return paymentInfo.qrCode;
    } catch (error) {
      this.logger.error(`Failed to generate QR code: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate payment data before creating payment link
   */
  private validatePaymentData(data: CreatePaymentRequest): void {
    if (!data.orderCode) {
      throw new Error('Order code is required');
    }
    if (!data.amount || data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    if (!data.description) {
      throw new Error('Description is required');
    }
    if (!data.returnUrl) {
      throw new Error('Return URL is required');
    }
    if (!data.cancelUrl) {
      throw new Error('Cancel URL is required');
    }
  }

  /**
   * Create payment link with validation
   */
  async createValidatedPaymentLink(
    data: CreatePaymentRequest,
  ): Promise<PaymentResponse> {
    this.validatePaymentData(data);
    return this.createPaymentLink(data);
  }

  /**
   * Create payment for subscription
   */
  async createSubscriptionPayment(
    orderCode: string | number,
    planName: string,
    amount: number,
    userEmail: string,
    returnUrl: string,
    cancelUrl: string,
  ): Promise<any> {
    const paymentData: CreatePaymentRequest = {
      orderCode,
      amount,
      description: `Thanh toán gói đăng ký: ${planName}`,
      returnUrl,
      cancelUrl,
      buyerEmail: userEmail,
      items: [
        {
          name: planName,
          quantity: 1,
          price: amount,
        },
      ],
    };

    return this.createValidatedPaymentLink(paymentData);
  }

  /**
   * Handle webhook with proper error handling
   */
  async handleWebhook(
    webhookData: any,
  ): Promise<{ isValid: boolean; data?: WebhookData }> {
    try {
      const isValid = this.verifyWebhook(webhookData);

      if (!isValid) {
        this.logger.warn('Invalid webhook signature received');
        return { isValid: false };
      }

      this.logger.log(
        `Valid webhook received for order: ${webhookData.orderCode}`,
      );
      return {
        isValid: true,
        data: webhookData as WebhookData,
      };
    } catch (error) {
      this.logger.error(`Webhook handling failed: ${error.message}`);
      return { isValid: false };
    }
  }
}
