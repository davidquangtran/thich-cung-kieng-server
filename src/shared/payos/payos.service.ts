import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PayOS, WebhookData } from '@payos/node';
import { CreatePaymentRequest } from './dto/payos-payment-request.dto';

@Injectable()
export class PayosService {
  private readonly logger = new Logger(PayosService.name);
  private readonly payos: any;

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.get<string>('payos.clientId');
    const apiKey = this.configService.get<string>('payos.apiKey');
    const checksumKey = this.configService.get<string>('payos.checksumKey');

    this.payos = new PayOS({
      clientId,
      apiKey,
      checksumKey,
      timeout: 30000,
      maxRetries: 3,
      logLevel: 'info',
      logger: console,
    });
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

      const result = await this.payos.paymentRequests.create(paymentData);
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
   * Get payment information by orderCode
   */
  async getPaymentInfo(orderCode: string | number) {
    try {
      this.logger.log(`Getting payment info for order: ${orderCode}`);
      const result =
        await this.payos.getPaymentLinkInformation(orderCode);
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
      const result = await this.payos.cancelPaymentLink(
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
      const isValid = this.payos.webhooks.verify(webhookData);
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
      const result = await this.payos.webhooks.confirm(url);
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
        await this.payos.getPaymentLinkInformation(transactionId);
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
    
    const amount = Number(data.amount);
    if (!data.amount || isNaN(amount) || amount < 0.01 || amount > 10000000000) {
      throw new Error('Amount must be between 0.01 and 10,000,000,000');
    }
    
    if (!data.description) {
      throw new Error('Description is required');
    }
    
    if (data.description.length > 25) {
      throw new Error('Description must be max 25 characters');
    }
    
    if (!data.returnUrl) {
      throw new Error('Return URL is required');
    }
    
    if (!data.cancelUrl) {
      throw new Error('Cancel URL is required');
    }

    // Validate items if provided
    if (data.items && data.items.length > 0) {
      for (const item of data.items) {
        const itemPrice = Number(item.price);
        if (isNaN(itemPrice) || itemPrice <= 0 || itemPrice > 10000000000) {
          throw new Error(`Item "${item.name}" price must be between 0.01 and 10,000,000,000`);
        }
        
        const quantity = Number(item.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          throw new Error(`Item "${item.name}" quantity must be greater than 0`);
        }
      }
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
    orderCode: number,
    planName: string,
    amount: number,
    userEmail: string,
    returnUrl: string,
    cancelUrl: string,
  ): Promise<any> {
    // Create short description (max 25 chars)
    const shortDescription = planName.length > 20 
      ? `Gói ${planName.substring(0, 20)}` 
      : `Gói ${planName}`;

    const paymentData: CreatePaymentRequest = {
      orderCode,
      amount: Number(amount),
      description: shortDescription,
      returnUrl,
      cancelUrl,
      buyerEmail: userEmail,
      items: [
        {
          name: planName.length > 50 ? planName.substring(0, 50) : planName, // Limit item name too
          quantity: Number(1),
          price: Number(amount),
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
