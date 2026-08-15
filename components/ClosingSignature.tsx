'use client';

import { motion } from 'framer-motion';

interface ClosingSignatureProps {
  recipientName: string;
}

export default function ClosingSignature({ recipientName }: ClosingSignatureProps) {
  return (
    <section
      className="relative py-32 md:py-40 px-6 flex flex-col items-center text-center"
      style={{ zIndex: 1, paddingBottom: '120px' }}
    >
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="tracking-[0.2em] text-xs font-medium mb-10 max-w-xs"
        style={{ color: '#8a2f4c', fontFamily: 'Karla, Inter, sans-serif', lineHeight: 1.8 }}
      >
        MADE WITH ALL MY HEART,
        <br />
        FOR THE ONE WHO HAS IT
      </motion.p>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          width: '80px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #8a2f4c, transparent)',
          marginBottom: '48px',
        }}
      />

      {/* "I love you, {name}" — script font */}
      <motion.h2
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "'Petit Formal Script', cursive",
          fontSize: 'clamp(2.5rem, 10vw, 6rem)',
          color: '#3a1f2b',
          lineHeight: 1.2,
          textShadow: '0 4px 32px rgba(138,47,76,0.15)',
        }}
      >
        I love you, {recipientName}
      </motion.h2>

      {/* Floating hearts */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
          animate={{
            y: [0, -10, 0],
          }}
          style={{
            animationDelay: `${i * 0.4}s`,
          }}
        >
          <motion.svg
            animate={{ y: [0, -8 - i * 3, 0] }}
            transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{ display: 'inline-block', margin: '16px 6px 0' }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#8a2f4c"
              opacity={0.3 + i * 0.2}
            />
          </motion.svg>
        </motion.div>
      ))}
    </section>
  );
}
