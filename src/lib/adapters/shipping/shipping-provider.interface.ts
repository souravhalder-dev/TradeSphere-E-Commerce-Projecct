import { ShipmentStatus } from "@prisma/client";

export interface ShippingQuoteRequest {
  originCountry: string;
  destinationCountry: string;
  weightKg: number;
  quantity: number;
}

export interface ShippingQuote {
  carrier: string;
  serviceName: string;
  estimatedDays: number;
  rate: number;
  currency: string;
}

export interface DispatchShipmentRequest {
  orderId: string;
  carrier: string;
  destinationAddress: string;
}

export interface DispatchResult {
  trackingNumber: string;
  carrier: string;
  status: ShipmentStatus;
  dispatchedAt: Date;
  estimatedDelivery: Date;
  trackingUrl: string;
}

export interface ShippingProvider {
  name: string;
  calculateRates(request: ShippingQuoteRequest): Promise<ShippingQuote[]>;
  dispatchShipment(request: DispatchShipmentRequest): Promise<DispatchResult>;
  getTrackingStatus(trackingNumber: string): Promise<{ status: ShipmentStatus; checkpoints: string[] }>;
}
