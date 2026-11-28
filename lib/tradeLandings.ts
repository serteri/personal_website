// Copy for the Brisbane trade landing pages (/ai-receptionist-brisbane-*). Each trade is written around its own
// real call types, triage rules and quoting flow. Keep claims to what the product does (see /ai-receptionist).

export interface TradeLanding {
    slug: string;
    trade: string; // "plumbers"
    tradeSingular: string; // "plumber"
    title: string; // before the "| Altiq Design" template
    description: string;
    eyebrow: string;
    h1: string;
    subhead: string;
    scenariosTitle: string;
    scenariosIntro: string;
    scenarios: { title: string; text: string }[];
    triageTitle: string;
    urgent: string[];
    routine: string[];
    captured: string[];
    steps: { title: string; text: string }[];
    faqs: { q: string; a: string }[];
    serviceName: string;
    serviceDescription: string;
    keywords: string[];
}

export const tradeLandings: TradeLanding[] = [
    {
        slug: 'ai-receptionist-brisbane-plumbers',
        trade: 'plumbers',
        tradeSingular: 'plumber',
        title: '24/7 AI Receptionist for Brisbane Plumbers',
        description:
            'Never miss a burst pipe or blocked drain call again. A 24/7 AI receptionist for Brisbane and South East Queensland plumbers: answers after hours, triages urgency, and sends you the suburb, issue and callback number.',
        eyebrow: 'For Brisbane & South East Queensland plumbers',
        h1: 'Stop losing burst-pipe jobs while you’re under a house.',
        subhead:
            'Your phone rings when you’re in a roof cavity, on a tools-down job or asleep. Sam, our AI receptionist, answers every call 24/7, works out what’s wrong, where and how urgent, and sends you the details so you can call back the jobs worth chasing first.',
        scenariosTitle: 'Built around the calls plumbers actually get',
        scenariosIntro: 'Plumbing calls are urgent, messy and suburb-specific. Sam asks the questions you would, in the order you would.',
        scenarios: [
            {
                title: 'Burst pipes & active leaks',
                text: 'Sam asks whether water is still running, whether the caller has found the isolation valve or the meter, and which suburb the property is in, then flags it as urgent in your summary so it’s the first call you return.',
            },
            {
                title: 'Blocked drains & overflowing toilets',
                text: 'It separates a slow sink from a gurgling, overflowing drain, and notes whether it’s one fixture or the whole house. Tree-root blockages in older Brisbane suburbs get logged with the detail you need to quote CCTV or jetting.',
            },
            {
                title: 'Hot water system failures',
                text: 'No hot water, a leaking tank or a tripping unit: Sam captures gas vs electric, the system’s age if the caller knows it, and whether the household is without hot water right now, which is the detail that decides same-day vs tomorrow.',
            },
            {
                title: 'After-hours triage',
                text: 'At 11pm a leaking tap and a flooding laundry sound very different. Sam tells them apart so you aren’t woken for a drip, and you don’t lose the real emergency to the plumber who answered first.',
            },
            {
                title: 'Landlords, tenants & property managers',
                text: 'It asks who is calling, whether they’re the owner or a tenant, and for property-manager or body-corporate details, so you know who approves the work before you drive out.',
            },
        ],
        triageTitle: 'Urgent now vs can wait until morning',
        urgent: [
            'Water that can’t be isolated, or flooding inside the home',
            'No hot water for a household with babies, elderly or unwell people',
            'Sewage overflow or an unusable toilet with no alternative',
            'Anything the caller describes as a gas smell: you can set Sam to tell them to leave the area and call the gas emergency line and 000 first, then take their details',
        ],
        routine: [
            'Dripping taps, running toilets and low pressure',
            'Quotes for bathroom, kitchen or hot water replacements',
            'Maintenance, inspections and non-urgent blockages',
            'Pre-listing and rental-compliance checks',
        ],
        captured: ['Caller name and best callback number', 'Suburb and street (so you can judge travel time)', 'What’s wrong, in their words', 'Urgency level and whether water is isolated', 'Owner, tenant or property manager', 'A short call summary and recording'],
        steps: [
            { title: 'Forward missed and after-hours calls', text: 'Keep your existing business number. Switch on call forwarding for calls you can’t pick up or after hours; it takes about 10 seconds from your phone settings.' },
            { title: 'Sam answers in friendly Australian English', text: 'It greets callers by your business name, asks the plumbing-specific questions above, and captures the job details instead of letting the caller ring the next plumber on Google.' },
            { title: 'You get an instant job summary', text: 'Issue, suburb, urgency and callback number land with you straight away, so you can return the burst pipe first and book the tap washer for tomorrow.' },
        ],
        faqs: [
            {
                q: 'How much does an AI receptionist for a plumbing business cost?',
                a: 'Start with the 30-day Brisbane Pilot for $99 AUD: $0 setup fee, 100 AI voice minutes and 24/7 web chat included, cancel anytime. After that, Starter is $149/month for 150 voice minutes and Growth is $249/month for 400 minutes plus calendar booking sync. Overage is $0.60/min on Starter and $0.50/min on Growth.',
            },
            {
                q: 'How long does setup take?',
                a: 'Call forwarding itself takes about 10 seconds from your phone settings. We configure Sam with your business name, service areas, hours and the triage rules you want so it answers like your own front desk.',
            },
            {
                q: 'Does it sound Australian, and will customers know it’s an AI?',
                a: 'Sam speaks in natural, friendly Australian English and uses local suburb names. It doesn’t pretend to be a person if asked, and the best way to judge the voice is to hear it yourself in the live voice demo on this page before you commit to anything.',
            },
            {
                q: 'How does it tell an emergency from a routine job?',
                a: 'It asks the same questions you would: is water still running, can it be isolated, is anyone without hot water, how many fixtures are affected. Those answers set the urgency on your summary. You decide which situations count as urgent, and you can set safety rules such as telling callers to call 000 or the gas emergency line first.',
            },
            {
                q: 'Can I keep my existing phone number?',
                a: 'Yes. Your customers keep calling the number on your ute, invoices and website. You forward missed or after-hours calls to your AI receptionist, and you can switch forwarding off at any time.',
            },
        ],
        serviceName: 'AI receptionist for plumbers',
        serviceDescription:
            '24/7 AI voice and chat receptionist for Brisbane and South East Queensland plumbers. Answers calls after hours and when on the tools, triages urgent jobs like burst pipes and blocked drains, and sends an instant job summary with suburb, issue, urgency and callback number.',
        keywords: ['AI receptionist for Brisbane plumbers', '24/7 plumbing call answering Brisbane', 'plumber answering service Brisbane', 'after-hours plumbing calls Brisbane'],
    },
    {
        slug: 'ai-receptionist-brisbane-electricians',
        trade: 'electricians',
        tradeSingular: 'electrician',
        title: 'AI Receptionist for Brisbane Electricians',
        description:
            'After-hours electrical call answering for Brisbane and South East Queensland electricians. An AI receptionist that handles power outages, tripping switchboards and quote requests, then sends you the job details instantly.',
        eyebrow: 'For Brisbane & South East Queensland electricians',
        h1: 'Don’t let a power outage call go to voicemail while you’re on a switchboard.',
        subhead:
            'You can’t answer the phone with your hands in a live board, and the caller with no power won’t wait for a callback. Sam, our AI receptionist, answers every call 24/7, finds out what’s happening and how urgent it is, and sends you the details so the right jobs get your call first.',
        scenariosTitle: 'Built around the calls electricians actually get',
        scenariosIntro: 'Electrical calls range from “my whole street is dark” to “can you quote six downlights”. Sam sorts them before they reach you.',
        scenarios: [
            {
                title: 'Power outages',
                text: 'Sam asks whether the whole house or just some circuits are out, and whether the neighbours have power. A street-wide outage is a network issue, not your job, so you don’t race out to it; a house-only fault goes to you flagged urgent.',
            },
            {
                title: 'Switchboard trips & safety switch faults',
                text: 'It captures what keeps tripping, whether the safety switch (RCD) resets, when it started and whether it followed rain, a new appliance or storm activity. That’s the detail you need to decide between a same-day visit and a morning booking.',
            },
            {
                title: 'Burning smells, sparks & hot outlets',
                text: 'These are safety situations. You can set Sam to tell the caller to switch off at the main if it’s safe to do so, keep clear and call 000 if there’s fire or danger, and then capture their details so you can follow up.',
            },
            {
                title: 'Quotes & bookings while you’re on-site',
                text: 'New power points, downlights, ceiling fans, smoke alarm upgrades, EV charger installs: Sam collects the job type, property type, suburb and preferred time, so you can quote from your ute at lunch, not from a pile of missed calls.',
            },
            {
                title: 'Landlords, property managers & builders',
                text: 'It asks who is calling and who approves the work, and records tenant access details, so repair requests from agencies arrive ready to action.',
            },
        ],
        triageTitle: 'Urgent now vs can wait until morning',
        urgent: [
            'Power out to the whole house with the neighbours still on',
            'A safety switch or main breaker that won’t reset',
            'Burning smell, sparking, buzzing or a hot or melted outlet or switchboard',
            'Water in a switchboard, meter box or light fittings after a storm',
        ],
        routine: [
            'Quotes for power points, downlights, fans and rewiring',
            'EV charger, solar or battery installation enquiries',
            'Smoke alarm upgrades and rental compliance checks',
            'Non-urgent faults such as a single dead outlet or flickering light',
        ],
        captured: ['Caller name and best callback number', 'Suburb and property type', 'What’s happening, in their words', 'Urgency level and whether power is fully out', 'Owner, tenant or property manager', 'A short call summary and recording'],
        steps: [
            { title: 'Forward missed and after-hours calls', text: 'Keep your existing business number. Forward calls you can’t pick up (on-site, on a ladder or after hours); it takes about 10 seconds from your phone settings.' },
            { title: 'Sam answers in friendly Australian English', text: 'It greets callers by your business name, runs the outage and tripping triage, or takes quote details for planned work, and captures everything you need to call back with confidence.' },
            { title: 'You get an instant job summary', text: 'The fault, suburb, urgency and callback number reach you straight away, so you can return the no-power call first and quote the downlights when you’re off the tools.' },
        ],
        faqs: [
            {
                q: 'How much does an AI receptionist for an electrical business cost?',
                a: 'Start with the 30-day Brisbane Pilot for $99 AUD: $0 setup fee, 100 AI voice minutes and 24/7 web chat included, cancel anytime. After that, Starter is $149/month for 150 voice minutes and Growth is $249/month for 400 minutes plus calendar booking sync. Overage is $0.60/min on Starter and $0.50/min on Growth.',
            },
            {
                q: 'How quickly can I be set up?',
                a: 'Forwarding calls takes about 10 seconds from your phone settings. We configure Sam with your business name, service areas, hours and which situations you treat as urgent so it handles calls the way you would.',
            },
            {
                q: 'Does it sound Australian, and what do customers think?',
                a: 'Sam speaks in natural, friendly Australian English and uses local suburb names. It doesn’t pretend to be a human if asked. Judge the voice yourself with the live voice demo on this page before you commit to anything.',
            },
            {
                q: 'How does it handle urgent faults vs quotes?',
                a: 'It listens for the signals electricians care about: a whole-house outage while neighbours have power, a safety switch that won’t reset, or any burning smell. Those come through flagged urgent. Quotes and planned work, like downlights or an EV charger, are captured as routine bookings so they don’t interrupt your night. You choose the rules, including telling callers to call 000 for fire or danger.',
            },
            {
                q: 'Can I keep my existing phone number?',
                a: 'Yes. Your customers keep ringing the number on your van and website. You forward missed or after-hours calls to your AI receptionist, and you can switch forwarding off whenever you like.',
            },
        ],
        serviceName: 'AI receptionist for electricians',
        serviceDescription:
            '24/7 AI voice and chat receptionist for Brisbane and South East Queensland electricians. Answers after-hours calls and calls while on-site, triages power outages, switchboard trips and safety switch faults, captures quote requests, and sends an instant job summary.',
        keywords: ['AI receptionist for Brisbane electricians', 'after-hours electrical call answering Brisbane', 'electrician answering service Brisbane', 'electrician missed calls Brisbane'],
    },
];

export const getTradeLanding = (slug: string) => tradeLandings.find((t) => t.slug === slug);
