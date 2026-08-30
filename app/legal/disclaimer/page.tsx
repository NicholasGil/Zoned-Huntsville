import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Informational only. Not legal or educational advice. No admission or placement guarantee.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer">
      <p>
        The Huntsville School Guide is informational only. It is not legal
        advice. It is not educational advice. It is not a placement service.
      </p>
      <p>
        Readers must verify every figure and deadline with the district or
        school before relying on it. Published policy changes. The date on a
        fact is the date we checked the source, not a promise that the source
        is still current.
      </p>
      <p>
        This site is not affiliated with, and is not endorsed by, Huntsville
        City Schools, Madison City Schools, Madison County Schools, Athens City
        Schools, Limestone County Schools, ASCTE, or any private school named
        in the guide.
      </p>
      <p>
        Nothing here is a guarantee of any admission or placement outcome. We
        do not rank schools. We do not promise a seat.
      </p>
      <p>
        We make reasonable efforts to verify each published fact from an
        official source and to stamp it with that source and date. If a fact is
        wrong, use the{" "}
        <Link href="/contact" className="text-brick hover:underline">
          contact form
        </Link>
        . We treat a sourced error as a defect and correct it for everyone.
      </p>
    </LegalPage>
  );
}
