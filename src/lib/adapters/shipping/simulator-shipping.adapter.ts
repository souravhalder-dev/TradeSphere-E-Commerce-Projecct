import {
  ShippingProvider,
  ShippingQuoteRequest,
  ShippingQuote,
  DispatchShipmentRequest,
  DispatchResult,
} from "./shipping-provider.interface";
import { ShipmentStatus } from "@prisma/client";

export class SimulatorShippingAdapter implements ShippingProvider {
  public readonly name = "TradeSphere Express & Freight Simulator";

  async calculateRates(request: ShippingQuoteRequest): Promise<ShippingQuote[]> {
    const isDomestic = request.originCountry === request.destinationCountry;
    const baseWeightRate = request.weightKg * (isDomestic ? 2.5 : 6.0);
    const volumeFactor = Math.max(1, Math.log10(request.quantity + 1));

    return [
      {
        carrier: "TradeSphere Standard Air",
        serviceName: isDomestic ? "Domestic Ground" : "Priority Air Cargo",
        estimatedDays: isDomestic ? 3 : 7,
        rate: Number((15 + baseWeightRate * volumeFactor).toFixed(2)),
        currency: "USD",
      },
      {
        carrier: "DHL Express Freight",
        serviceName: "Global Express Guaranteed",
        estimatedDays: isDomestic ? 1 : 3,
        rate: Number((35 + baseWeightRate * volumeFactor * 1.8).toFixed(2)),
        currency: "USD",
      },
      {
        carrier: "Ocean Freight / Bulk Maritime",
        serviceName: "Containerized Port-to-Port",
        estimatedDays: 21,
        rate: Number((50 + baseWeightRate * 0.5).toFixed(2)),
        currency: "USD",
      },
    ];
  }

  async dispatchShipment(request: DispatchShipmentRequest): Promise<DispatchResult> {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = `TS-${request.carrier.slice(0, 3).toUpperCase()}-${randomCode}`;
    const now = new Date();
    const delivery = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    return {
      trackingNumber,
      carrier: request.carrier,
      status: ShipmentStatus.DISPATCHED,
      dispatchedAt: now,
      estimatedDelivery: delivery,
      trackingUrl: `https://tracking.tradesphere.local/track/${trackingNumber}`,
    };
  }

  async getTrackingStatus(trackingNumber: string): Promise<{ status: ShipmentStatus; checkpoints: string[] }> {
    return {
      status: ShipmentStatus.IN_TRANSIT,
      checkpoints: [
        `Package received at origin regional hub [${new Date().toLocaleDateString()}]`,
        `Export customs clearance completed`,
        `In transit to destination facility`,
      ],
    };
  }
}

export const simulatorShippingAdapter = new SimulatorShippingAdapter();
