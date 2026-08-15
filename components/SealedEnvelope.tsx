'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LetterSection from './LetterSection';

interface SealedEnvelopeProps {
  salutation: string;
  letterParagraphs: string[];
  signOff: string;
}

export default function SealedEnvelope({ salutation, letterParagraphs, signOff }: SealedEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Wait for envelope animation to finish, then show letter
    setTimeout(() => setLetterVisible(true), 650);
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
        OPEN WHEN YOU&apos;RE READY
      </motion.p>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mb-14 max-w-md"
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          color: '#3a1f2b',
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        A letter, sealed with everything I mean
      </motion.h2>

      {/* Envelope container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
        style={{ perspective: '1000px' }}
      >
        {/* Envelope body */}
        <div
          className="relative cursor-pointer select-none"
          onClick={handleOpen}
          style={{
            width: 'clamp(280px, 60vw, 400px)',
            height: 'clamp(200px, 40vw, 280px)',
            background: '#fffaf6',
            borderRadius: '4px 4px 8px 8px',
            boxShadow: '0 8px 40px rgba(138,47,76,0.15), 0 2px 8px rgba(58,31,43,0.10)',
            overflow: 'visible',
          }}
        >
          {/* Envelope bottom V flap (always visible) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '55%',
              background: '#f5e9ec',
              clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
              zIndex: 1,
            }}
          />

          {/* Left side flap */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: '50%',
              background: '#fdf0f3',
              clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
              zIndex: 2,
            }}
          />

          {/* Right side flap */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: '50%',
              background: '#fdf0f3',
              clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
              zIndex: 2,
            }}
          />

          {/* TOP FLAP — the one that opens with 3D rotateX */}
          <motion.div
            animate={isOpen ? { rotateX: -160 } : { rotateX: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '55%',
              background: 'linear-gradient(160deg, #8a2f4c 0%, #a03560 100%)',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
              zIndex: isOpen ? 10 : 3,
              cursor: isOpen ? 'default' : 'pointer',
            }}
          >
            {/* Wax seal button */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8a2f4c, #c9973f)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(58,31,43,0.3)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="white"
                />
              </svg>
            </div>
          </motion.div>

          {/* Envelope inner paper peek (visible when open) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -10, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                style={{
                  position: 'absolute',
                  top: '20%',
                  left: '10%',
                  right: '10%',
                  height: '60%',
                  background: '#fffaf6',
                  borderRadius: '4px',
                  zIndex: 4,
                  boxShadow: '0 -4px 12px rgba(58,31,43,0.08)',
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Tap label */}
        <AnimatePresence>
          {!isOpen && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 tracking-[0.15em] text-xs font-medium"
              style={{ color: '#8a2f4c', fontFamily: 'Karla, Inter, sans-serif' }}
            >
              TAP THE ENVELOPE, BABY
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Letter Section — fades in after envelope opens */}
      <AnimatePresence>
        {letterVisible && (
          <LetterSection
            salutation={salutation}
            letterParagraphs={letterParagraphs}
            signOff={signOff}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
