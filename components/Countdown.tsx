'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownProps {
  targetDate: number; // Unix ms timestamp
  caption: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

function calcTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

// Flip digit card with 3D rotateX animation
function FlipDigit({ value, label }: { value: number; label: string }) {
  const [displayed, setDisplayed] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value !== prevRef.current) {
      setFlipping(true);
      const t = setTimeout(() => {
        setDisplayed(value);
        prevRef.current = value;
        setFlipping(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [value]);

  const formatted = String(displayed).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative overflow-hidden rounded-xl flex items-center justify-center"
        style={{
          width: 'clamp(70px, 18vw, 110px)',
          height: 'clamp(80px, 20vw, 130px)',
          background: '#fffaf6',
          boxShadow: '0 4px 24px rgba(138,47,76,0.12), 0 1px 4px rgba(58,31,43,0.08)',
          perspective: '400px',
        }}
      >
        <motion.span
          key={`${label}-${displayed}`}
          initial={{ rotateX: flipping ? -90 : 0, opacity: flipping ? 0 : 1 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
            fontSize: 'clamp(2.2rem, 7vw, 4rem)',
            color: '#3a1f2b',
            fontWeight: 600,
            display: 'block',
            lineHeight: 1,
            transformOrigin: 'center bottom',
          }}
        >
          {formatted}
        </motion.span>

        {/* Divider line in middle of card */}
        <div
          className="absolute inset-x-0"
          style={{
            top: '50%',
            height: '1px',
            background: 'rgba(138,47,76,0.12)',
          }}
        />
      </div>

      <span
        className="tracking-[0.2em] text-xs font-medium"
        style={{ color: '#8a2f4c', fontFamily: 'Karla, Inter, sans-serif' }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ targetDate, caption }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const formattedDate = new Date(targetDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
        COUNTING EVERY SINGLE DAY
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
        Until I get to see you again
      </motion.h2>

      {/* Flip cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex items-start gap-4 md:gap-8 mb-10"
      >
        <FlipDigit value={timeLeft.days} label="DAYS" />
        <div className="mt-8 md:mt-10" style={{ color: '#8a2f4c', fontSize: '2rem', opacity: 0.4 }}>:</div>
        <FlipDigit value={timeLeft.hours} label="HOURS" />
        <div className="mt-8 md:mt-10" style={{ color: '#8a2f4c', fontSize: '2rem', opacity: 0.4 }}>:</div>
        <FlipDigit value={timeLeft.mins} label="MINS" />
        <div className="mt-8 md:mt-10" style={{ color: '#8a2f4c', fontSize: '2rem', opacity: 0.4 }}>:</div>
        <FlipDigit value={timeLeft.secs} label="SECS" />
      </motion.div>

      {/* Caption */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="max-w-sm text-sm italic"
        style={{
          color: '#5a3545',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1rem',
        }}
      >
        until {formattedDate} — {caption}
      </motion.p>
    </section>
  );
}
