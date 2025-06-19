'use client';
import { motion } from 'framer-motion';

const AboutHero = () => {
    return (
        <section className="relative h-[70vh] flex items-center justify-center text-center px-4">
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
            <motion.div
                className="relative z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-5xl md:text-7xl font-bold">
                    We are <span className="text-purple-500">ALTIQDESIGN</span>.
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-300">
                    A creative studio dedicated to building powerful, engaging, and future-proof digital experiences that elevate brands.
                </p>
            </motion.div>
        </section>
    );
};

export default AboutHero;