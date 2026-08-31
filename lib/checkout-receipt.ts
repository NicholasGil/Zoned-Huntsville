import {
  PRODUCT_NAME,
  TIER_BUYER_LABEL,
  type BuyerProductTier,
} from "./checkout-offer.ts";

export type StripeSessionLike = {
  payment_status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string> | null;
  line_items?: {
    data?: Array<{
      description?: string | null;
      amount_total?: number | null;
      price?: {
        unit_amount?: number | null;
        nickname?: string | null;
        metadata?: Record<string, string> | null;
      } | null;
    }>;
  } | null;
};

export type CheckoutReceipt =
  | {
      kind: "confirmed";
      productName: string;
      tier: BuyerProductTier | null;
      tierLabel: string | null;
      amountUsd: number | null;
      amountDisplay: string | null;
      email: string | null;
    }
  | {
      kind: "unavailable";
      reason: "missing-session" | "stripe-unset" | "retrieve-failed" | "not-paid";
    };

const PRICE_ID_TIER = {
  "79": "guide",
  "149": "toolkit",
  "349": "call",
} as const;

const UNIT_AMOUNT_TIER: Record<number, BuyerProductTier> = {
  7900: "guide",
  14900: "toolkit",
  34900: "call",
};

export function formatPaidUsd(amountUsd: number): string {
  if (Number.isInteger(amountUsd)) {
    return `$${amountUsd}`;
  }
  return `$${amountUsd.toFixed(2)}`;
}

function readEmail(session: StripeSessionLike): string | null {
  const detailsEmail = session.customer_details?.email;
  if (typeof detailsEmail === "string" && detailsEmail.trim().length > 0) {
    return detailsEmail.trim();
  }
  if (typeof session.customer_email === "string" && session.customer_email.trim().length > 0) {
    return session.customer_email.trim();
  }
  return null;
}

function readAmountUsd(session: StripeSessionLike): number | null {
  const currency = session.currency?.toLowerCase();
  if (currency && currency !== "usd") {
    return null;
  }

  if (typeof session.amount_total === "number") {
    return session.amount_total / 100;
  }

  const lineAmount = session.line_items?.data?.[0]?.amount_total;
  if (typeof lineAmount === "number") {
    return lineAmount / 100;
  }

  return null;
}

function productTierFromToken(raw: string | null | undefined): BuyerProductTier | null {
  if (typeof raw !== "string") {
    return null;
  }

  const value = raw.trim().toLowerCase();
  if (value === "guide" || value === "toolkit" || value === "call") {
    return value;
  }
  if (value === "79" || value === "149" || value === "349") {
    return PRICE_ID_TIER[value];
  }
  return null;
}

function productTierFromLineCopy(raw: string | null | undefined): BuyerProductTier | null {
  if (typeof raw !== "string" || raw.trim().length === 0) {
    return null;
  }

  const value = raw.toLowerCase();
  if (/\bcall\b/.test(value)) {
    return "call";
  }
  if (/\btoolkit\b/.test(value)) {
    return "toolkit";
  }
  if (/\bguide\b/.test(value)) {
    return "guide";
  }
  return productTierFromToken(raw);
}

function readProductTier(session: StripeSessionLike): BuyerProductTier | null {
  const fromMetadata = productTierFromToken(session.metadata?.tier);
  if (fromMetadata) {
    return fromMetadata;
  }

  const line = session.line_items?.data?.[0];
  const fromPriceMetadata = productTierFromToken(line?.price?.metadata?.tier);
  if (fromPriceMetadata) {
    return fromPriceMetadata;
  }

  const fromDescription = productTierFromLineCopy(line?.description);
  if (fromDescription) {
    return fromDescription;
  }

  const fromNickname = productTierFromLineCopy(line?.price?.nickname);
  if (fromNickname) {
    return fromNickname;
  }

  const unitAmount = line?.price?.unit_amount;
  if (typeof unitAmount === "number" && UNIT_AMOUNT_TIER[unitAmount]) {
    return UNIT_AMOUNT_TIER[unitAmount];
  }

  return null;
}

export function unavailableReceipt(
  reason: Extract<CheckoutReceipt, { kind: "unavailable" }>["reason"],
): CheckoutReceipt {
  return { kind: "unavailable", reason };
}

export function mapCheckoutSession(session: StripeSessionLike | null): CheckoutReceipt {
  if (!session) {
    return unavailableReceipt("missing-session");
  }

  if (session.payment_status !== "paid") {
    return unavailableReceipt("not-paid");
  }

  const tier = readProductTier(session);
  const amountUsd = readAmountUsd(session);

  return {
    kind: "confirmed",
    productName: PRODUCT_NAME,
    tier,
    tierLabel: tier ? TIER_BUYER_LABEL[tier] : null,
    amountUsd,
    amountDisplay: amountUsd === null ? null : formatPaidUsd(amountUsd),
    email: readEmail(session),
  };
}

export function receiptHasInventedAmount(receipt: CheckoutReceipt): boolean {
  return receipt.kind === "confirmed" && receipt.amountUsd !== null;
}
