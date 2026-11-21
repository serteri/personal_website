// Central data for the four service pages (/services/[slug]) and the homepage grid.
// Keep claims concrete; no invented metrics, client counts or testimonials.

export interface ProcessStep {
    title: string; // Audit / Build / Launch
    text: string;
}

export interface Service {
    slug: string;
    number: string; // "01".."04"
    title: string;
    scope: string; // delivery label shown on cards and pages
    description: string; // card text on the homepage
    summary: string; // 2 sentences, page intro and meta description
    whoFor: string[];
    included: string[];
    process: ProcessStep[];
}

export const services: Service[] = [
    {
        slug: "mvp-saas-engineering",
        number: "01",
        title: "MVP & SaaS Engineering",
        scope: "3–5 WEEKS",
        description:
            "From idea to live product in weeks. Full-stack web apps with auth, billing, and scalable databases built to launch fast.",
        summary:
            "We take a product idea to a live, usable app in 3–5 weeks. Full-stack, with the foundations a real product needs from day one: accounts, payments, and a database that scales.",
        whoFor: [
            "Founders with a clear idea who need a working product, not another slide deck.",
            "Teams replacing a spreadsheet-and-email process with software their customers can log into.",
            "Businesses launching a paid web product that needs accounts and billing.",
        ],
        included: [
            "Full-stack web app (Next.js, TypeScript) on a production database",
            "User authentication with role-based access",
            "Billing for subscriptions or one-off payments",
            "Deployment to your own hosting accounts",
            "Source code in your repository, with setup notes",
        ],
        process: [
            { title: "Audit / Scope", text: "Define the smallest version that proves the idea. Agree scope, data model, and timeline." },
            { title: "Build", text: "Working builds you can click through during the project, not just status reports." },
            { title: "Launch & Handover", text: "Deploy to production and hand over code, accounts, and documentation." },
        ],
    },
    {
        slug: "document-workflow-automation",
        number: "02",
        title: "Document & Workflow Automation",
        scope: "CUSTOM PIPELINES",
        description:
            "Replace manual PDFs, spreadsheets, and repetitive admin with custom AI pipelines and internal web tools.",
        summary:
            "We replace manual document handling and repetitive admin with pipelines built around your actual process. Scoped by complexity, typically 2–4 weeks.",
        whoFor: [
            "Teams re-keying data from PDFs, forms, or emails into other systems.",
            "Operations that run on spreadsheets and break as volume grows.",
            "Businesses where staff spend hours on checks a system could flag.",
        ],
        included: [
            "Map of the current manual process, including its exceptions",
            "Document intake and extraction pipeline (PDF, email, uploads)",
            "AI-assisted checks with a human review step for anything uncertain",
            "Internal web tool for staff to review, approve, and export",
            "Logging, so every automated decision can be traced",
        ],
        process: [
            { title: "Audit / Scope", text: "Walk through the real workflow and sample documents. Decide what to automate and what stays human." },
            { title: "Build", text: "Build the pipeline and internal tool against your real samples." },
            { title: "Launch & Handover", text: "Run it alongside the current process, then switch over with documentation." },
        ],
    },
    {
        slug: "ai-app-rescue",
        number: "03",
        title: "AI-App Rescue & Hardening",
        scope: "1–2 WEEKS",
        description:
            "Stuck with a half-built Lovable, Bolt, or Cursor prototype? We fix the architecture, security, and database to get it production-ready.",
        summary:
            "We take a prototype built with Lovable, Bolt, or Cursor and make it safe to put real users on. Architecture, security, and database fixes in 1–2 weeks.",
        whoFor: [
            "Founders whose AI-built prototype works in demos but not in production.",
            "Teams unsure whether their app's authentication, data access, or secrets are safe.",
            "Anyone whose prototype slows down or breaks when real users arrive.",
        ],
        included: [
            "Code and architecture review with a written findings list",
            "Security fixes: authentication, access rules, secrets handling",
            "Database schema clean-up and migrations",
            "Move to a proper production deployment",
            "Handover notes explaining how the app is structured",
        ],
        process: [
            { title: "Audit / Scope", text: "Review the code, database, and deployment. Rank issues by risk." },
            { title: "Build", text: "Fix the highest-risk issues first, then restructure what blocks growth." },
            { title: "Launch & Handover", text: "Deploy the hardened version and hand over a clear map of the codebase." },
        ],
    },
    {
        slug: "conversion-websites",
        number: "04",
        title: "Conversion Websites & Lead Systems",
        scope: "1–2 WEEKS",
        description:
            "Fast, no-fluff websites engineered to capture leads—complete with automated booking, forms, and CRM follow-ups.",
        summary:
            "We build fast, focused websites that turn visitors into enquiries, then connect them to booking and follow-up. Delivered in 1–2 weeks.",
        whoFor: [
            "Service businesses whose site looks fine but doesn't generate enquiries.",
            "Teams losing leads to slow follow-up or a clunky booking process.",
            "Companies replacing a slow site builder with something fast.",
        ],
        included: [
            "Fast, mobile-first website built around one clear action",
            "Lead capture forms with validation and spam protection",
            "Automated booking flow",
            "Instant notification and CRM follow-up on every new lead",
            "Technical SEO basics and Core Web Vitals optimisation",
        ],
        process: [
            { title: "Audit / Scope", text: "Review the current site and lead flow. Agree the one action the site must drive." },
            { title: "Build", text: "Build the site, forms, booking, and follow-up automations together." },
            { title: "Launch & Handover", text: "Go live, test every lead path end to end, and hand over access." },
        ],
    },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
