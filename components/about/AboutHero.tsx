'use client';
import { motion } from 'framer-motion';

const AboutHero = () => {
    return (
        <section className="relative flex items-center bg-white px-4 py-24 md:py-32">
            <motion.div
                className="relative z-20 mx-auto w-full max-w-7xl sm:px-2 lg:px-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <p className="mb-6 font-mono text-xs uppercase tracking-wider text-muted">About</p>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                    We are <span className="text-cobalt">ALTIQDESIGN</span>.
                </h1>
                <p className="mt-6 text-lg md:text-xl max-w-3xl text-muted">
                    A creative studio dedicated to building powerful, engaging, and future-proof digital experiences that elevate brands.
                </p>
            </motion.div>
        </section>
    );
};

export default AboutHero;