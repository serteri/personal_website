import { MetadataRoute } from 'next';
import { caseStudies } from '@/lib/caseStudies';


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

    // Case study pages use the canonical www host
    const caseUrls = caseStudies.map((c) => ({
        url: `https://www.altiqdesign.com/case-studies/${c.slug}`,
        lastModified: new Date(),
    }));

    return [...staticUrls, ...caseUrls];
}
