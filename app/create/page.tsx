'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import { PRESET_SONGS, THEME_ACCENTS } from '@/lib/constants';
import { CreateFormState, Theme, UploadedFile } from '@/types';

const TOTAL_STEPS = 10;

const STEP_LABELS = [
  'Who is this for?',
  'Write the letter',
  'Countdown',
  'Reasons',
  'Press messages',
  'Photos',
  'Videos',
  'Music',
  'Password',
  'Review & Publish',
];

const DEFAULT_FORM: CreateFormState = {
  recipientName: '',
  relationWord: 'love',
  theme: 'love',
  salutation: '',
  letterParagraphs: [''],
  signOff: 'With all my love,',
  hasCountdown: false,
  countdownTargetDate: '',
  countdownCaption: 'until the day we finally meet again.',
  reasons: [''],
  pressMessages: [''],
  songChoice: 'preset1',
  customSongFile: null,
  password: '',
  photos: [],
  videos: [],
};

// ── Step 1: Recipient Info ────────────────────────────────────
function StepRecipient({ form, setForm }: { form: CreateFormState; setForm: React.Dispatch<React.SetStateAction<CreateFormState>> }) {
  return (
    <div className="space-y-5">
      <FormField label="Their name">
        <input
          type="text"
          value={form.recipientName}
          onChange={(e) => setForm((f) => ({ ...f, recipientName: e.target.value }))}
          placeholder="e.g. Anjali"
          className="form-input"
        />
      </FormField>

      <FormField label="How do you call them?">
        <input
          type="text"
          value={form.relationWord}
          onChange={(e) => setForm((f) => ({ ...f, relationWord: e.target.value }))}
          placeholder="e.g. baby girl, love, best friend"
          className="form-input"
        />
      </FormField>

      <FormField label="Page theme">
        <div className="grid grid-cols-2 gap-3">
          {(['love', 'birthday', 'anniversary', 'friendship'] as Theme[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm((f) => ({ ...f, theme: t }))}
              className="py-3 px-4 rounded-xl text-sm font-medium transition-all"
              style={{
                fontFamily: 'Karla, sans-serif',
                background: form.theme === t ? `linear-gradient(135deg, ${THEME_ACCENTS[t].primary}, ${THEME_ACCENTS[t].secondary})` : 'rgba(255,250,246,0.6)',
                color: form.theme === t ? '#fffaf6' : '#3a1f2b',
                border: `1.5px solid ${form.theme === t ? 'transparent' : 'rgba(138,47,76,0.15)'}`,
                cursor: 'pointer',
              }}
            >
              {THEME_ACCENTS[t].label}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="Salutation (optional)">
        <input
          type="text"
          value={form.salutation}
          onChange={(e) => setForm((f) => ({ ...f, salutation: e.target.value }))}
          placeholder={`My ${form.relationWord || 'love'} ${form.recipientName || 'name'},`}
          className="form-input"
        />
      </FormField>
    </div>
  );
}

// ── Step 2: Letter ────────────────────────────────────────────
function StepLetter({ form, setForm }: { form: CreateFormState; setForm: React.Dispatch<React.SetStateAction<CreateFormState>> }) {
  const updatePara = (i: number, val: string) => {
    const updated = [...form.letterParagraphs];
    updated[i] = val;
    setForm((f) => ({ ...f, letterParagraphs: updated }));
  };

  const addPara = () => setForm((f) => ({ ...f, letterParagraphs: [...f.letterParagraphs, ''] }));
  const removePara = (i: number) => setForm((f) => ({ ...f, letterParagraphs: f.letterParagraphs.filter((_, j) => j !== i) }));

  return (
    <div className="space-y-5">
      {form.letterParagraphs.map((para, i) => (
        <div key={i} className="relative">
          <label className="form-label">Paragraph {i + 1}</label>
          <textarea
            value={para}
            onChange={(e) => updatePara(i, e.target.value)}
            rows={4}
            placeholder="Write from the heart..."
            className="form-input resize-none w-full"
          />
          {form.letterParagraphs.length > 1 && (
            <button
              type="button"
              onClick={() => removePara(i)}
              className="absolute top-8 right-3 text-xs opacity-40 hover:opacity-80"
              style={{ color: '#8a2f4c', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ✕ remove
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addPara} className="text-sm" style={{ color: '#8a2f4c', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Karla, sans-serif' }}>
        + Add another paragraph
      </button>

      <FormField label="Sign-off">
        <input
          type="text"
          value={form.signOff}
          onChange={(e) => setForm((f) => ({ ...f, signOff: e.target.value }))}
          placeholder="With all my love,"
          className="form-input"
        />
      </FormField>
    </div>
  );
}

// ── Step 3: Countdown ─────────────────────────────────────────
function StepCountdown({ form, setForm }: { form: CreateFormState; setForm: React.Dispatch<React.SetStateAction<CreateFormState>> }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <input
          id="has-countdown"
          type="checkbox"
          checked={form.hasCountdown}
          onChange={(e) => setForm((f) => ({ ...f, hasCountdown: e.target.checked }))}
          className="w-4 h-4"
          style={{ accentColor: '#8a2f4c' }}
        />
        <label htmlFor="has-countdown" className="form-label" style={{ margin: 0 }}>
          Include a live countdown section
        </label>
      </div>

      {form.hasCountdown && (
        <>
          <FormField label="Target date">
            <input
              type="datetime-local"
              value={form.countdownTargetDate}
              onChange={(e) => setForm((f) => ({ ...f, countdownTargetDate: e.target.value }))}
              className="form-input"
            />
          </FormField>

          <FormField label="Caption under countdown">
            <input
              type="text"
              value={form.countdownCaption}
              onChange={(e) => setForm((f) => ({ ...f, countdownCaption: e.target.value }))}
              placeholder="until the day we finally meet again."
              className="form-input"
            />
          </FormField>
        </>
      )}
    </div>
  );
}

// ── Step 4: Reasons ───────────────────────────────────────────
function StepReasons({ form, setForm }: { form: CreateFormState; setForm: React.Dispatch<React.SetStateAction<CreateFormState>> }) {
  const update = (i: number, val: string) => {
    const updated = [...form.reasons];
    updated[i] = val;
    setForm((f) => ({ ...f, reasons: updated }));
  };
  const add = () => setForm((f) => ({ ...f, reasons: [...f.reasons, ''] }));
  const remove = (i: number) => setForm((f) => ({ ...f, reasons: f.reasons.filter((_, j) => j !== i) }));

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: '#5a3545', fontFamily: 'Karla, sans-serif' }}>
        Add reasons why you love them — shown one at a time with a button to reveal the next.
      </p>
      {form.reasons.map((r, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={r}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Reason ${i + 1}…`}
            className="form-input flex-1"
          />
          {form.reasons.length > 1 && (
            <button type="button" onClick={() => remove(i)} style={{ color: '#8a2f4c', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          )}
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm" style={{ color: '#8a2f4c', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Karla, sans-serif' }}>
        + Add reason
      </button>
    </div>
  );
}

// ── Step 5: Press Messages ────────────────────────────────────
function StepPressMessages({ form, setForm }: { form: CreateFormState; setForm: React.Dispatch<React.SetStateAction<CreateFormState>> }) {
  const update = (i: number, val: string) => {
    const updated = [...form.pressMessages];
    updated[i] = val;
    setForm((f) => ({ ...f, pressMessages: updated }));
  };
  const add = () => setForm((f) => ({ ...f, pressMessages: [...f.pressMessages, ''] }));
  const remove = (i: number) => setForm((f) => ({ ...f, pressMessages: f.pressMessages.filter((_, j) => j !== i) }));

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: '#5a3545', fontFamily: 'Karla, sans-serif' }}>
        Sweet messages that appear when they press the heart button — shown randomly.
      </p>
      {form.pressMessages.map((m, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={m}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Message ${i + 1}…`}
            className="form-input flex-1"
          />
          {form.pressMessages.length > 1 && (
            <button type="button" onClick={() => remove(i)} style={{ color: '#8a2f4c', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          )}
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm" style={{ color: '#8a2f4c', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Karla, sans-serif' }}>
        + Add message
      </button>
    </div>
  );
}

// ── Step 6: Photos ────────────────────────────────────────────
function StepPhotos({ form, setForm }: { form: CreateFormState; setForm: React.Dispatch<React.SetStateAction<CreateFormState>> }) {
  const onDrop = useCallback((accepted: File[]) => {
    const newFiles: UploadedFile[] = accepted.map((f) => ({
      file: f,
      caption: '',
      previewUrl: URL.createObjectURL(f),
    }));
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles] }));
  }, [setForm]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const updateCaption = (i: number, caption: string) => {
    const updated = [...form.photos];
    updated[i] = { ...updated[i], caption };
    setForm((f) => ({ ...f, photos: updated }));
  };

  const remove = (i: number) => setForm((f) => ({ ...f, photos: f.photos.filter((_, j) => j !== i) }));

  return (
    <div className="space-y-5">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
        style={{
          borderColor: isDragActive ? '#8a2f4c' : 'rgba(138,47,76,0.25)',
          background: isDragActive ? 'rgba(138,47,76,0.05)' : 'rgba(255,250,246,0.5)',
        }}
      >
        <input {...getInputProps()} />
        <p style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545', fontSize: '0.9rem' }}>
          {isDragActive ? 'Drop your photos here…' : 'Drag & drop photos, or tap to select'}
        </p>
        <p style={{ fontFamily: 'Karla, sans-serif', color: '#8a2f4c', fontSize: '0.75rem', marginTop: '4px', opacity: 0.7 }}>
          JPG, PNG, WEBP accepted
        </p>
      </div>

      {form.photos.length > 0 && (
        <div className="space-y-3">
          {form.photos.map((photo, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-xl" style={{ background: 'rgba(255,250,246,0.7)', border: '1px solid rgba(138,47,76,0.1)' }}>
              <img src={photo.previewUrl} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate mb-2" style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545' }}>{photo.file.name}</p>
                <input
                  type="text"
                  value={photo.caption}
                  onChange={(e) => updateCaption(i, e.target.value)}
                  placeholder="Caption (optional)"
                  className="form-input text-sm w-full"
                  style={{ padding: '6px 10px' }}
                />
              </div>
              <button type="button" onClick={() => remove(i)} style={{ color: '#8a2f4c', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Step 7: Videos ────────────────────────────────────────────
function StepVideos({ form, setForm }: { form: CreateFormState; setForm: React.Dispatch<React.SetStateAction<CreateFormState>> }) {
  const MAX_VIDEOS = 6;

  const onDrop = useCallback((accepted: File[]) => {
    const remaining = MAX_VIDEOS - form.videos.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_VIDEOS} videos allowed.`);
      return;
    }
    const toAdd = accepted.slice(0, remaining);
    const largFiles = toAdd.filter((f) => f.size > 100 * 1024 * 1024);
    if (largFiles.length > 0) {
      toast(`Heads up: ${largFiles.length} video(s) are over 100MB — uploads may be slow.`, { icon: '⚠️' });
    }
    const newFiles: UploadedFile[] = toAdd.map((f) => ({
      file: f,
      caption: '',
      previewUrl: URL.createObjectURL(f),
    }));
    setForm((prev) => ({ ...prev, videos: [...prev.videos, ...newFiles] }));
  }, [form.videos.length, setForm]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    multiple: true,
  });

  const updateCaption = (i: number, caption: string) => {
    const updated = [...form.videos];
    updated[i] = { ...updated[i], caption };
    setForm((f) => ({ ...f, videos: updated }));
  };

  const remove = (i: number) => setForm((f) => ({ ...f, videos: f.videos.filter((_, j) => j !== i) }));

  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545' }}>
        Up to {MAX_VIDEOS} videos. Portrait (9:16) works best. They play inline — no autoplay.
      </p>

      {form.videos.length < MAX_VIDEOS && (
        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
          style={{
            borderColor: isDragActive ? '#8a2f4c' : 'rgba(138,47,76,0.25)',
            background: isDragActive ? 'rgba(138,47,76,0.05)' : 'rgba(255,250,246,0.5)',
          }}
        >
          <input {...getInputProps()} />
          <p style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545', fontSize: '0.9rem' }}>
            {isDragActive ? 'Drop videos here…' : `Drag & drop videos (${form.videos.length}/${MAX_VIDEOS})`}
          </p>
        </div>
      )}

      {form.videos.length > 0 && (
        <div className="space-y-3">
          {form.videos.map((video, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-xl" style={{ background: 'rgba(255,250,246,0.7)', border: '1px solid rgba(138,47,76,0.1)' }}>
              <div className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: '#1a0a10' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M5 3l9 5-9 5V3z" fill="rgba(255,250,246,0.7)" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate mb-2" style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545' }}>
                  {video.file.name} ({(video.file.size / 1024 / 1024).toFixed(1)} MB)
                </p>
                <input
                  type="text"
                  value={video.caption}
                  onChange={(e) => updateCaption(i, e.target.value)}
                  placeholder="Caption (optional)"
                  className="form-input text-sm w-full"
                  style={{ padding: '6px 10px' }}
                />
              </div>
              <button type="button" onClick={() => remove(i)} style={{ color: '#8a2f4c', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Step 8: Music ─────────────────────────────────────────────
function StepMusic({ form, setForm }: { form: CreateFormState; setForm: React.Dispatch<React.SetStateAction<CreateFormState>> }) {
  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545' }}>
        Choose a preset track or upload your own song. It plays in a floating player at the bottom.
      </p>

      <div className="space-y-2">
        {PRESET_SONGS.map((song) => (
          <button
            key={song.id}
            type="button"
            onClick={() => setForm((f) => ({ ...f, songChoice: song.id as CreateFormState['songChoice'] }))}
            className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all"
            style={{
              background: form.songChoice === song.id ? 'rgba(138,47,76,0.08)' : 'rgba(255,250,246,0.5)',
              border: `1.5px solid ${form.songChoice === song.id ? '#8a2f4c' : 'rgba(138,47,76,0.15)'}`,
              cursor: 'pointer',
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: form.songChoice === song.id ? '#8a2f4c' : 'rgba(138,47,76,0.15)' }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 1.5l7 3.5-7 3.5V1.5z" fill={form.songChoice === song.id ? '#fffaf6' : '#8a2f4c'} />
              </svg>
            </div>
            <span style={{ fontFamily: 'Karla, sans-serif', color: '#3a1f2b', fontSize: '0.9rem' }}>{song.label}</span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setForm((f) => ({ ...f, songChoice: 'custom' }))}
          className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all"
          style={{
            background: form.songChoice === 'custom' ? 'rgba(138,47,76,0.08)' : 'rgba(255,250,246,0.5)',
            border: `1.5px solid ${form.songChoice === 'custom' ? '#8a2f4c' : 'rgba(138,47,76,0.15)'}`,
            cursor: 'pointer',
          }}
        >
          <span style={{ fontFamily: 'Karla, sans-serif', color: '#3a1f2b', fontSize: '0.9rem' }}>Upload your own song</span>
        </button>
      </div>

      {form.songChoice === 'custom' && (
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setForm((prev) => ({ ...prev, customSongFile: f }));
          }}
          className="form-input text-sm"
        />
      )}
    </div>
  );
}

// ── Step 9: Password ──────────────────────────────────────────
function StepPassword({ form, setForm }: { form: CreateFormState; setForm: React.Dispatch<React.SetStateAction<CreateFormState>> }) {
  return (
    <div className="space-y-5">
      <p className="text-sm" style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545', lineHeight: 1.6 }}>
        Optionally protect the page with a password. Only someone with the password can open it.
        Leave blank to make the page public.
      </p>
      <FormField label="Password (optional)">
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          placeholder="Leave blank for a public page"
          className="form-input"
          autoComplete="new-password"
        />
      </FormField>
      {form.password && (
        <p className="text-xs" style={{ color: '#8a2f4c', fontFamily: 'Karla, sans-serif' }}>
          ✓ Page will be password protected. Share the password separately with your person.
        </p>
      )}
    </div>
  );
}

// ── Step 10: Review ───────────────────────────────────────────
function StepReview({ form }: { form: CreateFormState }) {
  const items = [
    ['For', form.recipientName || '(not set)'],
    ['Theme', form.theme],
    ['Letter paragraphs', String(form.letterParagraphs.filter(Boolean).length)],
    ['Countdown', form.hasCountdown ? form.countdownTargetDate : 'Off'],
    ['Reasons', String(form.reasons.filter(Boolean).length)],
    ['Press messages', String(form.pressMessages.filter(Boolean).length)],
    ['Photos', String(form.photos.length)],
    ['Videos', String(form.videos.length)],
    ['Music', form.songChoice === 'custom' ? (form.customSongFile?.name ?? 'None') : form.songChoice],
    ['Password', form.password ? 'Set ✓' : 'None (public)'],
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm mb-4" style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545' }}>
        Everything looks good? Hit Publish to create your page.
      </p>
      {items.map(([label, val]) => (
        <div key={label} className="flex justify-between py-2" style={{ borderBottom: '1px solid rgba(138,47,76,0.08)' }}>
          <span className="text-sm" style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545' }}>{label}</span>
          <span className="text-sm font-medium" style={{ fontFamily: 'Karla, sans-serif', color: '#3a1f2b' }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

// ── Shared form field wrapper ─────────────────────────────────
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

// ── Image compression helper ──────────────────────────────────
async function compressImage(file: File): Promise<File> {
  // Skip if already small enough
  if (file.size < 400 * 1024) return file;
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.8,          // max 800KB
      maxWidthOrHeight: 1920,  // max 1920px side
      useWebWorker: true,
      fileType: 'image/webp',  // webp = smaller than jpeg
    });
  } catch {
    return file; // fallback to original on error
  }
}

// ── Upload helper with timeout and logs ──────────────────────
async function uploadFile(
  file: File,
  path: string, // Kept for signature compatibility; Cloudinary uses its own naming
  log?: (msg: string) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    log?.(`[Cloudinary] Starting upload of ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      const err = new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
      log?.(`[Cloudinary] ERROR: ${err.message}`);
      return reject(err);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);

    // Set 90-second timeout to prevent silent hang
    const timer = setTimeout(() => {
      xhr.abort();
      const timeoutErr = new Error(`Upload timed out for ${file.name} after 90 seconds.`);
      log?.(`[Cloudinary] ERROR: ${timeoutErr.message}`);
      reject(timeoutErr);
    }, 90000);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        log?.(`[Cloudinary] Uploading ${file.name}: ${pct}% (${(e.loaded / 1024).toFixed(1)} KB / ${(e.total / 1024).toFixed(1)} KB)`);
      }
    };

    xhr.onload = () => {
      clearTimeout(timer);
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        log?.(`[Cloudinary] Upload success for ${file.name}! Got URL: ${res.secure_url.substring(0, 50)}...`);
        resolve(res.secure_url);
      } else {
        const err = new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`);
        log?.(`[Cloudinary] ERROR: ${err.message}`);
        reject(err);
      }
    };

    xhr.onerror = () => {
      clearTimeout(timer);
      const err = new Error('Network error during upload');
      log?.(`[Cloudinary] ERROR: ${err.message}`);
      reject(err);
    };

    xhr.send(formData);
  });
}

// ── Main builder component ────────────────────────────────────
export default function CreatePage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreateFormState>(DEFAULT_FORM);
  const [publishing, setPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLabel, setUploadLabel] = useState('');
  const [donePageId, setDonePageId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const progressRef = useRef(0);

  // ── Smooth animated progress while publishing ──
  // Firebase doesn't fire progress events for small/fast uploads.
  // We simulate smooth forward progress (easing toward 85%) instead.
  useEffect(() => {
    if (!publishing) return;
    progressRef.current = 0;
    setUploadProgress(0);

    const tick = setInterval(() => {
      progressRef.current = progressRef.current + (85 - progressRef.current) * 0.06;
      setUploadProgress(Math.round(progressRef.current));
    }, 250);

    return () => clearInterval(tick);
  }, [publishing]);

  const canGoNext = () => {
    if (step === 0) return form.recipientName.trim().length > 0;
    return true;
  };

  const handlePublish = async () => {
    if (publishing) return;
    setPublishing(true);
    setUploadLabel('Compressing photos…');
    setDebugLogs([]);

    const logsArray: string[] = [];
    const log = (msg: string) => {
      const formatted = `[${new Date().toLocaleTimeString()}] ${msg}`;
      logsArray.push(formatted);
      setDebugLogs([...logsArray]);
      console.log(formatted);
    };

    log('🚀 Starting publish process...');
    log(`Recipient name: "${form.recipientName}"`);
    log(`Selected theme: "${form.theme}"`);
    log(`Files metadata: ${form.photos.length} photo(s), ${form.videos.length} video(s), song: "${form.songChoice}"`);

    const toastId = toast.loading('Preparing your page…');

    try {
      // Step 1: Compress photos client-side (parallel)
      log('Step 1: Compressing photos client-side...');
      const compressedPhotos = await Promise.all(
        form.photos.map(async (p, i) => {
          log(`Compressing photo ${i + 1}/${form.photos.length}: ${p.file.name}...`);
          const comp = await compressImage(p.file);
          log(`Compressed photo ${i + 1}: ${(p.file.size / 1024).toFixed(1)} KB -> ${(comp.size / 1024).toFixed(1)} KB`);
          return comp;
        })
      );
      log('All photos compressed successfully.');

      setUploadLabel('Uploading everything…');
      toast.loading('Uploading…', { id: toastId });

      // Step 2: Upload photos + videos + song ALL at once (parallel)
      log('Step 2: Uploading all assets (photos, videos, songs) to storage...');
      const [uploadedPhotos, uploadedVideos, songUrl] = await Promise.all([
        Promise.all(
          compressedPhotos.map((compressed, i) =>
            uploadFile(compressed, `memories/${uuidv4()}/photo_${i}.webp`, log)
              .then((url) => ({ url, caption: form.photos[i].caption, order: i }))
          )
        ),
        Promise.all(
          form.videos.map((v, i) =>
            uploadFile(v.file, `memories/${uuidv4()}/video_${i}`, log)
              .then((url) => ({ url, caption: v.caption, order: i }))
          )
        ),
        (async () => {
          if (form.songChoice === 'custom' && form.customSongFile) {
            log('Uploading custom song file...');
            return uploadFile(form.customSongFile, `songs/${uuidv4()}`, log);
          } else if (form.songChoice !== 'custom') {
            const preset = PRESET_SONGS.find((s) => s.id === form.songChoice)?.file ?? null;
            log(`Using preset song: ${form.songChoice}`);
            return preset;
          }
          log('No song upload needed.');
          return null;
        })(),
      ]);

      log('All assets successfully uploaded to storage.');

      // Step 3: Snap progress to 100 now that uploads are done
      setUploadProgress(100);
      setUploadLabel('Saving page…');
      toast.loading('Saving your page…', { id: toastId });

      // Step 4: Create page via API
      log('Step 3: Creating page in database via backend API (/api/pages)...');
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: form.recipientName,
          relationWord: form.relationWord,
          theme: form.theme,
          salutation: form.salutation || `My ${form.relationWord} ${form.recipientName},`,
          letterParagraphs: form.letterParagraphs.filter(Boolean),
          signOff: form.signOff,
          countdownTargetDate: form.hasCountdown && form.countdownTargetDate ? form.countdownTargetDate : null,
          countdownCaption: form.countdownCaption,
          reasons: form.reasons.filter(Boolean),
          pressMessages: form.pressMessages.filter(Boolean),
          songUrl: songUrl ?? null,
          password: form.password || '',
        }),
      });

      log(`Backend API response code: ${res.status}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend creation failed: ${res.status} - ${errorText}`);
      }
      const { pageId } = await res.json();
      log(`Database page record created! ID: ${pageId}`);

      // Step 5: Write memories to Firestore in parallel
      log('Step 4: Linking uploaded memories to Firestore database collections...');
      const allMemories = [
        ...uploadedPhotos.map((p, i) => ({ ...p, type: 'photo', order: i })),
        ...uploadedVideos.map((v, i) => ({ ...v, type: 'video', order: uploadedPhotos.length + i })),
      ];
      await Promise.all(
        allMemories.map(async (mem, index) => {
          const memId = uuidv4();
          log(`Saving memory link ${index + 1}/${allMemories.length} to Firestore...`);
          await setDoc(doc(collection(db, 'pages', pageId, 'memories'), memId), { ...mem, memoryId: memId });
        })
      );

      log('🎉 SUCCESS: Page publish complete!');
      toast.success('Your page is live! ✓', { id: toastId });
      setDonePageId(pageId);
    } catch (err: any) {
      log(`❌ FAILED: ${err.message || err}`);
      console.error(err);
      toast.error(`Error: ${err.message || 'Something went wrong. Please check diagnostic logs.'}`, { id: toastId });
    } finally {
      setPublishing(false);
      setUploadProgress(0);
      setUploadLabel('');
    }
  };

  const pageUrl = donePageId ? `${window.location.origin}/p/${donePageId}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Published success screen ──
  if (donePageId) {
    // Generate floating 3D love shapes
    const loveShapes = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'rose' : 'star',
      left: `${Math.random() * 100}%`,
      size: 16 + Math.random() * 28,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 10,
      rotate: Math.random() * 360,
      opacity: 0.15 + Math.random() * 0.55,
    }));

    return (
      <main
        className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a0510 0%, #2d0a1a 40%, #1a0a10 100%)' }}
      >
        {/* 3D floating love shapes */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden>
          {loveShapes.map((s) => (
            <div
              key={s.id}
              className="absolute love-float"
              style={{
                left: s.left,
                bottom: '-60px',
                fontSize: `${s.size}px`,
                opacity: s.opacity,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
                filter: 'drop-shadow(0 0 6px rgba(255,100,130,0.6))',
                transform: `rotate(${s.rotate}deg)`,
              }}
            >
              {s.type === 'heart' ? '❤️' : s.type === 'rose' ? '🌹' : '⭐'}
            </div>
          ))}
        </div>

        {/* Glowing orbs */}
        <div className="fixed inset-0 pointer-events-none" aria-hidden>
          <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(138,47,76,0.35) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'orbPulse 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,151,63,0.25) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'orbPulse 10s ease-in-out 2s infinite' }} />
          <div style={{ position: 'absolute', top: '60%', left: '50%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,60,100,0.2) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'orbPulse 12s ease-in-out 4s infinite' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md text-center relative z-10"
        >
          {/* Glassmorphism card */}
          <div style={{
            background: 'rgba(255,250,246,0.07)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,200,200,0.15)',
            borderRadius: '28px',
            padding: '48px 36px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}>
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              style={{ fontSize: '3.5rem', marginBottom: '24px', display: 'block' }}
            >
              🌹
            </motion.div>

            <h1
              className="mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.4rem',
                color: '#fffaf6',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                textShadow: '0 0 40px rgba(255,150,170,0.4)',
              }}
            >
              Your page is live!
            </h1>
            <p className="mb-8 text-sm" style={{ fontFamily: 'Karla, sans-serif', color: 'rgba(255,240,245,0.75)', lineHeight: 1.8 }}>
              Share this link with <strong style={{ color: '#ffb3c8' }}>{form.recipientName}</strong>. It&apos;s their little corner of the internet. 💕
            </p>

            <div
              className="flex items-center gap-2 p-4 rounded-2xl mb-5"
              style={{
                background: 'rgba(255,250,246,0.06)',
                border: '1px solid rgba(255,200,215,0.2)',
              }}
            >
              <p className="flex-1 text-sm truncate" style={{ fontFamily: 'Karla, sans-serif', color: 'rgba(255,240,245,0.85)' }}>{pageUrl}</p>
              <button
                onClick={copyLink}
                className="px-4 py-2 rounded-xl text-xs font-medium flex-shrink-0 transition-all"
                style={{
                  background: copied ? 'rgba(74,180,140,0.85)' : 'rgba(138,47,76,0.85)',
                  color: '#fffaf6',
                  border: copied ? '1px solid rgba(74,180,140,0.4)' : '1px solid rgba(255,100,130,0.3)',
                  cursor: 'pointer',
                  fontFamily: 'Karla, sans-serif',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>

            <a href={pageUrl} target="_blank" rel="noopener noreferrer">
              <button
                className="w-full py-4 rounded-2xl font-medium"
                style={{
                  background: 'linear-gradient(135deg, #8a2f4c, #c9973f)',
                  color: '#fffaf6',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Karla, sans-serif',
                  letterSpacing: '0.05em',
                  fontSize: '0.95rem',
                  boxShadow: '0 8px 32px rgba(138,47,76,0.5), 0 0 0 1px rgba(255,150,170,0.1)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                Preview the Page →
              </button>
            </a>
          </div>
        </motion.div>

        <style>{`
          @keyframes loveFloat {
            0% { transform: translateY(0) rotate(0deg) scale(1); opacity: var(--op, 0.4); }
            25% { transform: translateY(-25vh) rotate(15deg) scale(1.1); }
            50% { transform: translateY(-55vh) rotate(-10deg) scale(0.95); }
            75% { transform: translateY(-80vh) rotate(20deg) scale(1.05); }
            100% { transform: translateY(-110vh) rotate(5deg) scale(0.8); opacity: 0; }
          }
          @keyframes orbPulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.3); opacity: 1; }
          }
          .love-float {
            animation: loveFloat linear infinite;
            will-change: transform, opacity;
          }
        `}</style>
      </main>
    );
  }

  const steps = [
    <StepRecipient key={0} form={form} setForm={setForm} />,
    <StepLetter key={1} form={form} setForm={setForm} />,
    <StepCountdown key={2} form={form} setForm={setForm} />,
    <StepReasons key={3} form={form} setForm={setForm} />,
    <StepPressMessages key={4} form={form} setForm={setForm} />,
    <StepPhotos key={5} form={form} setForm={setForm} />,
    <StepVideos key={6} form={form} setForm={setForm} />,
    <StepMusic key={7} form={form} setForm={setForm} />,
    <StepPassword key={8} form={form} setForm={setForm} />,
    <StepReview key={9} form={form} />,
  ];

  return (
    <main
      className="min-h-screen px-4 py-10 md:py-16"
      style={{ background: 'linear-gradient(160deg, #fdf3f0, #f4dde2)' }}
    >
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p
            style={{ fontFamily: "'Petit Formal Script', cursive", fontSize: '2rem', color: '#3a1f2b' }}
          >
            Apna Pal
          </p>
          <p className="mt-1 text-sm" style={{ color: '#5a3545', fontFamily: 'Karla, sans-serif' }}>
            Build something beautiful for them
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-xs" style={{ fontFamily: 'Karla, sans-serif', color: '#8a2f4c' }}>
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <span className="text-xs" style={{ fontFamily: 'Karla, sans-serif', color: '#5a3545' }}>
              {STEP_LABELS[step]}
            </span>
          </div>
          <div className="w-full h-1 rounded-full" style={{ background: 'rgba(138,47,76,0.12)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #8a2f4c, #c9973f)' }}
              animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Step card */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-6"
          style={{
            background: 'rgba(255,250,246,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(138,47,76,0.1)',
            boxShadow: '0 8px 32px rgba(138,47,76,0.08)',
          }}
        >
          <h2
            className="mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.6rem',
              color: '#3a1f2b',
              fontWeight: 500,
            }}
          >
            {STEP_LABELS[step]}
          </h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{
                background: 'rgba(255,250,246,0.8)',
                border: '1.5px solid rgba(138,47,76,0.2)',
                color: '#3a1f2b',
                fontFamily: 'Karla, sans-serif',
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
          )}

          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={() => {
                if (canGoNext()) setStep((s) => s + 1);
                else toast.error('Please fill in the required field.');
              }}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: canGoNext() ? 'linear-gradient(135deg, #8a2f4c, #a03560)' : 'rgba(138,47,76,0.3)',
                color: '#fffaf6',
                fontFamily: 'Karla, sans-serif',
                border: 'none',
                cursor: canGoNext() ? 'pointer' : 'not-allowed',
                boxShadow: canGoNext() ? '0 4px 16px rgba(138,47,76,0.22)' : 'none',
                letterSpacing: '0.04em',
              }}
            >
              Continue →
            </button>
          ) : publishing ? (
            /* ── Live Upload Progress Bar ── */
            <div
              className="flex-1 rounded-xl overflow-hidden relative"
              style={{
                background: 'rgba(138,47,76,0.15)',
                border: '1.5px solid rgba(138,47,76,0.3)',
                minHeight: '48px',
              }}
            >
              {/* Animated fill */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${uploadProgress}%`,
                  background: 'linear-gradient(135deg, #8a2f4c, #c9973f)',
                  transition: 'width 0.3s ease',
                  borderRadius: 'inherit',
                }}
              />
              {/* Label */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '48px',
                  gap: '8px',
                  fontFamily: 'Karla, sans-serif',
                  fontSize: '0.88rem',
                  color: '#fffaf6',
                  letterSpacing: '0.04em',
                }}
              >
                <span style={{ opacity: 0.9 }}>
                  {uploadLabel || 'Preparing…'}
                </span>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                    {uploadProgress}%
                  </span>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{
                background: 'linear-gradient(135deg, #8a2f4c, #c9973f)',
                color: '#fffaf6',
                fontFamily: 'Karla, sans-serif',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(138,47,76,0.25)',
                letterSpacing: '0.04em',
              }}
            >
              ✨ Publish Page
            </button>
          )}
        </div>

        {/* Diagnostics Panel for tracing errors */}
        {debugLogs.length > 0 && (
          <div
            className="mt-6 rounded-xl p-4 text-xs font-mono text-left overflow-y-auto max-h-48"
            style={{
              background: 'rgba(26, 5, 16, 0.95)',
              color: '#4af0b2',
              border: '1.5px solid rgba(138, 47, 76, 0.3)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-white border-opacity-10">
              <span className="font-semibold text-pink-100">Upload Diagnostics Log</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(debugLogs.join('\n'));
                  toast.success('Logs copied!');
                }}
                className="px-2 py-0.5 rounded text-[10px]"
                style={{ background: '#8a2f4c', color: '#fffaf6', cursor: 'pointer', border: 'none' }}
              >
                Copy Logs
              </button>
            </div>
            {debugLogs.map((logStr, index) => (
              <div key={index} className="mb-1 leading-relaxed opacity-90">
                {logStr}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shared input styles via style tag */}
      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid rgba(138, 47, 76, 0.2);
          background: rgba(255, 250, 246, 0.8);
          color: #3a1f2b;
          font-family: 'Karla', sans-serif;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: #8a2f4c;
          outline: none;
        }
        .form-label {
          display: block;
          font-family: 'Karla', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: #5a3545;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
      `}</style>
    </main>
  );
}
