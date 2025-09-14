import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseFilterDto } from 'src/common/base/dto/base-filter.dto';
import { PaymentStatus } from 'src/common/enums/payment.enum';

export class FilterPaymentLogDto extends PartialType(BaseFilterDto) {
  @ApiPropertyOptional({
    description: 'Old status of the payment log',
    example: PaymentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  oldStatus?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'New status of the payment log',
    example: PaymentStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  newStatus?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'ID of the associated payment',
    example: 'payment-uuid-1234',
  })
  @IsOptional()
  @IsString()
  paymentId?: string;
}
