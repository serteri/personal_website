import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="bg-black px-4 py-20">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-14 text-center sm:px-12">
                {/* soft top glow */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(99,102,241,0.22), transparent 70%)",
                    }}
                />
                <div className="relative">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                        Ready to build a system that converts?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
                        Book a quick call to discuss your website, AI workflow, or custom web app.
                    </p>
                    <Link
                        href="/booking"
                        className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black transition hover:bg-zinc-200"
                    >
                        Book a Call
                    </Link>
                </div>
            </div>
        </section>
    );
}
