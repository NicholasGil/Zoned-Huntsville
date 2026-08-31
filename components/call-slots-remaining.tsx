"use client";

import { useEffect, useState } from "react";
import { readCallSlot } from "@/lib/call-slots-action";
import type { CallSlotQuery } from "@/lib/call-slots";

export function CallSlotsRemaining() {
  const [slot, setSlot] = useState<CallSlotQuery | null>(null);

  useEffect(() => {
    let cancelled = false;
    void readCallSlot().then((next) => {
      if (!cancelled) {
        setSlot(next);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (slot?.kind === "row") {
    return (
      <p className="mt-3 text-sm text-text-muted" aria-live="polite">
        {slot.remaining} of {slot.capacity} call slots remaining this month.
      </p>
    );
  }

  if (slot?.kind === "unavailable") {
    return (
      <p className="mt-3 text-sm text-text-muted">
        Four slots each month. Remaining is counted from this month&apos;s paid,
        non-refunded call purchases. The count is not available until that
        ledger is connected.
      </p>
    );
  }

  return (
    <p className="mt-3 text-sm text-text-muted">
      Four slots each month. Remaining is counted from this month&apos;s paid,
      non-refunded call purchases.
    </p>
  );
}
