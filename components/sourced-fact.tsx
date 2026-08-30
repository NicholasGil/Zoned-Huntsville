import { isSecondaryFact } from "@/lib/facts";
import { isHttpUrl, type SeedFact } from "@/lib/seed-facts";

export type SourcedFactView = Pick<
  SeedFact,
  "value" | "source_url" | "verified_at" | "verification_method"
>;

export function SourcedFact({ fact }: { fact: SourcedFactView }) {
  return (
    <span>
      {isHttpUrl(fact.value) ? (
        <a href={fact.value} className="break-all text-brick hover:underline">
          {fact.value}
        </a>
      ) : (
        fact.value
      )}
      {isSecondaryFact(fact) ? (
        <span className="text-brick"> unconfirmed — verify directly</span>
      ) : null}
      <span className="text-muted">
        {" "}
        (
        {isHttpUrl(fact.source_url) ? (
          <a href={fact.source_url} className="text-brick hover:underline">
            source
          </a>
        ) : (
          fact.source_url
        )}
        , verified {fact.verified_at})
      </span>
    </span>
  );
}
