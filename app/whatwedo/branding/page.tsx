export default function BrandingPage() {
    return (
        <div className="bg-black text-white min-h-screen">
            <div className="text-center py-24 bg-gray-900/50">
                <h1 className="text-5xl md:text-7xl font-bold">Branding & Identity</h1>
                <p className="text-xl text-lime-300 mt-2">Crafting Brands That Resonate</p>
            </div>

            <div className="container mx-auto py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">What is Branding?</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Branding is more than a logo; it's the entire experience your customers have with your company. It's your story, your values, and your promise. We help you define a strong brand identity that builds trust, recognition, and loyalty.
                    </p>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Our Branding Process</h3>
                    <ul className="space-y-4 text-gray-300">
                        <li><strong>1. Discovery & Strategy:</strong> We dive deep into your business, market, and audience to build a solid brand strategy.</li>
                        <li><strong>2. Visual Identity Design:</strong> We create your logo, color palette, typography, and other visual elements that form your brand's look and feel.</li>
                        <li><strong>3. Brand Guidelines:</strong> We deliver a comprehensive brand book to ensure consistency across all your marketing materials.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}