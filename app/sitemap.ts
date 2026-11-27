import { MetadataRoute } from 'next';
import { caseStudies } from '@/lib/caseStudies';
import { services } from '@/lib/services';

const SITE = 'https://www.altiqdesign.com';

// Public pages only: no /book/manage/*, /admin, /dashboard, /embed or invite-token URLs.
export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();
    const pages: [string, number][] = [
        ['', 1],
        ['/ai-receptionist', 0.9],
        ['/booking', 0.8],
        ['/about', 0.6],
        ['/contact', 0.6],
    ];
    return [
        ...pages.map(([path, priority]) => ({ url: `${SITE}${path}`, lastModified, priority })),
        ...services.map((s) => ({ url: `${SITE}/services/${s.slug}`, lastModified, priority: 0.8 })),
        ...caseStudies.map((c) => ({ url: `${SITE}/case-studies/${c.slug}`, lastModified, priority: 0.7 })),
    ];
}
