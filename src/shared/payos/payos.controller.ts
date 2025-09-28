import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PayosService } from './payos.service';
import {
  CreateSubscriptionPaymentDto,
} from './dto/payos.dto';
import { GlobalAuthGuard } from '../../common/guards/global-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { PayosIntegrationService } from './payos-integration.service';
import type { Webhook, WebhookData } from '@payos/node';

@ApiTags('PayOS - Subscription Payment')
@Controller('payos')
@Public()
export class PayosController {
  private readonly logger = new Logger(PayosController.name);

  constructor(
    private readonly payosService: PayosService,
    private readonly payosIntegrationService: PayosIntegrationService,
  ) {}

  @Post('subscription-payment')
  @UseGuards(GlobalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo thanh toán cho gói đăng ký' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Tạo link thanh toán gói đăng ký thành công',
  })
  async createSubscriptionPayment(@Body() dto: CreateSubscriptionPaymentDto) {
    try {
      const result =
        await this.payosIntegrationService.createSubscriptionPayment(
          dto.planId,
          dto.userId,
          {
            returnUrl: dto.returnUrl,
            cancelUrl: dto.cancelUrl,
          },
        );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to create subscription payment: ${error.message}`,
      );
      throw error;
    }
  }

  @Get('subscription/:orderCode/status')
  @UseGuards(GlobalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kiểm tra trạng thái thanh toán subscription' })
  @ApiParam({ name: 'orderCode', description: 'Mã đơn hàng subscription' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Kiểm tra trạng thái thành công',
  })
  async checkSubscriptionPaymentStatus(@Param('orderCode') orderCode: number) {
    try {
      const result =
        await this.payosIntegrationService.checkAndUpdatePaymentStatus(
          orderCode,
        );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to check subscription payment status: ${error.message}`,
      );
      throw error;
    }
  }

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'Handle PayOS webhook' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Webhook processed successfully',
  })
  async handleWebhook(
    @Body() webhookData: any,
    @Headers() headers: any
  ) {
    try {
      // Log webhook data for debugging
      this.logger.debug('Webhook received:', {
        data: webhookData,
        hasData: !!webhookData,
        userAgent: headers['user-agent'],
      });

      // Check if this is a test request (empty body from Swagger/Postman)
      if (!webhookData || Object.keys(webhookData).length === 0) {
        this.logger.warn('Empty webhook data received - likely a test request');
        return {
          success: true,
          message: 'Webhook endpoint is working. Awaiting real PayOS webhook data.',
          note: 'This appears to be a test request. Real PayOS webhooks will contain payment data.',
        };
      }

      // PayOS webhook has nested structure - extract the actual data
      const actualData = webhookData.data || webhookData;
      const orderCode = actualData.orderCode || webhookData.orderCode;
      const paymentCode = actualData.code || webhookData.code;

      // Validate required PayOS webhook fields
      if (!orderCode && !paymentCode) {
        this.logger.error('Invalid PayOS webhook format - missing required fields');
        return {
          success: false,
          message: 'Invalid webhook format - missing required PayOS fields',
        };
      }

      // Extract signature from headers or webhook body
      const signature = headers['x-payos-signature'] || 
                       headers['payos-signature'] || 
                       headers['signature'] ||
                       webhookData.signature;

      // For development, log the webhook structure
      this.logger.debug('PayOS webhook fields:', {
        orderCode: orderCode,
        code: paymentCode,
        amount: actualData.amount,
        hasSignature: !!signature,
        webhookStructure: {
          hasTopLevelData: !!webhookData.data,
          topLevelFields: Object.keys(webhookData),
          nestedFields: webhookData.data ? Object.keys(webhookData.data) : []
        }
      });

      // Verify webhook first
      const isValid = await this.payosService.verifyWebhook(webhookData, signature);
      
      if (!isValid) {
        this.logger.warn('Invalid webhook signature received');
        return {
          success: false,
          message: 'Invalid webhook signature',
        };
      }

      // Process webhook through integration service
      // Pass the actual payment data (nested structure)
      const actualPaymentData = webhookData.data || webhookData;
      const result = await this.payosIntegrationService.handlePaymentWebhook(actualPaymentData);

      return {
        success: true,
        message: 'Webhook processed successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Failed to process webhook: ${error.message}`);
      return {
        success: false,
        message: 'Webhook processing failed',
        error: error.message,
      };
    }
  }

  @Get('subscription/:paymentId/details')
  @UseGuards(GlobalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy chi tiết thanh toán subscription' })
  @ApiParam({ name: 'paymentId', description: 'ID thanh toán' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy chi tiết thanh toán thành công',
  })
  async getSubscriptionPaymentDetails(@Param('paymentId') paymentId: string) {
    try {
      const result =
        await this.payosIntegrationService.getSubscriptionPaymentDetails(
          paymentId,
        );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to get subscription payment details: ${error.message}`,
      );
      throw error;
    }
  }

  @Get('user/:userId/subscription-payments')
  @UseGuards(GlobalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách thanh toán subscription của user' })
  @ApiParam({ name: 'userId', description: 'ID người dùng' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách thanh toán thành công',
  })
  async getUserSubscriptionPayments(@Param('userId') userId: string) {
    try {
      const result =
        await this.payosIntegrationService.getUserSubscriptionPayments(userId);

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to get user subscription payments: ${error.message}`,
      );
      throw error;
    }
  }

  @Post('subscription/:paymentId/cancel')
  @UseGuards(GlobalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hủy thanh toán subscription' })
  @ApiParam({ name: 'paymentId', description: 'ID thanh toán' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Hủy thanh toán thành công',
  })
  async cancelSubscriptionPayment(
    @Param('paymentId') paymentId: string,
    @Body() body: { reason?: string } = {},
  ) {
    try {
      const result =
        await this.payosIntegrationService.cancelSubscriptionPayment(
          paymentId,
          body.reason,
        );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to cancel subscription payment: ${error.message}`,
      );
      throw error;
    }
  }

  @Get('user/:userId/stats')
  @UseGuards(GlobalAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thống kê thanh toán của user' })
  @ApiParam({ name: 'userId', description: 'ID người dùng' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy thống kê thanh toán thành công',
  })
  async getUserPaymentStats(@Param('userId') userId: string) {
    try {
      const result =
        await this.payosIntegrationService.getUserPaymentStats(userId);

      return result;
    } catch (error) {
      this.logger.error(`Failed to get user payment stats: ${error.message}`);
      throw error;
    }
  }

  @Get('webhook/test-format')
  @Public()
  @ApiOperation({ 
    summary: 'Xem format webhook PayOS mẫu',
    description: 'Endpoint để xem cấu trúc webhook mà PayOS sẽ gửi đến server'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Trả về format webhook PayOS mẫu',
  })
  getWebhookTestFormat() {
    return {
      success: true,
      message: 'PayOS Webhook Format Example',
      data: {
        webhookUrl: 'POST /api/v1/payos/webhook',
        samplePayload: {
          code: '00',
          desc: 'success',
          success: true,
          data: {
            orderCode: 1234567890,
            amount: 299000,
            description: 'Goi Premium',
            accountNumber: '970422***',
            reference: 'FT22348123456',
            transactionDateTime: '2025-09-28T10:30:00Z',
            currency: 'VND',
            paymentLinkId: 'abc123def456',
            code: '00', // "00" = success, other = failed
            desc: 'success',
            counterAccountBankId: '',
            counterAccountBankName: '',
            counterAccountName: '',
            counterAccountNumber: '',
            virtualAccountName: '',
            virtualAccountNumber: ''
          },
          signature: 'webhook_signature_here'
        },
        headers: {
          'x-payos-signature': 'sha256=signature_here',
          'content-type': 'application/json'
        },
        note: 'PayOS sẽ gửi webhook này khi thanh toán hoàn tất'
      }
    };
  }
}
