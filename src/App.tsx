import React, { useState, useCallback, lazy, Suspense, useEffect } from 'react';
import { OpeningSequence } from './components/OpeningSequence';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EducationSection } from './components/EducationSection';
import { CertificatesSection } from './components/CertificatesSection';
import { AchievementsSection } from './components/AchievementsSection';
import { ContactSection } from './components/ContactSection';
import { BackgroundUniverse } from './components/BackgroundUniverse';

// Lazy load AI assistant per Section B.5
const AiAssistantLazy = lazy(() =>
  import('./components/AiAssistant').then((module) => ({ default: module.AiAssistant }))
);

export function App() {
  const [isBuildStarted, setIsBuildStarted] = useState(false);
  const [isPhotoFormed, setIsPhotoFormed] = useState(false);
  const [canStartUniverse, setCanStartUniverse] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatLoaded, setIsChatLoaded] = useState(false);

  // Triggered when user clicks the "ENTER →" button on the opening screen
  const handleEnter = useCallback(() => {
    setIsBuildStarted(true);
  }, []);

  // Triggered after 3.6s build + 1.2s crossfade to the single real photo
  const handlePhotoReady = useCallback(() => {
    setIsPhotoFormed(true);

    // 500 ms later: start background particle universe
    setTimeout(() => {
      setCanStartUniverse(true);
    }, 500);

    // Then lazy-load AI chat code with requestIdleCallback or fallback
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        setIsChatLoaded(true);
      });
    } else {
      setTimeout(() => {
        setIsChatLoaded(true);
      }, 800);
    }
  }, []);

  // Reveal sections on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll('.perf-section');
    sections.forEach((sec) => {
      sec.classList.add('reveal-init');
      observer.observe(sec);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#060607] text-[#F2F2F2] selection:bg-[#FF4A1C] selection:text-black">
      {/* Background Universe of Black & White Particles */}
      <BackgroundUniverse canStart={canStartUniverse} />

      {/* Opening Screen (Pure black, ABHILASH K P -> title -> ENTER button) */}
      <OpeningSequence onEnter={handleEnter} />

      {/* Main Top Navigation */}
      <Navbar onOpenChat={() => setIsChatOpen(true)} />

      {/* Main Content Sections */}
      <main id="main-content">
        <HomeSection
          onOpenChat={() => setIsChatOpen(true)}
          isBuildStarted={isBuildStarted}
          onPhotoReady={handlePhotoReady}
          isPhotoFormed={isPhotoFormed}
        />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <CertificatesSection />
        <AchievementsSection />
        <ContactSection />
      </main>

      {/* Lazy-loaded AI Assistant Component */}
      {isChatLoaded && (
        <Suspense fallback={null}>
          <AiAssistantLazy
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            onOpen={() => setIsChatOpen(true)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
