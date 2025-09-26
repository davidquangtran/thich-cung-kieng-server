import {
  Controller,
  Post,
  Get,
  Body,
  Param,
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
  PaymentWebhookDto,
} from './dto/payos.dto';
import { GlobalAuthGuard } from '../../common/guards/global-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { PayosIntegrationService } from './payos-integration.service';

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

      return {
        success: true,
        message: 'Tạo thanh toán gói đăng ký thành công',
        data: result,
      };
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
  async checkSubscriptionPaymentStatus(@Param('orderCode') orderCode: string) {
    try {
      const result =
        await this.payosIntegrationService.checkAndUpdatePaymentStatus(
          orderCode,
        );

      return {
        success: true,
        message: 'Kiểm tra trạng thái thanh toán thành công',
        data: result,
      };
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
  async handleWebhook(@Body() webhookData: PaymentWebhookDto) {
    try {
      this.logger.log(`Received webhook for order: ${webhookData.orderCode}`);

      const result = await this.payosService.handleWebhook(webhookData);

      if (!result.isValid) {
        return {
          success: false,
          message: 'Invalid webhook signature',
        };
      }

      // Here you can add your business logic for handling successful payments
      // For example: update subscription status, send confirmation emails, etc.

      return {
        success: true,
        message: 'Webhook processed successfully',
        data: result.data,
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

      return {
        success: true,
        message: 'Lấy chi tiết thanh toán thành công',
        data: result,
      };
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

      return {
        success: true,
        message: 'Lấy danh sách thanh toán thành công',
        data: result,
      };
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

      return {
        success: true,
        message: 'Hủy thanh toán thành công',
        data: result,
      };
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

      return {
        success: true,
        message: 'Lấy thống kê thanh toán thành công',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Failed to get user payment stats: ${error.message}`);
      throw error;
    }
  }
}
