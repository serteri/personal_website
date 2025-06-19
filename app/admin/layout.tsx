import React from 'react';

// Bu layout, gelecekte oluşturacağınız /admin ile başlayan tüm sayfaları saracaktır.
export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {/* İleride buraya admin paneline özel bir navbar veya kenar çubuğu ekleyebilirsiniz */}
            {children}
        </section>
    );
}