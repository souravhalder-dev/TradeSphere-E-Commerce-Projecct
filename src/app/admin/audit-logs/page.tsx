import { ShieldCheck, Lock, Activity, FileText } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const auditLogs = [
    {
      id: "log-101",
      timestamp: "2026-10-22T06:56:45Z",
      actor: "system@tradesphere.local",
      action: "ORDER_CREATED_ESCROW_LOCKED",
      resource: "Order",
      resourceId: "TS-2026-1001",
      ip: "192.168.1.1",
      details: "Trade Assurance escrow locked $11,750.00 for order TS-2026-1001",
    },
    {
      id: "log-102",
      timestamp: "2026-10-22T06:40:00Z",
      actor: "sales@apexmachinery.com",
      action: "SHIPMENT_DISPATCHED",
      resource: "Shipment",
      resourceId: "TS-EXP-849201",
      ip: "74.125.21.90",
      details: "Carrier DHL Express assigned with tracking TS-EXP-849201",
    },
    {
      id: "log-103",
      timestamp: "2026-10-21T18:20:11Z",
      actor: "admin@tradesphere.com",
      action: "SELLER_VERIFICATION_APPROVED",
      resource: "SellerProfile",
      resourceId: "seller-apex",
      ip: "10.0.4.15",
      details: "Verified ISO9001 and US business registration for Apex Industrial",
    },
    {
      id: "log-104",
      timestamp: "2026-10-21T10:15:00Z",
      actor: "buyer@acmecorp.com",
      action: "RFQ_TENDER_SUBMITTED",
      resource: "RFQ",
      resourceId: "RFQ-2026-0089",
      ip: "165.225.200.4",
      details: "Published tender for 500 units LoRaWAN Smart Grid modules",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Security & Operational Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-1">
          Immutable event log tracking administrative actions, escrow holds, and verification changes
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Audit Details</th>
                <th className="py-3 px-4 text-right">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {log.actor}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {log.resource} ({log.resourceId})
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {log.details}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
