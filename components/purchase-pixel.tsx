"use client";

import { useEffect } from "react";
import {
  purchaseSummaryLabel,
  type CheckoutReceipt,
} from "@/lib/checkout-receipt";
import {
  hasTrackedOnce,
  markTrackedOnce,
  purchaseDedupKey,
  purchasePixelEvent,
  trackMetaEvent,
} from "@/lib/meta-pixel";

export function PurchasePixel({
  receipt,
  sessionId,
}: {
  receipt: CheckoutReceipt;
  sessionId: string | null;
}) {
  const confirmed = receipt.kind === "confirmed";
  const amountUsd = receipt.kind === "confirmed" ? receipt.amountUsd : null;
  const currency = receipt.kind === "confirmed" ? receipt.currency : null;
  const contentName = receipt.kind === "confirmed" ? purchaseSummaryLabel(receipt) : "";
  const contentId = receipt.kind === "confirmed" && receipt.tier ? receipt.tier : null;

  useEffect(() => {
    const planned = purchasePixelEvent({
      kind: confirmed ? "confirmed" : "unavailable",
      sessionId,
      amountUsd,
      currency,
      contentName,
      contentIds: contentId ? [contentId] : [],
    });
    if (!planned.shouldTrack) {
      return;
    }

    const key = purchaseDedupKey(sessionId, planned.eventId);
    if (hasTrackedOnce(key)) {
      return;
    }
    if (trackMetaEvent("Purchase", planned.params, planned.eventId)) {
      markTrackedOnce(key);
    }
  }, [amountUsd, confirmed, contentId, contentName, currency, sessionId]);

  return null;
}
