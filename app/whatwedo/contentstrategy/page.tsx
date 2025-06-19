export default function ContentStrategyPage() {
    return (
        <div className="bg-black text-white min-h-screen">
            <div className="text-center py-24 bg-gray-900/50">
                <h1 className="text-5xl md:text-7xl font-bold">Content Strategy</h1>
                <p className="text-xl text-lime-300 mt-2">Telling Your Story, Effectively</p>
            </div>

            <div className="container mx-auto py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Connecting with Your Audience</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Great design needs a great message. A content strategy defines what you say, how you say it, and where you say it. We help you create a clear narrative that resonates with your target audience, builds authority, and drives action.
                    </p>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Our Content Services</h3>
                    <ul className="space-y-4 text-gray-300">
                        <li><strong>1. Audience Research:</strong> We identify your ideal customer and what kind of content they are looking for.</li>
                        <li><strong>2. Messaging & Tone of Voice:</strong> We craft a unique brand voice that reflects your identity and speaks directly to your audience.</li>
                        <li><strong>3. Content Planning:</strong> We develop a content calendar and plan for your blog, social media, and other channels to ensure a consistent message.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
