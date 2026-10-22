"use client";

import { useState, useEffect } from "react";
import {
  FileCheck2,
  ShieldCheck,
  Building2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");

  const loadSellers = async () => {
    try {
      const res = await fetch("/api/admin/sellers").catch(() => null);
      if (res && res.ok) {
        const data = await res.json();
        setSellers(data.sellers);
      } else {
        // Fallback default
        setSellers([
          {
            id: "seller-apex",
            storeName: "Apex Industrial Technologies",
            storeSlug: "apex-industrial",
            country: "US",
            businessAddress: "450 Industrial Parkway, Detroit, MI 48201",
            taxId: "US-EIN-94827103",
            verificationStatus: "VERIFIED",
            verifiedAt: "2024-01-15T00:00:00.000Z",
            phone: "+1-313-555-0199",
            email: "sales@apexmachinery.com",
            establishedYear: 1999,
          },
          {
            id: "seller-nextech",
            storeName: "Shenzhen NexTech Components",
            storeSlug: "nextech-electronics",
            country: "CN",
            businessAddress: "Hi-Tech Industrial Park, Nanshan, Shenzhen, China",
            taxId: "CN-TAX-91440300MA5",
            verificationStatus: "VERIFIED",
            verifiedAt: "2023-11-20T00:00:00.000Z",
            phone: "+86-755-8833-2100",
            email: "export@nextechelec.com",
            establishedYear: 2012,
          },
          {
            id: "seller-vanguard",
            storeName: "Vanguard Global Textiles Corp",
            storeSlug: "vanguard-textiles",
            country: "BD",
            businessAddress: "Plot 42, Export Processing Zone, Dhaka, Bangladesh",
            taxId: "BD-BIN-002941849",
            verificationStatus: "UNDER_REVIEW",
            phone: "+880-2-9844210",
            email: "compliance@vanguardtex.com",
            establishedYear: 2008,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleUpdateStatus = async (sellerId: string, status: "VERIFIED" | "REJECTED") => {
    try {
      const res = await fetch("/api/admin/verify-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setActionMsg(`Seller status updated to ${status}!`);
      setSellers(
        sellers.map((s) =>
          s.id === sellerId ? { ...s, verificationStatus: status, verifiedAt: new Date().toISOString() } : s
        )
      );
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Supplier Verification & Compliance Queue</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review business registration licenses, ISO certifications, and tax credentials for global manufacturers
        </p>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Manufacturer Organization</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Tax / Business ID</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sellers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{s.storeName}</div>
                    <div className="text-[11px] text-slate-500">{s.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {s.country} (Est. {s.establishedYear})
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                    {s.taxId || "Pending Document Upload"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase border ${
                        s.verificationStatus === "VERIFIED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {s.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {s.verificationStatus !== "VERIFIED" ? (
                      <button
                        onClick={() => handleUpdateStatus(s.id, "VERIFIED")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition"
                      >
                        Approve & Verify
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(s.id, "REJECTED")}
                        className="text-rose-600 hover:underline font-semibold text-xs"
                      >
                        Revoke Verification
                      </button>
                    )}
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
