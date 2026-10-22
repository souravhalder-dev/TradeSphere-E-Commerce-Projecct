import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  Factory,
  Globe,
  Clock,
  Mail,
  Phone,
  FileText,
  Star,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { repository } from "@/lib/data/repository";
import { ProductCard } from "@/components/storefront/ProductCard";

interface SellerPageProps {
  params: {
    slug: string;
  };
}

export default async function SellerStorefrontPage({ params }: SellerPageProps) {
  const seller = await repository.getSellerBySlug(params.slug);
  if (!seller) {
    notFound();
  }

  const products = await repository.getProducts({ sellerId: seller.id });

  return (
    <div className="space-y-8 pb-16">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 bg-slate-900 overflow-hidden">
        <img
          src={seller.bannerUrl || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&q=80"}
          alt=""
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8 -mt-20 relative z-10">
        {/* Supplier Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={seller.logoUrl}
              alt={seller.storeName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-lg bg-white"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {seller.storeName}
                </h1>
                {seller.verificationStatus === "VERIFIED" && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Verified Global Manufacturer
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {seller.country} • Est. {seller.establishedYear}
                </span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold">
                  Response Rate: {seller.responseRate}
                </span>
              </p>

              <p className="text-xs text-slate-600 max-w-2xl pt-1">
                {seller.description}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <Link
              href="/rfq"
              className="flex-1 sm:flex-none text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Request RFQ Quote</span>
            </Link>
            <span className="text-[11px] text-slate-500 text-center font-medium">
              Trade Assurance Escrow Protected
            </span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Supplier Catalog ({products.length} Products)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All products ship directly from this supplier with factory warranty
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
