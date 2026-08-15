'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Memory } from '@/types';

interface VideoMomentsProps {
  memories: Memory[];
}

const TILTS = [-5, 4, -3, 6, -4, 5];

function VideoCard({ memory, index }: { memory: Memory; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const baseTilt = TILTS[index % TILTS.length];

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      video.muted = false;
      video.play();
      setPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        rotate: 0,
        y: -6,
        scale: 1.04,
        boxShadow: '0 20px 60px rgba(58,31,43,0.22)',
        transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
      }}
      className="flex-shrink-0 relative"
      style={{
        rotate: baseTilt,
        background: '#fffaf6',
        padding: '10px 10px 40px 10px',
        borderRadius: '2px',
        boxShadow: '0 8px 24px rgba(58,31,43,0.14)',
        width: 'clamp(140px, 24vw, 190px)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Video — 9:16 portrait */}
      <div
        style={{
          width: '100%',
          aspectRatio: '9 / 16',
          background: '#1a0a10',
          overflow: 'hidden',
          borderRadius: '1px',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={handlePlay}
      >
        <video
          ref={videoRef}
          src={memory.url}
          muted
          playsInline
          loop
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        {/* Play button overlay */}
        {!playing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(20,8,14,0.2)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255,250,246,0.18)',
                border: '1.5px solid rgba(255,250,246,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              {/* Play triangle */}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5 3l9 5-9 5V3z" fill="rgba(255,250,246,0.9)" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.78rem',
          color: '#3a1f2b',
          fontStyle: 'italic',
          textAlign: 'center',
          marginTop: '12px',
          lineHeight: 1.4,
          opacity: 0.85,
        }}
      >
        {memory.caption || '♡'}
      </p>
    </motion.div>
  );
}

export default function VideoMoments({ memories }: VideoMomentsProps) {
  const videoMemories = memories.filter((m) => m.type === 'video');

  if (videoMemories.length === 0) return null;

  return (
    <section
      className="relative py-24 md:py-32 px-6 flex flex-col items-center"
      style={{ zIndex: 1 }}
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="tracking-[0.25em] text-xs font-medium mb-5 text-center"
        style={{ color: '#8a2f4c', fontFamily: 'Karla, Inter, sans-serif' }}
      >
        WATCH THESE WHENEVER YOU MISS ME
      </motion.p>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mb-16 text-center"
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          color: '#3a1f2b',
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        A few little moments, moving
      </motion.h2>

      {/* Video polaroid row */}
      <div
        className="flex flex-wrap justify-center gap-8 md:gap-12"
        style={{ perspective: '1200px', maxWidth: '900px' }}
      >
        {videoMemories.map((memory, i) => (
          <VideoCard key={memory.memoryId} memory={memory} index={i} />
        ))}
      </div>
    </section>
  );
}
