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
        <a href={fact.value} className="break-all text-action underline underline-offset-4 hover:text-action-hover">
          {fact.value}
        </a>
      ) : (
        fact.value
      )}
      {isSecondaryFact(fact) ? (
        <span className="text-danger"> unconfirmed — verify directly</span>
      ) : null}
      <span className="text-text-muted">
        {" "}
        (
        {isHttpUrl(fact.source_url) ? (
          <a href={fact.source_url} className="text-action underline underline-offset-4 hover:text-action-hover">
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
