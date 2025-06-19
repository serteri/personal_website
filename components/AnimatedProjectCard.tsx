"use client";

import Image from 'next/image';
import { motion, MotionStyle } from 'framer-motion';
// Eğer /interfaces/index.ts dosyasını oluşturduysanız:
// import { Project } from '@/interfaces';

// Eğer arayüzü burada tanımlamak isterseniz:
export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  index: number;
}

interface AnimatedProjectCardProps {
  project: Project;
  style?: MotionStyle; // Framer Motion'dan gelen animasyon stilleri için
}

export default function AnimatedProjectCard({ project, style }: AnimatedProjectCardProps) {
  return (
    <motion.div
      style={style} // Dinamik stiller buraya uygulanacak
      className="w-full h-full flex items-center justify-center absolute top-0 left-0"
      // 'absolute' ve 'top-0 left-0' ile ebeveyn sticky container içinde konumlanır
    >
      <div className="relative w-[80vw] max-w-xl h-[60vh] bg-neutral-800 rounded-lg shadow-2xl overflow-hidden group">
        <Image
          src={project.imageUrl}
          alt={project.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold">{project.title}</h3>
          <p className="text-sm text-neutral-300 mb-2">{project.description} ({project.category})</p>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 text-sm font-semibold bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
            aria-label={`View project ${project.title}`}
          >
            Proje Detayları
          </a>
        </div>
      </div>
    </motion.div>
  );
}