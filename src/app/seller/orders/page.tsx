"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Package,
  Building2,
  ExternalLink,
  AlertCircle,
  X,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [carrier, setCarrier] = useState("DHL Express Freight");
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders?sellerId=seller-apex");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsFulfilling(true);
    setFeedbackMsg("");

    try {
      const res = await fetch("/api/seller/fulfillment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          carrier,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch order");
      }

      setFeedbackMsg(`Shipment Dispatched! Waybill Tracking Number: ${data.trackingNumber}`);
      setSelectedOrder(null);
      loadOrders();
    } catch (err: any) {
      setFeedbackMsg(`Error: ${err.message}`);
    } finally {
      setIsFulfilling(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order Fulfillment & Logistics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch cargo, generate international shipping waybills, and update tracking
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Orders Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Consignee</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Items Total</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4">Tracking Waybill</th>
                <th className="py-3 px-4 text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {o.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{o.buyerName}</div>
                    <div className="text-[11px] text-slate-500">{o.shippingAddress?.companyName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {o.shippingAddress?.city}, {o.shippingAddress?.country}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatCurrency(o.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase border ${
                        o.status === "DELIVERED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : o.status === "SHIPPED"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                    {o.trackingNumber || <span className="text-slate-400">Not Dispatched</span>}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {o.status !== "SHIPPED" && o.status !== "DELIVERED" ? (
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition shadow-sm"
                      >
                        Dispatch Cargo
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Dispatched
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Dispatch Order: {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Carrier / Freight Service *
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="DHL Express Freight">DHL Express Freight (Air Priority)</option>
                  <option value="TradeSphere Global Air">TradeSphere Standard Air Cargo</option>
                  <option value="Ocean Maritime Container">Ocean Maritime (Port-to-Port FCL/LCL)</option>
                  <option value="FedEx International Priority">FedEx International Priority</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1">
                <div>Consignee: <strong>{selectedOrder.buyerName}</strong></div>
                <div>Address: <strong>{selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}</strong></div>
                <div>Units: <strong>{selectedOrder.items?.reduce((a: number, i: any) => a + i.quantity, 0)} units</strong></div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFulfilling}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg transition"
                >
                  {isFulfilling ? "Generating Waybill..." : "Confirm Dispatch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
