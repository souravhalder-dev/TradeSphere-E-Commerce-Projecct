export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount: number;
}

export interface MockPriceTier {
  id: string;
  productId: string;
  minQuantity: number;
  maxQuantity: number | null;
  unitPrice: number;
}

export interface MockVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface MockProduct {
  id: string;
  sellerId: string;
  sellerStoreName: string;
  sellerSlug: string;
  sellerVerified: boolean;
  sellerCountry: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  moq: number;
  leadTimeDays: number;
  countryOfOrigin: string;
  status: "PUBLISHED" | "PENDING_REVIEW" | "DRAFT" | "OUT_OF_STOCK";
  isFeatured: boolean;
  productionCapacity: string;
  sampleAvailable: boolean;
  samplePrice?: number;
  customizationAvailable: boolean;
  ratingAverage: number;
  reviewCount: number;
  salesCount: number;
  specifications: Record<string, string>;
  images: string[];
  priceTiers: MockPriceTier[];
  variants: MockVariant[];
}

export interface MockSeller {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  description: string;
  businessAddress: string;
  country: string;
  verificationStatus: "VERIFIED" | "PENDING" | "UNDER_REVIEW" | "REJECTED";
  verifiedAt?: string;
  commissionRate: number;
  availableBalance: number;
  pendingBalance: number;
  logoUrl: string;
  bannerUrl?: string;
  phone: string;
  email: string;
  establishedYear: number;
  responseRate: string;
}

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: "BUYER" | "BUSINESS_BUYER" | "SELLER" | "ADMIN" | "SUPER_ADMIN";
  companyName?: string;
}

export interface MockRFQ {
  id: string;
  rfqNumber: string;
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
  status: "SUBMITTED" | "QUOTED" | "NEGOTIATING" | "ACCEPTED" | "REJECTED" | "CONVERTED_TO_ORDER";
  deliveryDate: string;
  createdAt: string;
  quotations: MockQuotation[];
}

export interface MockQuotation {
  id: string;
  quoteNumber: string;
  rfqId: string;
  sellerId: string;
  sellerName: string;
  unitPrice: number;
  totalPrice: number;
  minQuantity: number;
  leadTimeDays: number;
  validUntil: string;
  terms: string;
  status: "OFFERED" | "COUNTERED" | "ACCEPTED" | "REJECTED";
  messages: {
    id: string;
    senderId: string;
    senderRole: "BUYER" | "SELLER";
    senderName: string;
    message: string;
    proposedPrice?: number;
    createdAt: string;
  }[];
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerStoreName: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  currency: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PAID" | "UNPAID" | "REFUNDED";
  paymentProvider: string;
  trackingNumber?: string;
  carrier?: string;
  shippingAddress: {
    fullName: string;
    companyName?: string | null;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  isB2BTradeAssurance: boolean;
  createdAt: string;
}

export const INITIAL_CATEGORIES: MockCategory[] = [
  {
    id: "cat-machinery",
    name: "Industrial Machinery & Automation",
    slug: "industrial-machinery",
    description: "CNC milling machines, robotic automation, precision lasers, and hydraulic fabrication equipment",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    productCount: 1420,
  },
  {
    id: "cat-electronics",
    name: "Electronics & Semiconductors",
    slug: "electronics-components",
    description: "Industrial IoT modules, microcontrollers, smart telemetry, and power converters",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    productCount: 3890,
  },
  {
    id: "cat-textiles",
    name: "Apparel, Textiles & Fabrics",
    slug: "apparel-textiles",
    description: "Organic cotton textiles, high-visibility safety workwear, raw woven yarns, and uniforms",
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    productCount: 2150,
  },
  {
    id: "cat-energy",
    name: "Renewable Energy & Storage",
    slug: "renewable-energy",
    description: "Commercial solar inverters, lithium energy storage, smart microgrid units, and PV panels",
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
    productCount: 840,
  },
  {
    id: "cat-packaging",
    name: "Packaging & Logistics Supplies",
    slug: "packaging-supplies",
    description: "Eco-friendly corrugated mailers, heavy-duty stretch film, automated carton sealers",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    productCount: 1670,
  },
];

export const INITIAL_SELLERS: MockSeller[] = [
  {
    id: "seller-apex",
    userId: "usr-apex-owner",
    storeName: "Apex Industrial Technologies",
    storeSlug: "apex-industrial",
    description: "Tier-1 certified manufacturer of 5-axis CNC machining centers, laser cutters, and factory automation equipment with 25 years global export experience.",
    businessAddress: "450 Industrial Parkway, Detroit, MI 48201",
    country: "US",
    verificationStatus: "VERIFIED",
    verifiedAt: "2024-01-15T00:00:00.000Z",
    commissionRate: 4.5,
    availableBalance: 24500.0,
    pendingBalance: 8200.0,
    logoUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&q=80",
    phone: "+1-313-555-0199",
    email: "sales@apexmachinery.com",
    establishedYear: 1999,
    responseRate: "99% (< 2h)",
  },
  {
    id: "seller-nextech",
    userId: "usr-nextech-owner",
    storeName: "Shenzhen NexTech Components",
    storeSlug: "nextech-electronics",
    description: "ISO9001 & CE Certified Semiconductor Manufacturer. Specialized in ARM Cortex microcontrollers, LoRa wireless sensors, and power converters.",
    businessAddress: "Hi-Tech Industrial Park, Nanshan, Shenzhen, China",
    country: "CN",
    verificationStatus: "VERIFIED",
    verifiedAt: "2023-11-20T00:00:00.000Z",
    commissionRate: 5.0,
    availableBalance: 51200.0,
    pendingBalance: 14500.0,
    logoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
    phone: "+86-755-8833-2100",
    email: "export@nextechelec.com",
    establishedYear: 2012,
    responseRate: "98% (< 1h)",
  },
];

export const INITIAL_PRODUCTS: MockProduct[] = [
  {
    id: "prod-cnc-850",
    sellerId: "seller-apex",
    sellerStoreName: "Apex Industrial Technologies",
    sellerSlug: "apex-industrial",
    sellerVerified: true,
    sellerCountry: "US",
    categoryId: "cat-machinery",
    categoryName: "Industrial Machinery & Automation",
    categorySlug: "industrial-machinery",
    name: "Industrial Precision 5-Axis CNC Milling Center V850",
    slug: "industrial-5axis-cnc-milling-center-v850",
    description: "Heavy-duty 5-axis simultaneous CNC vertical machining center with Siemens 840D controller, 24-station automatic tool changer, and dynamic high-torque spindle for aerospace, medical, and mold fabrication.",
    basePrice: 42500.0,
    moq: 1,
    leadTimeDays: 14,
    countryOfOrigin: "US",
    status: "PUBLISHED",
    isFeatured: true,
    productionCapacity: "30 units / month",
    sampleAvailable: false,
    customizationAvailable: true,
    ratingAverage: 4.95,
    reviewCount: 18,
    salesCount: 42,
    specifications: {
      "Spindle Speed": "15,000 RPM Direct Drive",
      "Travel (X/Y/Z)": "850 x 500 x 550 mm",
      "Table Load": "600 kg",
      "Control System": "Siemens Sinumerik 840D sl",
      "Tool Holder": "BT40 Dual Contact",
      "Rapid Traverse": "36 m/min",
    },
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80",
    ],
    priceTiers: [
      { id: "tier-1", productId: "prod-cnc-850", minQuantity: 1, maxQuantity: 2, unitPrice: 42500.0 },
      { id: "tier-2", productId: "prod-cnc-850", minQuantity: 3, maxQuantity: 5, unitPrice: 39800.0 },
      { id: "tier-3", productId: "prod-cnc-850", minQuantity: 6, maxQuantity: null, unitPrice: 36500.0 },
    ],
    variants: [
      {
        id: "var-cnc-std",
        productId: "prod-cnc-850",
        sku: "APX-CNC-850-STD",
        title: "Standard 12,000 RPM / BT40",
        price: 42500.0,
        stock: 8,
        attributes: { Spindle: "12,000 RPM", Coolant: "Flood" },
      },
      {
        id: "var-cnc-pro",
        productId: "prod-cnc-850",
        sku: "APX-CNC-850-PRO",
        title: "High-Speed 20,000 RPM / HSK-A63",
        price: 46800.0,
        stock: 4,
        attributes: { Spindle: "20,000 RPM High-Torque", Coolant: "Through-Spindle 70 Bar" },
      },
    ],
  },
  {
    id: "prod-lora-gw",
    sellerId: "seller-nextech",
    sellerStoreName: "Shenzhen NexTech Components",
    sellerSlug: "nextech-electronics",
    sellerVerified: true,
    sellerCountry: "CN",
    categoryId: "cat-electronics",
    categoryName: "Electronics & Semiconductors",
    categorySlug: "electronics-components",
    name: "Ultra-Low-Power LoRaWAN Industrial IoT Sensor Gateway Module",
    slug: "ultralow-power-lorawan-iot-gateway-module",
    description: "Industrial grade 8-channel SX1302 LoRaWAN gateway core module with IP67 enclosure compatibility, Semtech chipset, RS485 / Modbus RTU interface, and solar-ready battery telemetry.",
    basePrice: 85.0,
    moq: 10,
    leadTimeDays: 5,
    countryOfOrigin: "CN",
    status: "PUBLISHED",
    isFeatured: true,
    productionCapacity: "50,000 units / month",
    sampleAvailable: true,
    samplePrice: 95.0,
    customizationAvailable: true,
    ratingAverage: 4.88,
    reviewCount: 64,
    salesCount: 3820,
    specifications: {
      "Frequency Bands": "US915 / EU868 / AS923 / IN865",
      "Operating Temp": "-40°C to +85°C",
      "Receiver Sensitivity": "-141 dBm",
      "Interfaces": "SPI, UART, I2C, USB 2.0",
      "Certifications": "FCC, CE, RoHS, Telec",
    },
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&q=80",
    ],
    priceTiers: [
      { id: "tier-lora-1", productId: "prod-lora-gw", minQuantity: 10, maxQuantity: 49, unitPrice: 85.0 },
      { id: "tier-lora-2", productId: "prod-lora-gw", minQuantity: 50, maxQuantity: 199, unitPrice: 72.0 },
      { id: "tier-lora-3", productId: "prod-lora-gw", minQuantity: 200, maxQuantity: 999, unitPrice: 58.5 },
      { id: "tier-lora-4", productId: "prod-lora-gw", minQuantity: 1000, maxQuantity: null, unitPrice: 48.0 },
    ],
    variants: [
      {
        id: "var-lora-915",
        productId: "prod-lora-gw",
        sku: "NXT-LORA-915-US",
        title: "US915 MHz Band (North America)",
        price: 85.0,
        stock: 4500,
        attributes: { Region: "US915", Antenna: "SMA Female" },
      },
      {
        id: "var-lora-868",
        productId: "prod-lora-gw",
        sku: "NXT-LORA-868-EU",
        title: "EU868 MHz Band (Europe / Africa)",
        price: 85.0,
        stock: 3200,
        attributes: { Region: "EU868", Antenna: "SMA Female" },
      },
    ],
  },
  {
    id: "prod-solar-inv",
    sellerId: "seller-apex",
    sellerStoreName: "Apex Industrial Technologies",
    sellerSlug: "apex-industrial",
    sellerVerified: true,
    sellerCountry: "US",
    categoryId: "cat-energy",
    categoryName: "Renewable Energy & Storage",
    categorySlug: "renewable-energy",
    name: "Commercial 100kW Three-Phase Hybrid Solar Inverter System",
    slug: "commercial-100kw-threephase-hybrid-solar-inverter",
    description: "Utility and industrial grade grid-tied hybrid inverter with high-voltage battery storage interface, 6 MPPT trackers, AFCI arc-fault protection, and 98.8% peak efficiency.",
    basePrice: 5800.0,
    moq: 2,
    leadTimeDays: 10,
    countryOfOrigin: "US",
    status: "PUBLISHED",
    isFeatured: true,
    productionCapacity: "500 units / month",
    sampleAvailable: true,
    samplePrice: 6200.0,
    customizationAvailable: true,
    ratingAverage: 4.92,
    reviewCount: 31,
    salesCount: 184,
    specifications: {
      "Rated AC Output": "100 kW / 400V 3P+N+PE",
      "Max PV Voltage": "1100 VDC",
      "MPPT Channels": "6 / 12 Strings",
      "Battery Range": "200V - 900V DC",
      "Enclosure": "NEMA 4X / IP66",
    },
    images: [
      "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
    ],
    priceTiers: [
      { id: "tier-inv-1", productId: "prod-solar-inv", minQuantity: 2, maxQuantity: 4, unitPrice: 5800.0 },
      { id: "tier-inv-2", productId: "prod-solar-inv", minQuantity: 5, maxQuantity: 9, unitPrice: 5200.0 },
      { id: "tier-inv-3", productId: "prod-solar-inv", minQuantity: 10, maxQuantity: null, unitPrice: 4650.0 },
    ],
    variants: [
      {
        id: "var-inv-std",
        productId: "prod-solar-inv",
        sku: "APX-INV-100KW-STD",
        title: "100kW Three-Phase 400V / 60Hz",
        price: 5800.0,
        stock: 45,
        attributes: { Voltage: "400V", Frequency: "60Hz" },
      },
    ],
  },
  {
    id: "prod-corrugated-boxes",
    sellerId: "seller-nextech",
    sellerStoreName: "Shenzhen NexTech Components",
    sellerSlug: "nextech-electronics",
    sellerVerified: true,
    sellerCountry: "CN",
    categoryId: "cat-packaging",
    categoryName: "Packaging & Logistics Supplies",
    categorySlug: "packaging-supplies",
    name: "Heavy-Duty Biodegradable Corrugated Shipping Boxes (Bulk 500pk)",
    slug: "heavy-duty-biodegradable-corrugated-shipping-boxes",
    description: "32-ECT double-wall corrugated cardboard cartons certified compostable and ocean-safe. Engineered for e-commerce export packaging and heavy fulfillment logistics.",
    basePrice: 280.0,
    moq: 5,
    leadTimeDays: 3,
    countryOfOrigin: "US",
    status: "PUBLISHED",
    isFeatured: false,
    productionCapacity: "100,000 bundles / month",
    sampleAvailable: true,
    samplePrice: 40.0,
    customizationAvailable: true,
    ratingAverage: 4.75,
    reviewCount: 42,
    salesCount: 1420,
    specifications: {
      "Dimensions": "16 x 12 x 10 inches",
      "Wall Type": "Double-Wall B/C Flute (ECT-48)",
      "Material": "100% Recycled Kraft Liner",
      "Weight Capacity": "65 lbs / 30 kg",
    },
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    ],
    priceTiers: [
      { id: "tier-box-1", productId: "prod-corrugated-boxes", minQuantity: 5, maxQuantity: 19, unitPrice: 280.0 },
      { id: "tier-box-2", productId: "prod-corrugated-boxes", minQuantity: 20, maxQuantity: 49, unitPrice: 245.0 },
      { id: "tier-box-3", productId: "prod-corrugated-boxes", minQuantity: 50, maxQuantity: null, unitPrice: 210.0 },
    ],
    variants: [
      {
        id: "var-box-m500",
        productId: "prod-corrugated-boxes",
        sku: "NXT-BOX-M500",
        title: "Medium Carton (16x12x10) - Bundle of 500",
        price: 280.0,
        stock: 650,
        attributes: { Size: "16x12x10 in", PackSize: "500 units" },
      },
    ],
  },
];

export const INITIAL_RFQS: MockRFQ[] = [
  {
    id: "rfq-grid-telemetry",
    rfqNumber: "RFQ-2026-0089",
    buyerId: "usr-buyer-acme",
    buyerName: "Sarah Jenkins",
    buyerCompany: "Acme Global Procurement Inc",
    title: "Sourcing 500 Units Industrial LoRaWAN Gateways for Smart Grid Telemetry",
    categoryId: "cat-electronics",
    categoryName: "Electronics & Semiconductors",
    quantity: 500,
    targetPrice: 55.0,
    destinationCountry: "US",
    specifications: "Must support US915 MHz with IP67 outdoor mounting brackets, dual antenna ports, PoE power input (802.3af), and CE/FCC compliance certificates.",
    status: "QUOTED",
    deliveryDate: "2026-11-30T00:00:00.000Z",
    createdAt: "2026-10-20T10:15:00.000Z",
    quotations: [
      {
        id: "quo-8901",
        quoteNumber: "QUO-APX-8901",
        rfqId: "rfq-grid-telemetry",
        sellerId: "seller-nextech",
        sellerName: "Shenzhen NexTech Components",
        unitPrice: 52.0,
        totalPrice: 26000.0,
        minQuantity: 200,
        leadTimeDays: 12,
        validUntil: "2026-11-20T00:00:00.000Z",
        terms: "30% advance via Trade Assurance, 70% balance upon BL issuance. Includes 2-year factory warranty.",
        status: "OFFERED",
        messages: [
          {
            id: "msg-1",
            senderId: "usr-nextech-owner",
            senderRole: "SELLER",
            senderName: "Li Wei (NexTech)",
            message: "Hello Sarah, we can supply all 500 units configured for US915 MHz with IP67 die-cast aluminum enclosures at $52/unit. Lead time is 12 days.",
            proposedPrice: 52.0,
            createdAt: "2026-10-21T08:30:00.000Z",
          },
        ],
      },
    ],
  },
];

export const INITIAL_ORDERS: MockOrder[] = [
  {
    id: "ord-2026-1001",
    orderNumber: "TS-2026-1001",
    buyerId: "usr-buyer-acme",
    buyerName: "Sarah Jenkins",
    sellerId: "seller-apex",
    sellerStoreName: "Apex Industrial Technologies",
    items: [
      {
        id: "item-1",
        productId: "prod-solar-inv",
        productName: "Commercial 100kW Three-Phase Hybrid Solar Inverter System",
        sku: "APX-INV-100KW-STD",
        unitPrice: 5800.0,
        quantity: 2,
        totalPrice: 11600.0,
      },
    ],
    subtotal: 11600.0,
    discount: 100.0,
    shippingFee: 250.0,
    tax: 0.0,
    totalAmount: 11750.0,
    currency: "USD",
    status: "PROCESSING",
    paymentStatus: "PAID",
    paymentProvider: "MOCK_DEVELOPMENT",
    trackingNumber: "TS-EXP-849201",
    carrier: "TradeSphere Freight",
    shippingAddress: {
      fullName: "Sarah Jenkins",
      companyName: "Acme Global Procurement Inc",
      street: "742 Evergreen Blvd, Suite 800",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "US",
      phone: "+1-212-555-0144",
    },
    isB2BTradeAssurance: true,
    createdAt: "2026-10-21T14:22:00.000Z",
  },
];
