// Apna Pal — Firestore + Storage + Auth Types
// This mirrors the Firestore data model exactly.

export type Theme = 'love' | 'birthday' | 'anniversary' | 'friendship';

export interface PageData {
  pageId: string;
  recipientName: string;
  relationWord: string;        // e.g. "baby girl", "love", "best friend"
  theme: Theme;
  salutation: string;          // e.g. "My baby girl Anjali,"
  letterParagraphs: string[];
  signOff: string;
  countdownTargetDate: number | null;  // Unix ms timestamp, null = hide
  countdownCaption: string;
  reasons: string[];
  pressMessages: string[];
  songUrl: string | null;
  passwordHash: string | null; // null = public; NEVER sent to client
  createdAt: number;
  locked?: boolean;            // client-only: true if passwordHash exists
}

export interface Memory {
  memoryId: string;
  type: 'photo' | 'video';
  url: string;
  caption: string;
  order: number;
}

// What we send to the client (no passwordHash)
export type PublicPageData = Omit<PageData, 'passwordHash'> & {
  locked: boolean;
};

// Form state used in /create
export interface CreateFormState {
  recipientName: string;
  relationWord: string;
  theme: Theme;
  salutation: string;
  letterParagraphs: string[];
  signOff: string;
  hasCountdown: boolean;
  countdownTargetDate: string; // ISO string in form, converted on save
  countdownCaption: string;
  reasons: string[];
  pressMessages: string[];
  songChoice: 'preset1' | 'preset2' | 'preset3' | 'preset4' | 'custom';
  customSongFile: File | null;
  password: string;
  photos: UploadedFile[];
  videos: UploadedFile[];
}

export interface UploadedFile {
  file: File;
  caption: string;
  previewUrl: string;
}
