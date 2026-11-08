import React from 'react';
import { EDUCATION } from '../data/portfolioData';

export const EducationSection: React.FC = () => {
  return (
    <section
      id="education"
      aria-label="Education section"
      className="py-20 perf-section border-t border-[#2A2A2A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="font-mono text-xs tracking-widest text-[#FF4A1C] uppercase mb-2">
            Academic Background
          </div>
          <h2 className="font-display uppercase text-3xl sm:text-5xl text-[#F2F2F2] tracking-tight">
            Education
          </h2>
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDUCATION.map((edu, idx) => (
            <div
              key={idx}
              className={`portfolio-card p-6 sm:p-8 rounded-lg flex flex-col justify-between ${
                edu.isMain ? 'md:col-span-3 portfolio-card-highlight' : ''
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs text-[#FF4A1C] uppercase tracking-wider">
                    {edu.period ? edu.period : 'Schooling'}
                  </span>
                  {edu.details && (
                    <span className="font-mono text-xs bg-[#1A1A1A] border border-[#2A2A2A] text-[#F2F2F2] px-2.5 py-0.5 rounded">
                      {edu.details}
                    </span>
                  )}
                </div>

                <h3 className={`font-display text-[#F2F2F2] mb-2 ${
                  edu.isMain ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
                }`}>
                  {edu.degree}
                </h3>

                <p className="text-sm text-[#A3A3A3] mb-4">
                  {edu.institution}
                </p>
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
                <span className="font-mono text-xs text-[#A3A3A3] uppercase">
                  Academic Result
                </span>
                <span className={`font-mono font-bold ${
                  edu.isMain ? 'text-lg text-[#FF4A1C]' : 'text-sm text-[#F2F2F2]'
                }`}>
                  {edu.score}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
