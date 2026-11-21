import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="bg-[#18181B] px-4 py-24 text-[#FAFAFA]">
            <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
                <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">04 / CONTACT</p>
                <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-8">
                        <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
                            Ready to build a system that converts?
                        </h2>
                        <p className="mt-5 max-w-xl text-lg text-zinc-400">
                            Book a quick call to discuss your website, AI workflow, or custom web app.
                        </p>
                    </div>
                    <div className="lg:col-span-4 lg:text-right">
                        <Link
                            href="/booking"
                            className="inline-flex items-center justify-center bg-[#0047FF] px-8 py-4 text-base font-semibold text-white transition hover:bg-[#0038CC]"
                        >
                            Book a Call
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
