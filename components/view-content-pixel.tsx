"use client";

import { useEffect } from "react";
import { trackMetaEvent, viewContentSampleParams } from "@/lib/meta-pixel";

export function ViewContentPixel() {
  useEffect(() => {
    trackMetaEvent("ViewContent", viewContentSampleParams());
  }, []);

  return null;
}
