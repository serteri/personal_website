import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Örnek olarak, taranmasını istemediğiniz bir klasör
        },
        sitemap: 'https://altiqdesign.com/sitemap.xml', // Site haritanızın adresi
    };
}