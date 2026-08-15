'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface PasswordGateProps {
  pageId: string;
  recipientName: string;
  onUnlock: () => void;
}

export default function PasswordGate({ pageId, recipientName, onUnlock }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, password: password.trim() }),
      });

      const data = await res.json();

      if (data.ok) {
        // Store unlock flag in sessionStorage
        sessionStorage.setItem(`unlocked_${pageId}`, '1');
        onUnlock();
      } else {
        setShake(true);
        toast.error('Wrong password, love. Try again.');
        setPassword('');
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      toast.error('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center px-6"
      style={{
        zIndex: 999,
        background: 'rgba(253,243,240,0.7)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm text-center"
      >
        {/* Lock icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6 flex justify-center"
        >
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: '64px',
              height: '64px',
              background: 'rgba(138,47,76,0.1)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="#8a2f4c" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="#8a2f4c" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1.5" fill="#8a2f4c" />
            </svg>
          </div>
        </motion.div>

        <p
          className="mb-2 tracking-[0.2em] text-xs font-medium"
          style={{ color: '#8a2f4c', fontFamily: 'Karla, sans-serif' }}
        >
          THIS PAGE IS PRIVATE
        </p>

        <h1
          className="mb-2"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
            color: '#3a1f2b',
            fontWeight: 500,
          }}
        >
          A page made for {recipientName}
        </h1>

        <p
          className="mb-8 text-sm italic"
          style={{ color: '#5a3545', fontFamily: "'Cormorant Garamond', serif" }}
        >
          Enter the password to open it.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <motion.div
            animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter the password, love"
              autoComplete="off"
              className="w-full px-5 py-4 rounded-xl text-center outline-none mb-4"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1rem',
                color: '#3a1f2b',
                background: '#fffaf6',
                border: '1.5px solid rgba(138,47,76,0.25)',
                letterSpacing: '0.1em',
              }}
              onFocus={(e) => (e.currentTarget.style.border = '1.5px solid #8a2f4c')}
              onBlur={(e) => (e.currentTarget.style.border = '1.5px solid rgba(138,47,76,0.25)')}
            />
          </motion.div>

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full py-4 rounded-xl font-medium tracking-wide transition-all"
            style={{
              background: password.trim() ? 'linear-gradient(135deg, #8a2f4c, #a03560)' : 'rgba(138,47,76,0.3)',
              color: '#fffaf6',
              fontFamily: 'Karla, sans-serif',
              fontSize: '0.9rem',
              letterSpacing: '0.08em',
              border: 'none',
              cursor: password.trim() ? 'pointer' : 'not-allowed',
              boxShadow: password.trim() ? '0 4px 20px rgba(138,47,76,0.25)' : 'none',
            }}
          >
            {loading ? 'Opening...' : 'OPEN THE PAGE'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
