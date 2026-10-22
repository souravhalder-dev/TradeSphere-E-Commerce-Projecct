import { PaymentProvider } from "./payment-provider.interface";
import { mockPaymentAdapter } from "./mock-payment.adapter";
import { PaymentProvider as PrismaPaymentProvider } from "@prisma/client";

/**
 * Returns the configured payment adapter for the requested provider.
 */
export function getPaymentAdapter(provider: PrismaPaymentProvider): PaymentProvider {
  switch (provider) {
    case PrismaPaymentProvider.MOCK_DEVELOPMENT:
      return mockPaymentAdapter;

    case PrismaPaymentProvider.STRIPE:
      // If Stripe credentials are not provided in environment, fall back to mock with warning
      if (!process.env.STRIPE_SECRET_KEY) {
        console.warn("[Payments] STRIPE_SECRET_KEY not set. Using Mock Payment Adapter for development.");
        return mockPaymentAdapter;
      }
      return mockPaymentAdapter; // Or stripe adapter when keys available

    case PrismaPaymentProvider.SSLCOMMERZ:
      if (!process.env.SSLCOMMERZ_STORE_ID) {
        console.warn("[Payments] SSLCOMMERZ_STORE_ID not set. Using Mock Payment Adapter for development.");
        return mockPaymentAdapter;
      }
      return mockPaymentAdapter;

    case PrismaPaymentProvider.BANK_TRANSFER:
    case PrismaPaymentProvider.CASH_ON_DELIVERY:
    default:
      return mockPaymentAdapter;
  }
}
