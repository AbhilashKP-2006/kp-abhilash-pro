import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onOpenChat: () => void;
}

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Single throttled scroll handler for progress bar
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            setScrollProgress(Math.min(1, Math.max(0, window.scrollY / totalHeight)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // IntersectionObserver for active section highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.href.replace('#', ''));
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top thin accent scroll-progress bar (scaleX transform) */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#FF4A1C] z-50 origin-left pointer-events-none"
        style={{
          transform: `scaleX(${scrollProgress})`,
          willChange: 'transform',
        }}
      />

      {/* Solid dark bar (no backdrop-filter/blur per specification) */}
      <nav
        aria-label="Main Navigation"
        className="fixed top-0 left-0 right-0 z-40 bg-[#060607] border-b border-[#2A2A2A] h-16 select-none"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-1 font-display tracking-wider text-lg uppercase text-[#F2F2F2] hover:opacity-90 transition-opacity"
            aria-label="Abhilash K P Home"
          >
            <span>ABHILASH</span>
            <span className="text-[#FF4A1C]">KP</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-xs font-mono tracking-wider uppercase transition-colors py-1 ${
                    isActive
                      ? 'text-[#FF4A1C] border-b border-[#FF4A1C]'
                      : 'text-[#A3A3A3] hover:text-[#F2F2F2]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Desktop Right Actions: Ask AI & Get in Touch */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onOpenChat}
              className="text-xs font-mono uppercase tracking-wider text-[#F2F2F2] hover:text-[#FF4A1C] border border-[#2A2A2A] hover:border-[#FF4A1C] px-3.5 py-2 rounded transition-colors"
            >
              Ask AI
            </button>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="text-xs font-mono uppercase font-semibold tracking-wider text-black bg-[#FF4A1C] hover:bg-[#ff5f36] px-4 py-2 rounded transition-colors"
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#A3A3A3] hover:text-[#F2F2F2] focus:outline-none focus:ring-1 focus:ring-[#FF4A1C]"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu (Solid background, no blur) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A0A0B] border-b border-[#2A2A2A] px-4 py-5 space-y-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block text-sm font-mono tracking-wider uppercase text-[#A3A3A3] hover:text-[#FF4A1C] py-1.5"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#2A2A2A] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="w-full text-center text-xs font-mono uppercase py-2 border border-[#2A2A2A] text-[#F2F2F2] rounded"
              >
                Ask my AI
              </button>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="w-full text-center text-xs font-mono uppercase py-2 bg-[#FF4A1C] text-black font-semibold rounded"
              >
                Get in Touch
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
