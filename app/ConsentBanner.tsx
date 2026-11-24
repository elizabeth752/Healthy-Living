'use client';

import { useEffect, useState } from 'react';

/* ── Consent banner (elev8 HIPAA, Privacy & Accessibility Standard 4.2) ──────
   Categories: Necessary (always on: CTM, the site itself, fonts), Analytics
   (GA4) and Advertising (Google Ads + Conversion Linker).
   The choice is sent to Tag Manager with Google Consent Mode. The consent
   default (everything denied, wait_for_update 500) lives in the GTM container
   on Consent Initialization, so this component only sends updates.
   ad_personalization always stays denied. A browser sending Global Privacy
   Control gets Advertising off automatically.
   Reopen from anywhere with: window.dispatchEvent(new Event('hl:open-consent')) */

const STORAGE_KEY = 'hl_consent_v1';
export const OPEN_CONSENT_EVENT = 'hl:open-consent';

type Choice = { analytics: boolean; advertising: boolean };

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

const NAVY = '#0D3442';
const AMBER = '#F9A21C';
const NAVY_BTN = '#132E49';

function hasGPC() {
  return typeof navigator !== 'undefined' && navigator.globalPrivacyControl === true;
}

function sendConsent(choice: Choice) {
  window.dataLayer = window.dataLayer || [];
  // Same signature GTM expects from gtag.js: push the arguments object.
  // eslint-disable-next-line prefer-rest-params
  const gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag = gtag;
  gtag('consent', 'update', {
    analytics_storage: choice.analytics ? 'granted' : 'denied',
    ad_storage: choice.advertising ? 'granted' : 'denied',
    ad_user_data: choice.advertising ? 'granted' : 'denied',
    ad_personalization: 'denied',
  });
  window.dataLayer.push({
    event: 'consent_update',
    consent_analytics: choice.analytics ? 'granted' : 'denied',
    consent_advertising: choice.advertising ? 'granted' : 'denied',
  });
}

function readStored(): Choice | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics !== 'boolean' || typeof parsed?.advertising !== 'boolean') return null;
    return { analytics: parsed.analytics, advertising: parsed.advertising };
  } catch {
    return null;
  }
}

function store(choice: Choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...choice, ts: new Date().toISOString() }));
  } catch {
    /* storage blocked: the choice still applies for this page view */
  }
}

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [gpc, setGpc] = useState(false);
  const [draft, setDraft] = useState<Choice>({ analytics: false, advertising: false });

  useEffect(() => {
    // Read the saved choice after hydration (static export: no window on the server).
    const init = setTimeout(() => {
      const g = hasGPC();
      setGpc(g);
      const stored = readStored();
      if (stored) {
        const applied = { ...stored, advertising: g ? false : stored.advertising };
        setDraft(applied);
        sendConsent(applied);
      } else {
        setOpen(true);
      }
    }, 0);
    const reopen = () => {
      const current = readStored();
      if (current) setDraft({ ...current, advertising: hasGPC() ? false : current.advertising });
      setCustomize(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => {
      clearTimeout(init);
      window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
    };
  }, []);

  const save = (choice: Choice) => {
    const final = { ...choice, advertising: gpc ? false : choice.advertising };
    store(final);
    sendConsent(final);
    setDraft(final);
    setOpen(false);
    setCustomize(false);
  };

  if (!open) return null;

  const btn: React.CSSProperties = {
    flex: '1 1 140px', minHeight: 44, padding: '12px 18px', borderRadius: 4, fontSize: 15, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1.2,
  };
  const primary: React.CSSProperties = { ...btn, background: AMBER, color: NAVY_BTN, border: `2px solid ${AMBER}` };
  const secondary: React.CSSProperties = { ...btn, background: '#fff', color: NAVY, border: `2px solid ${NAVY}` };
  const linkBtn: React.CSSProperties = {
    background: 'none', border: 'none', padding: 0, color: NAVY, textDecoration: 'underline', fontSize: 13,
    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  };

  const row = (id: keyof Choice | 'necessary', title: string, desc: string, checked: boolean, disabled: boolean, note?: string) => (
    <div key={id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderTop: '1px solid #d6e2e2' }}>
      <input
        id={`consent-${id}`}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => id !== 'necessary' && setDraft(d => ({ ...d, [id]: e.target.checked }))}
        style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0, accentColor: NAVY }}
      />
      <label htmlFor={`consent-${id}`} style={{ fontSize: 14, color: '#1f2d33', lineHeight: 1.5 }}>
        <strong style={{ color: NAVY }}>{title}</strong>
        <br />
        {desc}
        {note && <><br /><em>{note}</em></>}
      </label>
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
      style={{
        position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 300, maxWidth: 640, margin: '0 auto',
        background: '#fff', borderRadius: 10, boxShadow: '0 10px 40px rgba(0,0,0,0.3)', padding: '22px 22px 18px',
        maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', fontFamily: 'inherit',
      }}
    >
      <p id="consent-title" style={{ fontSize: 17, fontWeight: 700, color: NAVY, margin: '0 0 8px' }}>Your privacy choices</p>
      <p id="consent-desc" style={{ fontSize: 14, color: '#1f2d33', lineHeight: 1.55, margin: '0 0 14px' }}>
        We use cookies that are needed for this site to work. With your permission, we also use analytics and advertising cookies to measure and improve our ads. You can change your choice at any time from &ldquo;Cookie Preferences&rdquo; at the bottom of the page.
      </p>

      {customize && (
        <div style={{ marginBottom: 14 }}>
          {row('necessary', 'Necessary', 'Required for the site, our phone system and forms to work. Always on.', true, true)}
          {row('analytics', 'Analytics', 'Helps us understand how the site is used (Google Analytics).', draft.analytics, false)}
          {row('advertising', 'Advertising', 'Measures the results of our ads (Google Ads).', gpc ? false : draft.advertising, gpc,
            gpc ? 'Your browser sent a Global Privacy Control signal, so advertising cookies stay off.' : undefined)}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <button type="button" style={primary} onClick={() => save({ analytics: true, advertising: true })}>Accept All</button>
        <button type="button" style={secondary} onClick={() => save({ analytics: false, advertising: false })}>Reject All</button>
        {customize ? (
          <button type="button" style={secondary} onClick={() => save(draft)}>Save My Choices</button>
        ) : (
          <button type="button" style={secondary} onClick={() => setCustomize(true)}>Customize</button>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          style={linkBtn}
          onClick={() => { setDraft(d => ({ ...d, advertising: false })); setCustomize(true); }}
        >
          Do Not Sell or Share My Personal Information
        </button>
      </div>
    </div>
  );
}
