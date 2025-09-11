import { CanActivate, ExecutionContext } from "@nestjs/common";

export class SubscriptionGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Logic kiểm tra đăng ký hoặc quyền truy cập
        return true; // Cho phép truy cập nếu hợp lệ
    }

    private async checkUserSubscription(userId: string): Promise<boolean> {
        // Logic kiểm tra đăng ký của người dùng
        return true; // Trả về true nếu người dùng có đăng ký hợp lệ
    }
}