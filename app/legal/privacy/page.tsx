import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { VerifyToken } from "@/components/verify-token";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} collects and uses email, name, and payment data.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>
        This page describes what {site.name} collects and who else sees it.
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">Information we collect</h2>
      <p>
        Email, when you request the sample, request a magic-link sign-in, or
        use the contact form. Name, when you enter it at Stripe Checkout. The
        contact form also collects the message you type.
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">Payments</h2>
      <p>
        Stripe processes payment. Stripe stores card data. This site does not
        store card numbers.
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">Third parties</h2>
      <p>
        Stripe (checkout and cards). Supabase (sign-in, database, lead storage).
        An email provider, when one is configured, for transactional mail.
        Magic links still go through Supabase Auth.
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">Cookies and analytics</h2>
      <p>
        Sign-in uses session cookies from Supabase. Checkout error messages on
        the sales page read a query string in the browser. This codebase does
        not include a separate analytics product.
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">Retention</h2>
      <p>
        We keep purchase emails so we can honor access and refunds. We keep
        sample-form emails so we can send the profile. Entitlement rows stay
        until a refund is recorded on that row. Lead emails stay in the leads
        table so we can send the sample. This edition does not publish a
        day-count deletion schedule.
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">Contact</h2>
      <p>
        Questions about this policy go through the{" "}
        <Link href="/contact" className="text-brick hover:underline">
          contact form
        </Link>
        .{" "}
        <VerifyToken>physical mailbox for CAN-SPAM</VerifyToken>
      </p>
    </LegalPage>
  );
}
