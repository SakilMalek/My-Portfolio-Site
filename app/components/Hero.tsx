import React from 'react'
import { Spotlight } from './ui/Spotlight'
import { TextGenerateEffect } from './ui/TextGenerateEffect'
import MagicButton from './ui/MagicButton';
import { FaLocationArrow } from 'react-icons/fa';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pb-20 pt-36">
      {/* Spotlight Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
        <Spotlight className="top-10 left-full h-[88vh] w-[50vw]" fill="purple" />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>
  
      {/* Gradient Background */}
      <div className="absolute inset-0 pointer-events-none dark:bg-black-100 bg-white dark:bg-grid-white/[0.025] bg-grid-black/[0.025]">
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>
            {/* Centered Content */}
      <div className="relative z-10 max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center text-center">
        <h2 className="uppercase tracking-widest text-xs text-blue-100 max-w-80">
          Dynamic Web Magic Next.js
        </h2>
        <TextGenerateEffect
          className="text-[40px] md:text-5xl lg:text-6xl"
          words="Transforming Concepts into Seamless User Experience"
        />
                <p className="md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
          Hi! I&apos;m Sakil Malek, a Web Developer based in India.
        </p>
        <Link href="#about"><MagicButton title='Show my work' icon={<FaLocationArrow/>} position={'right'}/></Link> 
      </div>
    </div>
  );
  
}

export default Hero
