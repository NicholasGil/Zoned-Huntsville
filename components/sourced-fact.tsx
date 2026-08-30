import type { FactRow } from "@/lib/database";
import { isSecondaryFact } from "@/lib/facts";

export function SourcedFact({ fact }: { fact: FactRow }) {
  return (
    <span>
      {fact.value}
      {isSecondaryFact(fact) ? (
        <span className="text-brick"> unconfirmed — verify directly</span>
      ) : null}
    </span>
  );
}
