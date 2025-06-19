'use client';
import { motion } from 'framer-motion';

const PhilosophySection = () => {
    return (
        <motion.section
            className="py-24 px-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
        >
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="md:pr-8">
                    <h2 className="text-4xl font-bold mb-4">
                        Design with <span className="text-lime-300">Purpose</span>.
                    </h2>
                    <div className="w-24 h-1 bg-lime-300 mb-6"></div>
                </div>
                <div className="text-lg text-gray-300 space-y-4">
                    <p>
                        We believe that great design is not just about aesthetics; it's about solving problems. It's the silent ambassador of your brand. Our philosophy is rooted in a deep understanding of your business and your audience to create designs that are not only beautiful but also intuitive, effective, and meaningful.
                    </p>
                    <p>
                        From the simplest logo to the most complex website, every element is crafted with intention, ensuring a cohesive and compelling brand story that resonates and endures.
                    </p>
                </div>
            </div>
        </motion.section>
    );
};

export default PhilosophySection;