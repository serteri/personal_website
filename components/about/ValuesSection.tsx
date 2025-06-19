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
            className="py-24 px-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
        >
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-12">Our Core Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div key={index} className="flex flex-col items-center p-6">
                                <Icon className="w-12 h-12 text-lime-300 mb-4"/>
                                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-gray-400">{value.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </motion.section>
    );
};

export default ValuesSection;