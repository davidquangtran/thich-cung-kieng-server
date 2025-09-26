import { PayOSItem } from '../interfaces/Payos-item.interface';

export interface CreatePaymentRequest {
  orderCode: string | number;
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
