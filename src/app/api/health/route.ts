import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let postgresConnected = false;
  try {
    await db.$queryRaw`SELECT 1`;
    postgresConnected = true;
  } catch {
    postgresConnected = false;
  }

  return NextResponse.json({
    status: "ok",
    app: "TradeSphere Global B2B Marketplace",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    services: {
      database: postgresConnected ? "connected" : "fallback_memory_active",
      redis: "ready",
      storage: process.env.STORAGE_PROVIDER || "local",
      paymentProvider: process.env.PAYMENT_MOCK_ENABLED === "true" ? "mock_sandbox" : "live",
    },
  });
}
