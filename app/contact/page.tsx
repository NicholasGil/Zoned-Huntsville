import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PageShell>
      <h1 className="font-serif text-4xl text-ink">Contact</h1>
      <p className="mt-4 max-w-xl text-muted">
        Use this form to reach the publisher. Delivery is a stub until email is
        wired.
      </p>
      <ContactForm />
    </PageShell>
  );
}
