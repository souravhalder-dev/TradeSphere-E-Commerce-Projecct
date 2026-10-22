import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Package,
  Layers,
  AlertTriangle,
  FileCheck2,
  Lock,
  Globe,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 text-slate-300 flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="p-5 border-b border-slate-900">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">Admin Center</span>
                <span className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase">
                  Super Administrator
                </span>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1 text-xs font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-slate-900 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              <span>Platform Health & GMV</span>
            </Link>

            <Link
              href="/admin/sellers"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:text-white hover:bg-slate-900 transition"
            >
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              <span>Seller Verification Queue</span>
            </Link>

            <Link
              href="/admin/audit-logs"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:text-white hover:bg-slate-900 transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security & Audit Trail</span>
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-900 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Platform Security Active</span>
          </div>
          <p className="text-[11px]">PostgreSQL 16 & Redis Services Ready</p>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
