import AboutHero from '@/components/about/AboutHero';
import PhilosophySection from '@/components/about/PhilosophySection';
import ValuesSection from '@/components/about/ValuesSection';
import CallToAction from '@/components/CallToAction'

export default function About() {
    return (
       <div className="bg-black text-white">
             <AboutHero />
              <PhilosophySection />
              <ValuesSection />
                <CallToAction/>

       </div>

    )
}
