# PayOS Integration - Subscription Payment Solution

Tích hợp PayOS SDK với hệ thống NestJS, tập trung vào thanh toán gói đăng ký (subscription).

## 🚀 Tính Năng Đã Hoàn Thành

### Core PayOS SDK Features

- ✅ **Tạo Payment Link** - Tạo link thanh toán gói đăng ký
- ✅ **Quản lý Thanh Toán** - Xem thông tin, kiểm tra trạng thái thanh toán
- ✅ **QR Code Generation** - Tạo mã QR cho thanh toán subscription
- ✅ **Webhook Handling** - Xử lý webhook với xác thực signature
- ✅ **Payment Verification** - Xác minh và kiểm tra trạng thái thanh toán
- ✅ **Error Handling** - Xử lý lỗi toàn diện với logging

### Subscription Payment Features

- ✅ **Subscription Payments** - Thanh toán gói đăng ký với business logic
- ✅ **Webhook Business Logic** - Xử lý tự động kích hoạt subscription khi thanh toán thành công
- ✅ **Order Code Generation** - Tự động tạo mã đơn hàng duy nhất cho subscription
- ✅ **Plan & User Integration** - Tích hợp với thông tin plan và user

### API & Controller

- ✅ **RESTful APIs** - Đầy đủ endpoints với Swagger documentation
- ✅ **Authentication** - Tích hợp với hệ thống auth hiện tại
- ✅ **Validation** - Validation DTOs với class-validator
- ✅ **Type Safety** - TypeScript interfaces và type definitions
- ✅ **Public Webhook Endpoint** - Endpoint public cho PayOS webhook

## 📁 Cấu Trúc Files

```
src/shared/payos/
├── payos.service.ts              # Core PayOS SDK integration
├── payos-integration.service.ts  # Business logic integration
├── payos.controller.ts           # RESTful API endpoints
├── payos.module.ts              # Module configuration
├── dto/
│   └── payos.dto.ts             # Validation DTOs
├── payos.config.example.ts      # Configuration examples
└── README.md                    # Documentation (this file)
```

## 🛠️ Cài Đặt & Cấu Hình

### 1. Environment Variables

Thêm vào file `.env`:

```bash
# PayOS Configuration
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key

# Frontend URLs
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Configuration Service

Cập nhật `src/config/configuration.ts`:

```typescript
export default () => ({
  // ... other configurations

  payos: {
    clientId: process.env.PAYOS_CLIENT_ID,
    apiKey: process.env.PAYOS_API_KEY,
    checksumKey: process.env.PAYOS_CHECKSUM_KEY,
  },

  app: {
    frontendUrl: process.env.FRONTEND_URL,
  },
});
```

### 3. Module Import

Thêm PayosModule vào AppModule:

```typescript
@Module({
  imports: [
    // ... other modules
    PayosModule,
  ],
})
export class AppModule {}
```

## 📖 Cách Sử Dụng

### 1. Tạo Thanh Toán Subscription

```typescript
// Inject service
constructor(
  private readonly payosIntegrationService: PayosIntegrationService,
) {}

// Tạo thanh toán subscription
async createSubscriptionPayment(userId: string, planId: string) {
  const paymentResult = await this.payosIntegrationService.createSubscriptionPayment(
    planId,
    userId,
    {
      returnUrl: 'https://yoursite.com/subscription/success',
      cancelUrl: 'https://yoursite.com/subscription/cancel',
    }
  );

  return paymentResult;
  // Returns: { orderCode, paymentLink, qrCode, planInfo, userInfo, paymentInfo }
}
```

### 2. Xử Lý Webhook

```typescript
// Webhook sẽ được xử lý tự động cho subscription
@Post('webhook')
@Public()
async handlePaymentWebhook(@Body() webhookData: any) {
  // PayOS integration service sẽ:
  // 1. Verify webhook signature
  // 2. Process subscription payment
  // 3. Activate subscription
  // 4. Update database records

  const result = await this.payosIntegrationService.handlePaymentWebhook(webhookData);
  return result;
}
```

## 🔗 API Endpoints

| Method | Endpoint                                | Description                      | Auth        |
| ------ | --------------------------------------- | -------------------------------- | ----------- |
| POST   | `/payos/subscription-payment`           | Tạo thanh toán subscription      | ✅          |
| GET    | `/payos/subscription/:orderCode/status` | Kiểm tra trạng thái subscription | ✅          |
| POST   | `/payos/webhook`                        | PayOS webhook                    | ❌ (Public) |

## 🔄 Quy Trình Thanh Toán Subscription

1. **Tạo Payment Link**

   ```typescript
   const payment = await payosIntegrationService.createSubscriptionPayment(
     planId,
     userId,
   );
   // Trả về: { orderCode, paymentLink, qrCode, planInfo, userInfo }
   ```

2. **User Thanh Toán**
   - Redirect user tới `payment.paymentLink`
   - Hoặc hiển thị `payment.qrCode`

3. **Webhook Notification**
   - PayOS gửi webhook tới `/payos/webhook`
   - Hệ thống tự động kích hoạt subscription
   - Cập nhật trạng thái trong database

4. **Return URL Handling**
   - User được redirect về success/cancel URL
   - Frontend kiểm tra trạng thái và hiển thị thông báo

## 🎯 Tích Hợp với Business Logic

### Subscription Payment Success

```typescript
// Tự động được gọi khi thanh toán subscription thành công
private async handleSubscriptionPayment(webhookData: any) {
  // 1. Kích hoạt subscription cho user
  // 2. Gửi email xác nhận
  // 3. Cập nhật quyền truy cập của user
  // 4. Lưu lịch sử thanh toán
}
```

## 🔍 Monitoring & Debugging

### Logs

Service sử dụng NestJS Logger để tracking:

- Payment creation
- Status checks
- Webhook processing
- Error handling

### Error Handling

```typescript
// Tất cả methods đều có comprehensive error handling
try {
  const result = await payosService.createPaymentLink(data);
} catch (error) {
  // Lỗi được log và throw về controller
  // Controller trả về error response phù hợp
}
```

## 🧪 Testing

### Test Subscription Payment Creation

```bash
# Test API endpoint
POST /api/payos/subscription-payment
{
  "planId": "plan_premium_monthly",
  "userId": "user_123456",
  "returnUrl": "https://yoursite.com/subscription/success",
  "cancelUrl": "https://yoursite.com/subscription/cancel"
}
```

### Test Webhook

```bash
# Test webhook endpoint (simulate PayOS webhook)
POST /api/payos/webhook
{
  "orderCode": 123456,
  "amount": 299000,
  "description": "Test payment",
  "code": "00",
  "desc": "success",
  # ... other webhook fields
}
```

## 🚀 Production Deployment

### 1. Environment Setup

- Đảm bảo tất cả PayOS credentials được cấu hình đúng
- Cập nhật FRONTEND_URL cho production domain

### 2. Webhook Configuration

```typescript
// Đăng ký webhook URL với PayOS
await payosService.confirmWebhookUrl(
  'https://your-production-domain.com/api/payos/webhook',
);
```

### 3. SSL Certificate

- Webhook endpoint phải có SSL certificate
- PayOS chỉ gửi webhook tới HTTPS URLs

## 📞 Support

- **PayOS Documentation**: [docs.payos.vn](https://docs.payos.vn)
- **Swagger API Docs**: `https://your-domain.com/api/docs` (khi chạy server)
- **Error Logs**: Check NestJS logs cho chi tiết lỗi

---

🎉 **Hoàn tất!** PayOS integration đã được tích hợp đầy đủ với tất cả tính năng cơ bản và nâng cao của SDK.
