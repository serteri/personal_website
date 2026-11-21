// Data source for our own products (case studies).
// Rules: no invented metrics, user counts, revenue, testimonials or dates.

export interface CaseStudy {
    slug: string;
    title: string;
    summary: string; // max 140 chars
    tags: string[];
    year?: string; // left out when unknown
    liveUrl: string;
    category: "Own Product";
    problem: string;
    built: string[];
    stack: string[];
    outcome: string[];
    disclaimer?: string;
    // TODO(serter): add real metric (e.g. users, providers onboarded) — render nothing until verified.
    metric?: { label: string; value: string };
}

// TODO(serter): drop these 1280x800 screenshots into /public/projects/ :
//   /public/projects/logivisa.png
//   /public/projects/providershield.png
//   /public/projects/flightagent.png
// Until the files exist, cards fall back to a flat placeholder.

export const caseStudies: (CaseStudy & { coverImage?: string })[] = [
    {
        slug: "provider-shield",
        coverImage: "/projects/providershield.png",
        title: "Provider Shield",
        summary: "NDIS document review that flags missing information and inconsistencies in participant files before they become bigger problems.",
        tags: ["Compliance SaaS", "Document Review"],
        liveUrl: "https://providershield.com.au",
        category: "Own Product",
        problem:
            "NDIS providers keep a lot of participant documentation: progress notes, service agreements, timesheets and service records. Gaps and inconsistencies in those files are easy to miss until they become bigger problems.",
        built: [
            "A document review tool that checks participant documentation, progress notes and service records and flags missing information and inconsistencies, without replacing existing NDIS software.",
            "A free document check that needs no sign-up. It makes suggestions; the provider's team reviews and decides.",
            // TODO(serter): confirm the RAG-based assistant over NDIS rules is live on the site, then add it back here. It is not mentioned on the public homepage.
        ],
        stack: ["Next.js", "TypeScript", "Tailwind", "Prisma", "Neon PostgreSQL", "Vercel"],
        outcome: [
            "Shipped and live at providershield.com.au.",
            "Offers a free document check and a signed-in product for providers.",
        ],
        // TODO(serter): add real metric
    },
    {
        slug: "logivisa",
        coverImage: "/projects/logivisa.png",
        title: "LogiVisa",
        summary: "Know where you stand before you apply: a visa and immigration readiness assessment, crafted to convert.",
        tags: ["Assessment Tool", "Immigration", "Web App"],
        liveUrl: "https://logivisa.com",
        category: "Own Product",
        problem:
            "Australian visa information is spread across many published sources. People need a way to research occupations, skills assessments and visa requirements, and to see where each piece of information comes from.",
        built: [
            "Research tools for Australian visa and occupation information: occupation and ANZSCO search, points calculation and visa comparison.",
            "A structured LogiVisa Assessment for people who want a guided review of where they stand.",
        ],
        // TODO(serter): confirm the exact stack for LogiVisa and list it here.
        stack: [],
        outcome: [
            "Shipped and live at logivisa.com.",
            "Provides information and research tools, not personalised immigration advice.",
        ],
        disclaimer:
            "LogiVisa provides information and research tools. It is not personalised immigration advice and is not a registered migration agent service.",
        // TODO(serter): add real metric
    },
    {
        slug: "flightagent",
        coverImage: "/projects/flightagent.png",
        title: "FlightAgent.io",
        summary: "Flight disruption protection for travellers: support in place for when flights go wrong, crafted to convert.",
        tags: ["Travel", "Protection", "Web App"],
        liveUrl: "https://flightagent.io",
        category: "Own Product",
        problem:
            "When a flight is delayed or cancelled, travellers often find out late and don't know whether they may be owed compensation. The product began as a flight search idea and is now focused on protection when flights go wrong.",
        built: [
            "Flight disruption monitoring: it watches booked flights and emails the traveller when they are delayed or cancelled.",
            "A check of whether the traveller may be eligible for EU261 or UK261 compensation.",
        ],
        // TODO(serter): confirm the exact stack for FlightAgent.io and list it here.
        stack: [],
        outcome: [
            "Shipped and live at flightagent.io.",
            "Monitors bookings and tells travellers about disruption and possible compensation eligibility.",
        ],
        // TODO(serter): add real metric
    },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
