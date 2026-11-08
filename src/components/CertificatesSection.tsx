import React, { useState } from 'react';
import { CERTIFICATES } from '../data/portfolioData';
import { CertificateCategory } from '../types/portfolio';

const CATEGORIES: { id: CertificateCategory; label: string }[] = [
  { id: 'all', label: 'All (15)' },
  { id: 'ai', label: 'AI & Generative AI (8)' },
  { id: 'security', label: 'Cybersecurity & Cloud (3)' },
  { id: 'programming', label: 'Programming (2)' },
  { id: 'other', label: 'Other (2)' },
];

export const CertificatesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CertificateCategory>('all');

  const filteredCertificates = selectedCategory === 'all'
    ? CERTIFICATES
    : CERTIFICATES.filter((c) => c.category === selectedCategory);

  return (
    <section
      id="certificates"
      aria-label="Certificates section"
      className="py-20 perf-section border-t border-[#2A2A2A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="font-mono text-xs tracking-widest text-[#FF4A1C] uppercase mb-2">
              Verified Learning
            </div>
            <h2 className="font-display uppercase text-3xl sm:text-5xl text-[#F2F2F2] tracking-tight">
              Professional credentials
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-[#A3A3A3]">
            15 completed certificates, including six from Coursera.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Certificate categories">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className={`font-mono text-xs uppercase px-3.5 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-[#FF4A1C] text-black font-semibold'
                    : 'bg-[#141414] border border-[#2A2A2A] text-[#A3A3A3] hover:text-[#F2F2F2] hover:border-[#FF4A1C]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="portfolio-card p-5 rounded-lg flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] text-[#FF4A1C] uppercase tracking-wider block mb-2">
                  {cert.issuer}
                </span>
                <h3 className="text-sm sm:text-base font-medium text-[#F2F2F2] leading-snug">
                  {cert.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
