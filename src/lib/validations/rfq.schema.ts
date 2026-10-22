import { z } from "zod";

export const rfqCreateSchema = z.object({
  title: z.string().min(5, "RFQ title must be at least 5 characters"),
  categoryId: z.string().uuid("Please select a valid category"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  targetPrice: z.number().positive("Target price must be positive").optional().nullable(),
  destinationCountry: z.string().min(2, "Destination country is required"),
  specifications: z.string().min(20, "Please provide detailed product specifications (at least 20 characters)"),
  deliveryDate: z.string().optional().nullable(),
});

export const quotationSubmitSchema = z.object({
  rfqId: z.string().uuid(),
  unitPrice: z.number().positive("Unit price must be positive"),
  minQuantity: z.number().int().min(1).default(1),
  leadTimeDays: z.number().int().min(1).default(7),
  validDays: z.number().int().min(1).max(90).default(30),
  terms: z.string().min(5, "Payment/shipping terms required"),
});

export const negotiationMessageSchema = z.object({
  rfqId: z.string().uuid().optional(),
  quotationId: z.string().uuid().optional(),
  message: z.string().min(1, "Message cannot be empty"),
  proposedPrice: z.number().positive().optional().nullable(),
  proposedQuantity: z.number().int().positive().optional().nullable(),
});

export type RFQCreateInput = z.infer<typeof rfqCreateSchema>;
export type QuotationSubmitInput = z.infer<typeof quotationSubmitSchema>;
export type NegotiationMessageInput = z.infer<typeof negotiationMessageSchema>;
