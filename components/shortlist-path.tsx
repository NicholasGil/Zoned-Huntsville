"use client";

import { useMemo, useState } from "react";
import {
  homeschoolShortlistItems,
  privateShortlistItems,
  publicShortlistItems,
  systemsWithoutLocator,
  type PathChoice,
  type ShortlistItem,
  type ShortlistOption,
} from "@/lib/shortlist-path";

type ShortlistPathProps = {
  systems: readonly ShortlistOption[];
  privateSchools: readonly ShortlistOption[];
  churchSchool: string;
  privateTutor: string;
};

function PathRadio({
  value,
  current,
  onChange,
  label,
}: {
  value: PathChoice;
  current: PathChoice | "";
  onChange: (value: PathChoice) => void;
  label: string;
}) {
  const id = `shortlist-path-${value}`;
  return (
    <label htmlFor={id} className="mt-2 flex items-center gap-2 text-ink">
      <input
        id={id}
        type="radio"
        name="shortlist-path"
        value={value}
        checked={current === value}
        onChange={() => onChange(value)}
      />
      {label}
    </label>
  );
}

function ShortlistOutput({
  items,
  commuteAnchor,
  commuteLimit,
  budget,
}: {
  items: ShortlistItem[];
  commuteAnchor: string;
  commuteLimit: string;
  budget: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 border border-rule bg-paper-raised px-5 py-5" aria-live="polite">
      <h3 className="font-serif text-2xl text-ink">Your 3-item shortlist</h3>
      <p className="mt-2 text-sm text-muted">
        Commute anchor: {commuteAnchor.trim() || "not entered yet"}
        {commuteLimit.trim() ? ` · Your limit: ${commuteLimit.trim()}` : ""}
      </p>
      <p className="mt-1 text-sm text-muted">
        Budget you entered: {budget.trim() || "not entered yet"}
      </p>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-ink">
        {items.map((item) => (
          <li key={item.label}>
            <p>{item.label}</p>
            {item.detail ? <p className="mt-1 text-sm text-muted">{item.detail}</p> : null}
            {item.href ? (
              <p className="mt-1 text-sm">
                <a href={item.href} className="text-brick hover:underline">
                  Official website
                </a>
              </p>
            ) : null}
            {item.locatorHref ? (
              <p className="mt-1 text-sm">
                <a href={item.locatorHref} className="text-brick hover:underline">
                  Official zone locator
                </a>
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ShortlistPath({
  systems,
  privateSchools,
  churchSchool,
  privateTutor,
}: ShortlistPathProps) {
  const [commuteAnchor, setCommuteAnchor] = useState("");
  const [commuteLimit, setCommuteLimit] = useState("");
  const [budget, setBudget] = useState("");
  const [path, setPath] = useState<PathChoice | "">("");
  const [locatorSchools, setLocatorSchools] = useState<Record<string, string>>({});
  const [privatePicks, setPrivatePicks] = useState<string[]>([]);

  const locatorSystems = useMemo(
    () => systems.filter((system) => Boolean(system.zoneLocatorUrl)),
    [systems],
  );
  const noLocator = useMemo(() => systemsWithoutLocator(systems), [systems]);

  const items = useMemo(() => {
    if (path === "public") {
      return publicShortlistItems(systems, locatorSchools);
    }
    if (path === "private") {
      return privateShortlistItems(privateSchools, privatePicks);
    }
    if (path === "homeschool") {
      return homeschoolShortlistItems({ churchSchool, privateTutor });
    }
    return [];
  }, [
    path,
    systems,
    locatorSchools,
    privateSchools,
    privatePicks,
    churchSchool,
    privateTutor,
  ]);

  function togglePrivate(slug: string) {
    setPrivatePicks((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }
      if (current.length >= 3) {
        return current;
      }
      return [...current, slug];
    });
  }

  return (
    <div className="mt-10 max-w-xl">
      <h2 className="font-serif text-2xl text-ink">10-minute shortlist path</h2>
      <p className="mt-3 text-muted">
        This edition does not publish commute times, budget cutoffs, or school
        rankings. Enter your own commute and budget, pick a path, and the
        shortlist is built from sourced system and school facts already in the
        guide.
      </p>

      <section className="mt-8">
        <h3 className="font-serif text-xl text-ink">1. Commute anchor</h3>
        <label htmlFor="shortlist-commute" className="mt-3 block text-sm text-ink">
          Where will you live or commute from?
        </label>
        <input
          id="shortlist-commute"
          type="text"
          value={commuteAnchor}
          onChange={(event) => setCommuteAnchor(event.target.value)}
          className="mt-2 w-full border border-rule bg-paper px-3 py-2"
        />
        <label htmlFor="shortlist-commute-limit" className="mt-4 block text-sm text-ink">
          Your commute limit (you set this; this edition has no sourced threshold)
        </label>
        <input
          id="shortlist-commute-limit"
          type="text"
          value={commuteLimit}
          onChange={(event) => setCommuteLimit(event.target.value)}
          className="mt-2 w-full border border-rule bg-paper px-3 py-2"
        />
        <p className="mt-3 text-sm text-muted">
          Use each official zone locator to see which public school an address
          returns. The three locators below are the ones already sourced. That
          is a source capability, not a ranking.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink">
          {locatorSystems.map((system) => (
            <li key={system.slug}>
              {system.name}
              {system.zoneLocatorUrl ? (
                <>
                  {" — "}
                  <a href={system.zoneLocatorUrl} className="text-brick hover:underline">
                    zone locator
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
        {noLocator.length > 0 ? (
          <p className="mt-3 text-sm text-muted">
            {noLocator.map((system) => system.name).join(" and ")} have official
            websites in this edition but no sourced zone locator yet.
          </p>
        ) : null}
      </section>

      <section className="mt-8">
        <h3 className="font-serif text-xl text-ink">2. Budget</h3>
        <label htmlFor="shortlist-budget" className="mt-3 block text-sm text-ink">
          What will you spend? (you enter this; this edition does not invent a cutoff)
        </label>
        <input
          id="shortlist-budget"
          type="text"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          className="mt-2 w-full border border-rule bg-paper px-3 py-2"
        />
        <p className="mt-3 text-sm text-muted">
          Private-school tuition is unpublished in this edition. State ESA
          amounts are in Paying For It.
        </p>
      </section>

      <section className="mt-8">
        <h3 className="font-serif text-xl text-ink">3. Public, private, or homeschool</h3>
        <fieldset className="mt-3 border-0 p-0">
          <legend className="text-sm text-muted">Choose one path</legend>
          <PathRadio
            value="public"
            current={path}
            onChange={setPath}
            label="Public — look up a zoned school in the three sourced locators"
          />
          <PathRadio
            value="private"
            current={path}
            onChange={setPath}
            label="Private — pick three named schools already in the seed"
          />
          <PathRadio
            value="homeschool"
            current={path}
            onChange={setPath}
            label="Homeschool — church-school or private-tutor options"
          />
        </fieldset>
      </section>

      {path === "public" ? (
        <section className="mt-8">
          <h3 className="font-serif text-xl text-ink">
            4. Write in what each locator returned
          </h3>
          <p className="mt-3 text-sm text-muted">
            Optional. Type the school name the official locator showed for your
            address. This edition does not invent those names.
          </p>
          {locatorSystems.map((system) => (
            <div key={system.slug} className="mt-4">
              <label
                htmlFor={`locator-school-${system.slug}`}
                className="block text-sm text-ink"
              >
                School returned by {system.name}
              </label>
              <input
                id={`locator-school-${system.slug}`}
                type="text"
                value={locatorSchools[system.slug] ?? ""}
                onChange={(event) =>
                  setLocatorSchools((current) => ({
                    ...current,
                    [system.slug]: event.target.value,
                  }))
                }
                className="mt-2 w-full border border-rule bg-paper px-3 py-2"
              />
            </div>
          ))}
        </section>
      ) : null}

      {path === "private" ? (
        <section className="mt-8">
          <h3 className="font-serif text-xl text-ink">4. Pick three private schools</h3>
          <p className="mt-3 text-sm text-muted">
            These are the private schools already named in the seed. Choosing
            three is your shortlist, not a ranking from this guide.
          </p>
          <ul className="mt-3 space-y-2">
            {privateSchools.map((school) => {
              const id = `private-pick-${school.slug}`;
              return (
                <li key={school.slug}>
                  <label htmlFor={id} className="flex items-center gap-2 text-ink">
                    <input
                      id={id}
                      type="checkbox"
                      checked={privatePicks.includes(school.slug)}
                      onChange={() => togglePrivate(school.slug)}
                    />
                    {school.name}
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <ShortlistOutput
        items={items}
        commuteAnchor={commuteAnchor}
        commuteLimit={commuteLimit}
        budget={budget}
      />
    </div>
  );
}
