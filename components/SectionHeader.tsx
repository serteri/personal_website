import React from "react";

// Section header: small blue eyebrow, large friendly heading, optional intro.
export default function SectionHeader({
    eyebrow,
    title,
    description,
    align = "left",
}: {
    eyebrow: string;
    title: string;
    description?: string;
    align?: "left" | "center";
}) {
    return (
        <div className={`mb-12 ${align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}`}>
            <p className="text-sm font-semibold text-blue-600">{eyebrow}</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight text-slate-900">{title}</h2>
            {description && <p className="mt-4 text-lg text-slate-600">{description}</p>}
        </div>
    );
}
