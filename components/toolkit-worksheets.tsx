import { LeaseCheck } from "@/components/lease-check";
import { SourcedFact } from "@/components/sourced-fact";
import { VerifyToken } from "@/components/verify-token";
import { isSecondaryFact, type PublishedFact } from "@/lib/facts";
import { isHttpUrl } from "@/lib/seed-facts";
import {
  applicationWindows,
  comparisonRows,
  entityName,
  officialLocatorFacts,
  registrationChecklists,
  TOOLKIT_UNIMPLEMENTED,
  zoneFacts,
} from "@/lib/toolkit";

export function ToolkitWorksheets({ facts }: { facts: PublishedFact[] }) {
  const checklists = registrationChecklists(facts);
  const locators = officialLocatorFacts(facts);
  const comparison = comparisonRows(facts);
  const windows = applicationWindows(facts);

  return (
    <div className="mt-10 space-y-14">
      <section>
        <h2 className="font-serif text-2xl text-ink">
          Registration Document Checklist
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Per-district lists already sourced in Registration Mechanics. Districts
          whose enrollment page did not publish a list stay marked. Use your
          browser&apos;s print function to print or save this page.
        </p>
        {checklists.map((checklist) => (
          <div key={checklist.slug} className="mt-8 max-w-xl">
            <h3 className="font-serif text-xl text-ink">{checklist.name}</h3>
            {checklist.isVerify ? (
              <p className="mt-3 text-ink">
                <SourcedFact fact={checklist.fact} />
              </p>
            ) : (
              <>
                <ul className="mt-4 space-y-2 text-ink">
                  {checklist.items.map((item) => (
                    <li key={item}>
                      <label className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>{item}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-muted">
                  {isSecondaryFact(checklist.fact) ? (
                    <span className="text-brick">unconfirmed — verify directly </span>
                  ) : null}
                  (
                  {isHttpUrl(checklist.fact.source_url) ? (
                    <a
                      href={checklist.fact.source_url}
                      className="text-brick hover:underline"
                    >
                      source
                    </a>
                  ) : (
                    checklist.fact.source_url
                  )}
                  , verified {checklist.fact.verified_at})
                </p>
              </>
            )}
          </div>
        ))}
      </section>

      <section>
        <h2 className="font-serif text-2xl text-ink">
          Zone-vs-listing cross-check
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Use the district tool. Do not trust realtor or listing maps. Confirm
          the zone before you sign a lease.
        </p>
        {locators.length > 0 ? (
          <ul className="mt-4 max-w-xl list-disc space-y-3 pl-5 text-ink">
            {locators.map((fact) => (
              <li key={`${fact.entity_slug}:${fact.field}`}>
                <span className="text-sm text-muted">
                  {entityName(facts, fact.entity_slug)}
                  {": "}
                </span>
                <SourcedFact fact={fact} />
              </li>
            ))}
          </ul>
        ) : null}
        <LeaseCheck facts={zoneFacts(facts)} />
      </section>

      <section>
        <h2 className="font-serif text-2xl text-ink">School comparison</h2>
        <p className="mt-4 max-w-xl text-muted">
          Sourced fields only: name, website, locator, and enrollment path. This
          table is not a ranking and does not invent scores, tuition, or
          commute times.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-rule text-muted">
                <th className="py-2 pr-4 font-normal">System</th>
                <th className="py-2 pr-4 font-normal">Website</th>
                <th className="py-2 pr-4 font-normal">Locator</th>
                <th className="py-2 font-normal">Enrollment path</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.slug} className="border-b border-rule align-top">
                  <td className="py-3 pr-4 text-ink">{row.name}</td>
                  <td className="py-3 pr-4 text-ink">
                    {row.websiteFact ? (
                      <SourcedFact fact={row.websiteFact} />
                    ) : (
                      <VerifyToken>{`published website for ${row.name}`}</VerifyToken>
                    )}
                  </td>
                  <td className="py-3 pr-4 text-ink">
                    {row.locatorFact ? (
                      <SourcedFact fact={row.locatorFact} />
                    ) : (
                      <VerifyToken>{`official zone locator for ${row.name}`}</VerifyToken>
                    )}
                  </td>
                  <td className="py-3 text-ink">
                    {row.enrollmentFact ? (
                      <SourcedFact fact={row.enrollmentFact} />
                    ) : (
                      <VerifyToken>{`published enrollment path for ${row.name}`}</VerifyToken>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-ink">
          Sourced application windows
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          This is not a month-grid calendar. Only windows that exist as sourced
          facts are listed. Missing windows stay marked.
        </p>
        <dl className="mt-6 max-w-xl space-y-6">
          {windows.map((row) => (
            <div key={`${row.fact.entity_slug}:${row.fact.field}`}>
              <dt className="text-sm text-muted">
                {row.entityName} — {row.fieldLabel}
              </dt>
              <dd className="mt-1 text-ink">
                <SourcedFact fact={row.fact} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-ink">Not in this edition</h2>
        <ul className="mt-4 max-w-xl list-disc space-y-3 pl-5 text-muted">
          {TOOLKIT_UNIMPLEMENTED.map((item) => (
            <li key={item.name}>
              {item.name} is not implemented.{" "}
              <VerifyToken>{item.verify}</VerifyToken>
            </li>
          ))}
          <li>
            A month-grid Deadline Calendar is not implemented. Sourced windows
            are listed above.
          </li>
        </ul>
      </section>
    </div>
  );
}
