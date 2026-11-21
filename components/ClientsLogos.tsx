import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

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
        wordmark: { text: "Logivisa", className: "font-extrabold tracking-tight" },
    },
    {
        name: "ProviderShield",
        alt: "ProviderShield logo",
        href: "https://providershield.com.au",
        wordmark: { text: "ProviderShield", className: "font-bold tracking-tight" },
    },
    {
        name: "FlightAgent",
        alt: "FlightAgent logo",
        href: "https://flightagent.io",
        wordmark: { text: "FlightAgent", className: "font-semibold tracking-wide" },
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
        <section className="bg-[#F4F4F5] border-b border-line py-14 px-4">
            <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                <h2 className="mb-5 font-mono text-xs uppercase tracking-wider text-muted">{title}</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-3 border-t border-l border-line">
                    {logos.map((logo) => {
                        const content = logo.src ? (
                            <span className="relative block h-full w-full">
                                <Image src={logo.src} alt={logo.alt} fill className="object-contain" sizes="280px" />
                            </span>
                        ) : (
                            <span role="img" aria-label={logo.alt} className={`text-2xl md:text-3xl text-ink ${logo.wordmark.className}`}>
                                {logo.wordmark.text}
                            </span>
                        );
                        const cell =
                            "group relative flex h-32 w-full items-center justify-center bg-white p-4 transition-colors duration-300 hover:bg-[#FAFAFA] hover:text-cobalt";
                        return (
                            <li key={logo.name} className="border-r border-b border-line">
                                {logo.href ? (
                                    <a href={logo.href} target="_blank" rel="noopener noreferrer" className={cell}>
                                        {content}
                                        <ArrowUpRight
                                            className="absolute right-3 top-3 h-4 w-4 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cobalt"
                                            aria-hidden="true"
                                        />
                                    </a>
                                ) : (
                                    <div className={cell}>{content}</div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
