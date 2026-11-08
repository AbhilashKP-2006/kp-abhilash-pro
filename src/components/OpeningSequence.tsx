import React, { useEffect, useState, useRef, useCallback } from 'react';
import { prepareParticleSystem } from '../utils/particleEngine';

interface OpeningSequenceProps {
  onEnter: () => void;
}

export const OpeningSequence: React.FC<OpeningSequenceProps> = ({ onEnter }) => {
  const [nameVisible, setNameVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [isWide, setIsWide] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const hasPreparedRef = useRef(false);

  // Safety fit: reduce font size step by step if scrollWidth exceeds container width
  const adjustNameSize = useCallback(() => {
    const el = nameRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const wide = window.innerWidth > 900;
    setIsWide(wide);

    // Reset inline font size so CSS clamp rule takes baseline effect
    el.style.fontSize = '';

    const availableWidth = container.clientWidth;
    if (availableWidth <= 0) return;

    let computedSize = parseFloat(window.getComputedStyle(el).fontSize);
    // Safety check: reduce step by step (by 0.5px) until scrollWidth fits within available width
    while (el.scrollWidth > availableWidth && computedSize > 12) {
      computedSize -= 0.5;
      el.style.fontSize = `${computedSize}px`;
    }
  }, []);

  useEffect(() => {
    // Lock scrolling on mount
    document.body.style.overflow = 'hidden';

    // Start background preparation immediately
    if (!hasPreparedRef.current) {
      hasPreparedRef.current = true;
      prepareParticleSystem().catch((e) => console.warn('Preload warning:', e));
    }

    // Safety fit after font load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => adjustNameSize());
    } else {
      setTimeout(adjustNameSize, 100);
    }

    // Debounced resize handler (150 ms)
    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(adjustNameSize, 150);
    };
    window.addEventListener('resize', handleResize);

    // Stage 1: Name fades in at 0.1s
    const tName = setTimeout(() => {
      setNameVisible(true);
      adjustNameSize();
    }, 100);

    // Stage 2: ~0.8s later, title fades in
    const tTitle = setTimeout(() => {
      setTitleVisible(true);
    }, 900);

    // Stage 3: ~0.8s later, ENTER button fades in
    const tButton = setTimeout(() => {
      setButtonVisible(true);
    }, 1700);

    return () => {
      clearTimeout(tName);
      clearTimeout(tTitle);
      clearTimeout(tButton);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustNameSize]);

  const handleEnterClick = () => {
    if (isFadingOut || isRemoved) return;

    // Trigger black screen fade out (0.8s duration) using ONLY opacity
    setIsFadingOut(true);

    // Call onEnter to signal start of Home particle build
    onEnter();

    // After 0.8s opacity transition completes, remove from DOM and unlock scroll
    setTimeout(() => {
      setIsRemoved(true);
      document.body.style.overflow = '';
    }, 800);
  };

  if (isRemoved) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome screen for Abhilash K P"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black select-none px-[5vw]"
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        willChange: 'opacity',
      }}
    >
      <div
        ref={containerRef}
        className="flex flex-col items-center w-full max-w-5xl mx-auto text-center"
      >
        {/* 1. ABHILASH K P: ALWAYS ONE line, nowrap, clamp(1.05rem, 6.2vw, 4.2rem) */}
        <h1
          ref={nameRef}
          className="opening-name font-display uppercase text-white whitespace-nowrap text-center"
          style={{
            opacity: nameVisible ? 1 : 0,
            transform: nameVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            willChange: 'opacity, transform',
          }}
        >
          ABHILASH K P
        </h1>

        {/* 2. Subtitle: text-wrap: balance, max 2 centered lines on mobile */}
        <p
          className="opening-subtitle font-mono text-xs sm:text-sm tracking-wider uppercase text-[#A3A3A3] mt-5 max-w-lg mx-auto text-center"
          style={{
            textWrap: 'balance',
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            willChange: 'opacity, transform',
          }}
        >
          B.E. COMPUTER SCIENCE · ASPIRING SOFTWARE DEVELOPER
        </p>

        {/* 3. Outlined pill button: ENTER → */}
        <div
          className="mt-10"
          style={{
            opacity: buttonVisible ? 1 : 0,
            transform: buttonVisible ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            willChange: 'opacity, transform',
          }}
        >
          <button
            onClick={handleEnterClick}
            autoFocus
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-[#FF4A1C] bg-transparent text-white font-mono text-sm tracking-widest uppercase cursor-pointer transition-colors duration-200 hover:bg-[#FF4A1C] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FF4A1C] focus:ring-offset-2 focus:ring-offset-black min-h-[48px]"
            aria-label="Enter portfolio"
          >
            <span>ENTER</span>
            <span
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
