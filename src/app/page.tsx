import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Factory,
  Globe,
  ArrowRight,
  TrendingUp,
  FileText,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";
import { repository } from "@/lib/data/repository";
import { ProductCard } from "@/components/storefront/ProductCard";

export default async function HomePage() {
  const [categories, products, sellers, rfqs] = await Promise.all([
    repository.getCategories(),
    repository.getProducts({ sortBy: "relevance" }),
    repository.getSellers(),
    repository.getRFQs(),
  ]);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden py-16 md:py-24 border-b border-slate-800">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Direct Global Sourcing Platform • Over 1,200 Verified Manufacturers
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Source Direct from Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Global Suppliers</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              TradeSphere bridges institutional buyers with certified industrial manufacturers. Access volume-tiered wholesale pricing, formal RFQ negotiations, and Trade Assurance escrow protection.
            </p>

            {/* Prominent Hero Search Form */}
            <form
              action="/products"
              method="GET"
              className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl border border-slate-200"
            >
              <div className="flex-1 flex items-center px-3 py-1">
                <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  name="q"
                  placeholder="Enter product, material, model number, or industry SKU..."
                  className="w-full text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Search Sourcing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Sourcing Metrics */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-800">
              <div>
                <div className="text-2xl font-bold text-white">180+</div>
                <div className="text-xs text-slate-400">Export Countries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">99.4%</div>
                <div className="text-xs text-slate-400">On-Time Dispatch</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">$450M+</div>
                <div className="text-xs text-slate-400">Trade Protected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">24 Hours</div>
                <div className="text-xs text-slate-400">Avg. RFQ Response</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14">
        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Explore Sourcing Sectors</h2>
              <p className="text-xs text-slate-500 mt-0.5">Top-level wholesale categories direct from audited factory floors</p>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative bg-white border border-slate-200 hover:border-blue-500 rounded-xl overflow-hidden p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-3">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 text-[11px] font-medium text-white/90">
                    {cat.productCount.toLocaleString()} products
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Wholesale Deals & Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Featured Catalog</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Wholesale Products with Volume Price Tiers</h2>
            </div>

            <Link
              href="/products"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              <span>Explore 20,000+ Items</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* B2B RFQ Promotion Banner */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <FileText className="w-3.5 h-3.5" />
              TradeSphere Sourcing Request (RFQ)
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Can’t find your exact specification? Submit a Custom RFQ
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Post your target price, required volume, and CAD/technical specs. Receive competitive formal quotations and counteroffers directly from verified manufacturers within 24 hours.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/rfq"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                <span>Submit RFQ Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/rfq"
                className="bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3 rounded-xl text-sm transition border border-white/10"
              >
                Browse Open RFQ Market ({rfqs.length} Live)
              </Link>
            </div>
          </div>
        </section>

        {/* Verified Suppliers Directory Spotlight */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Audited & Verified Manufacturers</h2>
              <p className="text-xs text-slate-500 mt-0.5">Direct factory relationships with audited production lines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-blue-400 transition space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={seller.logoUrl}
                      alt={seller.storeName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/sellers/${seller.storeSlug}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition"
                        >
                          {seller.storeName}
                        </Link>
                        {seller.verificationStatus === "VERIFIED" && (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200">
                            <ShieldCheck className="w-3 h-3 text-blue-600" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Factory className="w-3 h-3" />
                        {seller.country} • Est. {seller.establishedYear} • Response Rate: {seller.responseRate}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {seller.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                  <span className="text-slate-500">
                    Location: <strong className="text-slate-700">{seller.businessAddress}</strong>
                  </span>
                  <Link
                    href={`/sellers/${seller.storeSlug}`}
                    className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Visit Storefront</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
