'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_PRESS_MESSAGES } from '@/lib/constants';

interface PressRevealProps {
  pressMessages: string[];
}

export default function PressReveal({ pressMessages }: PressRevealProps) {
  const messages = pressMessages.length > 0 ? pressMessages : DEFAULT_PRESS_MESSAGES;
  const [message, setMessage] = useState<string | null>(null);
  const [isBeating, setIsBeating] = useState(false);

  const handlePress = () => {
    // Pick a random message (different from current if possible)
    let newMsg: string;
    if (messages.length === 1) {
      newMsg = messages[0];
    } else {
      const available = messages.filter((m) => m !== message);
      newMsg = available[Math.floor(Math.random() * available.length)];
    }

    setIsBeating(true);
    setTimeout(() => setIsBeating(false), 600);
    setMessage(newMsg);
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
        ONE MORE THING
      </motion.p>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mb-12"
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          color: '#3a1f2b',
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        Press it, baby
      </motion.h2>

      {/* Pill button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <motion.button
          onClick={handlePress}
          animate={
            isBeating
              ? { scale: [1, 1.08, 1, 1.04, 1] }
              : { scale: 1 }
          }
          transition={
            isBeating
              ? { duration: 0.5, ease: 'easeInOut' }
              : { duration: 0.2 }
          }
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: 'Karla, Inter, sans-serif',
            fontSize: '1rem',
            color: '#8a2f4c',
            background: 'transparent',
            border: '2px solid #8a2f4c',
            borderRadius: '9999px',
            padding: '14px 36px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(138,47,76,0.06)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          }}
        >
          ♡ press here ♡
        </motion.button>
      </motion.div>

      {/* Revealed message */}
      <div className="mt-10 min-h-[80px] flex items-center justify-center max-w-md px-4">
        <AnimatePresence mode="wait">
          {message && (
            <motion.p
              key={message}
              initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(4px)', y: -8 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                color: '#3a1f2b',
                fontStyle: 'italic',
                lineHeight: 1.6,
                textAlign: 'center',
              }}
            >
              &ldquo;{message}&rdquo;
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
