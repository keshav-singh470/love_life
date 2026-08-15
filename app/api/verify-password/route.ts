import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { verifyPassword } from '@/lib/hash';

export async function POST(request: NextRequest) {
  try {
    const { pageId, password } = await request.json();

    if (!pageId || !password) {
      return NextResponse.json({ error: 'pageId and password are required' }, { status: 400 });
    }

    const pageRef = doc(db, 'pages', pageId);
    const snap = await getDoc(pageRef);

    if (!snap.exists()) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const { passwordHash } = snap.data();

    if (!passwordHash) {
      // Page has no password — treat as unlocked
      return NextResponse.json({ ok: true });
    }

    // Server-side comparison ONLY — never send hash to client
    const isCorrect = await verifyPassword(password, passwordHash);

    if (isCorrect) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ ok: false, error: 'Incorrect password' }, { status: 401 });
    }
  } catch (error) {
    console.error('[POST /api/verify-password] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
