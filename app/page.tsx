'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '✉',
    title: 'A Letter, Sealed with Love',
    desc: 'Write paragraphs that reveal one by one as they scroll — like watching a letter unfold.',
  },
  {
    icon: '⏱',
    title: 'Live Countdown',
    desc: 'A real-time flip-clock counting down to your next meeting, ticking every second.',
  },
  {
    icon: '📸',
    title: 'Photo & Video Memories',
    desc: 'Upload your moments as polaroid cards with captions. Tap to view in a full-screen gallery.',
  },
];

export default function LandingPage() {
  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #fdf3f0 0%, #f4dde2 100%)' }}
    >
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
        {[
          { x: '10%', y: '15%', size: 500, color: '#8a2f4c', dur: 75 },
          { x: '70%', y: '40%', size: 420, color: '#c9973f', dur: 90 },
          { x: '35%', y: '75%', size: 480, color: '#f4dde2', dur: 80 },
        ].map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              width: b.size,
              height: b.size,
              background: b.color,
              opacity: 0.07,
              filter: 'blur(80px)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `drift${i} ${b.dur}s ease-in-out infinite alternate`,
            }}
          />
        ))}
        <style>{`
          @keyframes drift0 { 0% { transform: translate(-50%,-50%) scale(1); } 100% { transform: translate(-45%,-55%) scale(1.15); } }
          @keyframes drift1 { 0% { transform: translate(-50%,-50%) scale(1.1); } 100% { transform: translate(-55%,-45%) scale(0.9); } }
          @keyframes drift2 { 0% { transform: translate(-50%,-50%) scale(0.9); } 100% { transform: translate(-50%,-55%) scale(1.1); } }
        `}</style>
      </div>

      {/* Nav */}
      <nav
        className="relative flex items-center justify-between px-6 md:px-12 py-6"
        style={{ zIndex: 10 }}
      >
        <p
          style={{
            fontFamily: "'Petit Formal Script', cursive",
            fontSize: '1.5rem',
            color: '#3a1f2b',
          }}
        >
          Apna Pal
        </p>

        <Link href="/create">
          <button
            className="px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #8a2f4c, #a03560)',
              color: '#fffaf6',
              fontFamily: 'Karla, sans-serif',
              letterSpacing: '0.04em',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(138,47,76,0.2)',
            }}
          >
            Create a Page
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <section
        className="relative flex flex-col items-center text-center px-6 pt-16 pb-32 md:pt-24"
        style={{ zIndex: 1 }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="tracking-[0.25em] text-xs font-medium mb-6"
          style={{ color: '#8a2f4c', fontFamily: 'Karla, sans-serif' }}
        >
          FOR THE ONE WHO HAS YOUR WHOLE HEART
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            color: '#3a1f2b',
            fontWeight: 500,
            lineHeight: 1.1,
          }}
        >
          Give them a page
          <br />
          <span style={{ fontFamily: "'Petit Formal Script', cursive", color: '#8a2f4c' }}>
            made just for them.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="max-w-lg text-base md:text-lg mb-10"
          style={{ color: '#5a3545', fontFamily: 'Karla, sans-serif', lineHeight: 1.7 }}
        >
          A personalized, animated web page — a love letter, a countdown, your photos and
          videos, all wrapped in something beautiful. Share the link. They&apos;ll never forget it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(138,47,76,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-full text-sm font-medium"
              style={{
                background: 'linear-gradient(135deg, #8a2f4c, #a03560)',
                color: '#fffaf6',
                fontFamily: 'Karla, sans-serif',
                letterSpacing: '0.06em',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(138,47,76,0.25)',
              }}
            >
              CREATE YOUR PAGE — FREE
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative scroll arrow */}
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M6 13l6 6 6-6" stroke="#8a2f4c" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative px-6 pb-32" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="p-8 rounded-2xl"
              style={{
                background: 'rgba(255,250,246,0.7)',
                border: '1px solid rgba(138,47,76,0.1)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div
                className="mb-4 text-2xl flex items-center justify-center rounded-full"
                style={{ width: '52px', height: '52px', background: 'rgba(138,47,76,0.08)' }}
              >
                {f.icon}
              </div>
              <h3
                className="mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', color: '#3a1f2b', fontWeight: 500 }}
              >
                {f.title}
              </h3>
              <p style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545', fontSize: '0.9rem', lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative text-center pb-12 px-6"
        style={{ zIndex: 1, color: '#5a3545', fontFamily: 'Karla, sans-serif', fontSize: '0.8rem', opacity: 0.6 }}
      >
        <p>Made with love &nbsp;♡&nbsp; Apna Pal</p>
      </footer>
    </main>
  );
}
