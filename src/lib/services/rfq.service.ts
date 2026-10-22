import { RFQStatus, QuotationStatus } from "@prisma/client";

export const VALID_RFQ_TRANSITIONS: Record<RFQStatus, RFQStatus[]> = {
  DRAFT: [RFQStatus.SUBMITTED],
  SUBMITTED: [RFQStatus.QUOTED, RFQStatus.REJECTED, RFQStatus.EXPIRED],
  QUOTED: [RFQStatus.NEGOTIATING, RFQStatus.ACCEPTED, RFQStatus.REJECTED, RFQStatus.EXPIRED],
  NEGOTIATING: [RFQStatus.ACCEPTED, RFQStatus.REJECTED, RFQStatus.EXPIRED],
  ACCEPTED: [RFQStatus.CONVERTED_TO_ORDER],
  REJECTED: [],
  EXPIRED: [],
  CONVERTED_TO_ORDER: [],
};

export const VALID_QUOTATION_TRANSITIONS: Record<QuotationStatus, QuotationStatus[]> = {
  OFFERED: [QuotationStatus.COUNTERED, QuotationStatus.ACCEPTED, QuotationStatus.REJECTED, QuotationStatus.EXPIRED],
  COUNTERED: [QuotationStatus.OFFERED, QuotationStatus.ACCEPTED, QuotationStatus.REJECTED, QuotationStatus.EXPIRED],
  ACCEPTED: [],
  REJECTED: [],
  EXPIRED: [],
};

export function canTransitionRFQ(currentStatus: RFQStatus, nextStatus: RFQStatus): boolean {
  if (currentStatus === nextStatus) return true;
  const allowed = VALID_RFQ_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(nextStatus) : false;
}

export function validateRFQTransition(currentStatus: RFQStatus, nextStatus: RFQStatus): void {
  if (!canTransitionRFQ(currentStatus, nextStatus)) {
    throw new Error(`Invalid RFQ transition from ${currentStatus} to ${nextStatus}`);
  }
}

export function canTransitionQuotation(currentStatus: QuotationStatus, nextStatus: QuotationStatus): boolean {
  if (currentStatus === nextStatus) return true;
  const allowed = VALID_QUOTATION_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(nextStatus) : false;
}
