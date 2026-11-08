import React from 'react';
import { ACHIEVEMENTS } from '../data/portfolioData';

export const AchievementsSection: React.FC = () => {
  const byteathon = ACHIEVEMENTS.find((a) => a.id === 'byteathon-2026');
  const smartHorizon = ACHIEVEMENTS.find((a) => a.id === 'smart-horizon-2026');
  const otherAchievements = ACHIEVEMENTS.filter(
    (a) => a.id !== 'byteathon-2026' && a.id !== 'smart-horizon-2026'
  );

  return (
    <section
      id="achievements"
      aria-label="Achievements section"
      className="py-20 perf-section border-t border-[#2A2A2A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="font-mono text-xs tracking-widest text-[#FF4A1C] uppercase mb-2">
            Competitive Events & Recognition
          </div>
          <h2 className="font-display uppercase text-3xl sm:text-5xl text-[#F2F2F2] tracking-tight">
            Hackathons & Achievements
          </h2>
        </div>

        {/* BYTEATHON 2026: Shown FIRST, full width, with accent border & soft accent gradient */}
        {byteathon && (
          <div className="portfolio-card border border-[#FF4A1C] p-6 sm:p-8 rounded-lg mb-8 relative overflow-hidden bg-gradient-to-r from-[#141414] via-[#141414] to-[#FF4A1C]/10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="font-mono text-xs font-bold text-[#FF4A1C] border border-[#FF4A1C] bg-[#FF4A1C]/10 px-3 py-1 rounded tracking-wider">
                {byteathon.badge}
              </span>
              <span className="font-mono text-xs text-[#A3A3A3]">
                {byteathon.date}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-[#F2F2F2] mb-2 leading-tight">
              {byteathon.title}
            </h3>

            <div className="text-xs font-mono text-[#A3A3A3] mb-4 space-y-1">
              <div>Team: <span className="text-[#F2F2F2]">{byteathon.team}</span></div>
              <div>Organiser: <span className="text-[#F2F2F2]">{byteathon.organizer}</span></div>
            </div>

            <p className="text-sm sm:text-base text-[#F2F2F2] leading-relaxed max-w-4xl">
              {byteathon.description}
            </p>
          </div>
        )}

        {/* Smart Horizon 2026 */}
        {smartHorizon && (
          <div className="portfolio-card p-6 sm:p-8 rounded-lg mb-8 border-l-2 border-[#FF4A1C]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="font-mono text-xs text-[#FF4A1C] uppercase tracking-wider">
                International Hackathon
              </span>
              <span className="font-mono text-xs text-[#A3A3A3]">
                {smartHorizon.date}
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl text-[#F2F2F2] mb-2">
              {smartHorizon.title}
            </h3>

            <p className="font-mono text-xs text-[#A3A3A3] mb-4">
              {smartHorizon.organizer} · Team: {smartHorizon.team}
            </p>

            <p className="text-sm text-[#F2F2F2] leading-relaxed mb-4">
              {smartHorizon.description}
            </p>

            {smartHorizon.hashtags && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#2A2A2A]">
                {smartHorizon.hashtags.map((tag) => (
                  <span key={tag} className="font-mono text-xs text-[#FF4A1C]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Additional Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherAchievements.map((item) => (
            <div
              key={item.id}
              className="portfolio-card p-6 rounded-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs text-[#A3A3A3]">
                    {item.organizer || 'Technical Event'}
                  </span>
                  {item.badge && (
                    <span className="font-mono text-[10px] text-[#FF4A1C] border border-[#FF4A1C]/50 bg-[#FF4A1C]/10 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-lg text-[#F2F2F2] mb-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
