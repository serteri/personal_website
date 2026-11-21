import React from "react";

// Section header: monospace index/label above a tight bold heading.
export default function SwissHeader({
    index,
    label,
    title,
    as: Tag = "h2",
}: {
    index: string;
    label: string;
    title: string;
    as?: "h1" | "h2";
}) {
    return (
        <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">
                {index} / {label}
            </p>
            <Tag className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-ink">{title}</Tag>
        </div>
    );
}
