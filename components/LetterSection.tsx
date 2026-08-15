'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LetterSectionProps {
  salutation: string;
  letterParagraphs: string[];
  signOff: string;
}

function RevealParagraph({ children, delay }: { children: string; delay: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const revealed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !revealed.current) {
          revealed.current = true;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      style={{
        fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
        fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
        color: '#3a1f2b',
        lineHeight: 1.85,
        marginBottom: '1.5rem',
        opacity: 0,
        transform: 'translateY(20px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </p>
  );
}

export default function LetterSection({ salutation, letterParagraphs, signOff }: LetterSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl mx-auto mt-16 px-6 md:px-12 py-12 rounded-2xl"
      style={{
        background: '#fffaf6',
        boxShadow: '0 8px 48px rgba(138,47,76,0.10), 0 2px 8px rgba(58,31,43,0.06)',
        border: '1px solid rgba(138,47,76,0.08)',
      }}
    >
      {/* Salutation */}
      <p
        className="mb-8"
        style={{
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
          color: '#3a1f2b',
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}
      >
        {salutation}
      </p>

      {/* Letter paragraphs — each reveals on scroll */}
      <div>
        {letterParagraphs.length > 0 ? (
          letterParagraphs.map((para, i) => (
            <RevealParagraph key={i} delay={i * 100}>
              {para}
            </RevealParagraph>
          ))
        ) : (
          <RevealParagraph delay={0}>
            I&apos;ve been thinking about what to say for so long, and now that I&apos;m here — words feel almost too small. But I&apos;ll try anyway, because you deserve to know.
          </RevealParagraph>
        )}
      </div>

      {/* Sign-off */}
      <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(138,47,76,0.1)' }}>
        <p
          style={{
            fontFamily: "'Petit Formal Script', cursive",
            fontSize: 'clamp(1.4rem, 4vw, 2rem)',
            color: '#8a2f4c',
            lineHeight: 1.4,
          }}
        >
          {signOff}
        </p>
      </div>
    </motion.div>
  );
}
