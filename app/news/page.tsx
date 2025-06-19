import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';
import Image from 'next/image';

export default function NewsPage() {
    const allPosts = getAllPosts();

    const featuredPost = allPosts[0];
    const otherPosts = allPosts.slice(1);

    return (
        <div className="bg-black min-h-screen text-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold">News & Insights</h1>
                    <p className="mt-4 text-lg text-gray-400">The latest articles and updates from the ALTIQDESIGN team.</p>
                </div>

                {/* Featured Post */}
                {featuredPost && (
                    <Link href={`/news/${featuredPost.slug}`} className="group block mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="relative w-full h-80 rounded-lg overflow-hidden">
                                <Image src={featuredPost.coverImage} alt={featuredPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <div>
                                <p className="text-lime-300 font-semibold">{new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <h2 className="mt-2 text-4xl font-bold group-hover:text-purple-500 transition-colors">{featuredPost.title}</h2>
                                <p className="mt-4 text-gray-300">{featuredPost.excerpt}</p>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Other Posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherPosts.map((post) => (
                        <Link href={`/news/${post.slug}`} key={post.slug} className="group block">
                            <div className="relative w-full h-56 rounded-lg overflow-hidden mb-4">
                                <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                            <p className="text-sm text-lime-300">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <h3 className="mt-1 text-2xl font-bold group-hover:text-purple-500 transition-colors">{post.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}