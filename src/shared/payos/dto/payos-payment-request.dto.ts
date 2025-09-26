import { PayOSItem } from '../interfaces/Payos-item.interface';

export interface CreatePaymentRequest {
  orderCode: number | string;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  items?: PayOSItem[];
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAddress?: string;
  expiredAt?: number;
}
