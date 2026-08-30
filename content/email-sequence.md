# Kit marketing sequence

Handoff note: Kit / ConvertKit owns this five-email sequence and unsubscribe.
This Next.js app must not send these emails. It must not implement marketing unsubscribe.

Do not load this sequence into Kit until both are true:

1. Nicholas supplies a physical mailbox for CAN-SPAM and replaces every `⟦VERIFY: physical mailbox for CAN-SPAM⟧` token.
2. Kit is connected and its unsubscribe footer is on.

Email 1 is already sent by Resend on sample opt-in. In Kit, do not send a second "immediate" copy of the district profile.

Each marketing email below uses from-name `Nicholas / The Huntsville School Guide`. Subjects are non-deceptive. Kit supplies the working unsubscribe link.

---

## Email 1. Immediately

**Status.** Already handled by Resend. See `lib/transactional-mail.ts` (`sendSampleProfileEmail`). Kit does not send this.

**From-name.** Nicholas / The Huntsville School Guide

**Subject.** Your Huntsville City Schools sample

**Body intent.** Deliver the Huntsville City Schools profile only. No pitch. No price. No buy CTA. A link to `/sample` is allowed.

**Kit / CAN-SPAM.** Do not send this from Kit. If a Kit record is kept for the series, leave it unsent.

---

## Email 2. Day 1, the zone trap

**From-name.** Nicholas / The Huntsville School Guide

**Subject.** Your address and your school zone may not match

**Body.**

You can tour a house in Madison and enroll in Madison County.

You can live inside Huntsville city limits and be zoned to a school four neighborhoods away.

Madison City published language admits students who reside within the Madison City school zone.

Athens City has a separate non-resident path.

Those four facts sit on different sites. Check the address against the system that assigns the school.

Huntsville City Schools locator: https://maps.huntsvilleal.gov/myschools/

Madison City Schools locator: https://hmphoar.maps.arcgis.com/apps/instant/lookup/index.html?appid=f32249aa33ef4de9b10a5a6bddcfc1b3

Madison County Schools locator: https://www.mcssk12.org/enrollment/school-zone

The guide is the rest of that picture in one place: https://huntsvilleschoolguide.com

⟦VERIFY: physical mailbox for CAN-SPAM⟧

Kit owns unsubscribe. This app does not implement marketing unsubscribe.

---

## Email 3. Day 3, the deadline problem

**From-name.** Nicholas / The Huntsville School Guide

**Subject.** School deadlines here sit on different calendars

**Editor.** Any date that is not already a seed fact stays a token. Do not invent one.

**Body.**

A family comparing schools in this metro is not watching one calendar.

They are tracking windows across five public systems, magnet and specialty applications, private-school applications, and the CHOOSE Act.

Those windows do not open on the same day. They do not live on the same site.

⟦VERIFY: current-cycle registration windows for Huntsville City, Madison City, Madison County, Athens City, and Limestone County⟧

⟦VERIFY: current-cycle magnet and specialty application windows⟧

⟦VERIFY: current-cycle private-school application windows used in this metro⟧

The guide is where those windows are collected, each with a source and a verification date: https://huntsvilleschoolguide.com

⟦VERIFY: physical mailbox for CAN-SPAM⟧

Kit owns unsubscribe. This app does not implement marketing unsubscribe.

---

## Email 4. Day 5, CHOOSE Act

**From-name.** Nicholas / The Huntsville School Guide

**Subject.** The CHOOSE Act portal redirects to ClassWallet

**Body.**

Alabama's official CHOOSE Act portal is https://chooseact.alabama.gov

That address redirects to ClassWallet at https://classwallet.com/alchoose. The .gov URL bouncing to a vendor domain is expected. It is still the state program.

The 2026–27 window closed at midnight on March 31, 2026. The next cycle opens January 2027 ⟦VERIFY: exact date near publish⟧.

For 2027–28 the income cap is scheduled to come off. That is a policy change.

The guide's paying-for-it module is built around that program: https://huntsvilleschoolguide.com

⟦VERIFY: physical mailbox for CAN-SPAM⟧

Kit owns unsubscribe. This app does not implement marketing unsubscribe.

---

## Email 5. Day 8, the offer

**From-name.** Nicholas / The Huntsville School Guide

**Subject.** The Huntsville School Guide is $79, $149, or $349

**Body.**

The Huntsville School Guide is $79 for the guide, $149 for the guide plus the Toolkit, or $349 for the guide, the Toolkit, and one 45-minute call.

30-day unconditional money-back.

The Zone Promise. If your address isn't covered, or a deadline in this guide turns out to be wrong on the day you call, email us and we'll refund you in full — and fix it for everyone else the same week.

https://huntsvilleschoolguide.com

⟦VERIFY: physical mailbox for CAN-SPAM⟧

Kit owns unsubscribe. This app does not implement marketing unsubscribe.
