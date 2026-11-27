import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/admin/',
                '/book/manage/', // private per-booking manage links
                '/dashboard',
                '/embed/',
                '/*?invite=', // private demo invite links (token in the query string)
            ],
        },
        sitemap: 'https://www.altiqdesign.com/sitemap.xml',
        host: 'https://www.altiqdesign.com',
    };
}
