import React, { useRef, useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { PhotoParticles } from './PhotoParticles';
import { FloatingChips } from './FloatingChips';

interface HomeSectionProps {
  onOpenChat: () => void;
  isBuildStarted: boolean;
  onPhotoReady: () => void;
  isPhotoFormed: boolean;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  onOpenChat,
  isBuildStarted,
  onPhotoReady,
  isPhotoFormed,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const photoTargetRef = useRef<HTMLDivElement>(null);
  const [photoOpacity, setPhotoOpacity] = useState(0);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Home section"
      className="relative min-h-screen pt-24 sm:pt-28 pb-16 flex items-center justify-center perf-contain overflow-hidden"
    >
      {/* Full-section Particle Canvas (covers whole Home section so particles cross text area) */}
      <PhotoParticles
        sectionRef={sectionRef}
        photoTargetRef={photoTargetRef}
        isBuildStarted={isBuildStarted}
        onPhotoFadeIn={() => setPhotoOpacity(1)}
        onPhotoReady={onPhotoReady}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Bio Details */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Tagline */}
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs tracking-widest text-[#FF4A1C] uppercase">
                {PERSONAL_INFO.tagline}
              </span>
            </div>

            {/* Name with light weight and wide letter spacing */}
            <div className="text-sm font-mono tracking-[0.25em] text-[#A3A3A3] uppercase">
              {PERSONAL_INFO.name}
            </div>

            {/* Big Headline: I BUILD THINGS THAT THINK. (THINGS and THINK. in orange-red, last line italic) */}
            <h1 className="font-display uppercase text-4xl sm:text-6xl xl:text-7xl tracking-tight text-[#F2F2F2] leading-[0.92]">
              {PERSONAL_INFO.headlineLead}{' '}
              <span className="text-[#FF4A1C]">{PERSONAL_INFO.headlineAccent1}</span>
              <br />
              {PERSONAL_INFO.headlineMiddle}{' '}
              <span className="text-[#FF4A1C] italic">{PERSONAL_INFO.headlineAccent2}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#A3A3A3] font-normal leading-relaxed max-w-xl">
              {PERSONAL_INFO.title}
            </p>

            {/* Monospace Skills with orange-red left border */}
            <div className="border-l-2 border-[#FF4A1C] pl-4 py-1">
              <p className="font-mono text-xs sm:text-sm text-[#F2F2F2] tracking-wide leading-relaxed">
                {PERSONAL_INFO.skillsList}
              </p>
            </div>

            {/* CTA Buttons: View Projects, Get in Touch, Ask my AI */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                onClick={(e) => handleScrollTo(e, 'projects')}
                className="font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase bg-[#FF4A1C] hover:bg-[#ff5f36] text-black px-5 py-3 rounded transition-colors duration-200"
              >
                View Projects
              </a>
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, 'contact')}
                className="font-mono text-xs sm:text-sm tracking-wider uppercase border border-[#2A2A2A] hover:border-[#FF4A1C] text-[#F2F2F2] hover:text-[#FF4A1C] px-5 py-3 rounded transition-colors duration-200"
              >
                Get in Touch
              </a>
              <button
                onClick={onOpenChat}
                className="font-mono text-xs sm:text-sm tracking-wider uppercase border border-[#2A2A2A] hover:border-[#FF4A1C] text-[#F2F2F2] hover:text-[#FF4A1C] px-5 py-3 rounded transition-colors duration-200"
              >
                Ask my AI
              </button>
            </div>
          </div>

          {/* Right Column: Photo Target Frame with Exactly ONE Real Photo and Floating Chips */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div
              ref={photoTargetRef}
              className="relative w-full max-w-[420px] aspect-[900/1083] mx-auto select-none"
            >
              {/* Exactly ONE real photo element that stays hidden (opacity 0) until particles finish */}
              <img
                src="/assets/abhilash-portrait.webp"
                alt="Abhilash K P - B.E. Computer Science student and aspiring software developer"
                className="w-full h-full object-contain pointer-events-none select-none"
                style={{
                  opacity: photoOpacity,
                  transition: 'opacity 1.0s ease-in-out',
                  willChange: 'opacity',
                  filter: 'none',
                  backdropFilter: 'none',
                  boxShadow: 'none',
                  outline: 'none',
                  imageRendering: 'auto',
                }}
                width={900}
                height={1083}
              />

              {/* Draggable and floating chips in empty space around head (appear after photo is built) */}
              <FloatingChips
                isPhotoFormed={isPhotoFormed}
                containerRef={photoTargetRef}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
