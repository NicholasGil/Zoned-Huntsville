export const salesCopy = {
  whatsInTheGuide: [
    "The $79 Guide is the 2026–27 edition.",
    "What is sourced today is The Five Systems: Huntsville City, Madison City, Madison County, Athens City, and Limestone County. Each published fact is linked to its official source and stamped with the date we verified it.",
    "Remaining modules stay in the Guide and are marked until they are sourced. They are not sold as a finished catalog of magnets, private schools, deadlines, or registration documents.",
  ],
  problem:
    "You can tour a house in Madison and enroll in Madison County. You can live inside Huntsville city limits and be zoned to a school four neighborhoods away. Madison City's published policy admits students who reside within the Madison City school zone — and there's no obvious front door for anyone else. Athens City takes non-residents through a separate application entirely. Nobody puts these three facts on the same page, because the people writing about Huntsville schools are selling houses.",
  mechanism:
    "This is not a ranking. Rankings are opinions with a number attached. This is the underlying material: what each system publishes, linked to its official source and the date we verified it. Where a fact couldn't be confirmed from an official source, it says so.",
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
        "Yes, and it is spread across district sites, GIS tools, a state ESA portal that redirects to a vendor domain, private school sites, and a state report card most people have never opened. The Guide puts the sourced Five Systems material on one page. Remaining modules are marked until they are sourced.",
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
        "If the Guide is enough, buy the Guide. The Toolkit tier is optional. It is not required to read the Five Systems material.",
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
        "The $149 tier adds Toolkit access on top of the Guide. This edition does not include a downloadable worksheet pack. The $349 tier adds one 45-minute video call with Nicholas.",
    },
    {
      question: "Why is the call capped?",
      answer:
        "The $349 tier includes one 45-minute video call with Nicholas. There are 4 slots each month. The pricing card shows how many remain, counted from this month's paid, non-refunded call purchases.",
    },
  ],
} as const;
