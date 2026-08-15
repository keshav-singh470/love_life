'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRESET_SONGS } from '@/lib/constants';

interface MusicPlayerProps {
  songUrl: string | null;
}

export default function MusicPlayer({ songUrl }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [volume, setVolume] = useState(0.6);
  const [songLabel, setSongLabel] = useState('');

  useEffect(() => {
    // Find preset label if applicable
    const preset = PRESET_SONGS.find((s) => s.file === songUrl);
    setSongLabel(preset?.label ?? 'Your Song');
  }, [songUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  if (!songUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={songUrl} loop preload="metadata" />

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3 md:px-8"
            style={{
              background: 'rgba(58,31,43,0.85)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(201,151,63,0.2)',
              zIndex: 500,
            }}
          >
            {/* Song info */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Animated waveform when playing */}
              <div className="flex items-end gap-[3px] h-5 flex-shrink-0">
                {[0.5, 1, 0.7, 0.9, 0.6].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={playing ? { scaleY: [h, 1, h * 0.4, 0.8, h] } : { scaleY: 0.2 }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' }}
                    style={{
                      width: '3px',
                      height: '16px',
                      background: '#c9973f',
                      borderRadius: '2px',
                      transformOrigin: 'bottom',
                    }}
                  />
                ))}
              </div>

              <div className="min-w-0">
                <p
                  className="truncate text-xs font-medium"
                  style={{ color: '#fffaf6', fontFamily: 'Karla, sans-serif', letterSpacing: '0.05em' }}
                >
                  {songLabel}
                </p>
                <p
                  className="text-xs opacity-50"
                  style={{ color: '#c9973f', fontFamily: 'Karla, sans-serif' }}
                >
                  {playing ? 'Now playing' : 'Paused'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Volume slider */}
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 md:w-24 accent-wine"
                style={{ accentColor: '#c9973f', opacity: 0.7 }}
              />

              {/* Play/Pause */}
              <button
                onClick={toggle}
                className="flex items-center justify-center rounded-full flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#c9973f',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="2" y="1" width="4" height="12" rx="1" fill="#3a1f2b" />
                    <rect x="8" y="1" width="4" height="12" rx="1" fill="#3a1f2b" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 2l10 5-10 5V2z" fill="#3a1f2b" />
                  </svg>
                )}
              </button>

              {/* Dismiss */}
              <button
                onClick={() => setVisible(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,250,246,0.4)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  lineHeight: 1,
                  padding: '4px',
                }}
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
