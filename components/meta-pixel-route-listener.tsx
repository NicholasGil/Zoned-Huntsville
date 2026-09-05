"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackMetaEvent } from "@/lib/meta-pixel";

export function MetaPixelRouteListener() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    trackMetaEvent("PageView");
  }, [pathname]);

  return null;
}
