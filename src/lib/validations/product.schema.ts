import { z } from "zod";

export const priceTierSchema = z.object({
  minQuantity: z.number().int().min(1, "Minimum quantity must be at least 1"),
  maxQuantity: z.number().int().nullable().optional(),
  unitPrice: z.number().positive("Unit price must be positive"),
});

export const variantSchema = z.object({
  sku: z.string().min(2, "SKU must be at least 2 characters"),
  title: z.string().min(1, "Variant title is required"),
  price: z.number().positive("Variant price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  attributes: z.record(z.string(), z.string()).default({}),
});

export const productCreateSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  categoryId: z.string().uuid("Invalid category ID"),
  brandId: z.string().uuid().optional().nullable(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  basePrice: z.number().positive("Base price must be positive"),
  moq: z.number().int().min(1, "Minimum Order Quantity must be at least 1").default(1),
  leadTimeDays: z.number().int().min(1).default(3),
  countryOfOrigin: z.string().default("US"),
  productionCapacity: z.string().optional(),
  sampleAvailable: z.boolean().default(false),
  samplePrice: z.number().positive().optional().nullable(),
  customizationAvailable: z.boolean().default(false),
  images: z.array(z.string().url()).min(1, "At least one product image is required"),
  priceTiers: z.array(priceTierSchema).optional().default([]),
  variants: z.array(variantSchema).optional().default([]),
  specifications: z.record(z.string(), z.string()).optional().default({}),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
