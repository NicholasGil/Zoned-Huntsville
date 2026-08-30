import { cookies } from "next/headers";

export type Entitlement =
  | { kind: "anonymous" }
  | {
      kind: "signed-in";
      hasGuide: boolean;
      hasToolkit: boolean;
    };

/**
 * Server-side access check. Purchase records and Supabase schema are out of
 * scope for this scaffold, so this always returns anonymous.
 *
 * Awaits cookies() so gated routes stay dynamic under Next.js 16.
 */
export async function getEntitlement(): Promise<Entitlement> {
  await cookies();
  return { kind: "anonymous" };
}

export function canReadGuide(entitlement: Entitlement): boolean {
  return entitlement.kind === "signed-in" && entitlement.hasGuide;
}

export function canReadToolkit(entitlement: Entitlement): boolean {
  return entitlement.kind === "signed-in" && entitlement.hasToolkit;
}
