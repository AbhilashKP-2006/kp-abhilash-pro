import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      aria-label="About section"
      className="py-20 perf-section border-t border-[#2A2A2A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10">
          <div className="font-mono text-xs tracking-widest text-[#FF4A1C] uppercase mb-2">
            Profile & Overview
          </div>
          <h2 className="font-display uppercase text-3xl sm:text-5xl text-[#F2F2F2] tracking-tight">
            About me
          </h2>
        </div>

        {/* Bio Paragraph */}
        <div className="portfolio-card p-6 sm:p-8 rounded-lg mb-8">
          <p className="text-base sm:text-lg text-[#F2F2F2] leading-relaxed font-normal">
            {PERSONAL_INFO.bio}
          </p>
        </div>

        {/* Quick Facts Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="portfolio-card p-5 rounded-lg">
            <span className="font-mono text-xs text-[#A3A3A3] uppercase block mb-1">
              University
            </span>
            <span className="font-medium text-sm sm:text-base text-[#F2F2F2]">
              UCEN, Nagercoil
            </span>
          </div>

          <div className="portfolio-card p-5 rounded-lg portfolio-card-highlight">
            <span className="font-mono text-xs text-[#FF4A1C] uppercase block mb-1">
              Current CGPA
            </span>
            <span className="font-display text-xl sm:text-2xl text-[#F2F2F2]">
              {PERSONAL_INFO.cgpa}
            </span>
          </div>

          <div className="portfolio-card p-5 rounded-lg">
            <span className="font-mono text-xs text-[#A3A3A3] uppercase block mb-1">
              Academic Term
            </span>
            <span className="font-medium text-sm sm:text-base text-[#F2F2F2]">
              {PERSONAL_INFO.semester}
            </span>
          </div>

          <div className="portfolio-card p-5 rounded-lg">
            <span className="font-mono text-xs text-[#A3A3A3] uppercase block mb-1">
              Languages
            </span>
            <div className="text-xs text-[#F2F2F2] space-y-0.5">
              {PERSONAL_INFO.languages.map((l) => (
                <div key={l.name}>
                  <span className="text-[#F2F2F2]">{l.name}</span>{' '}
                  <span className="text-[#A3A3A3]">({l.level})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Competencies & Career Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Competencies */}
          <div className="portfolio-card p-6 rounded-lg">
            <h3 className="font-mono text-xs tracking-wider uppercase text-[#FF4A1C] mb-4">
              Core Competencies
            </h3>
            <ul className="space-y-2.5">
              {PERSONAL_INFO.coreCompetencies.map((comp, idx) => (
                <li key={idx} className="flex items-start text-sm text-[#F2F2F2]">
                  <span className="text-[#FF4A1C] mr-2.5 select-none">▪</span>
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Career Interests */}
          <div className="portfolio-card p-6 rounded-lg">
            <h3 className="font-mono text-xs tracking-wider uppercase text-[#FF4A1C] mb-4">
              Career Interests
            </h3>
            <ul className="space-y-2.5">
              {PERSONAL_INFO.careerInterests.map((interest, idx) => (
                <li key={idx} className="flex items-start text-sm text-[#F2F2F2]">
                  <span className="text-[#FF4A1C] mr-2.5 select-none">▪</span>
                  <span>{interest}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};
