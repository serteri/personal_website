import Image from "next/image";

export type ClientLogo = {
    name: string;
    alt: string;
    href?: string;
    // TODO(serter): when a logo file exists, set e.g. src: "/logos/logivisa.svg".
    // Until then the wordmark below is rendered instead of a broken image.
    src?: string;
    wordmark: { text: string; className: string };
};

// Single place to edit the logo strip.
export const clientLogos: ClientLogo[] = [
    {
        name: "Logivisa",
        alt: "Logivisa logo",
        href: "https://logivisa.com",
        wordmark: { text: "Logivisa", className: "font-extrabold tracking-tight text-indigo-600" },
    },
    {
        name: "ProviderShield",
        alt: "ProviderShield logo",
        href: "https://providershield.com.au",
        wordmark: { text: "ProviderShield", className: "font-bold tracking-tight text-emerald-600" },
    },
    {
        name: "FlightAgent",
        alt: "FlightAgent logo",
        href: "https://flightagent.io",
        wordmark: { text: "FlightAgent", className: "font-semibold tracking-wide text-sky-600" },
    },
];

export default function ClientsLogos({
    logos = clientLogos,
    title = "PRODUCTS WE BUILT & RUN",
}: {
    logos?: ClientLogo[];
    title?: string;
}) {
    return (
        <section className="bg-black text-white py-14 px-4 md:px-8">
            <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-wide mb-8">{title}</h2>

            <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-6 md:p-10 shadow-2xl shadow-blue-500/20">
                <ul className="flex flex-col sm:flex-row items-stretch justify-center gap-4 md:gap-8">
                    {logos.map((logo) => {
                        const content = logo.src ? (
                            <span className="relative block w-full h-full">
                                <Image src={logo.src} alt={logo.alt} fill className="object-contain" sizes="280px" />
                            </span>
                        ) : (
                            <span role="img" aria-label={logo.alt} className={`text-2xl md:text-3xl ${logo.wordmark.className}`}>
                                {logo.wordmark.text}
                            </span>
                        );
                        const box =
                            "flex items-center justify-center w-full sm:w-64 h-28 md:h-32 rounded-2xl bg-white shadow-md p-4";
                        return (
                            <li key={logo.name} className="flex justify-center">
                                {logo.href ? (
                                    <a href={logo.href} target="_blank" rel="noopener noreferrer" className={box}>
                                        {content}
                                    </a>
                                ) : (
                                    <div className={box}>{content}</div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
