import { MetadataRoute } from 'next';
import { getAllPosts } from './lib/posts'; // Post fonksiyonumuzu import ediyoruz

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = 'https://altiqdesign.com'; // KENDİ DOMAINİNİZİ YAZIN

    // Blog postları için dinamik URL'ler oluşturuyoruz
    const posts = getAllPosts();
    const postUrls = posts.map((post) => ({
        url: `${siteUrl}/news/${post.slug}`,
        lastModified: new Date(post.date),
    }));

    // Statik sayfaları ekliyoruz
    const staticUrls = [
        { url: siteUrl, lastModified: new Date() },
        { url: `${siteUrl}/about`, lastModified: new Date() },
        { url: `${siteUrl}/news`, lastModified: new Date() },
        { url: `${siteUrl}/contact`, lastModified: new Date() },
        // ... diğer statik sayfalarınız ...
    ];

    return [...staticUrls, ...postUrls];
}
