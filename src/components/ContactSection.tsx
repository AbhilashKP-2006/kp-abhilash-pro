import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section
      id="contact"
      aria-label="Contact section"
      className="py-20 perf-section border-t border-[#2A2A2A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="font-mono text-xs tracking-widest text-[#FF4A1C] uppercase mb-2">
            Get In Touch
          </div>
          <h2 className="font-display uppercase text-3xl sm:text-5xl text-[#F2F2F2] tracking-tight">
            Let's work together.
          </h2>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          {/* Email Card */}
          <div className="portfolio-card p-6 rounded-lg flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-[#FF4A1C] uppercase block mb-1">
                Direct Email
              </span>
              <p className="font-mono text-sm text-[#F2F2F2] break-all mb-4">
                {PERSONAL_INFO.contact.email}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#2A2A2A]">
              <button
                onClick={handleCopyEmail}
                className="font-mono text-xs border border-[#2A2A2A] hover:border-[#FF4A1C] text-[#F2F2F2] hover:text-[#FF4A1C] px-3 py-1.5 rounded transition-colors"
                aria-label="Copy email address"
              >
                {copied ? 'Copied!' : 'Copy email'}
              </button>
              <a
                href={`mailto:${PERSONAL_INFO.contact.email}`}
                className="font-mono text-xs text-center bg-[#FF4A1C] hover:bg-[#ff5f36] text-black font-semibold px-3 py-1.5 rounded transition-colors"
              >
                Send email
              </a>
            </div>
          </div>

          {/* Phone Card */}
          <div className="portfolio-card p-6 rounded-lg flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-[#FF4A1C] uppercase block mb-1">
                Phone
              </span>
              <p className="font-mono text-sm text-[#F2F2F2] mb-4">
                {PERSONAL_INFO.contact.phoneFormatted}
              </p>
            </div>
            <div className="pt-2 border-t border-[#2A2A2A]">
              <a
                href={`tel:${PERSONAL_INFO.contact.phone}`}
                className="font-mono text-xs inline-block border border-[#2A2A2A] hover:border-[#FF4A1C] text-[#F2F2F2] hover:text-[#FF4A1C] px-3 py-1.5 rounded transition-colors"
              >
                Call: {PERSONAL_INFO.contact.phone}
              </a>
            </div>
          </div>

          {/* Location Card */}
          <div className="portfolio-card p-6 rounded-lg flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-[#FF4A1C] uppercase block mb-1">
                Location
              </span>
              <p className="font-medium text-sm sm:text-base text-[#F2F2F2] mb-2">
                {PERSONAL_INFO.contact.location}
              </p>
            </div>
            <div className="pt-2 border-t border-[#2A2A2A]">
              <span className="font-mono text-xs text-[#A3A3A3]">
                Open to relocation & remote
              </span>
            </div>
          </div>

          {/* Professional Links Card */}
          <div className="portfolio-card p-6 rounded-lg flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-[#FF4A1C] uppercase block mb-2">
                Profiles
              </span>
              <div className="space-y-2">
                <a
                  href={PERSONAL_INFO.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#F2F2F2] hover:text-[#FF4A1C] flex items-center justify-between border-b border-[#2A2A2A] pb-1.5 transition-colors"
                >
                  <span>LinkedIn</span>
                  <span>↗</span>
                </a>
                <a
                  href={PERSONAL_INFO.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#F2F2F2] hover:text-[#FF4A1C] flex items-center justify-between border-b border-[#2A2A2A] pb-1.5 transition-colors"
                >
                  <span>GitHub</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A3A3A3]">
          <div>
            © 2026 ABHILASH K P. All rights reserved.
          </div>
          <div className="text-[11px] text-[#A3A3A3]">
            Designed & Engineered with 60 FPS WebGL architecture
          </div>
        </div>

      </div>
    </section>
  );
};
