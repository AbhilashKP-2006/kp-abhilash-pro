import React from 'react';
import { SKILL_GROUPS, SOFT_SKILLS, CURRENTLY_LEARNING } from '../data/portfolioData';

export const SkillsSection: React.FC = () => {
  return (
    <section
      id="skills"
      aria-label="Skills section"
      className="py-20 perf-section border-t border-[#2A2A2A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="font-mono text-xs tracking-widest text-[#FF4A1C] uppercase mb-2">
            Technical Stack & Capabilities
          </div>
          <h2 className="font-display uppercase text-3xl sm:text-5xl text-[#F2F2F2] tracking-tight">
            Skills & tools
          </h2>
        </div>

        {/* Technical Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {SKILL_GROUPS.map((group) => (
            <div key={group.category} className="portfolio-card p-6 rounded-lg flex flex-col justify-between">
              <div>
                <h3 className="font-mono text-xs tracking-wider uppercase text-[#FF4A1C] mb-4">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="font-mono text-xs bg-[#1A1A1A] border border-[#2A2A2A] text-[#F2F2F2] px-3 py-1.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Currently Learning Card (Highlighted with 3px left border) */}
          <div className="portfolio-card portfolio-card-highlight p-6 rounded-lg lg:col-span-1 md:col-span-2">
            <h3 className="font-mono text-xs tracking-wider uppercase text-[#FF4A1C] mb-3">
              Currently Learning
            </h3>
            <ul className="space-y-2">
              {CURRENTLY_LEARNING.map((item, idx) => (
                <li key={idx} className="flex items-start text-xs sm:text-sm text-[#F2F2F2]">
                  <span className="text-[#FF4A1C] mr-2">›</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Soft Skills with One-Line Descriptions */}
        <div className="portfolio-card p-6 sm:p-8 rounded-lg">
          <h3 className="font-mono text-xs tracking-wider uppercase text-[#FF4A1C] mb-6">
            Professional & Analytical Strengths
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOFT_SKILLS.map((soft) => (
              <div key={soft.name} className="border-l border-[#2A2A2A] pl-3">
                <span className="font-mono text-xs font-semibold text-[#F2F2F2] block mb-1">
                  {soft.name}
                </span>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  {soft.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
