import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  index: number;
}

interface Props { project: Project }

export default function ProjectItem({ project }: Props) {
  const direction = project.index % 2 === 0 ? -1 : 1;

  return (
    <motion.div
      className="max-w-md p-6 bg-white rounded-2xl shadow-lg flex flex-col items-center"
      initial={{ opacity: 0, x: direction * 100, scale: 0.8 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <a href={project.link} target="_blank" rel="noopener noreferrer">
        <div className="w-48 h-48 relative mb-4">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
      </a>
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{project.description}</p>
      <span className="text-xs uppercase tracking-wide text-gray-400">{project.category}</span>
    </motion.div>
  );
}
