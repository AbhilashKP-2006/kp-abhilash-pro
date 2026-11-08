import React from 'react';
import { PROJECTS, PRACTICAL_EXPERIENCE } from '../data/portfolioData';

export const ProjectsSection: React.FC = () => {
  return (
    <section
      id="projects"
      aria-label="Projects section"
      className="py-20 perf-section border-t border-[#2A2A2A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="font-mono text-xs tracking-widest text-[#FF4A1C] uppercase mb-2">
            Concepts & Hackathon Explorations
          </div>
          <h2 className="font-display uppercase text-3xl sm:text-5xl text-[#F2F2F2] tracking-tight">
            Projects & Experience
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="portfolio-card p-6 rounded-lg flex flex-col justify-between"
            >
              <div>
                {/* Header Tag and Stage */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
                      proj.tag === 'HACKATHON'
                        ? 'border-[#FF4A1C] text-[#FF4A1C] bg-[#FF4A1C]/10'
                        : 'border-[#2A2A2A] text-[#A3A3A3] bg-[#1A1A1A]'
                    }`}
                  >
                    {proj.tag}
                  </span>
                  <span className="font-mono text-[10px] text-[#A3A3A3]">
                    {proj.stage}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-display text-lg sm:text-xl text-[#F2F2F2] mb-1 leading-snug">
                  {proj.title}
                </h3>
                <p className="font-mono text-xs text-[#A3A3A3] mb-4">
                  {proj.subtitle}
                </p>

                {/* Role / Contribution if present */}
                {(proj.role || proj.contribution) && (
                  <div className="mb-3 text-xs font-mono text-[#FF4A1C] border-l-2 border-[#FF4A1C] pl-2">
                    {proj.role && <span>Role: {proj.role} · </span>}
                    {proj.contribution && <span>{proj.contribution}</span>}
                  </div>
                )}

                {/* Description */}
                <p className="text-sm text-[#A3A3A3] leading-relaxed mb-4">
                  {proj.description}
                </p>

                {/* Bullet Points */}
                {proj.points && (
                  <ul className="space-y-1.5 border-t border-[#2A2A2A] pt-3">
                    {proj.points.map((pt, i) => (
                      <li key={i} className="text-xs text-[#A3A3A3] flex items-start">
                        <span className="text-[#FF4A1C] mr-2">▪</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Practical Experience Card */}
        <div className="portfolio-card portfolio-card-highlight p-6 sm:p-8 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <span className="font-mono text-xs text-[#FF4A1C] uppercase tracking-wider">
                Practical Experience
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-[#F2F2F2] mt-0.5">
                {PRACTICAL_EXPERIENCE.title}
              </h3>
            </div>
            <span className="font-mono text-xs text-[#A3A3A3]">
              {PRACTICAL_EXPERIENCE.institution}
            </span>
          </div>

          <p className="text-sm sm:text-base text-[#F2F2F2] leading-relaxed mb-4">
            {PRACTICAL_EXPERIENCE.description}
          </p>

          <div className="inline-flex items-center gap-2 border border-[#FF4A1C]/40 bg-[#FF4A1C]/5 px-3 py-1.5 rounded">
            <span className="w-2 h-2 rounded-full bg-[#FF4A1C] animate-pulse" />
            <span className="font-mono text-xs text-[#FF4A1C] tracking-wide">
              {PRACTICAL_EXPERIENCE.note}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
