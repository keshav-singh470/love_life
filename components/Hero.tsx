'use client';

import { motion } from 'framer-motion';

interface HeroProps {
  recipientName: string;
  relationWord: string;
}

export default function Hero({ recipientName, relationWord }: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20"
      style={{ zIndex: 1 }}
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="tracking-[0.25em] text-xs font-medium mb-8"
        style={{ color: '#8a2f4c', fontFamily: 'Karla, Inter, sans-serif' }}
      >
        A LITTLE CORNER OF THE INTERNET, JUST FOR YOU
      </motion.p>

      {/* Recipient Name — script font, large */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6 leading-none"
        style={{
          fontFamily: "'Petit Formal Script', cursive",
          fontSize: 'clamp(3rem, 12vw, 9rem)',
          color: '#3a1f2b',
          textShadow: '0 2px 24px rgba(138,47,76,0.12)',
        }}
      >
        {recipientName}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="text-lg md:text-xl max-w-md"
        style={{
          color: '#5a3545',
          fontFamily: 'Karla, Inter, sans-serif',
          fontStyle: 'italic',
          letterSpacing: '0.02em',
        }}
      >
        my {relationWord} — this whole page is yours.
      </motion.p>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-12 flex flex-col items-center gap-3"
      >
        {/* Heart icon */}
        <motion.svg
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="#8a2f4c"
            opacity="0.7"
          />
        </motion.svg>

        <p
          className="tracking-[0.2em] text-xs"
          style={{ color: '#8a2f4c', fontFamily: 'Karla, Inter, sans-serif', opacity: 0.7 }}
        >
          SCROLL DOWN
        </p>

        {/* Scroll arrow */}
        <motion.svg
          animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M10 4v12M4 10l6 6 6-6" stroke="#8a2f4c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
