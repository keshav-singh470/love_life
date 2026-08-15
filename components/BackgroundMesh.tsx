'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Reusing tiny SVG paths (heart and a 4-point sparkle) to avoid heavy asset loads
const SVG_SHAPES = [
  <path key="heart" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />,
  <path key="sparkle" d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
];

// Pre-computed particle layers for SSR hydration safety (18 nodes total)
const FAR_PARTICLES = [
  { id: 'f1', x: 10, y: 15, size: 12, dur: 18, delay: -2, shape: 0, r: 15 },
  { id: 'f2', x: 85, y: 10, size: 10, dur: 15, delay: -5, shape: 1, r: -10 },
  { id: 'f3', x: 25, y: 35, size: 14, dur: 19, delay: -8, shape: 0, r: 25 },
  { id: 'f4', x: 75, y: 40, size: 11, dur: 16, delay: -1, shape: 1, r: -20 },
  { id: 'f5', x: 45, y: 65, size: 13, dur: 20, delay: -12, shape: 0, r: 5 },
  { id: 'f6', x: 15, y: 80, size: 10, dur: 14, delay: -4, shape: 1, r: 30 },
  { id: 'f7', x: 80, y: 75, size: 12, dur: 17, delay: -9, shape: 0, r: -15 },
  { id: 'f8', x: 50, y: 15, size: 14, dur: 19, delay: -3, shape: 1, r: 10 },
  { id: 'f9', x: 90, y: 90, size: 11, dur: 15, delay: -7, shape: 0, r: -5 },
  { id: 'f10', x: 5, y: 50, size: 13, dur: 18, delay: -11, shape: 1, r: 20 },
];

const NEAR_PARTICLES = [
  { id: 'n1', x: 15, y: 25, size: 18, dur: 10, delay: -1, shape: 0, r: 10 },
  { id: 'n2', x: 75, y: 20, size: 22, dur: 12, delay: -4, shape: 1, r: -15 },
  { id: 'n3', x: 35, y: 55, size: 16, dur: 9, delay: -2, shape: 0, r: 20 },
  { id: 'n4', x: 85, y: 60, size: 20, dur: 11, delay: -6, shape: 1, r: -5 },
  { id: 'n5', x: 20, y: 85, size: 17, dur: 10, delay: -3, shape: 0, r: 25 },
  { id: 'n6', x: 65, y: 85, size: 21, dur: 12, delay: -7, shape: 1, r: -20 },
  { id: 'n7', x: 55, y: 35, size: 19, dur: 8, delay: -5, shape: 0, r: 15 },
  { id: 'n8', x: 10, y: 65, size: 16, dur: 11, delay: -8, shape: 1, r: -10 },
];

export default function BackgroundMesh() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    // Only check once on mount for accessibility
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Frame-optimized parallax via framer-motion (GPU driven via transform)
  const yFar = useTransform(scrollY, (val) => (reducedMotion ? 0 : val * 0.15));
  const yNear = useTransform(scrollY, (val) => (reducedMotion ? 0 : val * 0.35));

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Layer 1: Ambient gradient mesh (Depth via blur + drift) */}
      <div className="absolute inset-0">
        {/* Blob 1: Wine */}
        <div
          className="absolute rounded-full"
          style={{
            left: '10%', top: '15%', width: '600px', height: '600px',
            background: '#8a2f4c', opacity: 0.10, filter: 'blur(70px)',
            transformOrigin: 'center',
            willChange: 'transform',
            animation: reducedMotion ? 'none' : 'drift1 48s ease-in-out infinite alternate',
          }}
        />
        {/* Blob 2: Gold */}
        <div
          className="absolute rounded-full"
          style={{
            left: '65%', top: '10%', width: '500px', height: '500px',
            background: '#c9973f', opacity: 0.10, filter: 'blur(70px)',
            transformOrigin: 'center',
            willChange: 'transform',
            animation: reducedMotion ? 'none' : 'drift2 63s ease-in-out infinite alternate',
          }}
        />
        {/* Blob 3: Blush */}
        <div
          className="absolute rounded-full"
          style={{
            left: '30%', top: '65%', width: '550px', height: '550px',
            background: '#f4c6cf', opacity: 0.12, filter: 'blur(70px)',
            transformOrigin: 'center',
            willChange: 'transform',
            animation: reducedMotion ? 'none' : 'drift3 81s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* Layer 2 (Far Depth): Smaller, lower opacity, blurred out, slower float */}
      <motion.div
        className="absolute inset-0"
        style={{ y: yFar, willChange: 'transform' }}
      >
        {FAR_PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute flex items-center justify-center text-[#8a2f4c]"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: `${p.size}px`, height: `${p.size}px`,
              opacity: 0.25, filter: 'blur(1.5px)',
              willChange: 'transform',
              animation: reducedMotion ? 'none' : `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate`
            }}
          >
            <svg viewBox="0 0 24 24" style={{ transform: `rotate(${p.r}deg)`, width: '100%', height: '100%' }}>
              {SVG_SHAPES[p.shape]}
            </svg>
          </div>
        ))}
      </motion.div>

      {/* Layer 3 (Near Depth): Larger, higher opacity, crisp focus, faster float */}
      <motion.div
        className="absolute inset-0"
        style={{ y: yNear, willChange: 'transform' }}
      >
        {NEAR_PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute flex items-center justify-center text-[#c9973f]"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: `${p.size}px`, height: `${p.size}px`,
              opacity: 0.55, filter: 'none',
              willChange: 'transform',
              animation: reducedMotion ? 'none' : `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate`
            }}
          >
            <svg viewBox="0 0 24 24" style={{ transform: `rotate(${p.r}deg)`, width: '100%', height: '100%' }}>
              {SVG_SHAPES[p.shape]}
            </svg>
          </div>
        ))}
      </motion.div>

      <style jsx>{`
        @keyframes drift1 { 
          0% { transform: translate(-5%, -5%) scale(1); } 
          100% { transform: translate(8%, 6%) scale(1.15); } 
        }
        @keyframes drift2 { 
          0% { transform: translate(5%, 8%) scale(1.1); } 
          100% { transform: translate(-8%, -4%) scale(0.95); } 
        }
        @keyframes drift3 { 
          0% { transform: translate(0%, 0%) scale(1); } 
          100% { transform: translate(-6%, 10%) scale(1.1); } 
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(15deg); }
        }
      `}</style>
    </div>
  );
}
