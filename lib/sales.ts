export const salesCopy = {
  problem:
    "You can tour a house in Madison and enroll in Madison County. You can live inside Huntsville city limits and be zoned to a school four neighborhoods away. Madison City's published policy admits students who reside within the Madison City school zone — and there's no obvious front door for anyone else. Athens City takes non-residents through a separate application entirely. Nobody puts these three facts on the same page, because the people writing about Huntsville schools are selling houses.",
  mechanism:
    "This is not a ranking. Rankings are opinions with a number attached. This is the underlying material: what each system publishes, what each school requires, when each window opens, and where to confirm it yourself in one click. Where a fact couldn't be confirmed from an official source, it says so.",
  zonePromise:
    "The Zone Promise. If your address isn't covered, or a deadline in this guide turns out to be wrong on the day you call, email us and we'll refund you in full — and fix it for everyone else the same week.",
  whoBuiltThis:
    "Nicholas Gil is moving back to north Alabama. He built the resource he needed: one place to read what each system publishes, with a link and a date on every fact.",
  whyFreeGuidesFail: [
    "Most of what you will find for free was written by someone trying to sell a house. That is a different job from compiling district policy.",
    "Those pages are realtor-authored. They rarely cite a source. They skip application windows. They skip tuition, or they skip the schools that do not publish it. They treat Huntsville as one system.",
    "You cannot choose from that. You can only get a feeling.",
  ],
  objections: [
    {
      question: "Isn't this all free on the districts' websites?",
      answer:
        "Yes, and it is spread across five district sites, two GIS tools, a state ESA portal that redirects to a vendor domain, ten private school sites that don't publish tuition, and a state report card most people have never opened. The guide is the assembly, not the facts.",
    },
    {
      question: "Won't this be out of date?",
      answer:
        "Every fact carries the date it was verified. If a deadline is wrong the day you call, you get your money back and it's fixed that week.",
    },
    {
      question: "I already have a realtor.",
      answer:
        "Your realtor is legally cautious about school comparisons for good reason. Most publicly decline to rank or recommend schools at all.",
    },
    {
      question: "$79 for a PDF?",
      answer:
        "It isn't a PDF, and the comparison isn't to a free blog post. It's to the cost of signing a lease in the wrong zone.",
    },
    {
      question: "Do I need the Toolkit?",
      answer:
        "If you've already picked your school, no. If you're comparing more than three, the worksheets are the reason you'll finish in an evening.",
    },
  ],
  faq: [
    {
      question: "How do I open the guide after I pay?",
      answer:
        "Stripe takes the payment. A magic-link email goes to the checkout address. Open the link, then go to /guide. If you bought with a different email than the one you are signed in with, request a link from /account.",
    },
    {
      question: "How do refunds work?",
      answer:
        "30-day unconditional money-back. Email us through the contact form. You get a full refund. The Zone Promise also covers a missed address or a deadline that is wrong on the day you call.",
    },
    {
      question: "What is the Toolkit?",
      answer:
        "The $149 tier adds the School Comparison Worksheet (pre-filled), Deadline Calendar, Registration Document Checklist per district, Call Script Pack, and Zone-vs-Listing cross-check worksheet.",
    },
    {
      question: "Why is the call capped?",
      answer:
        "The $349 tier includes one 45-minute video call with Nicholas. There are 4 slots each month. The pricing card shows how many remain, counted from this month's paid, non-refunded call purchases.",
    },
  ],
} as const;
