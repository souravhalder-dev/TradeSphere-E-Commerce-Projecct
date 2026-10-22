import {
  PaymentProvider,
  PaymentIntentOptions,
  PaymentResult,
  RefundOptions,
  RefundResult,
} from "./payment-provider.interface";

/**
 * Development & Testing Mock Payment Adapter
 * Clearly labeled as SIMULATED for local sandbox testing without live credentials.
 */
export class MockPaymentAdapter implements PaymentProvider {
  public readonly name = "MOCK_DEVELOPMENT";
  public readonly isSimulated = true;

  async createPaymentIntent(options: PaymentIntentOptions): Promise<PaymentResult> {
    // Generate deterministic simulated transaction reference
    const transactionId = `SIM_TX_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // In simulated mode, amount === 0 or special flag can simulate failure
    if (options.amount < 0 || options.metadata?.forceFail === "true") {
      return {
        success: false,
        transactionId,
        provider: "MOCK_DEVELOPMENT",
        status: "FAILED",
        message: "Simulated payment failure triggered for testing",
        rawDetails: {
          simulated: true,
          mode: "sandbox_failure_test",
          orderId: options.orderId,
        },
      };
    }

    return {
      success: true,
      transactionId,
      provider: "MOCK_DEVELOPMENT",
      status: "PAID",
      message: "Simulated payment completed successfully in development sandbox mode",
      rawDetails: {
        simulated: true,
        mode: "sandbox_success",
        orderId: options.orderId,
        amount: options.amount,
        currency: options.currency,
        processedAt: new Date().toISOString(),
      },
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    return {
      success: true,
      transactionId,
      provider: "MOCK_DEVELOPMENT",
      status: "PAID",
      message: "Simulated payment verified",
      rawDetails: { simulated: true },
    };
  }

  async processRefund(options: RefundOptions): Promise<RefundResult> {
    return {
      success: true,
      refundId: `SIM_REFUND_${Date.now()}`,
      amount: options.amount,
      status: "COMPLETED",
      message: `Simulated refund of $${options.amount.toFixed(2)} processed for sandbox`,
    };
  }
}

export const mockPaymentAdapter = new MockPaymentAdapter();
