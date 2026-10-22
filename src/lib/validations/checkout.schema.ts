import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().optional().nullable(),
  street: z.string().min(5, "Street address is required"),
  apartment: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State / Province is required"),
  postalCode: z.string().min(3, "Postal / ZIP code is required"),
  country: z.string().min(2, "Country is required").default("US"),
  phone: z.string().min(7, "Valid phone number is required"),
});

export const checkoutItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional().nullable(),
  quantity: z.number().int().min(1),
});

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, "Cart cannot be empty"),
  shippingAddress: addressSchema,
  paymentProvider: z.enum([
    "MOCK_DEVELOPMENT",
    "STRIPE",
    "SSLCOMMERZ",
    "CASH_ON_DELIVERY",
    "BANK_TRANSFER",
  ]),
  couponCode: z.string().optional().nullable(),
  isB2BTradeAssurance: z.boolean().default(false),
  notes: z.string().max(500).optional().nullable(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
