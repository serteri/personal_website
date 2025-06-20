import { MetadataRoute } from 'next';


export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = 'https://altiqdesign.com'; // KENDİ DOMAINİNİZİ YAZIN



    // Statik sayfaları ekliyoruz
    const staticUrls = [
        { url: siteUrl, lastModified: new Date() },
        { url: `${siteUrl}/about`, lastModified: new Date() },
        { url: `${siteUrl}/news`, lastModified: new Date() },
        { url: `${siteUrl}/contact`, lastModified: new Date() },
        // ... diğer statik sayfalarınız ...
    ];

    return [...staticUrls];
}
