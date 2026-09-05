"use client";

import { useEffect } from "react";
import { persistAttributionFromSearch } from "@/lib/attribution";

export function AttributionCapture() {
  useEffect(() => {
    persistAttributionFromSearch(window.location.search);
  }, []);

  return null;
}
