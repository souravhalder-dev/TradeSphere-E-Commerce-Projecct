import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./db";

export type UserRole =
  | "GUEST"
  | "BUYER"
  | "BUSINESS_BUYER"
  | "SELLER"
  | "SELLER_STAFF"
  | "SUPPLIER"
  | "LOGISTICS_PARTNER"
  | "CUSTOMER_SUPPORT"
  | "CONTENT_MODERATOR"
  | "FINANCE_OPERATOR"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  sellerId?: string | null;
  organizationId?: string | null;
}

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "tradesphere_dev_super_secret_jwt_key_32chars_minimum";
export const AUTH_COOKIE_NAME = "tradesphere_session";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: SessionUser): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionUser;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current authenticated session user from server cookies
 */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Server-side authorization check: throws or returns error if not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Server-side role guard: enforces one of allowed roles
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<SessionUser> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN: Insufficient role permissions");
  }
  return session;
}

/**
 * Server-side seller tenant guard: enforces user is a seller and returns seller profile
 */
export async function requireSeller(): Promise<{ session: SessionUser; sellerId: string }> {
  const session = await requireAuth();
  if (session.role !== "SELLER" && session.role !== "SELLER_STAFF" && session.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN: Seller account required");
  }

  // Find or verify seller profile
  const seller = await db.sellerProfile.findFirst({
    where: { userId: session.id },
  });

  if (!seller && session.role !== "SUPER_ADMIN") {
    throw new Error("FORBIDDEN: Seller profile not found");
  }

  return { session, sellerId: seller ? seller.id : (session.sellerId || "") };
}

/**
 * Server-side admin guard: enforces ADMIN or SUPER_ADMIN
 */
export async function requireAdmin(): Promise<SessionUser> {
  return requireRole(["ADMIN", "SUPER_ADMIN"]);
}

/**
 * Helper to record auditable actions
 */
export async function createAuditLog(params: {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  try {
    return await db.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        details: params.details ? JSON.parse(JSON.stringify(params.details)) : undefined,
        ipAddress: params.ipAddress,
      },
    });
  } catch (err) {
    console.error("Failed to create audit log:", err);
  }
}
