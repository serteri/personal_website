import type { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import PhilosophySection from '@/components/about/PhilosophySection';
import ValuesSection from '@/components/about/ValuesSection';
import CallToAction from '@/components/CallToAction'

export const metadata: Metadata = {
    title: 'About',
    description: 'Meet the Brisbane team behind Altiq Design: custom software, conversion-focused websites and AI voice receptionists for local businesses.',
    alternates: { canonical: '/about' },
};


export default function About() {
    return (
       <div className="bg-[#F8FAFC] text-ink">
             <AboutHero />
              <PhilosophySection />
              <ValuesSection />
                <CallToAction/>

       </div>

    )
}
