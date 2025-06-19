import { getAllPosts, getPostBySlug } from '@/lib/posts';
import Image from 'next/image';
import type { Metadata } from 'next';


type Props = {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [
                {
                    url: post.coverImage,
                }
            ]
        }
    };
}


// Bu fonksiyon, Next.js'e hangi sayfaları önceden oluşturacağını söyler.
export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map(post => ({
        slug: post.slug,
    }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    return (
        <article className="bg-black text-white min-h-screen">
            <div className="relative w-full h-[50vh]">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4">
                        <h1 className="text-4xl md:text-6xl font-bold">{post.title}</h1>
                        <p className="mt-4 text-lg text-gray-300">
                            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by {post.author}
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-16 px-6">
                <div
                    className="prose prose-invert prose-lg max-w-3xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
            </div>
        </article>
    );
}