
import React from 'react';

// Bu en temel dinamik sayfa yapısıdır.
// generateMetadata, generateStaticParams veya async olmadan.
export default function MinimalPostPage({ params }: { params: { slug: string } }) {
    return (
        <div className="bg-black text-white min-h-screen p-10">
            <h1 className="text-4xl font-bold">Test Sayfası</h1>
            <p className="mt-4 text-xl">Görüntülenen Slug: {params.slug}</p>
            <p className="mt-2 text-lime-300">Eğer bu sayfayı görüyorsanız, build işlemi başarılı olmuştur.</p>
        </div>
    );
}