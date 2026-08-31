import { SourcedFact } from "@/components/sourced-fact";
import type { PublishedFact } from "@/lib/facts";

export function LeaseCheck({ facts }: { facts: PublishedFact[] }) {
  const howTos = facts.filter(
    (fact) =>
      fact.field === "how_to_check_before_lease" ||
      fact.field === "zone_check_instruction",
  );
  const rezoning = facts.find((fact) => fact.field === "rezoning_status");

  if (howTos.length === 0 && !rezoning) {
    return null;
  }

  return (
    <section className="mt-10 max-w-xl">
      <h2 className="font-serif text-2xl text-ink">
        Check the zone before you sign a lease
      </h2>
      <p className="mt-4 text-muted">
        Use that system&apos;s official locator or district instruction. Do not
        trust realtor or listing maps. Confirm the zone before you sign.
      </p>
      {howTos.length > 0 ? (
        <ul className="mt-4 list-disc space-y-3 pl-5 text-ink">
          {howTos.map((fact) => (
            <li key={`${fact.entity_slug}:${fact.field}`}>
              <SourcedFact fact={fact} />
            </li>
          ))}
        </ul>
      ) : null}
      {rezoning ? (
        <p className="mt-6 text-ink">
          Live rezoning risk (Madison City Schools):{" "}
          <SourcedFact fact={rezoning} />
        </p>
      ) : null}
    </section>
  );
}
