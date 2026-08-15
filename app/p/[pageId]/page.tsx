'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PublicPageData, Memory } from '@/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';

// Components
import BackgroundMesh from '@/components/BackgroundMesh';
import PasswordGate from '@/components/PasswordGate';
import Hero from '@/components/Hero';
import Countdown from '@/components/Countdown';
import SealedEnvelope from '@/components/SealedEnvelope';
import ReasonGenerator from '@/components/ReasonGenerator';
import PolaroidArchive from '@/components/PolaroidArchive';
import VideoMoments from '@/components/VideoMoments';
import PressReveal from '@/components/PressReveal';
import ClosingSignature from '@/components/ClosingSignature';
import MusicPlayer from '@/components/MusicPlayer';

interface PageViewerProps {
  params: Promise<{ pageId: string }>;
}

export default function PageViewer({ params }: PageViewerProps) {
  const [pageId, setPageId] = useState<string | null>(null);
  const [page, setPage] = useState<PublicPageData | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    params.then(({ pageId: id }) => setPageId(id));
  }, [params]);

  useEffect(() => {
    if (!pageId) return;

    async function load() {
      try {
        const alreadyUnlocked = sessionStorage.getItem(`unlocked_${pageId}`) === '1';

        if (alreadyUnlocked) {
          // If already unlocked, fetch full data directly from Firestore
          const pageRef = doc(db, 'pages', pageId!);
          const pageSnap = await getDoc(pageRef);
          if (!pageSnap.exists()) {
            setError('Page not found.');
            return;
          }
          const raw = pageSnap.data();
          const publicData: PublicPageData = {
            pageId: pageId!,
            recipientName: raw.recipientName,
            relationWord: raw.relationWord,
            theme: raw.theme,
            salutation: raw.salutation,
            letterParagraphs: raw.letterParagraphs ?? [],
            signOff: raw.signOff,
            countdownTargetDate: raw.countdownTargetDate ?? null,
            countdownCaption: raw.countdownCaption,
            reasons: raw.reasons ?? [],
            pressMessages: raw.pressMessages ?? [],
            songUrl: raw.songUrl ?? null,
            locked: false,
            createdAt: raw.createdAt?.toMillis?.() ?? raw.createdAt ?? null,
          };
          setPage(publicData);
          setUnlocked(true);

          const memoriesQuery = query(
            collection(db, 'pages', pageId!, 'memories'),
            orderBy('order', 'asc')
          );
          const snap = await getDocs(memoriesQuery);
          const mems: Memory[] = snap.docs.map((d) => ({
            memoryId: d.id,
            ...d.data(),
          } as Memory));
          setMemories(mems);
        } else {
          // Locked state, fetch from API (returns safeData)
          const res = await fetch(`/api/pages/${pageId}`);
          if (!res.ok) {
            setError(res.status === 404 ? 'Page not found.' : 'Something went wrong.');
            return;
          }
          const data: PublicPageData = await res.json();
          setPage(data);
        }
      } catch {
        setError('Failed to load page. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [pageId]);

  const handleUnlock = async () => {
    if (!pageId) return;
    setUnlocked(true);

    try {
      const memoriesQuery = query(
        collection(db, 'pages', pageId, 'memories'),
        orderBy('order', 'asc')
      );
      const snap = await getDocs(memoriesQuery);
      const mems: Memory[] = snap.docs.map((d) => ({
        memoryId: d.id,
        ...d.data(),
      } as Memory));
      setMemories(mems);

      // Fetch full page content directly from Firestore
      const pageRef = doc(db, 'pages', pageId);
      const pageSnap = await getDoc(pageRef);
      if (pageSnap.exists()) {
        const raw = pageSnap.data();
        const publicData: PublicPageData = {
          pageId,
          recipientName: raw.recipientName,
          relationWord: raw.relationWord,
          theme: raw.theme,
          salutation: raw.salutation,
          letterParagraphs: raw.letterParagraphs ?? [],
          signOff: raw.signOff,
          countdownTargetDate: raw.countdownTargetDate ?? null,
          countdownCaption: raw.countdownCaption,
          reasons: raw.reasons ?? [],
          pressMessages: raw.pressMessages ?? [],
          songUrl: raw.songUrl ?? null,
          locked: false,
          createdAt: raw.createdAt?.toMillis?.() ?? raw.createdAt ?? null,
        };
        setPage(publicData);
      }
    } catch {
      // Silent fail — page is already displayed
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #fdf3f0, #f4dde2)' }}
      >
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full mx-auto mb-4"
            style={{
              border: '2px solid #8a2f4c',
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ color: '#8a2f4c', fontFamily: 'Karla, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
            OPENING YOUR PAGE...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: 'linear-gradient(160deg, #fdf3f0, #f4dde2)' }}
      >
        <div className="text-center max-w-sm">
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.5rem',
              color: '#3a1f2b',
              marginBottom: '8px',
            }}
          >
            {error || 'Page not found.'}
          </p>
          <p style={{ color: '#5a3545', fontFamily: 'Karla, sans-serif', fontSize: '0.9rem', opacity: 0.7 }}>
            The link may be wrong or the page may have been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg, #fdf3f0 0%, #f4dde2 100%)' }}
    >
      {/* Ambient background blobs */}
      <BackgroundMesh />

      {/* Password gate — shown before all content if locked */}
      <AnimatePresence>
        {page.locked && !unlocked && (
          <PasswordGate
            pageId={page.pageId}
            recipientName={page.recipientName}
            onUnlock={handleUnlock}
          />
        )}
      </AnimatePresence>

      {/* Main content — only shown when unlocked */}
      {(!page.locked || unlocked) && page.relationWord && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Section 1: Hero */}
          <Hero
            recipientName={page.recipientName}
            relationWord={page.relationWord}
          />

          {/* Section 2: Countdown — only if target date exists */}
          {page.countdownTargetDate && (
            <Countdown
              targetDate={page.countdownTargetDate}
              caption={page.countdownCaption || 'until the day we finally meet again.'}
              theme={page.theme}
              createdAt={page.createdAt ?? undefined}
            />
          )}

          {/* Sections 3 + 4: Envelope → Letter */}
          <SealedEnvelope
            salutation={page.salutation || `My ${page.relationWord} ${page.recipientName},`}
            letterParagraphs={page.letterParagraphs ?? []}
            signOff={page.signOff || 'With all my love,'}
          />

          {/* Section 5: Reasons */}
          <ReasonGenerator reasons={page.reasons ?? []} />

          {/* Section 6: Photo Archive */}
          <PolaroidArchive memories={memories} />

          {/* Section 7: Video Moments */}
          <VideoMoments memories={memories} />

          {/* Section 8: Press Reveal */}
          <PressReveal pressMessages={page.pressMessages ?? []} />

          {/* Section 9: Closing */}
          <ClosingSignature recipientName={page.recipientName} />
        </div>
      )}

      {/* Floating music player */}
      {(!page.locked || unlocked) && <MusicPlayer songUrl={page.songUrl ?? null} />}
    </main>
  );
}
