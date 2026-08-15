'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_REASONS } from '@/lib/constants';

interface ReasonGeneratorProps {
  reasons: string[];
}

export default function ReasonGenerator({ reasons }: ReasonGeneratorProps) {
  const list = reasons.length > 0 ? reasons : DEFAULT_REASONS;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % list.length);
  };

  return (
    <section
      className="relative py-24 md:py-32 px-6 flex flex-col items-center text-center"
      style={{ zIndex: 1 }}
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="tracking-[0.25em] text-xs font-medium mb-5"
        style={{ color: '#8a2f4c', fontFamily: 'Karla, Inter, sans-serif' }}
      >
        TAP TO KEEP GOING
      </motion.p>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mb-14"
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          color: '#3a1f2b',
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        A few reasons, out of hundreds
      </motion.h2>

      {/* Reason card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-lg relative"
        style={{ minHeight: '160px' }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, y: 20 * direction }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 * direction }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="px-10 py-10 rounded-2xl"
            style={{
              background: '#fffaf6',
              boxShadow: '0 8px 40px rgba(138,47,76,0.12), 0 2px 8px rgba(58,31,43,0.06)',
              border: '1px solid rgba(138,47,76,0.1)',
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                fontSize: 'clamp(1.15rem, 3vw, 1.5rem)',
                color: '#3a1f2b',
                fontStyle: 'italic',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              &ldquo;{list[index]}&rdquo;
            </p>

            {/* Counter */}
            <p
              className="tracking-[0.2em] text-xs"
              style={{ color: '#8a2f4c', fontFamily: 'Karla, Inter, sans-serif' }}
            >
              REASON {index + 1} OF {list.length}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4 }}
        onClick={handleNext}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-8 px-8 py-3 rounded-full font-medium text-sm tracking-wide transition-all"
        style={{
          background: 'linear-gradient(135deg, #8a2f4c, #a03560)',
          color: '#fffaf6',
          fontFamily: 'Karla, Inter, sans-serif',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(138,47,76,0.25)',
          letterSpacing: '0.05em',
        }}
      >
        GIVE ME ANOTHER REASON
      </motion.button>
    </section>
  );
}
