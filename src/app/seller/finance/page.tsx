"use client";

import { useState } from "react";
import {
  DollarSign,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function SellerFinancePage() {
  const [availableBalance, setAvailableBalance] = useState(24500.0);
  const [pendingBalance, setPendingBalance] = useState(8200.0);
  const [payoutRequested, setPayoutRequested] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(5000);

  // Sample Balanced Double-Entry Ledger
  const [ledgerEntries, setLedgerEntries] = useState([
    {
      id: "ledg-001",
      date: "2026-10-21T14:30:00Z",
      type: "CREDIT",
      description: "Order Settlement: TS-2026-1001 (Solar Inverter System)",
      gross: 11600.0,
      fee: 522.0, // 4.5% commission
      net: 11078.0,
      balanceAfter: 24500.0,
    },
    {
      id: "ledg-002",
      date: "2026-10-18T10:15:00Z",
      type: "CREDIT",
      description: "Order Settlement: TS-2026-0982 (CNC Mill Replacement Parts)",
      gross: 4800.0,
      fee: 216.0,
      net: 4584.0,
      balanceAfter: 13422.0,
    },
    {
      id: "ledg-003",
      date: "2026-10-15T09:00:00Z",
      type: "DEBIT",
      description: "Payout to Commercial Bank Account (Wire Ref: WIR-9041)",
      gross: -10000.0,
      fee: 0.0,
      net: -10000.0,
      balanceAfter: 8838.0,
    },
  ]);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount > availableBalance) return;

    setAvailableBalance(availableBalance - payoutAmount);
    setLedgerEntries([
      {
        id: `ledg-${Date.now()}`,
        date: new Date().toISOString(),
        type: "DEBIT",
        description: `Settlement Payout Initiated to Wire Account (Pending Transfer)`,
        gross: -payoutAmount,
        fee: 0.0,
        net: -payoutAmount,
        balanceAfter: availableBalance - payoutAmount,
      },
      ...ledgerEntries,
    ]);

    setPayoutRequested(true);
    setShowPayoutModal(false);
    setTimeout(() => setPayoutRequested(false), 4000);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Ledger & Settlement Accounts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Auditable double-entry accounting, platform commission fee calculations, and payout withdrawals
          </p>
        </div>

        <button
          onClick={() => setShowPayoutModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
        >
          <DollarSign className="w-4 h-4" />
          <span>Request Payout Settlement</span>
        </button>
      </div>

      {payoutRequested && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Payout request submitted to platform finance operators! International wire transfer initiated.</span>
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Available Payout Balance</span>
          <div className="text-3xl font-black text-slate-900">{formatCurrency(availableBalance)}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">Cleared funds eligible for immediate wire</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Trade Assurance Escrow</span>
          <div className="text-3xl font-black text-slate-900">{formatCurrency(pendingBalance)}</div>
          <p className="text-[11px] text-amber-600 font-semibold">Releases upon buyer inspection / BL confirmation</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Platform Commission Rate</span>
          <div className="text-3xl font-black text-blue-600">4.50%</div>
          <p className="text-[11px] text-slate-500">Tier-1 Verified Industrial Supplier Contract</p>
        </div>
      </div>

      {/* Ledger History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
          Auditable Financial Ledger Entries
        </h2>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4 text-right">Gross Amount</th>
                <th className="py-3 px-4 text-right">Platform Fee (4.5%)</th>
                <th className="py-3 px-4 text-right">Net Credited</th>
                <th className="py-3 px-4 text-right">Balance After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledgerEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {formatDateTime(entry.date)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {entry.description}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                    {formatCurrency(entry.gross)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-rose-600 font-medium">
                    {entry.fee > 0 ? `-${formatCurrency(entry.fee)}` : "$0.00"}
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-bold ${
                      entry.net >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {entry.net >= 0 ? `+${formatCurrency(entry.net)}` : formatCurrency(entry.net)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                    {formatCurrency(entry.balanceAfter)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Request Settlement Wire Transfer
            </h3>
            <p className="text-xs text-slate-500">
              Funds will be sent to your verified corporate bank account (Detroit Commercial Credit Union ****4921).
            </p>

            <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Withdrawal Amount ($ USD) *
                </label>
                <input
                  type="number"
                  required
                  max={availableBalance}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Maximum Available: {formatCurrency(availableBalance)}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                >
                  Confirm Wire Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
