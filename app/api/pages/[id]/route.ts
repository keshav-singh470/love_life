import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { PublicPageData } from '@/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pageRef = doc(db, 'pages', id);
    const snap = await getDoc(pageRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const raw = snap.data();
    const isLocked = !!raw.passwordHash;

    // CRITICAL: NEVER send passwordHash to the client
    // If the page is locked, return only the locked flag + non-sensitive metadata
    if (isLocked) {
      const safeData: Partial<PublicPageData> = {
        pageId: id,
        recipientName: raw.recipientName,
        theme: raw.theme,
        locked: true,
        createdAt: raw.createdAt?.toMillis?.() ?? raw.createdAt ?? null,
      };
      return NextResponse.json(safeData);
    }

    // Unlocked page — send everything except passwordHash
    const publicData: PublicPageData = {
      pageId: id,
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

    return NextResponse.json(publicData);
  } catch (error) {
    console.error('[GET /api/pages/[id]] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
