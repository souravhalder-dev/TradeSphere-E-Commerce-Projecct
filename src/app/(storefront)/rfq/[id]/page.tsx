"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Building2,
  Clock,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export default function RFQDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [rfq, setRfq] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Quote Submission Form State
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [unitPrice, setUnitPrice] = useState<number>(50);
  const [minQuantity, setMinQuantity] = useState<number>(100);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(14);
  const [validDays, setValidDays] = useState<number>(30);
  const [terms, setTerms] = useState<string>(
    "30% advance via Trade Assurance, 70% upon Bill of Lading. Standard factory warranty included."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const loadRFQ = async () => {
    try {
      const res = await fetch("/api/rfq");
      const data = await res.json();
      if (data.rfqs) {
        const found = data.rfqs.find((r: any) => r.id === params.id || r.rfqNumber === params.id);
        setRfq(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRFQ();
  }, [params.id]);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMsg("");

    try {
      const res = await fetch(`/api/rfq/${params.id}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfqId: params.id,
          unitPrice,
          minQuantity,
          leadTimeDays,
          validDays,
          terms,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quotation");
      }

      setFeedbackMsg("Official quotation submitted successfully!");
      setShowQuoteForm(false);
      loadRFQ();
    } catch (err: any) {
      setFeedbackMsg(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 text-center text-xs text-slate-500">
        Loading RFQ details...
      </div>
    );
  }

  if (!rfq) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">RFQ Tender Not Found</h2>
        <Link href="/rfq" className="text-xs font-semibold text-blue-600 hover:underline">
          Return to RFQ Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/rfq" className="hover:text-blue-600">RFQ Marketplace</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-slate-800 font-mono">{rfq.rfqNumber}</span>
      </nav>

      {/* Main Tender Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {rfq.rfqNumber}
              </span>
              <span className="text-xs font-medium text-slate-500">{rfq.categoryName}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{rfq.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              {rfq.status}
            </span>
          </div>
        </div>

        {/* Tender Specifications Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 text-[11px]">Required Quantity</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {rfq.quantity.toLocaleString()} Units
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">Target Unit Price</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {rfq.targetPrice ? formatCurrency(rfq.targetPrice) : "Open for Bid"}
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">Destination Port</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {rfq.destinationCountry}
            </div>
          </div>
          <div>
            <span className="text-slate-500 text-[11px]">Delivery Target</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">
              {formatDate(rfq.deliveryDate)}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Technical Specifications & Sourcing Criteria
          </h3>
          <p className="text-xs text-slate-800 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
            {rfq.specifications}
          </p>
        </div>

        {/* Action Button: Submit Formal Quotation */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Buyer Organization: <strong>{rfq.buyerCompany}</strong></span>
          </div>

          <button
            onClick={() => setShowQuoteForm(!showQuoteForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4" />
            <span>{showQuoteForm ? "Close Quote Form" : "Submit Formal Supplier Quotation"}</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-medium">
          {feedbackMsg}
        </div>
      )}

      {/* Supplier Quotation Submission Card */}
      {showQuoteForm && (
        <div className="bg-white border-2 border-blue-600 rounded-2xl p-6 sm:p-8 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            Submit Formal Quotation for {rfq.rfqNumber}
          </h3>

          <form onSubmit={handleSubmitQuote} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Offered Unit Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Minimum Order Quantity (Units) *
              </label>
              <input
                type="number"
                required
                value={minQuantity}
                onChange={(e) => setMinQuantity(parseInt(e.target.value) || 1)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Manufacturing Lead Time (Days) *
              </label>
              <input
                type="number"
                required
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(parseInt(e.target.value) || 1)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Quotation Validity (Days) *
              </label>
              <input
                type="number"
                required
                value={validDays}
                onChange={(e) => setValidDays(parseInt(e.target.value) || 1)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Commercial Payment & Shipping Terms *
              </label>
              <textarea
                rows={3}
                required
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowQuoteForm(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg"
              >
                {isSubmitting ? "Transmitting..." : "Send Formal Quotation"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Received Quotations & Negotiation Threads */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          Supplier Quotations & Negotiation History ({rfq.quotations?.length || 0})
        </h2>

        {(!rfq.quotations || rfq.quotations.length === 0) ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
            No quotations have been submitted yet. Be the first verified supplier to bid!
          </div>
        ) : (
          <div className="space-y-4">
            {rfq.quotations.map((quo: any) => (
              <div
                key={quo.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-slate-500">
                      Quote Ref: {quo.quoteNumber}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                      {quo.sellerName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-extrabold text-blue-600">
                      {formatCurrency(quo.unitPrice)} / unit
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Total: {formatCurrency(quo.totalPrice)} (MOQ {quo.minQuantity})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-slate-500 text-[11px]">Production Lead Time</span>
                    <div className="font-semibold text-slate-900">{quo.leadTimeDays} Days</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Quote Valid Until</span>
                    <div className="font-semibold text-slate-900">{formatDate(quo.validUntil)}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Status</span>
                    <div className="font-bold text-emerald-600">{quo.status}</div>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500">Terms & Conditions:</span>
                  <p className="text-xs text-slate-700 mt-0.5">{quo.terms}</p>
                </div>

                {/* Negotiation Messages */}
                {quo.messages && quo.messages.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Negotiation Log:
                    </span>
                    {quo.messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className="p-3 bg-slate-50/70 rounded-xl text-xs border border-slate-200/60"
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-800 text-[11px]">
                          <span>{msg.senderName}</span>
                          <span className="text-slate-400 font-normal">{formatDateTime(msg.createdAt)}</span>
                        </div>
                        <p className="text-slate-700 mt-1">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
