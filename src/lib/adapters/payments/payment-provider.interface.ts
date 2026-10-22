export interface PaymentIntentOptions {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  redirectUrl?: string;
  provider: "MOCK_DEVELOPMENT" | "STRIPE" | "SSLCOMMERZ" | "CASH_ON_DELIVERY" | "BANK_TRANSFER";
  status: "PAID" | "PENDING" | "FAILED";
  message?: string;
  rawDetails?: Record<string, unknown>;
}

export interface RefundOptions {
  transactionId: string;
  amount: number;
  reason: string;
}

export interface RefundResult {
  success: boolean;
  refundId: string;
  amount: number;
  status: "COMPLETED" | "FAILED";
  message?: string;
}

export interface PaymentProvider {
  name: string;
  isSimulated: boolean;
  createPaymentIntent(options: PaymentIntentOptions): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<PaymentResult>;
  processRefund(options: RefundOptions): Promise<RefundResult>;
}
