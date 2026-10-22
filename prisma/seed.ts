import { PrismaClient, UserRole, VerificationStatus, ProductStatus, CouponType, RFQStatus, QuotationStatus, OrderStatus, PaymentStatus, PaymentProvider } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function seedDatabase() {
  console.log("🌱 Starting TradeSphere database seeding...");

  // 1. Create Admins
  const adminPassword = await hashPassword("AdminPass123!");
  const superAdmin = await db.user.upsert({
    where: { email: "admin@tradesphere.com" },
    update: {},
    create: {
      email: "admin@tradesphere.com",
      name: "Global Platform Administrator",
      passwordHash: adminPassword,
      role: UserRole.SUPER_ADMIN,
      phone: "+1-800-555-0199",
      emailVerified: new Date(),
    },
  });
  console.log(`✓ Admin user created: ${superAdmin.email}`);

  // 2. Create Categories
  const categoriesData = [
    {
      name: "Industrial Machinery & Automation",
      slug: "industrial-machinery",
      description: "CNC machines, industrial robotic arms, milling cutters, and fabrication systems",
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    },
    {
      name: "Electronics & Components",
      slug: "electronics-components",
      description: "Microcontrollers, IoT embedded sensors, power converters, and semiconductor wafers",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    },
    {
      name: "Apparel, Textiles & Fabrics",
      slug: "apparel-textiles",
      description: "Wholesale organic cotton, performance textiles, industrial safety workwear, and yarns",
      imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    },
    {
      name: "Renewable Energy & Storage",
      slug: "renewable-energy",
      description: "Industrial solar inverters, lithium battery banks, grid equipment, and smart meters",
      imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
    },
    {
      name: "Packaging & Logistics Supplies",
      slug: "packaging-supplies",
      description: "Corrugated bulk cartons, biodegradable mailers, heavy-duty pallet wrap, and sealing equipment",
      imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    },
  ];

  const createdCategories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const record = await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = record;
  }
  console.log(`✓ Seeded ${Object.keys(createdCategories).length} product categories`);

  // 3. Create Verified Sellers & Organizations
  const sellerPassword = await hashPassword("SupplierPass123!");

  // Seller 1: Apex Industrial Machinery
  const apexUser = await db.user.upsert({
    where: { email: "sales@apexmachinery.com" },
    update: {},
    create: {
      email: "sales@apexmachinery.com",
      name: "Marcus Vance",
      passwordHash: sellerPassword,
      role: UserRole.SELLER,
      emailVerified: new Date(),
    },
  });

  const apexOrg = await db.organization.upsert({
    where: { slug: "apex-machinery-corp" },
    update: {},
    create: {
      name: "Apex Global Machinery Corp",
      slug: "apex-machinery-corp",
      taxId: "US-EIN-94827103",
      country: "US",
      website: "https://apexmachinery.example.com",
    },
  });

  const apexSeller = await db.sellerProfile.upsert({
    where: { storeSlug: "apex-industrial" },
    update: {},
    create: {
      userId: apexUser.id,
      organizationId: apexOrg.id,
      storeName: "Apex Industrial Technologies",
      storeSlug: "apex-industrial",
      description: "Tier-1 certified manufacturer of 5-axis CNC machining centers, laser cutters, and factory automation equipment with 25 years global export experience.",
      businessAddress: "450 Industrial Parkway, Detroit, MI 48201",
      country: "US",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      commissionRate: 4.5,
      availableBalance: 24500.0,
      logoUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200&q=80",
    },
  });

  // Seller 2: Shenzhen NexTech Electronics
  const nextechUser = await db.user.upsert({
    where: { email: "export@nextechelec.com" },
    update: {},
    create: {
      email: "export@nextechelec.com",
      name: "Li Wei",
      passwordHash: sellerPassword,
      role: UserRole.SELLER,
      emailVerified: new Date(),
    },
  });

  const nextechOrg = await db.organization.upsert({
    where: { slug: "nextech-electronics-ltd" },
    update: {},
    create: {
      name: "Shenzhen NexTech Electronics Ltd",
      slug: "nextech-electronics-ltd",
      taxId: "CN-TAX-91440300MA5",
      country: "CN",
      website: "https://nextechelec.example.com",
    },
  });

  const nextechSeller = await db.sellerProfile.upsert({
    where: { storeSlug: "nextech-electronics" },
    update: {},
    create: {
      userId: nextechUser.id,
      organizationId: nextechOrg.id,
      storeName: "Shenzhen NexTech Components",
      storeSlug: "nextech-electronics",
      description: "ISO9001 & CE Certified Semiconductor Manufacturer. Specialized in ARM Cortex microcontrollers, LoRa wireless sensors, and power converters.",
      businessAddress: "Hi-Tech Industrial Park, Nanshan, Shenzhen, China",
      country: "CN",
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date(),
      commissionRate: 5.0,
      availableBalance: 51200.0,
      logoUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&q=80",
    },
  });
  console.log("✓ Verified Sellers & Organizations created");

  // 4. Create B2B Buyer
  const buyerPassword = await hashPassword("BuyerPass123!");
  const buyerUser = await db.user.upsert({
    where: { email: "buyer@acmecorp.com" },
    update: {},
    create: {
      email: "buyer@acmecorp.com",
      name: "Sarah Jenkins",
      passwordHash: buyerPassword,
      role: UserRole.BUSINESS_BUYER,
      phone: "+1-212-555-0144",
      emailVerified: new Date(),
    },
  });

  const buyerOrg = await db.organization.upsert({
    where: { slug: "acme-procurement-inc" },
    update: {},
    create: {
      name: "Acme Global Procurement Inc",
      slug: "acme-procurement-inc",
      country: "US",
    },
  });

  await db.organizationMembership.upsert({
    where: {
      userId_organizationId: {
        userId: buyerUser.id,
        organizationId: buyerOrg.id,
      },
    },
    update: {},
    create: {
      userId: buyerUser.id,
      organizationId: buyerOrg.id,
      roleInOrg: "PROCUREMENT_MANAGER",
      isPrimary: true,
    },
  });

  const buyerAddress = await db.address.create({
    data: {
      userId: buyerUser.id,
      fullName: "Sarah Jenkins (Acme Logistics Dock #4)",
      companyName: "Acme Global Procurement Inc",
      street: "742 Evergreen Blvd, Suite 800",
      city: "Chicago",
      state: "IL",
      postalCode: "60601",
      country: "US",
      phone: "+1-212-555-0144",
      isDefault: true,
    },
  });
  console.log("✓ Business Buyer & Organization address created");

  // 5. Seed Products with Variants & Tiered Pricing
  const productsData = [
    {
      sellerId: apexSeller.id,
      categoryId: createdCategories["industrial-machinery"].id,
      name: "Industrial Precision 5-Axis CNC Milling Center V850",
      slug: "industrial-5axis-cnc-milling-center-v850",
      description: "Heavy-duty 5-axis simultaneous CNC vertical machining center with Siemens 840D controller, 24-station automatic tool changer, and dynamic high-torque spindle for aerospace, medical, and mold fabrication.",
      basePrice: 42500.0,
      moq: 1,
      leadTimeDays: 14,
      countryOfOrigin: "US",
      status: ProductStatus.PUBLISHED,
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
      },
      images: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
        "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80",
      ],
      priceTiers: [
        { minQuantity: 1, maxQuantity: 2, unitPrice: 42500.0 },
        { minQuantity: 3, maxQuantity: 5, unitPrice: 39800.0 },
        { minQuantity: 6, maxQuantity: null, unitPrice: 36500.0 },
      ],
      variants: [
        {
          sku: "APX-CNC-850-STD",
          title: "Standard 12,000 RPM / BT40",
          price: 42500.0,
          stock: 8,
          attributes: { Spindle: "12,000 RPM", Coolant: "Flood" },
        },
        {
          sku: "APX-CNC-850-PRO",
          title: "High-Speed 20,000 RPM / HSK-A63",
          price: 46800.0,
          stock: 4,
          attributes: { Spindle: "20,000 RPM High-Torque", Coolant: "Through-Spindle 70 Bar" },
        },
      ],
    },
    {
      sellerId: nextechSeller.id,
      categoryId: createdCategories["electronics-components"].id,
      name: "Ultra-Low-Power LoRaWAN Industrial IoT Sensor Gateway Module",
      slug: "ultralow-power-lorawan-iot-gateway-module",
      description: "Industrial grade 8-channel SX1302 LoRaWAN gateway core module with IP67 enclosure compatibility, Semtech chipset, RS485 / Modbus RTU interface, and solar-ready battery telemetry.",
      basePrice: 85.0,
      moq: 10,
      leadTimeDays: 5,
      countryOfOrigin: "CN",
      status: ProductStatus.PUBLISHED,
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
        "Operating Temperature": "-40°C to +85°C",
        "Receiver Sensitivity": "-141 dBm",
        "Interfaces": "SPI, UART, I2C, USB 2.0",
        "Certifications": "FCC, CE, RoHS, Telec",
      },
      images: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
        "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&q=80",
      ],
      priceTiers: [
        { minQuantity: 10, maxQuantity: 49, unitPrice: 85.0 },
        { minQuantity: 50, maxQuantity: 199, unitPrice: 72.0 },
        { minQuantity: 200, maxQuantity: 999, unitPrice: 58.5 },
        { minQuantity: 1000, maxQuantity: null, unitPrice: 48.0 },
      ],
      variants: [
        {
          sku: "NXT-LORA-915-US",
          title: "US915 MHz Band (North America)",
          price: 85.0,
          stock: 4500,
          attributes: { Region: "US915", Antenna: "SMA Female" },
        },
        {
          sku: "NXT-LORA-868-EU",
          title: "EU868 MHz Band (Europe / Africa)",
          price: 85.0,
          stock: 3200,
          attributes: { Region: "EU868", Antenna: "SMA Female" },
        },
      ],
    },
    {
      sellerId: apexSeller.id,
      categoryId: createdCategories["renewable-energy"].id,
      name: "Commercial 100kW Three-Phase Hybrid Solar Inverter System",
      slug: "commercial-100kw-threephase-hybrid-solar-inverter",
      description: "Utility and industrial grade grid-tied hybrid inverter with high-voltage battery storage interface, 6 MPPT trackers, AFCI arc-fault protection, and 98.8% peak efficiency.",
      basePrice: 5800.0,
      moq: 2,
      leadTimeDays: 10,
      countryOfOrigin: "US",
      status: ProductStatus.PUBLISHED,
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
        "Max PV Input Voltage": "1100 VDC",
        "MPPT Channels": "6 / 12 Strings",
        "Battery Voltage Range": "200V - 900V DC",
        "Enclosure Rating": "NEMA 4X / IP66",
      },
      images: [
        "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
      ],
      priceTiers: [
        { minQuantity: 2, maxQuantity: 4, unitPrice: 5800.0 },
        { minQuantity: 5, maxQuantity: 9, unitPrice: 5200.0 },
        { minQuantity: 10, maxQuantity: null, unitPrice: 4650.0 },
      ],
      variants: [
        {
          sku: "APX-INV-100KW-STD",
          title: "100kW Three-Phase 400V / 60Hz",
          price: 5800.0,
          stock: 45,
          attributes: { Voltage: "400V", Frequency: "60Hz" },
        },
      ],
    },
    {
      sellerId: nextechSeller.id,
      categoryId: createdCategories["packaging-supplies"].id,
      name: "Heavy-Duty Biodegradable Corrugated Shipping Boxes (Bulk 500pk)",
      slug: "heavy-duty-biodegradable-corrugated-shipping-boxes",
      description: "32-ECT double-wall corrugated cardboard cartons certified compostable and ocean-safe. Engineered for e-commerce export packaging and heavy fulfillment logistics.",
      basePrice: 280.0,
      moq: 5,
      leadTimeDays: 3,
      countryOfOrigin: "US",
      status: ProductStatus.PUBLISHED,
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
        { minQuantity: 5, maxQuantity: 19, unitPrice: 280.0 },
        { minQuantity: 20, maxQuantity: 49, unitPrice: 245.0 },
        { minQuantity: 50, maxQuantity: null, unitPrice: 210.0 },
      ],
      variants: [
        {
          sku: "NXT-BOX-M500",
          title: "Medium Carton (16x12x10) - Bundle of 500",
          price: 280.0,
          stock: 650,
          attributes: { Size: "16x12x10 in", PackSize: "500 units" },
        },
      ],
    },
  ];

  for (const prod of productsData) {
    const createdProduct = await db.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        sellerId: prod.sellerId,
        categoryId: prod.categoryId,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        basePrice: prod.basePrice,
        moq: prod.moq,
        leadTimeDays: prod.leadTimeDays,
        countryOfOrigin: prod.countryOfOrigin,
        status: prod.status,
        isFeatured: prod.isFeatured,
        productionCapacity: prod.productionCapacity,
        sampleAvailable: prod.sampleAvailable,
        samplePrice: prod.samplePrice,
        customizationAvailable: prod.customizationAvailable,
        ratingAverage: prod.ratingAverage,
        reviewCount: prod.reviewCount,
        salesCount: prod.salesCount,
        specifications: prod.specifications,
        media: {
          create: prod.images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            order: idx,
          })),
        },
        priceTiers: {
          create: prod.priceTiers.map((t) => ({
            minQuantity: t.minQuantity,
            maxQuantity: t.maxQuantity,
            unitPrice: t.unitPrice,
          })),
        },
        variants: {
          create: prod.variants.map((v) => ({
            sku: v.sku,
            title: v.title,
            price: v.price,
            attributes: v.attributes,
            inventory: {
              create: {
                availableStock: v.stock,
                reservedStock: 0,
              },
            },
          })),
        },
      },
    });
    console.log(`✓ Seeded Product: ${createdProduct.name}`);
  }

  // 6. Seed Promotion Coupons
  await db.coupon.upsert({
    where: { code: "GLOBAL15" },
    update: {},
    create: {
      code: "GLOBAL15",
      type: CouponType.PERCENTAGE,
      discountValue: 15.0,
      minOrderValue: 500.0,
      maxDiscount: 250.0,
      usageLimit: 1000,
      isActive: true,
      startsAt: new Date(Date.now() - 86400000),
      expiresAt: new Date(Date.now() + 30 * 86400000),
    },
  });

  await db.coupon.upsert({
    where: { code: "WHOLESALE100" },
    update: {},
    create: {
      code: "WHOLESALE100",
      type: CouponType.FIXED_AMOUNT,
      discountValue: 100.0,
      minOrderValue: 1000.0,
      usageLimit: 500,
      isActive: true,
      startsAt: new Date(Date.now() - 86400000),
      expiresAt: new Date(Date.now() + 60 * 86400000),
    },
  });
  console.log("✓ Seeded Discount Coupons");

  // 7. Seed Sample B2B RFQ with Supplier Quotation
  const sampleRfq = await db.rFQ.upsert({
    where: { rfqNumber: "RFQ-2026-0089" },
    update: {},
    create: {
      rfqNumber: "RFQ-2026-0089",
      buyerId: buyerUser.id,
      title: "Sourcing 500 Units Industrial LoRaWAN Gateways for Smart Grid Telemetry",
      categoryId: createdCategories["electronics-components"].id,
      quantity: 500,
      targetPrice: 55.0,
      destinationCountry: "US",
      specifications: "Must support US915 MHz with IP67 outdoor mounting brackets, dual antenna ports, PoE power input (802.3af), and CE/FCC compliance certificates.",
      status: RFQStatus.QUOTED,
      deliveryDate: new Date(Date.now() + 45 * 86400000),
    },
  });

  await db.quotation.upsert({
    where: { quoteNumber: "QUO-APX-8901" },
    update: {},
    create: {
      quoteNumber: "QUO-APX-8901",
      rfqId: sampleRfq.id,
      sellerId: nextechSeller.id,
      unitPrice: 52.0,
      totalPrice: 26000.0,
      minQuantity: 200,
      leadTimeDays: 12,
      validUntil: new Date(Date.now() + 25 * 86400000),
      terms: "30% advance via Trade Assurance, 70% balance upon BL issuance. Includes 2-year factory warranty.",
      status: QuotationStatus.OFFERED,
    },
  });
  console.log("✓ Seeded B2B RFQ & Formal Supplier Quotation");

  console.log("🎉 Seeding completed successfully!");
}

if (process.argv[1]?.includes("seed.ts")) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await db.$disconnect();
    });
}
