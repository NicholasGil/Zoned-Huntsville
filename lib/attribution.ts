export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

export const ATTRIBUTION_STORAGE_KEY = "hsg_ad_attribution";

const MAX_ATTRIBUTION_VALUE = 255;

export function isAttributionKey(value: string): value is AttributionKey {
  return (ATTRIBUTION_KEYS as readonly string[]).includes(value);
}

export function sanitizeAttributionValue(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (/[<>"'`\r\n]/.test(trimmed)) {
    return null;
  }
  return trimmed.slice(0, MAX_ATTRIBUTION_VALUE);
}

export function parseAttributionRecord(record: unknown): Attribution {
  if (typeof record !== "object" || record === null || Array.isArray(record)) {
    return {};
  }

  const attribution: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = sanitizeAttributionValue((record as Record<string, unknown>)[key]);
    if (value) {
      attribution[key] = value;
    }
  }
  return attribution;
}

export function parseAttributionSearch(search: string): Attribution {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(query);
  const record: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key);
    if (value) {
      record[key] = value;
    }
  }
  return parseAttributionRecord(record);
}

export function mergeAttribution(stored: Attribution, incoming: Attribution): Attribution {
  return { ...stored, ...incoming };
}

export function readStoredAttribution(): Attribution {
  if (typeof window === "undefined") {
    return {};
  }

  for (const store of [window.sessionStorage, window.localStorage]) {
    try {
      const raw = store.getItem(ATTRIBUTION_STORAGE_KEY);
      if (!raw) {
        continue;
      }
      return parseAttributionRecord(JSON.parse(raw) as unknown);
    } catch {
      continue;
    }
  }
  return {};
}

function writeStoredAttribution(attribution: Attribution): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify(attribution);
  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, payload);
  } catch {
    // Private mode or quota.
  }
  try {
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, payload);
  } catch {
    // Private mode or quota.
  }
}

export function persistAttributionFromSearch(search: string): Attribution {
  const incoming = parseAttributionSearch(search);
  const stored = readStoredAttribution();
  const merged =
    Object.keys(incoming).length > 0 ? mergeAttribution(stored, incoming) : stored;
  writeStoredAttribution(merged);
  return merged;
}

export function captureAttributionForCheckout(): Attribution {
  if (typeof window === "undefined") {
    return {};
  }
  persistAttributionFromSearch(window.location.search);
  return readStoredAttribution();
}

export function attributionFromFormData(form: FormData): Attribution {
  const record: Record<string, unknown> = {};
  for (const key of ATTRIBUTION_KEYS) {
    record[key] = form.get(key);
  }
  return parseAttributionRecord(record);
}

export function checkoutSuccessUrl(origin: string, attribution: Attribution = {}): string {
  const params = new URLSearchParams();
  params.set("session_id", "{CHECKOUT_SESSION_ID}");
  for (const key of ATTRIBUTION_KEYS) {
    const value = attribution[key];
    if (value) {
      params.set(key, value);
    }
  }
  const query = params
    .toString()
    .replace("%7BCHECKOUT_SESSION_ID%7D", "{CHECKOUT_SESSION_ID}");
  return `${origin.replace(/\/+$/, "")}/checkout/success?${query}`;
}

export function checkoutSessionMetadata(
  tierId: string,
  attribution: Attribution = {},
): Record<string, string> {
  const metadata: Record<string, string> = { tier: tierId };
  for (const key of ATTRIBUTION_KEYS) {
    const value = attribution[key];
    if (value) {
      metadata[key] = value;
    }
  }
  return metadata;
}
