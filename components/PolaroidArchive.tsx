'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '@/types';

interface PolaroidArchiveProps {
  memories: Memory[];
}

const TILTS = [-6, 5, -4, 7, -5, 6, -3, 4];

function PolaroidCard({ memory, index, onClick }: { memory: Memory; index: number; onClick: () => void }) {
  const baseTilt = TILTS[index % TILTS.length];
  // Slight randomisation per card
  const tilt = baseTilt + (index % 3 === 0 ? 1 : index % 3 === 1 ? -1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        rotate: 0,
        y: -6,
        scale: 1.04,
        boxShadow: '0 20px 60px rgba(58,31,43,0.22)',
        transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
      }}
      onClick={onClick}
      className="cursor-pointer flex-shrink-0"
      style={{
        rotate: tilt,
        background: '#fffaf6',
        padding: '10px 10px 40px 10px',
        borderRadius: '2px',
        boxShadow: '0 8px 24px rgba(58,31,43,0.14)',
        width: 'clamp(160px, 28vw, 220px)',
        transformStyle: 'preserve-3d',
        perspective: '800px',
      }}
    >
      {/* Photo */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: '#e8d5d8',
          overflow: 'hidden',
          borderRadius: '1px',
        }}
      >
        <img
          src={memory.url}
          alt={memory.caption || 'Memory'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
      </div>

      {/* Caption */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.8rem',
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

// Lightbox
function Lightbox({ memories, startIndex, onClose }: { memories: Memory[]; startIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + memories.length) % memories.length), [memories.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % memories.length), [memories.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: 'rgba(20,8,14,0.92)', zIndex: 1000 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6"
        style={{ color: '#fffaf6', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
      >
        ✕
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 md:left-8"
        style={{ color: '#fffaf6', background: 'rgba(255,250,246,0.1)', border: '1px solid rgba(255,250,246,0.2)', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', fontSize: '1rem' }}
      >
        ‹
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '90vw',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src={memories[current].url}
            alt={memories[current].caption}
            style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '4px' }}
          />
          <p style={{ color: '#fffaf6', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', opacity: 0.8 }}>
            {memories[current].caption}
          </p>
          <p style={{ color: 'rgba(255,250,246,0.4)', fontSize: '0.75rem', fontFamily: 'Karla, sans-serif' }}>
            {current + 1} / {memories.length}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 md:right-8"
        style={{ color: '#fffaf6', background: 'rgba(255,250,246,0.1)', border: '1px solid rgba(255,250,246,0.2)', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', fontSize: '1rem' }}
      >
        ›
      </button>
    </motion.div>
  );
}

export default function PolaroidArchive({ memories }: PolaroidArchiveProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photoMemories = memories.filter((m) => m.type === 'photo');

  if (photoMemories.length === 0) return null;

  return (
    <>
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
          OUR LITTLE ARCHIVE
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
          Moments I never want to forget
        </motion.h2>

        {/* Polaroid grid */}
        <div
          className="flex flex-wrap justify-center gap-6 md:gap-10"
          style={{ perspective: '1200px', maxWidth: '900px' }}
        >
          {photoMemories.map((memory, i) => (
            <PolaroidCard
              key={memory.memoryId}
              memory={memory}
              index={i}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            memories={photoMemories}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
