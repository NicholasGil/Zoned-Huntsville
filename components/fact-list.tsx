import { SourcedFact } from "@/components/sourced-fact";
import type { PublishedFact } from "@/lib/facts";
import { factKey, fieldLabel, seedFacts } from "@/lib/seed-facts";

function entityHeading(facts: PublishedFact[]): string {
  const named = facts.find((fact) => fact.field === "name");
  if (named) {
    return named.value;
  }
  const first = facts[0];
  if (!first) {
    return "Untitled";
  }
  const catalogName = seedFacts.find(
    (fact) => fact.entity_slug === first.entity_slug && fact.field === "name",
  );
  return catalogName?.value ?? first.entity_slug;
}

function groupFacts(facts: PublishedFact[]): PublishedFact[][] {
  const groups = new Map<string, PublishedFact[]>();
  for (const fact of facts) {
    const existing = groups.get(fact.entity_slug);
    if (existing) {
      existing.push(fact);
    } else {
      groups.set(fact.entity_slug, [fact]);
    }
  }
  return [...groups.values()];
}

export function FactList({ facts }: { facts: PublishedFact[] }) {
  if (facts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-10">
      {groupFacts(facts).map((group) => {
        const first = group[0];
        const key = first ? first.entity_slug : "empty";
        return (
          <section key={key}>
            <h3 className="font-sans text-2xl font-semibold text-text">{entityHeading(group)}</h3>
            <dl className="mt-4 space-y-3">
              {group.map((fact) => (
                <div key={fact.id ?? factKey(fact)}>
                  <dt className="text-sm text-text-muted">{fieldLabel(fact.field)}</dt>
                  <dd className="mt-1 text-text">
                    <SourcedFact fact={fact} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </div>
  );
}
