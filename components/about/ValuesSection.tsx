'use client';
import { motion } from 'framer-motion';
import { FiZap, FiUsers, FiAward, FiHeart } from 'react-icons/fi'; // Örnek ikonlar

const values = [
    {
        icon: FiZap,
        title: "Innovation",
        description: "We constantly push boundaries to deliver cutting-edge solutions."
    },
    {
        icon: FiHeart,
        title: "Passion",
        description: "Our love for design drives us to create work that inspires."
    },
    {
        icon: FiUsers,
        title: "Collaboration",
        description: "We work with our clients as partners to achieve shared goals."
    },
    {
        icon: FiAward,
        title: "Excellence",
        description: "We are committed to the highest standards of quality in everything we do."
    },
];

const ValuesSection = () => {
    return (
        <motion.section
            className="border-b border-line py-24 px-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
        >
            <div className="mx-auto max-w-7xl">
                <h2 className="text-4xl font-extrabold tracking-tight mb-12">Our Core Values</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div key={index} className="flex flex-col items-start rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                                <Icon className="w-8 h-8 text-ink mb-4"/>
                                <h3 className="text-xl font-bold tracking-tight mb-2">{value.title}</h3>
                                <p className="text-muted">{value.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </motion.section>
    );
};

export default ValuesSection;