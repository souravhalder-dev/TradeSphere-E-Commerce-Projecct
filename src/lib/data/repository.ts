import { db } from "../db";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SELLERS,
  INITIAL_RFQS,
  INITIAL_ORDERS,
  MockProduct,
  MockCategory,
  MockSeller,
  MockRFQ,
  MockOrder,
} from "./mock-data";

// In-memory runtime state for development and sandbox operations
const memoryStore = {
  products: [...INITIAL_PRODUCTS],
  categories: [...INITIAL_CATEGORIES],
  sellers: [...INITIAL_SELLERS],
  rfqs: [...INITIAL_RFQS],
  orders: [...INITIAL_ORDERS],
};

let isPostgresAvailable: boolean | null = null;

async function checkPostgres(): Promise<boolean> {
  if (isPostgresAvailable !== null) return isPostgresAvailable;
  try {
    await db.$queryRaw`SELECT 1`;
    isPostgresAvailable = true;
  } catch {
    isPostgresAvailable = false;
  }
  return isPostgresAvailable;
}

export const repository = {
  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------
  async getCategories(): Promise<MockCategory[]> {
    const hasPostgres = await checkPostgres();
    if (hasPostgres) {
      try {
        const cats = await db.category.findMany({
          include: { _count: { select: { products: true } } },
        });
        if (cats.length > 0) {
          return cats.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || "",
            imageUrl: c.imageUrl || "",
            productCount: c._count.products,
          }));
        }
      } catch (err) {
        console.warn("Postgres query failed, falling back to memoryStore:", err);
      }
    }
    return memoryStore.categories;
  },

  async getCategoryBySlug(slug: string): Promise<MockCategory | null> {
    const cats = await this.getCategories();
    return cats.find((c) => c.slug === slug) || null;
  },

  // ---------------------------------------------------------------------------
  // Products
  // ---------------------------------------------------------------------------
  async getProducts(params?: {
    categorySlug?: string;
    searchQuery?: string;
    minPrice?: number;
    maxPrice?: number;
    moqMax?: number;
    verifiedOnly?: boolean;
    country?: string;
    sellerId?: string;
    sortBy?: "relevance" | "price_asc" | "price_desc" | "rating" | "moq";
  }): Promise<MockProduct[]> {
    let list = [...memoryStore.products];

    if (params?.sellerId) {
      list = list.filter((p) => p.sellerId === params.sellerId);
    }
    if (params?.categorySlug) {
      list = list.filter((p) => p.categorySlug === params.categorySlug);
    }
    if (params?.searchQuery) {
      const q = params.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sellerStoreName.toLowerCase().includes(q)
      );
    }
    if (params?.minPrice !== undefined) {
      list = list.filter((p) => p.basePrice >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      list = list.filter((p) => p.basePrice <= params.maxPrice!);
    }
    if (params?.moqMax !== undefined) {
      list = list.filter((p) => p.moq <= params.moqMax!);
    }
    if (params?.verifiedOnly) {
      list = list.filter((p) => p.sellerVerified);
    }
    if (params?.country) {
      list = list.filter((p) => p.countryOfOrigin.toLowerCase() === params.country?.toLowerCase());
    }

    if (params?.sortBy === "price_asc") {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (params?.sortBy === "price_desc") {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (params?.sortBy === "rating") {
      list.sort((a, b) => b.ratingAverage - a.ratingAverage);
    } else if (params?.sortBy === "moq") {
      list.sort((a, b) => a.moq - b.moq);
    }

    return list;
  },

  async getProductBySlug(slug: string): Promise<MockProduct | null> {
    return memoryStore.products.find((p) => p.slug === slug) || null;
  },

  async getProductById(id: string): Promise<MockProduct | null> {
    return memoryStore.products.find((p) => p.id === id) || null;
  },

  async createProduct(productData: Partial<MockProduct> & { name: string; basePrice: number }): Promise<MockProduct> {
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProduct: MockProduct = {
      id: `prod-${Date.now()}`,
      sellerId: productData.sellerId || "seller-apex",
      sellerStoreName: productData.sellerStoreName || "Apex Industrial Technologies",
      sellerSlug: productData.sellerSlug || "apex-industrial",
      sellerVerified: true,
      sellerCountry: productData.countryOfOrigin || "US",
      categoryId: productData.categoryId || "cat-machinery",
      categoryName: productData.categoryName || "Industrial Machinery & Automation",
      categorySlug: productData.categorySlug || "industrial-machinery",
      name: productData.name,
      slug,
      description: productData.description || "",
      basePrice: productData.basePrice,
      moq: productData.moq || 1,
      leadTimeDays: productData.leadTimeDays || 3,
      countryOfOrigin: productData.countryOfOrigin || "US",
      status: "PUBLISHED",
      isFeatured: false,
      productionCapacity: productData.productionCapacity || "1,000 units/mo",
      sampleAvailable: productData.sampleAvailable || false,
      samplePrice: productData.samplePrice,
      customizationAvailable: productData.customizationAvailable || false,
      ratingAverage: 5.0,
      reviewCount: 0,
      salesCount: 0,
      specifications: productData.specifications || {},
      images: productData.images && productData.images.length > 0
        ? productData.images
        : ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80"],
      priceTiers: productData.priceTiers || [],
      variants: productData.variants || [
        {
          id: `var-${Date.now()}`,
          productId: `prod-${Date.now()}`,
          sku: `SKU-${Date.now().toString().slice(-6)}`,
          title: "Standard Edition",
          price: productData.basePrice,
          stock: 100,
          attributes: {},
        },
      ],
    };
    memoryStore.products.unshift(newProduct);
    return newProduct;
  },

  // ---------------------------------------------------------------------------
  // Sellers
  // ---------------------------------------------------------------------------
  async getSellers(): Promise<MockSeller[]> {
    return memoryStore.sellers;
  },

  async getSellerBySlug(slug: string): Promise<MockSeller | null> {
    return memoryStore.sellers.find((s) => s.storeSlug === slug) || null;
  },

  async getSellerById(id: string): Promise<MockSeller | null> {
    return memoryStore.sellers.find((s) => s.id === id) || null;
  },

  async updateSellerVerification(sellerId: string, status: "VERIFIED" | "REJECTED" | "UNDER_REVIEW"): Promise<MockSeller | null> {
    const seller = memoryStore.sellers.find((s) => s.id === sellerId);
    if (seller) {
      seller.verificationStatus = status;
      if (status === "VERIFIED") {
        seller.verifiedAt = new Date().toISOString();
      }
    }
    return seller || null;
  },

  // ---------------------------------------------------------------------------
  // RFQs & Quotations
  // ---------------------------------------------------------------------------
  async getRFQs(): Promise<MockRFQ[]> {
    return memoryStore.rfqs;
  },

  async getRFQById(id: string): Promise<MockRFQ | null> {
    return memoryStore.rfqs.find((r) => r.id === id) || null;
  },

  async createRFQ(data: {
    buyerId: string;
    buyerName: string;
    buyerCompany: string;
    title: string;
    categoryId: string;
    categoryName: string;
    quantity: number;
    targetPrice?: number;
    destinationCountry: string;
    specifications: string;
    deliveryDate?: string;
  }): Promise<MockRFQ> {
    const rfqNumber = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRfq: MockRFQ = {
      id: `rfq-${Date.now()}`,
      rfqNumber,
      buyerId: data.buyerId,
      buyerName: data.buyerName,
      buyerCompany: data.buyerCompany,
      title: data.title,
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      quantity: data.quantity,
      targetPrice: data.targetPrice,
      destinationCountry: data.destinationCountry,
      specifications: data.specifications,
      status: "SUBMITTED",
      deliveryDate: data.deliveryDate || new Date(Date.now() + 30 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      quotations: [],
    };
    memoryStore.rfqs.unshift(newRfq);
    return newRfq;
  },

  async submitQuotation(rfqId: string, quoteData: {
    sellerId: string;
    sellerName: string;
    unitPrice: number;
    minQuantity: number;
    leadTimeDays: number;
    validDays: number;
    terms: string;
  }): Promise<MockRFQ | null> {
    const rfq = memoryStore.rfqs.find((r) => r.id === rfqId);
    if (!rfq) return null;

    const totalPrice = Number((quoteData.unitPrice * rfq.quantity).toFixed(2));
    const validUntil = new Date(Date.now() + quoteData.validDays * 86400000).toISOString();

    const newQuotation = {
      id: `quo-${Date.now()}`,
      quoteNumber: `QUO-${Math.floor(1000 + Math.random() * 9000)}`,
      rfqId,
      sellerId: quoteData.sellerId,
      sellerName: quoteData.sellerName,
      unitPrice: quoteData.unitPrice,
      totalPrice,
      minQuantity: quoteData.minQuantity,
      leadTimeDays: quoteData.leadTimeDays,
      validUntil,
      terms: quoteData.terms,
      status: "OFFERED" as const,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: quoteData.sellerId,
          senderRole: "SELLER" as const,
          senderName: quoteData.sellerName,
          message: `Official Quotation submitted: $${quoteData.unitPrice}/unit. Terms: ${quoteData.terms}`,
          proposedPrice: quoteData.unitPrice,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    rfq.quotations.push(newQuotation);
    rfq.status = "QUOTED";
    return rfq;
  },

  // ---------------------------------------------------------------------------
  // Orders
  // ---------------------------------------------------------------------------
  async getOrders(params?: { buyerId?: string; sellerId?: string }): Promise<MockOrder[]> {
    let list = [...memoryStore.orders];
    if (params?.buyerId) {
      list = list.filter((o) => o.buyerId === params.buyerId);
    }
    if (params?.sellerId) {
      list = list.filter((o) => o.sellerId === params.sellerId);
    }
    return list;
  },

  async getOrderById(id: string): Promise<MockOrder | null> {
    return memoryStore.orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async createOrder(order: Omit<MockOrder, "id" | "orderNumber" | "createdAt">): Promise<MockOrder> {
    const orderNumber = `TS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: MockOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };
    memoryStore.orders.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(
    orderId: string,
    status: MockOrder["status"],
    trackingInfo?: { carrier?: string; trackingNumber?: string }
  ): Promise<MockOrder | null> {
    const order = memoryStore.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.status = status;
    if (trackingInfo?.carrier) order.carrier = trackingInfo.carrier;
    if (trackingInfo?.trackingNumber) order.trackingNumber = trackingInfo.trackingNumber;
    return order;
  },
};
