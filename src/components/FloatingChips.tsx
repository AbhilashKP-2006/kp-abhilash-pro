import React, { useState, useRef, useEffect } from 'react';

interface ChipData {
  id: string;
  label: string;
  isBadge?: boolean;
  side: 'left' | 'right';
  initialXPercent: number; // percentage relative to container width
  initialYPercent: number; // percentage relative to container height
  floatDelay: string;
}

const CHIPS_CONFIG: ChipData[] = [
  // Right side: badge "TOP 30 FINALIST", tags C++, Python, Flutter, Git
  { id: 'top30', label: 'TOP 30 FINALIST', isBadge: true, side: 'right', initialXPercent: 68, initialYPercent: 12, floatDelay: '0s' },
  { id: 'cpp', label: 'C++', isBadge: false, side: 'right', initialXPercent: 74, initialYPercent: 24, floatDelay: '1.2s' },
  { id: 'python', label: 'Python', isBadge: false, side: 'right', initialXPercent: 70, initialYPercent: 36, floatDelay: '2.4s' },
  { id: 'flutter', label: 'Flutter', isBadge: false, side: 'right', initialXPercent: 75, initialYPercent: 48, floatDelay: '0.8s' },
  { id: 'git', label: 'Git', isBadge: false, side: 'right', initialXPercent: 66, initialYPercent: 60, floatDelay: '1.9s' },

  // Left side: tag Java and badge "CGPA 8.1"
  { id: 'java', label: 'Java', isBadge: false, side: 'left', initialXPercent: 6, initialYPercent: 20, floatDelay: '1.5s' },
  { id: 'cgpa', label: 'CGPA 8.1', isBadge: true, side: 'left', initialXPercent: 4, initialYPercent: 34, floatDelay: '2.8s' },
];

interface FloatingChipsProps {
  isPhotoFormed: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const FloatingChips: React.FC<FloatingChipsProps> = ({ isPhotoFormed, containerRef }) => {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [visibleChips, setVisibleChips] = useState<Set<string>>(new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  // Stagger fade-in one by one (0.3s apart) after photo is formed
  useEffect(() => {
    if (!isPhotoFormed) return;

    CHIPS_CONFIG.forEach((chip, index) => {
      setTimeout(() => {
        setVisibleChips((prev) => new Set([...prev, chip.id]));
      }, index * 300);
    });
  }, [isPhotoFormed]);

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const currentPos = positions[id] || { x: 0, y: 0 };
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: currentPos.x,
      startY: currentPos.y,
    };
    setDraggingId(id);
  };

  const handlePointerMove = (id: string, e: React.PointerEvent) => {
    if (draggingId !== id) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;

    // Constraint within photo container
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const chipEl = e.currentTarget as HTMLElement;
      const chipRect = chipEl.getBoundingClientRect();

      let newX = dragStartRef.current.startX + dx;
      let newY = dragStartRef.current.startY + dy;

      // Clamp so chip doesn't leave photo container
      const minX = -rect.width * 0.45;
      const maxX = rect.width * 0.45;
      const minY = -rect.height * 0.45;
      const maxY = rect.height * 0.45;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      setPositions((prev) => ({
        ...prev,
        [id]: { x: newX, y: newY },
      }));
    }
  };

  const handlePointerUp = (id: string, e: React.PointerEvent) => {
    if (draggingId === id) {
      setDraggingId(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible select-none">
      <style>{`
        @keyframes floatUpDown {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }
        .chip-float {
          animation: floatUpDown 5s ease-in-out infinite;
        }
      `}</style>

      {CHIPS_CONFIG.map((chip) => {
        const isVisible = visibleChips.has(chip.id);
        const isDragging = draggingId === chip.id;
        const pos = positions[chip.id] || { x: 0, y: 0 };

        // Hide left-side chips on mobile per specification
        const responsiveClasses = chip.side === 'left' ? 'hidden md:flex' : 'flex';

        return (
          <div
            key={chip.id}
            onPointerDown={(e) => handlePointerDown(chip.id, e)}
            onPointerMove={(e) => handlePointerMove(chip.id, e)}
            onPointerUp={(e) => handlePointerUp(chip.id, e)}
            onPointerCancel={(e) => handlePointerUp(chip.id, e)}
            style={{
              left: `${chip.initialXPercent}%`,
              top: `${chip.initialYPercent}%`,
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
              touchAction: 'none',
              willChange: 'transform, opacity',
            }}
            className={`absolute pointer-events-auto items-center transition-opacity duration-500 ease-out ${responsiveClasses}`}
          >
            <div
              className={`font-mono transition-colors duration-200 select-none ${
                isDragging ? 'cursor-grabbing border-[#FF4A1C]' : 'cursor-grab border-[#2A2A2A] hover:border-[#FF4A1C]'
              } ${isDragging ? '' : 'chip-float'}`}
              style={{
                backgroundColor: 'rgba(20, 20, 20, 0.88)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isDragging || chip.isBadge ? '#FF4A1C' : '#2A2A2A',
                color: chip.isBadge ? '#FF4A1C' : '#F2F2F2',
                padding: '5px 11px',
                fontSize: '0.72rem',
                lineHeight: 1.2,
                borderRadius: '4px',
                opacity: isVisible ? 1 : 0,
                animationDelay: chip.floatDelay,
                letterSpacing: '0.04em',
              }}
            >
              {chip.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
