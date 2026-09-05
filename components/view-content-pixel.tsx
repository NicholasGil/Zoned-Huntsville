"use client";

import { useEffect } from "react";
import {
  hasTrackedOnce,
  markTrackedOnce,
  trackMetaEvent,
  viewContentSampleParams,
} from "@/lib/meta-pixel";

export function ViewContentPixel() {
  useEffect(() => {
    const key = "meta_pixel:viewcontent:sample";
    if (hasTrackedOnce(key)) {
      return;
    }
    if (trackMetaEvent("ViewContent", viewContentSampleParams())) {
      markTrackedOnce(key);
    }
  }, []);

  return null;
}
