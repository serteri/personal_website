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
    gradient: string; // Tailwind gradient classes for the placeholder cover
    problem: string;
    built: string[];
    stack: string[];
    outcome: string[];
    disclaimer?: string;
    // TODO(serter): add real metric (e.g. users, providers onboarded) — render nothing until verified.
    metric?: { label: string; value: string };
}

// TODO(serter): drop these screenshots into /public/projects/ :
//   /public/projects/provider-shield.png
//   /public/projects/logivisa.png
//   /public/projects/flightagent.png
// then set `coverImage` below (the placeholder card is used until then).

export const caseStudies: (CaseStudy & { coverImage?: string })[] = [
    {
        slug: "provider-shield",
        title: "Provider Shield",
        summary: "NDIS compliance, simplified: a RAG assistant and workflow built to help registered providers stay audit-ready.",
        tags: ["SaaS", "AI / RAG", "Compliance"],
        liveUrl: "https://providershield.com.au",
        category: "Own Product",
        gradient: "from-emerald-500 via-teal-500 to-cyan-600",
        problem:
            "Registered NDIS providers have to follow a large set of rules and keep their compliance work organised. Finding the relevant rule and tracking what has been done is time-consuming.",
        built: [
            "A RAG-based assistant that answers questions over NDIS rules.",
            "A compliance workflow for registered providers.",
        ],
        stack: ["Next.js", "TypeScript", "Tailwind", "Prisma", "Neon PostgreSQL", "Vercel"],
        outcome: [
            "Shipped and live at providershield.com.au.",
            "Includes the RAG assistant and the compliance workflow described above.",
        ],
        // TODO(serter): add real metric
    },
    {
        slug: "logivisa",
        title: "LogiVisa",
        summary: "Know where you stand before you apply: a visa and immigration readiness assessment, crafted to convert.",
        tags: ["Assessment Tool", "Immigration", "Web App"],
        liveUrl: "https://logivisa.com",
        category: "Own Product",
        gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
        problem:
            "People often start a visa or immigration process without knowing how ready they are. They need a clear picture of where they stand before they apply.",
        built: ["A readiness assessment tool that helps people understand where they stand before applying."],
        // TODO(serter): confirm the exact stack for LogiVisa and list it here.
        stack: [],
        outcome: ["Shipped and live at logivisa.com.", "An assessment product that helps users understand their readiness."],
        disclaimer:
            "LogiVisa is an assessment tool. It is not migration advice and is not a registered migration agent service.",
        // TODO(serter): add real metric
    },
    {
        slug: "flightagent",
        title: "FlightAgent.io",
        summary: "Flight disruption protection for travellers: support in place for when flights go wrong, crafted to convert.",
        tags: ["Travel", "Protection", "Web App"],
        liveUrl: "https://flightagent.io",
        category: "Own Product",
        gradient: "from-sky-500 via-blue-600 to-indigo-700",
        problem:
            "When a flight is delayed or cancelled, travellers are left to sort it out themselves. The product began as a flight search idea and is now focused on protection when flights go wrong.",
        built: ["A flight disruption protection stack for travellers."],
        // TODO(serter): confirm the exact stack for FlightAgent.io and list it here.
        stack: [],
        outcome: ["Shipped and live at flightagent.io.", "Focused on traveller protection during flight disruption."],
        // TODO(serter): add real metric
    },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
