import { checkoutOffer } from "./checkout-offer.ts";
import type { PricingTierId } from "./site.ts";

export const META_PIXEL_ID_ENV = "NEXT_PUBLIC_META_PIXEL_ID";

export type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "InitiateCheckout"
  | "AddToCart"
  | "Lead"
  | "Purchase";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export function isValidMetaPixelId(value: string | undefined | null): value is string {
  return typeof value === "string" && /^\d{5,20}$/.test(value.trim());
}

export function getMetaPixelId(): string | null {
  const raw = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  return isValidMetaPixelId(raw) ? raw.trim() : null;
}

export function initiateCheckoutParams(tierId: PricingTierId) {
  const offer = checkoutOffer(tierId);
  return {
    content_ids: [tierId],
    content_name: offer.stripeLineName,
    content_type: "product",
    value: offer.amountUsd,
    currency: "USD",
    num_items: 1,
  };
}

export function leadEventParams() {
  return {
    content_name: "Huntsville City Schools sample",
    content_category: "lead",
  };
}

export function viewContentSampleParams() {
  return {
    content_name: "Huntsville City Schools sample",
    content_type: "product",
  };
}

export function purchaseDedupKey(sessionId: string | null, eventId: string | null): string {
  if (eventId) {
    return `meta_pixel:${eventId}`;
  }
  if (sessionId) {
    return `meta_pixel:purchase:${sessionId}`;
  }
  return "meta_pixel:purchase:unknown";
}

export function purchasePixelEvent(input: {
  kind: "confirmed" | "unavailable";
  sessionId: string | null;
  amountUsd: number | null;
  currency: string | null;
  contentName: string;
  contentIds: string[];
}): {
  shouldTrack: boolean;
  eventId: string | null;
  params: Record<string, unknown>;
} {
  if (input.kind !== "confirmed") {
    return { shouldTrack: false, eventId: null, params: {} };
  }

  const params: Record<string, unknown> = {
    content_name: input.contentName,
    content_type: "product",
  };
  if (input.contentIds.length > 0) {
    params.content_ids = input.contentIds;
  }
  if (typeof input.amountUsd === "number") {
    params.value = input.amountUsd;
  }
  if (input.currency) {
    params.currency = input.currency.toUpperCase();
  }

  return {
    shouldTrack: true,
    eventId: input.sessionId ? `purchase:${input.sessionId}` : null,
    params,
  };
}

export function trackMetaEvent(
  event: MetaStandardEvent,
  params?: Record<string, unknown>,
  eventId?: string | null,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (!getMetaPixelId()) {
    return false;
  }
  if (typeof window.fbq !== "function") {
    return false;
  }

  if (eventId) {
    window.fbq("track", event, params ?? {}, { eventID: eventId });
  } else if (params) {
    window.fbq("track", event, params);
  } else {
    window.fbq("track", event);
  }
  return true;
}

export function hasTrackedOnce(storageKey: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return window.sessionStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

export function markTrackedOnce(storageKey: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Private mode or quota.
  }
}
