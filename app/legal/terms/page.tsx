import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { VerifyToken } from "@/components/verify-token";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms for using ${site.name}.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms">
      <p>
        These terms cover use of {site.name} at {site.domain}. The product is a
        paid digital guide plus optional Toolkit worksheets and an optional
        45-minute call. It is informational. It is not legal or educational
        advice. See the{" "}
        <Link href="/legal/disclaimer" className="text-brick hover:underline">
          disclaimer
        </Link>
        .
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">What we collect</h2>
      <p>
        We collect your email when you request the sample, request a sign-in
        link, or send a message through the contact form. Stripe collects the
        name and card details you enter at checkout. Card data is stored by
        Stripe, not on this site.
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">Access</h2>
      <p>
        After payment, access is tied to the checkout email. You open the guide
        with a Supabase magic link, not a password. The $79 tier is the guide.
        The $149 tier adds the Toolkit. The $349 tier adds one 45-minute video
        call with Nicholas, capped at 4 slots each month.
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">Refunds</h2>
      <p>
        Refunds follow the{" "}
        <Link href="/legal/refunds" className="text-brick hover:underline">
          refund policy
        </Link>
        : 30-day unconditional money-back, plus the Zone Promise.
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">Third parties</h2>
      <p>
        Checkout runs on Stripe. Accounts and the database run on Supabase.
        Transactional email may go through Supabase Auth and, when configured,
        a separate email provider.
      </p>
      <h2 className="pt-4 font-serif text-2xl text-ink">Contact</h2>
      <p>
        Use the{" "}
        <Link href="/contact" className="text-brick hover:underline">
          contact form
        </Link>
        .{" "}
        <VerifyToken>physical mailbox for CAN-SPAM</VerifyToken>
      </p>
    </LegalPage>
  );
}
