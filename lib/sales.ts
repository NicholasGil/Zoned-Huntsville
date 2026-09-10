export const salesCopy = {
  heroRiskReversal:
    "30-day refund. Zone Promise: uncovered address or a wrong deadline the day you call — full refund.",
  whatsInTheGuide: [
    "The $79 Guide is the 2026–27 edition.",
    "What is sourced today is The Five Systems: Huntsville City, Madison City, Madison County, Athens City, and Limestone County. Each published fact is linked to its official source and stamped with the date we verified it.",
    "The Guide also covers zones and addresses, magnets, private schools, homeschool paths, paying for school, and registration — each fact linked to its official source and dated. It is not sold as a complete catalog of every magnet seat, private school tuition figure, or district document.",
  ],
  offerStack: [
    {
      name: "The Guide — $79",
      detail:
        "Sourced 2026–27 Guide modules, web-based, mobile-readable, lifetime access. Every published fact is linked to its official source and dated.",
    },
    {
      name: "Guide + Toolkit — $149",
      detail:
        "Everything in the Guide, plus Toolkit access: on-page printable checklists built from sourced facts already in the Guide. This edition does not include a downloadable PDF pack.",
    },
    {
      name: "Guide + Toolkit + Call — $349",
      detail:
        "Everything in the Guide and Toolkit, plus one 45-minute video call with an expert. Four slots each month.",
    },
  ],
  problem:
    "Huntsville is five school systems, not one. A neighborhood name on a listing is not a zone. You can tour a house in Madison and enroll in Madison County. You can live inside Huntsville city limits and be zoned to a school four neighborhoods away. Deadlines sit on five different district calendars, a state ESA portal, and school sites. If the lease is in three weeks, you do not have time to reconstruct that from realtor blogs.",
  problemDetail:
    "Madison City's published policy admits students who reside within the Madison City school zone — and there's no obvious front door for anyone else. Athens City takes non-residents through a separate application entirely. Nobody puts these facts on the same page, because the people writing about Huntsville schools are selling houses.",
  mechanism:
    "This is not a ranking. Rankings are opinions with a number attached. This is sourced assembly: what each system publishes, linked to its official source and the date we verified it. Where a fact couldn't be confirmed from an official source, it says so.",
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
        "Yes, and it is spread across district sites, GIS tools, a state ESA portal that redirects to a vendor domain, private school sites, and a state report card most people have never opened. The Guide puts those sources on one page — Five Systems, zones, registration, and the rest of this edition — each fact linked and dated.",
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
        "If the Guide is enough, buy the Guide. The Toolkit tier is optional. It is Toolkit access — on-page checklists — not a five-worksheet pack. It is not required to read the Five Systems material.",
    },
  ],
  faq: [
    {
      question: "How do I open the guide after I pay?",
      answer:
        "Stripe takes the payment and sends you back to a thank-you page with an Open the guide button. Click it and you are in. If you come back later on another device, use Send link on /login or /account with your checkout email and we email you a sign-in link.",
    },
    {
      question: "How do refunds work?",
      answer:
        "30-day unconditional money-back. Email us through the contact form. You get a full refund. The Zone Promise also covers a missed address or a deadline that is wrong on the day you call.",
    },
    {
      question: "What is the Toolkit?",
      answer:
        "The $149 tier adds Toolkit access on top of the Guide. The Toolkit is on-page printable checklists built from sourced facts already in the Guide. This edition does not include a downloadable PDF pack. The $349 tier adds one 45-minute video call with an expert.",
    },
    {
      question: "Why is the call capped?",
      answer:
        "The $349 tier includes one 45-minute video call with an expert. There are 4 slots each month. The pricing card shows how many remain, counted from this month's paid, non-refunded call purchases.",
    },
    {
      question: "Can I upgrade from the $79 Guide to Toolkit or Call?",
      answer:
        "Yes. There is no pay-the-difference or prorated upgrade checkout. Choose the higher tier on the pricing section and pay the full listed price ($149 for Guide + Toolkit, $349 for Guide + Toolkit + Call). Each purchase is a separate Stripe charge at that price. Access stacks: Toolkit and Call include everything in lower tiers, and your account combines every active, non-refunded purchase—so the highest tier you have paid for unlocks the matching pages.",
    },
  ],
  upgradePath: {
    headline: "Upgrade to a higher tier",
    summary:
      "There is no pay-the-difference checkout. Buy the higher tier at its full listed price from the pricing section. Each purchase is a separate charge. Access stacks across active purchases—the highest tier you have paid for wins.",
    pricingHref: "/#pricing",
    tiers: [
      {
        from: "Guide ($79)",
        to: "Guide + Toolkit ($149)",
        charge: "Pay $149 in full at checkout.",
      },
      {
        from: "Guide ($79) or Toolkit ($149)",
        to: "Guide + Toolkit + Call ($349)",
        charge: "Pay $349 in full at checkout.",
      },
    ],
  },
} as const;
