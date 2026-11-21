import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="bg-slate-50 px-4 py-20">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-center text-white shadow-lg sm:px-12">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(37,99,235,0.35), transparent 70%)" }}
                />
                <div className="relative">
                    <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                        Ready to build a system that converts?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
                        Book a quick call to discuss your website, AI workflow, or custom web app.
                    </p>
                    <Link
                        href="/booking"
                        className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-md"
                    >
                        Book a Call
                    </Link>
                </div>
            </div>
        </section>
    );
}
