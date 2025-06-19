export default function WebDesignPage() {
    return (
        <div className="bg-black text-white min-h-screen">
            <div className="text-center py-24 bg-gray-900/50">
                <h1 className="text-5xl md:text-7xl font-bold">Website Design</h1>
                <p className="text-xl text-lime-300 mt-2">Building Your Digital Home</p>
            </div>

            <div className="container mx-auto py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">User-Centric Web Experiences</h2>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        Your website is your most powerful marketing tool. We design and develop beautiful, responsive, and high-performing websites that are optimized for user experience and designed to achieve your business goals, from lead generation to e-commerce sales.
                    </p>

                    <h3 className="text-2xl font-bold mt-12 mb-4">Our Web Design Process</h3>
                    <ul className="space-y-4 text-gray-300">
                        <li><strong>1. UI/UX Design:</strong> We create intuitive wireframes and stunning visual mockups that focus on your user's journey.</li>
                        <li><strong>2. Development:</strong> Our developers bring the designs to life using modern, fast, and secure technologies like Next.js.</li>
                        <li><strong>3. Launch & Optimization:</strong> We handle the launch process and ensure your website is optimized for speed, performance, and different devices.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}