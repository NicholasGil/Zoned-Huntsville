import { getEntitlement } from "@/lib/entitlement";

export const dynamic = "force-dynamic";

export default async function GuideLayout({
  children,
}: LayoutProps<"/guide">) {
  await getEntitlement();
  return children;
}
