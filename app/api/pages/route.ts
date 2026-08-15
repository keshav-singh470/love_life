import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { hashPassword } from '@/lib/hash';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { PageData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      recipientName,
      relationWord,
      theme,
      salutation,
      letterParagraphs,
      signOff,
      countdownTargetDate,
      countdownCaption,
      reasons,
      pressMessages,
      songUrl,
      password,
    } = body;

    // Validate required fields
    if (!recipientName || !recipientName.trim()) {
      return NextResponse.json({ error: 'recipientName is required' }, { status: 400 });
    }

    const pageId = uuidv4();

    // Hash password server-side if provided — NEVER store plaintext
    let passwordHash: string | null = null;
    if (password && password.trim().length > 0) {
      passwordHash = await hashPassword(password.trim());
    }

    const pageData: Omit<PageData, 'pageId' | 'createdAt'> & { createdAt: any } = {
      recipientName: recipientName.trim(),
      relationWord: (relationWord || 'love').trim(),
      theme: theme || 'love',
      salutation: (salutation || `My ${relationWord || 'love'} ${recipientName},`).trim(),
      letterParagraphs: Array.isArray(letterParagraphs) ? letterParagraphs.filter(Boolean) : [],
      signOff: (signOff || 'With all my love,').trim(),
      countdownTargetDate: countdownTargetDate ? new Date(countdownTargetDate).getTime() : null,
      countdownCaption: (countdownCaption || 'until the day we finally meet again.').trim(),
      reasons: Array.isArray(reasons) ? reasons.filter(Boolean) : [],
      pressMessages: Array.isArray(pressMessages) ? pressMessages.filter(Boolean) : [],
      songUrl: songUrl || null,
      passwordHash,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(collection(db, 'pages'), pageId), pageData);

    return NextResponse.json({ pageId }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/pages] Error:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
