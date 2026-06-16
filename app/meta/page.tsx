'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* OptImg — renders <picture> with WebP source + JPG fallback. Passes all
   props (including width/height/loading/fetchPriority/className/style) to
   the inner <img>, so CSS and layout behave identically. Used as a drop-in
   replacement for <img> on JPG sources. PNG/SVG sources pass through
   unchanged (no WebP conversion). */
function OptImg(props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) {
  const { src, ...rest } = props;
  if (/\.jpe?g$/i.test(src)) {
    const webp = src.replace(/\.jpe?g$/i, '.webp');
    return (
      <picture>
        <source srcSet={webp} type="image/webp" />
        <img src={src} {...rest} />
      </picture>
    );
  }
  return <img src={src} {...rest} />;
}

/* ── All assets pulled directly from Figma MCP ─────────────────────────── */

// Header
const LOGO     = '/assets/d07d3847-d242-45af-812f-44c5dca2a12a.svg';
const PHONE_IC = '/assets/b21093ed-0f8e-41b4-b20e-8983f39c116a.svg';

// Hero/Banner (node 3574:2753)
const HERO_BG  = '/assets/b98d49b5-9f35-465b-88d4-d034211e775a.jpg';
const CHECK_IC = '/assets/1dfb5845-c530-4f9d-918f-fd25e200aa50.svg';
const BADGE_G  = '/assets/7531f52f-8434-4e7e-a3ea-40dd900f73ad.png';
const BADGE_B  = '/assets/e86764f0-b6a7-4558-bb7d-7eee1d297c87.png';
const DHCS     = '/assets/7f8a9c03-dca4-4f31-81a1-e5f13eba1139.png';
const PSYCH    = '/assets/ce846d8b-9e2a-4e94-95c0-7407931a7cd7.svg';
const SAMHSA   = '/assets/1ee1d93b-ec86-4022-ad83-705dca16313b.svg';
const FORM_IC  = '/assets/4841cde0-bceb-4fba-bb18-908740aad935.svg';

// Carousel arrow
const CAR_ARR  = '/assets/a22864e4-c981-403e-a2e6-4827de9e9761.svg';

// Facility photos (node 6041:3105 — Seccion 1)
const FACILITY = [
  '/assets/facility-19.webp', // exterior — moved to first per client request (Julian Bejarano, 2026-05-05)
  '/assets/facility-01.webp',
  '/assets/facility-02.webp',
  '/assets/facility-03.webp',
  '/assets/facility-04.webp',
  '/assets/facility-05.webp',
  '/assets/facility-06.webp',
  '/assets/facility-07.webp',
  '/assets/facility-08.webp',
  '/assets/facility-09.webp',
  '/assets/facility-10.webp',
  '/assets/facility-11.webp',
  '/assets/facility-12.webp',
  '/assets/facility-13.webp',
  '/assets/facility-14.webp',
  '/assets/facility-15.webp',
  '/assets/facility-16.webp',
  '/assets/facility-17.webp',
  '/assets/facility-18.webp',
];

// Amenity icons
const AMEN_1 = '/assets/af4e30dc-f24c-4589-86b8-fa57aae5ef55.svg';
const AMEN_2 = '/assets/809aa185-9d20-43f5-bd45-0bab4a25ca1b.svg';
const AMEN_3 = '/assets/2baaa94b-5cbc-4666-8e73-d76dd145698b.svg';
const AMEN_4 = '/assets/b006e088-8294-412e-a99c-19afc09a900b.svg';
const AMEN_5 = '/assets/e043a9de-af0d-4392-ba0d-b91701480d9e.svg';

// Condition icons
const IC_ALCOHOL  = '/assets/7b436f39-0056-4b72-b656-1ac9065f51c3.svg';
const IC_OPIOID   = '/assets/a228c9f5-dd18-422d-af88-72c069c37822.svg';
const IC_BENZO    = '/assets/91942f7a-e33c-412d-ac2e-56b9f2605701.svg';
const IC_COCAINE  = '/assets/6ce1dd58-85f8-4783-8bc5-90fb03d26e9f.svg';
const IC_FENTANYL = '/assets/5282761b-1072-4bc1-a2a7-43c1077fee69.svg';
const IC_HEROIN   = '/assets/4a9aa952-3a3b-49cd-9d69-8f52fc2f45e8.svg';
const IC_DUAL     = '/assets/46bf0366-8192-4901-8a31-4be2193272f6.svg';

// Recovery icons (Seccion 2)
const REC_COUPLES   = '/assets/f715e92e-860c-492a-9bbd-7879967cb741.svg';
const REC_DOG       = '/assets/8c2864b2-e458-4de6-a2c8-da09af8ac0a3.svg';
const REC_HOLISTIC  = '/assets/4e9b1d43-3c96-4ecf-970b-9106d3e97dcd.svg';
const REC_DETOX     = '/assets/0d0ca17b-d792-4093-8376-61aaf80f1848.svg';
const REC_MEDICAL   = '/assets/7ee8b202-7c9f-45f5-bf37-076e00dcc8af.svg';
const REC_PROF      = '/assets/1231f0b5-9f99-422b-8d9f-a07881950ff7.svg';
const REC_MEALS     = '/assets/bf078a69-8127-4664-961a-6818d73bf62c.svg';
const REC_TECH      = '/assets/423dfe45-62c3-4bb9-96b5-da3da0dbb427.svg';

// Section 6 — Insurance logos strip
// Individual logos extracted from Figma nodes 6062:4803-4809 for the marquee.
// TODO: add missing 8 (MultiPlan, Beacon + 6 unnamed Vectors) once Ellie exports them as PNGs.
// width/height are the SVG's true viewBox dimensions — passed as <img> attrs so
// the browser derives the correct intrinsic aspect ratio (these SVGs are authored
// width="100%" height="100%", so without explicit dims they distort when sized).
const INS_LOGOS = [
  { src: '/assets/insurance/aetna.svg',           alt: 'Aetna',                width: 155, height: 28 },
  { src: '/assets/insurance/anthem.svg',          alt: 'Anthem',               width: 202, height: 30 },
  { src: '/assets/insurance/bluecross.svg',       alt: 'BlueCross BlueShield', width: 164, height: 32 },
  { src: '/assets/insurance/blue-california.svg', alt: 'Blue California',      width: 103, height: 40 },
  { src: '/assets/insurance/cigna.svg',           alt: 'Cigna',                width: 101, height: 50 },
  { src: '/assets/insurance/highmark.svg',        alt: 'Highmark',             width: 166, height: 26 },
  { src: '/assets/insurance/tribal.svg',          alt: 'Tribal Health',        width: 149, height: 40 },
];

// Section 7 — Step icons
const STEP1_IC      = '/assets/620f93c9-2fc3-4252-8a66-29b3a8552aaa.svg';
const STEP2_IC      = '/assets/8a55c9d4-62cb-4120-87cb-cb50b62a098d.svg';
const STEP3_IC      = '/assets/08f52511-8481-46d2-9a64-747c321ab447.svg';

// Section 9 — Stats icons
const STAT1_IC      = '/assets/7bb23f50-b405-4b9a-b6aa-0174ea6e6bae.svg';
const STAT2_IC      = '/assets/e3d24105-99f3-408e-8e0f-f02e295fb34f.svg';
const STAT3_IC      = '/assets/91a31f23-28ff-4171-9676-5fa39be97100.svg';
const STAT4_IC      = '/assets/60a7657d-4bc5-4fdc-8acb-ffe9709fd824.svg';

// Seccion 3 — Treatment Path photos (updated 2026-05-19 from Figma node 6178:465)
const SEC3_DETOX    = '/assets/sec3-new-6178-468.jpg';
const SEC3_RESID    = '/assets/sec3-new-6178-477.jpg';
const SEC3_AFTER    = '/assets/sec3-new-6178-480.jpg';

// Team headshots (updated 2026-05-19 from Figma Seccion 5 node 3574:3006)
// Order matches x-position: Narine x:114, Harout x:444, Ritsa x:774, Julie x:1104
const TEAM_NARINE = '/assets/dr-6036-1692.jpg';
const TEAM_HAROUT = '/assets/dr-6036-1694.jpg';
const TEAM_RITSA  = '/assets/dr-6036-1697.jpg';
const TEAM_JULIE  = '/assets/dr-6041-1851.jpg';

// Reviews
const STARS     = '/assets/6d0d84c4-5abf-4e0c-b267-1051986a3f8e.svg';
const GOOGLE_IC = '/assets/3f47f82b-a218-4854-a023-584579dd8955.png';
const REVIEWERS = [
  { photo: '/assets/83127b99-39f2-43fc-b3a9-e05a78fa8046.png', name: 'Jose Martinez',    text: "Well first off the staff are all about assisting the clients with their needs — they go above and beyond. The food is beyond great. The medical attention is on point. I've been to a few programs and this is the best one hands down." },
  { photo: '/assets/01fd596c-5475-41ba-a47e-62c21b16814a.png', name: 'Melissa Jenkins',  text: "This was my first experience at a treatment program. I was very nervous but the staff were unbelievable! I ended up staying the full 30 days and I'm so glad I did. I can't recommend Healthy Living enough." },
  { photo: '/assets/758779c3-d3a0-4c04-8122-9ffe4aa02913.png', name: 'Gilbert Pimienta', text: "Healthy Living truly exceeded my expectations. The staff is highly professional and incredibly compassionate. The facility is clean and comfortable. Thanks to Healthy Living, I've made meaningful progress." },
  { photo: '/assets/cfc93faa-711c-4f7f-8543-08991d40fcbe.png', name: 'Jordan',           text: "The staff here really care about you and your wellbeing. During detox they made it as smooth and comfortable as possible. The food is amazing. The counseling and therapy is top notch. 10 out of 10." },
  { photo: '/assets/e19e5a4d-5ea0-41e4-8627-4e7b8302721c.png', name: 'Nicolas Arp',      text: "I had a really good experience here. We did a lot of really cool activities like hiking, time by the fireplace, outings to the movies and going thrifting. I would highly recommend!" },
  { photo: '/assets/13dda1b7-ca89-44b0-a6a3-54d45a5f8a9a.png', name: 'C Los',            text: "Healthy Living is the best detox and residential program around, hands down. They picked up as soon as I called, I was in treatment the following day. You get to keep your phone, therapy every week, I had my own room and private bathroom." },
  { photo: '/assets/78190423-3e6e-423a-a256-30242a43bf9b.png', name: 'Rachel Vassell',   text: "This treatment center was a great experience. It's like living at a five-star hotel — they cater to your every need mentally and physically and go above and beyond. Thank you so much Healthy Living." },
];

// FAQ / CTA
const FAQ_OPEN  = '/assets/318ecfed-37ab-4e53-8c81-4e39aa469df5.svg';
const FAQ_SHUT  = '/assets/35ac22b3-934f-45d7-8e76-60cfdca371cd.svg';
const CTA_BG    = '/assets/b5cddfeb-0c27-48fd-82b3-51892007dec5.jpg';
const INS_BTN_IC = '/assets/d9606794-a866-4c8e-adc7-017a9e865ffb.svg';

// Location section — exterior house photo (from Figma Seccion 10 imgImage20)
const LOCATION_PHOTO = '/assets/1b1d5a28-3422-45a4-994d-25f3377fd21e.jpg';

/* ── Design tokens ──────────────────────────────────────────────────────── */
const N     = '#0D3442';   // navy primary
const T     = '#56B5B7';   // teal
const O     = '#CEA36F';   // gold (subnav active state, dashed dividers)
const BG    = '#EDF4F4';   // off-white teal
const DT    = '#174154';   // deep navy (trust banner, conditions)
const AMBER = '#F9A21C';   // CTA buttons per Figma (Call/Begin/Verify/Check)
const NAVY_BTN = '#132E49'; // CTA button text per Figma

/* ── Utilities ──────────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, style = {}, className = '' }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }} style={style}>
      {children}
    </motion.div>
  );
}

/* ── Decorative brand bird/wing motif — Healthy Living's actual logo asset ── */
const BIRD_BG = '/assets/bird-bg.png';
function DecorativeBg({
  position = 'top-left',
  size = 320,
  opacity = 1,
  flip = false,
  contrast = 'normal',
  offset = 0,
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  opacity?: number;
  flip?: boolean;
  contrast?: 'normal' | 'boost';
  offset?: number; // px to nudge into the section overflow (negative bottom for "tucked under" half-bird look)
}) {
  const pos: React.CSSProperties = { position: 'absolute', pointerEvents: 'none', zIndex: 0 };
  if (position.includes('top'))    pos.top    = -offset;
  if (position.includes('bottom')) pos.bottom = -offset;
  if (position.includes('left'))   pos.left   = -offset;
  if (position.includes('right'))  pos.right  = -offset;
  const transforms = [];
  if (flip) transforms.push('scaleX(-1)');
  return (
    <OptImg
      aria-hidden="true"
      src={BIRD_BG}
      alt=""
      style={{
        ...pos,
        width: size,
        height: 'auto',
        opacity,
        transform: transforms.length ? transforms.join(' ') : 'none',
        filter: contrast === 'boost' ? 'brightness(0.7) saturate(1.6)' : 'none',
      }}
    />
  );
}

/* ── Insurance form (CTM hosted iframe — 6 fields incl. DOB + insurance dropdown) ── */
const CTM_FORM_URL = 'https://206076.tctm.co/form/FRT472ABB2C5B9B141A0D34850A59FA6661E0D33A5F99CB4151874B16424968667C.html';
function InsuranceForm({ height = 320 }: { height?: number }) {
  // Tight 320px height with scrolling=auto: form fits cleanly with no whitespace,
  // and when the Insurance Carrier dropdown overflows, browser's native direction
  // detection kicks in (opens up/down based on space) + iframe scrollbar as fallback.
  return (
    <div style={{ width: '100%' }}>
      {/* Reassurance ABOVE the form — always visible on every viewport, sets expectation before filling */}
      <p style={{ textAlign: 'center', fontSize: 13, color: '#0D3442', margin: 0, padding: '0 4px 12px', lineHeight: 1.5, fontWeight: 500, fontStyle: 'italic' }}>
        Your information is private and secure. No pressure to commit.
      </p>
      <iframe
        className="ctm-call-widget"
        src={CTM_FORM_URL}
        style={{ width: '100%', height, border: 'none', display: 'block', background: '#fff', borderRadius: 6 }}
        title="Verify Insurance Coverage"
        scrolling="auto"
        allow="clipboard-write"
      />
      {/* Fallback link — for browsers that block 3rd-party iframes (Brave shields, uBlock, etc) */}
      <p style={{ textAlign: 'center', fontSize: 12, color: '#666', margin: 0, padding: '8px 4px 0', lineHeight: 1.5 }}>
        Trouble seeing the form? <a href={CTM_FORM_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#0D3442', fontWeight: 600, textDecoration: 'underline' }}>Open it in a new window →</a>
      </p>
      <p style={{ textAlign: 'center', fontSize: 11, color: '#888', margin: 0, padding: '10px 4px 0', lineHeight: 1.5 }}>
        By submitting, I consent to be contacted by Healthy Living Residential Program at the number provided, including via autodialed or prerecorded calls and text messages, regarding treatment options. This consent is not a condition of receiving services.
      </p>
    </div>
  );
}

/* ── Facility Carousel ──────────────────────────────────────────────────── */
function Carousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = FACILITY.length;
  const prev = () => setI(a => (a - 1 + total) % total);
  const next = () => setI(a => (a + 1) % total);
  const thumbStripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [paused]);

  // Auto-scroll the thumbnail strip horizontally to keep the active thumb in view.
  // Use strip.scrollTo (not activeThumb.scrollIntoView) so we don't fight the
  // page's vertical scroll position — scrollIntoView yanks the whole page when
  // the strip isn't already in the viewport, which made every carousel tick
  // bounce the user back up to the gallery section.
  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const activeThumb = strip.children[i] as HTMLElement | undefined;
    if (!activeThumb) return;
    const targetLeft = activeThumb.offsetLeft - (strip.clientWidth - activeThumb.clientWidth) / 2;
    strip.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
  }, [i]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Two photos side by side (mobile: first only) */}
      <div className="carousel-photos-wrap" style={{ position: 'relative', display: 'flex', gap: 20, height: 320 }}>
        {[0, 1].map(offset => (
          <div key={offset} className={`carousel-photo-item${offset === 1 ? ' carousel-second-photo' : ''}`} style={{ flex: 1, borderRadius: 4, overflow: 'hidden', position: 'relative', height: 320 }}>
            <AnimatePresence>
              <motion.img loading="lazy" key={`${i}-${offset}`} src={FACILITY[(i + offset) % total]} alt=""
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </AnimatePresence>
          </div>
        ))}
        {[{ fn: prev, side: 'left' as const, rot: 'rotate(180deg)' }, { fn: next, side: 'right' as const, rot: 'none' }].map(({ fn, side, rot }) => (
          <button key={side} onClick={fn}
            style={{ position: 'absolute', [side]: 20, top: '50%', transform: 'translateY(-50%)', width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 2 }}>
            <OptImg loading="lazy" src={CAR_ARR} alt="" style={{ width: 20, height: 20, objectFit: 'contain', transform: rot }} />
          </button>
        ))}
      </div>
      {/* Dots below photos, not overlaid */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        {FACILITY.map((_, di) => (
          <button key={di} onClick={() => setI(di)}
            style={{ width: di === i ? 18 : 6, height: 6, borderRadius: 3, background: di === i ? '#fff' : 'rgba(255,255,255,0.45)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
      <div ref={thumbStripRef} style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 4 }}>
        {FACILITY.map((src, idx) => (
          <button key={idx} onClick={() => setI(idx)}
            style={{
              flexShrink: 0,
              padding: 0,
              background: 'none',
              border: idx === i ? `2px solid ${AMBER}` : '2px solid transparent',
              cursor: 'pointer',
              position: 'relative',
              borderRadius: 6,
              overflow: 'hidden',
              scrollSnapAlign: 'center',
              transition: 'border 0.2s, opacity 0.2s',
              opacity: idx === i ? 1 : 0.55,
            }}
            onMouseEnter={(e) => { if (idx !== i) (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
            onMouseLeave={(e) => { if (idx !== i) (e.currentTarget as HTMLElement).style.opacity = '0.55'; }}>
            <OptImg loading="lazy" src={src.replace(/\.(jpe?g|webp)$/i, '-thumb.webp')} alt="" width={336} height={160} style={{ width: 168, height: 80, objectFit: 'cover', display: 'block', borderRadius: 4 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Conditions Carousel — native horizontal scroll w/ snap, drag + momentum ── */
function ConditionsCarousel({ conditions }: { conditions: { icon: string; title: string; desc: string }[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const dragState = useRef({
    isDown: false,
    startX: 0,
    startScroll: 0,
    moved: false,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  });
  const momentumRaf = useRef<number | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const scrollToIdx = (i: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[i] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - 10, behavior: 'smooth' });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => {
      const cardW = 516; // 500 + 16 gap
      const i = Math.round(el.scrollLeft / cardW);
      setActiveIdx(Math.min(Math.max(0, i), conditions.length - 1));
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, [conditions.length]);

  // Cancel any pending momentum animation
  const cancelMomentum = () => {
    if (momentumRaf.current != null) {
      cancelAnimationFrame(momentumRaf.current);
      momentumRaf.current = null;
    }
  };

  // Mouse drag-to-scroll (touch + trackpad already work natively)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = scrollRef.current; if (!el) return;
    cancelMomentum();
    const now = performance.now();
    dragState.current = {
      isDown: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      lastX: e.clientX,
      lastT: now,
      velocity: 0,
    };
    setGrabbing(true);
    el.setPointerCapture(e.pointerId);
    el.style.scrollSnapType = 'none';
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const s = dragState.current; if (!s.isDown) return;
    const el = scrollRef.current; if (!el) return;
    const dx = e.clientX - s.startX;
    if (Math.abs(dx) > 4) s.moved = true;
    el.scrollLeft = s.startScroll - dx;
    // Track velocity (px/ms) using last move
    const now = performance.now();
    const dt = now - s.lastT;
    if (dt > 0) {
      const instantV = (s.lastX - e.clientX) / dt; // positive = scrolling right
      // Smooth velocity: 70% recent, 30% prior — feels natural
      s.velocity = s.velocity * 0.3 + instantV * 0.7;
    }
    s.lastX = e.clientX;
    s.lastT = now;
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    const s = dragState.current; if (!s.isDown) return;
    s.isDown = false;
    setGrabbing(false);
    const el = scrollRef.current; if (!el) return;
    el.releasePointerCapture?.(e.pointerId);

    // If user dragged with velocity, run momentum scroll before re-enabling snap
    if (s.moved && Math.abs(s.velocity) > 0.05) {
      let v = s.velocity * 16; // px/frame at ~60fps
      const friction = 0.94; // deceleration per frame
      const tick = () => {
        if (!el) return;
        if (Math.abs(v) < 0.5) {
          // Coast complete — re-enable snap which will lock to nearest card
          el.style.scrollSnapType = 'x mandatory';
          momentumRaf.current = null;
          return;
        }
        el.scrollLeft += v;
        v *= friction;
        // If we hit either edge, stop
        if (el.scrollLeft <= 0 || el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.style.scrollSnapType = 'x mandatory';
          momentumRaf.current = null;
          return;
        }
        momentumRaf.current = requestAnimationFrame(tick);
      };
      momentumRaf.current = requestAnimationFrame(tick);
    } else {
      el.style.scrollSnapType = 'x mandatory';
    }
  };
  // Suppress click on cards if user just dragged
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.moved) { e.preventDefault(); e.stopPropagation(); dragState.current.moved = false; }
  };

  useEffect(() => () => cancelMomentum(), []);

  return (
    <div>
      <p style={{ color: '#fff', fontWeight: 700, fontSize: 18, lineHeight: '22px', textAlign: 'center', marginBottom: 16 }}>Common Conditions:</p>
      <div
        ref={scrollRef}
        className="conditions-scroller"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          padding: 10,
          scrollbarWidth: 'none',
          cursor: grabbing ? 'grabbing' : 'grab',
          userSelect: grabbing ? 'none' : 'auto',
        }}
      >
        {conditions.map((c, idx) => (
          <div key={idx}
            style={{
              flexShrink: 0,
              width: 500,
              scrollSnapAlign: 'start',
              background: '#fff',
              borderRadius: 10,
              padding: '20px 24px',
              boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              textAlign: 'center',
            }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <OptImg loading="lazy" src={c.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
              <p style={{ fontSize: 18, fontWeight: 500, color: N, lineHeight: '22px' }}>{c.title}</p>
              <p style={{ fontSize: 16, color: '#000', lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 22 }}>
        {conditions.map((_, di) => (
          <button key={di} onClick={() => scrollToIdx(di)}
            style={{ width: di === activeIdx ? 20 : 8, height: 8, borderRadius: 4, background: di === activeIdx ? O : 'rgba(255,255,255,0.35)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

/* ── Reviews Carousel ───────────────────────────────────────────────────── */
function ReviewsCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = REVIEWERS.length;
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx(a => (a + 1) % total), 4000);
    return () => clearInterval(t);
  }, [paused]);

  const slice = Array.from({ length: 3 }, (_, o) => ({ r: REVIEWERS[(idx + o) % total], key: (idx + o) % total }));

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current != null ? e.changedTouches[0].clientX - touchStartX.current : 0;
    if (Math.abs(dx) > 50) {
      setIdx(a => (dx < 0 ? (a + 1) % total : (a - 1 + total) % total));
    }
    touchStartX.current = null;
    setPaused(false);
  };

  return (
    <div
      style={{ flex: 1, minWidth: 0 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="reviews-row" style={{ display: 'flex', gap: 16 }}>
          {slice.map(({ r, key }) => (
            <div key={key} style={{ background: '#fff', padding: 20, boxShadow: '0 4px 4px rgba(0,0,0,0.25)', flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <OptImg loading="lazy" src={r.photo} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#000' }}>{r.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <OptImg loading="lazy" src={STARS} alt="5 stars" style={{ height: 14, width: 76, objectFit: 'contain' }} />
                    <OptImg loading="lazy" src={GOOGLE_IC} alt="Google" style={{ width: 14, height: 14, objectFit: 'contain' }} />
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#222', lineHeight: 1.65, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' } as any}>{r.text}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        {REVIEWERS.map((_, di) => (
          <button key={di} onClick={() => setIdx(di)}
            style={{ width: di === idx ? 20 : 8, height: 8, borderRadius: 4, background: di === idx ? N : 'rgba(0,0,0,0.2)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    { q: 'What therapies do you offer?', a: 'Beyond individual and group therapy, we offer EMDR for trauma, music, art, movement, sound therapy, yoga, animal-assisted activities, and time in nature.' },
    { q: 'Do you offer Medication-Assisted Treatment (MAT)?', a: 'Yes. Our physicians evaluate each patient individually and discuss MAT openly. We offer buprenorphine, naltrexone, and other evidence-based medications when clinically appropriate.' },
    { q: 'Can couples go through treatment together?', a: 'Absolutely. Couples are welcome and we have experience supporting partners through detox and residential treatment simultaneously, with both shared and individual therapy sessions.' },
    { q: 'Can I use my cellphone and computer during treatment?', a: 'Yes — cellphones and wifi are available. We believe in balancing connection with focus on healing, and our clinical team can help you find that balance.' },
    { q: 'Is family involvement allowed or encouraged?', a: 'Yes. Family therapy and regular family contact are encouraged. We offer family education sessions and can coordinate visits as part of the healing process.' },
    { q: 'Is your program LGBTQ+ friendly?', a: 'Yes. We are fully inclusive and affirming. Our clinical team is trained in LGBTQ+ specific needs, and we strive to create a safe, welcoming environment for all.' },
    { q: 'How long does treatment last?', a: 'Detox typically lasts 5–14 days. Residential treatment ranges from 30 to 90+ days. Length is tailored to each individual based on medical needs and treatment progress.' },
    { q: 'Do you offer transportation assistance to treatment?', a: "We understand that getting to treatment is sometimes the first obstacle, and we don't want logistics to be the reason someone doesn't get the help they need. Healthy Living offers transportation assistance and coordination for clients who need support getting to our Santa Clarita facility safely.\n\nWhether you're coming from within the Los Angeles area, the San Fernando Valley, or further across Southern California, our admissions team can help coordinate arrangements before your arrival.\n\nThis may include guidance on the best route, coordination with a trusted transport service, or simply walking you through what to expect on your first day so nothing feels uncertain." },
    { q: 'What happens after I complete the residential program?', a: 'We connect you with outpatient programs, sober living, and ongoing therapy in Santa Clarita and Los Angeles. Our alumni program provides online support groups and monthly meetings.' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 860, margin: '0 auto' }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ borderRadius: 10, overflow: 'hidden' }}>
          <button onClick={() => setOpen(open === idx ? null : idx)}
            style={{ width: '100%', background: open === idx ? '#386376' : N, border: 'none', padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ color: '#fff', fontSize: 17, fontWeight: 700, textAlign: 'left', lineHeight: 1.35 }}>{item.q}</span>
            <OptImg loading="lazy" src={open === idx ? FAQ_OPEN : FAQ_SHUT} alt="" style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0 }} />
          </button>
          <AnimatePresence>
            {open === idx && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden', background: '#386376' }}>
                <div style={{ padding: '8px 12px 14px' }}>
                  <div style={{ background: '#fff', borderRadius: 10, boxShadow: '0 4px 4px rgba(0,0,0,0.25)', padding: '16px 20px' }}>
                    {item.a.split('\n\n').map((para, pIdx, all) => (
                      <p
                        key={pIdx}
                        style={{
                          color: '#1a1a1a', fontSize: 15, lineHeight: 1.7, fontWeight: 400,
                          marginBottom: pIdx < all.length - 1 ? '0.85em' : 0,
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────────────────────── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
      {/* Top banner — ALWAYS visible, does not collapse on scroll */}
      <div style={{ background: T, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, lineHeight: '22px', textAlign: 'center', padding: '0 16px' }}>
          Support Available 24/7 — ⚠️ We do not accept Medicare or Medicaid
        </p>
      </div>
      <div style={{ background: N, boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.35)' : 'none' }}>
        <div className="lp-wide header-inner" style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <OptImg src={LOGO} alt="Healthy Living Residential Program" className="header-logo" style={{ height: 44, width: 'auto', objectFit: 'contain', flexShrink: 1, minWidth: 0 }} />
          <motion.a href="tel:+16619908165" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="header-cta"
            style={{ background: AMBER, color: NAVY_BTN, fontWeight: 500, fontSize: 18, padding: '14px 22px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, lineHeight: 1 }}>
            <OptImg src={PHONE_IC} alt="" className="header-cta-icon" style={{ width: 20, height: 20, flexShrink: 0, objectFit: 'contain' }} />
            <span className="header-cta-full">Call Us&nbsp;&nbsp;(661) 990-8165</span>
            <span className="header-cta-short">(661) 990-8165</span>
          </motion.a>
        </div>
      </div>
    </header>
  );
}

/* ── Trust Bar — accepted-insurance logo strip directly under the hero ──────
   Surfaces "we take your insurance" to the visitors who never scroll past the
   hero. Additive only — does not reorder or touch any existing section. */
function TrustBar() {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '18px 0' }}>
      <div className="lp-inner trustbar-logos" aria-label="Accepted insurance">
        {INS_LOGOS.map(logo => (
          <OptImg key={logo.alt} src={logo.src} alt={logo.alt} loading="lazy"
            width={logo.width} height={logo.height} className="trustbar-logo-img" />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function Page() {
  const [showInsModal, setShowInsModal] = useState(false);
  const [activeSection, setActiveSection] = useState('our-center');

  useEffect(() => {
    const ids = ['our-center', 'conditions', 'team', 'programs', 'reviews'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: '-200px 0px -60% 0px', threshold: 0 }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const AMENITIES = [
    { label: 'Outdoor Activities & Beach Access',    icon: AMEN_1 },
    { label: 'Nature Immersion & Gardening',          icon: AMEN_2 },
    { label: 'Music, Art & Movement Therapy',         icon: AMEN_3 },
    { label: 'Chef-Prepared Meals & Nutrition Plans', icon: AMEN_4 },
    { label: 'Cellphones Allowed & Wifi Available',   icon: AMEN_5 },
  ];

  const CONDITIONS = [
    { icon: IC_ALCOHOL,  title: 'Alcohol Addiction',        desc: 'Alcohol withdrawal can be dangerous — our medical team monitors you closely from day one.' },
    { icon: IC_OPIOID,   title: 'Opioid Addiction',         desc: 'Prescription opioid dependence often begins with real pain — we treat the whole picture.' },
    { icon: IC_BENZO,    title: 'Benzodiazepine Addiction', desc: 'Often prescribed with the best intentions. Our medically supervised care helps you taper safely.' },
    { icon: IC_COCAINE,  title: 'Cocaine Addiction',        desc: 'Cocaine rewires how the brain experiences pleasure — we help you find joy without it.' },
    { icon: IC_FENTANYL, title: 'Fentanyl Addiction',       desc: 'Fentanyl withdrawal can be dangerous — our medical team is here to get you through it safely.' },
    { icon: IC_HEROIN,   title: 'Heroin Addiction',         desc: "We know how deeply heroin takes hold. We're here to meet you exactly where you are, without judgment." },
    { icon: IC_DUAL,     title: 'Co-Occurring Disorders',   desc: 'When addiction and mental health challenges exist together, we address both at the same time.' },
  ];

  // Per-person photo framing: zoom (width %) + top + left so all faces are similar size & eyes aligned at ~30% of card
  // Names/titles verbatim from Figma Seccion 5 (updated 2026-05-19)
  const TEAM = [
    { name: 'Dr. Narine Arutyounian MD', role: 'Medical Director',               img: TEAM_NARINE, width: '100%', top: '0%',  left: '0%'  },
    { name: 'Dr. Harout Mesrobian MD',   role: 'CEO',                            img: TEAM_HAROUT, width: '100%', top: '0%',  left: '0%'  },
    { name: 'Ritsa Fistes, LMFT',        role: 'Clinical Director',              img: TEAM_RITSA,  width: '100%', top: '0%',  left: '0%'  },
    { name: 'Julie Tatian MSN, NP',      role: 'Psychiatric Nurse Practitioner', img: TEAM_JULIE,  width: '100%', top: '0%',  left: '0%'  },
  ];

  const RECOVERY_ITEMS = [
    { icon: REC_COUPLES,  title: 'Couples Welcome',        desc: "We're one of the few centers that allows couples to heal together, side by side." },
    { icon: REC_DOG,      title: 'Dog-Friendly',            desc: 'Comfort and connection are part of healing, and sometimes that comes on four legs.' },
    { icon: REC_HOLISTIC, title: 'Holistic Care',           desc: 'Music, art, movement, sound, animals, and time in nature treats the whole person, not just the addiction.' },
    { icon: REC_DETOX,    title: 'Comfort-First Detox',     desc: "Detox doesn't have to feel like punishment. Our medical team & MAT protocols keeps you safe and comfortable." },
    { icon: REC_MEDICAL,  title: 'Medical Leadership',      desc: "Physician-founded and medically directed — clinical excellence isn't a feature here, it's the foundation of everything we do." },
    { icon: REC_PROF,     title: 'Professional Pathways',   desc: "Built for people who can't step away from everything, our program offers the structure and discretion that professionals need." },
    { icon: REC_MEALS,    title: 'Chef-Prepared Meals',     desc: "In-house chef prepares nourishing meals daily, because a body that's well-fed heals faster and feels more like itself again." },
    { icon: REC_TECH,     title: 'Flexible Tech Policies',  desc: "Phones and technology are allowed (with limits), because isolation isn't part of our approach to recovery." },
  ];

  const INSURERS = ['Aetna','Anthem','Cigna','Humana','United','BlueCross','Magellan','Beacon','Optum','ComPsych','MHN','Molina','MultiPlan','Ambetter'];

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 160;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  }

  return (
    <div style={{ color: N }}>
      <Header />

      {/* ════ HERO / BANNER (node 3574:2753) ═════════════════════════════ */}
      <section className="hero-section" style={{ position: 'relative', paddingTop: 160 }}>
        {/* full-bleed background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <OptImg src={HERO_BG} alt="" width={2528} height={1696} fetchPriority="high" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center right' }} />
          {/* Figma gradient: to-left, transparent 5.2% → 90% opaque 41.9% */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(237,244,244,0) 5.208%, rgba(237,244,244,0.9) 41.855%)' }} />
        </div>

        {/* Hero content — lp-wide handles responsive side padding */}
        <div className="lp-wide hero-grid" style={{ position: 'relative', zIndex: 1, paddingTop: 50, paddingBottom: 40 }}>
          <div className="hero-row" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>

            {/* LEFT — fills available space up to 750px. NOTE: framer-motion
                fade-in REMOVED from this column — it was gating LCP on slow
                mobile (heading invisible until JS hydrates = LCP delays
                10-15s on simulated slow 4G + slow CPU). H1 paints
                immediately now. Other sections keep their fade-ins. */}
            <div className="hero-text-col" style={{ flex: '1 1 0', minWidth: 0 }}>
              <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 700, lineHeight: 1.2, color: N, marginBottom: 20 }}>
                Physician-Owned Detox &amp;{' '}
                <span className="hero-title-line2">Residential Treatment</span>
              </h1>
              <p className="hero-stars" style={{ color: '#386376', fontSize: 14, fontWeight: 700, marginBottom: 20 }}>
                ⭐️⭐️⭐️⭐️⭐ 4.9/5 on Google from 78+ Reviews
              </p>

              {/* Bullet grid — 2 cols on desktop, stacks on mobile */}
              <div className="hero-bullets">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {['Same-Day Admissions 24/7', 'Comfort-Focused Detox & MAT'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <OptImg src={CHECK_IC} alt="" style={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }} />
                      <span style={{ fontSize: 16, color: N }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {['Couples Are Welcome', 'Pet-Friendly'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <OptImg src={CHECK_IC} alt="" style={{ width: 22, height: 22, objectFit: 'contain', flexShrink: 0 }} />
                      <span style={{ fontSize: 16, color: N }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA + trust badges (Figma: inline on one line at desktop) */}
              <div className="hero-cta-row" style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'nowrap' }}>
                <motion.a href="tel:+16619908165" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ background: N, color: '#fff', fontWeight: 500, fontSize: 17, padding: '14px 22px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0, lineHeight: 1, filter: 'brightness(1)' }}>
                  <OptImg src={PHONE_IC} alt="" style={{ width: 18, height: 18, objectFit: 'contain', flexShrink: 0, filter: 'brightness(0) invert(1)' }} />
                  <span>Speak with Admissions 24/7</span>
                </motion.a>
                <div className="hero-badges-row" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'nowrap', flexShrink: 1, minWidth: 0 }}>
                  <OptImg src={BADGE_G}  alt="" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
                  <OptImg src={BADGE_B}  alt="" style={{ width: 32, height: 35, objectFit: 'contain', flexShrink: 0 }} />
                  <OptImg src={DHCS}     alt="" style={{ width: 88, height: 19, objectFit: 'contain', flexShrink: 0 }} />
                  <OptImg src={PSYCH}    alt="" style={{ width: 84, height: 24, objectFit: 'contain', flexShrink: 0 }} />
                  <OptImg src={SAMHSA}   alt="" style={{ width: 70, height: 24, objectFit: 'contain', flexShrink: 0 }} />
                </div>
              </div>
              {/* Transportation callout — practical benefit pill, sits below badges */}
              <div className="hero-transport-callout" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 18,
                padding: '8px 16px',
                background: 'rgba(249, 162, 28, 0.12)',
                border: `1px solid ${O}`,
                borderRadius: 20,
                color: N,
                fontSize: 14,
                fontWeight: 500,
                lineHeight: 1.3
              }}>
                <svg aria-hidden="true" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={O} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transform: 'scaleX(-1)' }}>
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
                <span>Complimentary transportation available for verified patients</span>
              </div>
            </div>

            {/* RIGHT — form card 530px. Framer fade-in REMOVED for same LCP
                reasons: form card was the LCP candidate on desktop, was
                invisible until JS hydrated. */}
            <div
              className="hero-form"
              style={{ width: 530, flexShrink: 0, backdropFilter: 'blur(5px)', background: 'rgba(237,244,244,0.8)', border: '1px solid rgba(237,244,244,0.04)', borderRadius: 6, boxShadow: '0 4px 8px rgba(0,0,0,0.2)', padding: '30px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ color: N, fontWeight: 500, fontSize: 16 }}>Get Instant Insurance Verification</span>
                <OptImg src={FORM_IC} alt="" style={{ height: 24, width: 'auto', maxWidth: 50, objectFit: 'contain', flexShrink: 0 }} />
              </div>
              <InsuranceForm />
            </div>
          </div>
        </div>

        {/* Sub-nav — white bar with scroll-spy active state, docks under always-visible header (50 banner + 110 nav) */}
        <div className="subnav" style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 160, zIndex: 40 }}>
          <div className="lp-inner subnav-links" style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            {[
              { label: 'Our Center', id: 'our-center' },
              { label: 'Conditions', id: 'conditions' },
              { label: 'Team',       id: 'team'       },
              { label: 'Insurances', id: 'programs'   },
              { label: 'Reviews',    id: 'reviews'    },
            ].map(({ label, id }) => {
              const isActive = activeSection === id;
              return (
                <button key={id} onClick={() => scrollTo(id)}
                  className="subnav-link"
                  data-active={isActive ? 'true' : 'false'}
                  style={{
                    padding: '10px 0 6px',
                    fontSize: 16,
                    color: isActive ? O : N,
                    fontWeight: isActive ? 700 : 400,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderBottom: isActive ? `2px solid ${O}` : '2px solid transparent',
                    fontFamily: 'inherit',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ TRUST BAR — credibility strip under the hero ═══════════════ */}
      <TrustBar />

      {/* ════ FACILITY / OUR CENTER ══════════════════════════════════════ */}
      <section id="our-center" style={{ background: 'linear-gradient(to top, #0D3442, #386376)', padding: '70px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="lp-inner" style={{ position: 'relative', zIndex: 1 }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Healthy Living Isn't Just Our Name</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>It's what we help you achieve.</p>
          </FadeUp>
          <FadeUp delay={0.1}><Carousel /></FadeUp>
          <FadeUp delay={0.15} style={{ marginTop: 22 }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '30px' }}>
              <div className="amenities-wrap" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
                {AMENITIES.map(a => (
                  <div key={a.label} className="amenity-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, width: 150 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <OptImg loading="lazy" src={a.icon} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: 14, color: '#fff', lineHeight: 1.4 }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.2} style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <motion.a href="tel:+16619908165" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: AMBER, color: NAVY_BTN, fontWeight: 500, fontSize: 18, padding: '14px 28px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', lineHeight: 1 }}>
              <OptImg loading="lazy" src={PHONE_IC} alt="" style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />
              <span>Call (661) 990-8165</span>
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ RECOVERY — THE WAY IT SHOULD FEEL ═════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <DecorativeBg position="bottom-left" size={340} opacity={1} offset={120} />
        <div className="lp-inner" style={{ position: 'relative', zIndex: 1 }}>
          <FadeUp style={{ marginBottom: 48, textAlign: 'center' }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: N, marginBottom: 16 }}>Recovery, The Way It Should Feel</h2>
            <p style={{ color: '#555', fontSize: 16, lineHeight: 1.65, maxWidth: 720, margin: '0 auto' }}>
              We built this program around the belief that comfort, dignity, and real human connection aren't luxuries in recovery — they're necessities. We also provide complimentary transportation for verified patients, so logistics never stand between you and the care you need.
            </p>
          </FadeUp>
          {[RECOVERY_ITEMS.slice(0,4), RECOVERY_ITEMS.slice(4)].map((group, gi) => (
            <div key={gi}>
              {gi === 1 && <div style={{ borderTop: `1px dashed ${O}`, margin: '4px 0 8px' }} />}
              <div className="recovery-grid">
                {group.map((item, idx) => (
                  <FadeUp key={item.title} delay={(gi * 4 + idx) * 0.07}>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '10px' }}>
                      <div style={{ width: 70, height: 70, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <OptImg loading="lazy" src={item.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, padding: '10px 0' }}>
                        <p style={{ fontWeight: 500, fontSize: 18, color: N, marginBottom: 6, lineHeight: '22px' }}>{item.title}</p>
                        <p style={{ color: '#000', fontSize: 16, lineHeight: 1.5 }}>{item.desc}</p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          ))}
          <FadeUp style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <motion.a href="tel:+16619908165" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: N, color: '#fff', fontWeight: 600, fontSize: 18, padding: '14px 40px', borderRadius: 4, textDecoration: 'none', letterSpacing: '0.01em' }}>
              Connect with Treatment
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ COUPLES BANNER — full-width, centered, no photo ════════════ */}
      <section style={{ background: DT, padding: '76px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="lp-inner" style={{ position: 'relative', zIndex: 1 }}>
          <FadeUp style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto' }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <OptImg src={REC_COUPLES} alt="" style={{ width: 42, height: 42, objectFit: 'contain' }} />
            </div>
            <p style={{ color: T, fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
              You shouldn't have to choose
            </p>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: '#fff', lineHeight: 1.15, marginBottom: 18 }}>
              Couples Heal Here — Side by Side
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, lineHeight: 1.65, marginBottom: 32 }}>
              We're one of the few centers in California where couples go through detox and residential treatment together — with both shared and individual therapy. The people who struggled together can get well together, without ever choosing between recovery and the person they love.
            </p>
            <motion.a href="tel:+16619908165" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: AMBER, color: NAVY_BTN, fontWeight: 500, fontSize: 18, padding: '14px 32px', borderRadius: 4, textDecoration: 'none', lineHeight: 1 }}>
              <OptImg src={PHONE_IC} alt="" style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />
              <span>Call Today (661) 990-8165</span>
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ TREATMENT PATH (Seccion 3) ═════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '70px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: N, marginBottom: 14 }}>Your Recovery Path to Healthy Living</h2>
            <p style={{ color: '#222', fontSize: 16, lineHeight: 1.65, maxWidth: 800, margin: '0 auto' }}>
              Whether you're seeking intensive support or looking to balance treatment with daily life, we offer a full continuum of care that meets you where you are in life.
            </p>
          </FadeUp>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Row 1 — photo left (mirrored per Figma), text right */}
            <FadeUp>
              <div className="treatment-row" style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '30px 0', borderBottom: `1px solid ${O}` }}>
                <div className="treatment-photo" style={{ width: 310, flexShrink: 0, alignSelf: 'stretch', minHeight: 260, borderRadius: 10, overflow: 'hidden' }}>
                  <OptImg loading="lazy" src={SEC3_DETOX} alt="Medical Detox" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                </div>
                <div style={{ flex: 1, paddingLeft: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: N, marginBottom: 16, lineHeight: '22px' }}>Medical Detox & Medication-Assisted Treatment (MAT)</h3>
                  <p style={{ color: '#000', fontSize: 16, lineHeight: 1.7 }}>
                    When you arrive, one of our physicians evaluates you personally to understand exactly what you need, and if Medication-Assisted Treatment (MAT) can ease withdrawal, we decide together what's right for you. Our care team is with you around the clock, and most people stay between 5 and 14 days, tailored to your health and how your body responds.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Row 2 — DOM order: photo first (matches mobile order). Desktop flips visually with row-reverse */}
            <FadeUp delay={0.1}>
              <div className="treatment-row treatment-row-reverse" style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '30px 0', borderBottom: `1px solid ${O}` }}>
                <div className="treatment-photo" style={{ width: 310, flexShrink: 0, alignSelf: 'stretch', minHeight: 260, borderRadius: 10, overflow: 'hidden' }}>
                  <OptImg loading="lazy" src={SEC3_RESID} alt="Residential Treatment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, paddingLeft: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: N, marginBottom: 16, lineHeight: '22px' }}>Inpatient Residential Treatment Program</h3>
                  <p style={{ color: '#000', fontSize: 16, lineHeight: 1.7 }}>
                    Once you're stable, our therapists, counselors, and experiential instructors build a recovery plan that's truly yours — healing the mind, body, and spirit through a structured daily schedule in the calm, private hills of Santa Clarita. Most residential stays range from 1 to 3 months, depending on your progress and treatment needs.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Row 3 — photo left, text right */}
            <FadeUp delay={0.15}>
              <div className="treatment-row" style={{ display: 'flex', gap: 20, alignItems: 'center', padding: '30px 0' }}>
                <div className="treatment-photo" style={{ width: 310, flexShrink: 0, alignSelf: 'stretch', minHeight: 260, borderRadius: 10, overflow: 'hidden' }}>
                  <OptImg loading="lazy" src={SEC3_AFTER} alt="Aftercare" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, paddingLeft: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: N, marginBottom: 16, lineHeight: '22px' }}>Aftercare Planning, Ongoing Care, & Alumni</h3>
                  <p style={{ color: '#000', fontSize: 16, lineHeight: 1.7 }}>
                    Recovery is a lifelong journey, so we make sure you leave with a plan — connecting you to outpatient and sober living services across Santa Clarita and Los Angeles, plus an alumni program with online support groups and monthly in-person meetings to keep you connected long after treatment.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>

          <FadeUp style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <motion.a href="tel:+16619908165" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: N, color: '#fff', fontWeight: 500, fontSize: 18, padding: '14px 32px', borderRadius: 4, textDecoration: 'none' }}>
              Begin Treatment
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ CONDITIONS ═════════════════════════════════════════════════ */}
      <section id="conditions" style={{ background: DT, padding: '70px 0' }}>
        <div className="lp-wide">
          <FadeUp style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Care for Every Type of Addiction</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6, maxWidth: 700, margin: '0 auto' }}>
              Addiction doesn't look the same for everyone — and neither does our care. Whatever you're facing, we have the experience and the compassion to help.
            </p>
          </FadeUp>
          <ConditionsCarousel conditions={CONDITIONS} />
          <FadeUp delay={0.2} style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
            <motion.a href="tel:+16619908165" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: AMBER, color: NAVY_BTN, fontWeight: 500, fontSize: 18, padding: '14px 32px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', lineHeight: 1 }}>
              <OptImg loading="lazy" src={PHONE_IC} alt="" style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />
              <span>We're Here to Support</span>
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ TEAM ═══════════════════════════════════════════════════════ */}
      <section id="team" style={{ background: BG, padding: '80px 0' }}>
        <div className="lp-wide">
          <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: N, marginBottom: 14 }}>The Medical Team Behind Your Recovery</h2>
            <p style={{ color: '#555', fontSize: 16, maxWidth: 700, margin: '0 auto' }}>We know what addiction does to the brain, body, and spirit. You don't need more willpower — you need the right medical team.</p>
          </FadeUp>
          <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, alignItems: 'start' }}>
            {TEAM.map((m, idx) => (
              <FadeUp key={m.name} delay={idx * 0.08}>
                <motion.div whileHover={{ y: -4 }}>
                  {/* Photo: aspect-preserving (width %, height auto) with per-person zoom + top + left for face framing */}
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', position: 'relative', background: '#fff' }}>
                    <OptImg loading="lazy" src={m.img} alt={m.name} className="team-photo-img"
                      style={{ position: 'absolute', left: m.left, top: m.top, width: m.width, height: 'auto', maxWidth: 'none', display: 'block' }} />
                  </div>
                  <div style={{ padding: '8px 10px 0' }}>
                    <p style={{ fontWeight: 700, color: N, fontSize: 17, lineHeight: 1.25 }}>{m.name}</p>
                    <p style={{ color: '#2A7A7C', fontSize: 14, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{m.role}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════ INSURANCE ══════════════════════════════════════════════════ */}
      <section id="programs" style={{ background: '#fff', padding: '80px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: N, marginBottom: 14 }}>We Are In Network with Blue Shield and Major Insurance Companies</h2>
            <p style={{ color: '#222', fontSize: 16, maxWidth: 860, margin: '0 auto', lineHeight: 1.65 }}>We accept all PPO insurance plans and private pay. Call our admissions team and we'll walk you through your benefits so you know exactly what's covered before you commit to anything.</p>
          </FadeUp>
        </div>
        {/* Full-width marquee — sits OUTSIDE the centered container so the logo
            strip spans edge to edge. Auto-scrolling = the mobile slider too. */}
        <FadeUp delay={0.1} style={{ marginBottom: 36 }}>
          <div className="ins-logos" aria-label="Insurance logos">
            <div className="marquee-track">
              {[...INS_LOGOS, ...INS_LOGOS].map((logo, idx) => (
                <OptImg loading="lazy" key={idx} src={logo.src} alt={idx < INS_LOGOS.length ? logo.alt : ''}
                  aria-hidden={idx >= INS_LOGOS.length}
                  width={logo.width} height={logo.height}
                  className="ins-logo-img" />
              ))}
            </div>
          </div>
        </FadeUp>
        <div className="lp-inner">
          <FadeUp style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.button onClick={() => setShowInsModal(true)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: N, color: '#fff', fontWeight: 500, fontSize: 18, padding: '14px 32px', borderRadius: 4, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Verify Insurance Coverage
            </motion.button>
          </FadeUp>
        </div>
      </section>

      {/* ════ HOW IT WORKS ═══════════════════════════════════════════════ */}
      <section style={{ background: '#386376', padding: '70px 0' }}>
        <div className="lp-wide">
          <FadeUp style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: '#fff', marginBottom: 14 }}>You Call. We Handle The Rest.</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, maxWidth: 860, margin: '0 auto' }}>Connect with care anytime, day or night. Our team walks you through everything and can get you enrolled in treatment on the same day.</p>
          </FadeUp>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {[
              { icon: STEP1_IC, title: 'Step 1: Call & Speak With a\nCare Specialist',        body: 'Our team is available 24/7 to answer your questions, understand your situation, and help you determine the next right step. Every call is answered by someone who understands addiction, not an automated system or a call center. No judgment, no pressure — just an honest conversation.' },
              { icon: STEP2_IC, title: 'Step 2: Complete a Brief\nPre-Admission Screening',   body: "We'll walk you through a short, structured screening to better understand your needs, clinical history, and what level of care is appropriate. By the end of the call, you'll have a clear picture of what treatment actually looks like for you. This typically takes less than 15 minutes, and there's no obligation to commit." },
              { icon: STEP3_IC, title: 'Step 3: Review Insurance, Payment,\nand Transportation Options', body: 'Our team will verify your insurance benefits and clearly explain coverage, costs, and private pay options. We also help coordinate transportation to ensure you can access care safely and without added stress, so you can make an informed decision without pressure or surprises.' },
            ].map((s, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <div style={{ background: '#fff', borderRadius: 14, padding: '24px 22px', textAlign: 'center', height: '100%', boxShadow: '0 4px 4px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 70, height: 70, borderRadius: '50%', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <OptImg loading="lazy" src={s.icon} alt="" style={{ width: 38, height: 38, objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 500, color: N, fontSize: 20, marginBottom: 12, lineHeight: '22px', whiteSpace: 'pre-line' }}>{s.title}</h3>
                    <p style={{ color: '#222', fontSize: 16, lineHeight: 1.65 }}>{s.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════ TESTIMONIALS ═══════════════════════════════════════════════ */}
      <section id="reviews" style={{ background: BG, padding: '70px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="lp-inner reviews-layout" style={{ display: 'flex', gap: 32, alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <FadeUp className="reviews-title-col" style={{ width: 360, flexShrink: 0 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: N, lineHeight: 1.15, marginBottom: 18, letterSpacing: '-0.01em' }}>
              Real People.<br />Real Recovery.
            </h2>
            <p style={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>These are the stories that remind us why we do this work.</p>
          </FadeUp>
          <ReviewsCarousel />
        </div>
      </section>

      {/* ════ STATS ══════════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(to bottom, #0D3442 0%, #56B5B7 100%)', padding: '60px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div className="lp-inner" style={{ position: 'relative', zIndex: 1 }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: 50 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: '#fff' }}>Thousands Served — Decades of Trust</h2>
          </FadeUp>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { val: 90,  suffix: '%', label: 'Client satisfaction based on post-treatment surveys', icon: STAT1_IC },
              { val: 175, suffix: '+', label: 'Years of combined experience across our clinical team', icon: STAT2_IC },
              { val: 30,  suffix: '+', label: 'Evidence-based and holistic treatment modalities',     icon: STAT3_IC },
              { val: 93,  suffix: '%', label: 'Completion rate for residential treatment',             icon: STAT4_IC },
            ].map((s, idx) => (
              <FadeUp key={s.label} delay={idx * 0.08}>
                <div style={{ position: 'relative', paddingTop: 28 }}>
                  {/* Icon circle floating above card */}
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 56, height: 56, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                    <OptImg loading="lazy" src={s.icon} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                  </div>
                  {/* Card — rectangular per Figma 255x127 inner */}
                  <div style={{ background: BG, borderRadius: 8, padding: '36px 14px 18px', textAlign: 'center', minHeight: 127 }}>
                    <div style={{ fontSize: 32, fontWeight: 600, color: N, marginBottom: 6, lineHeight: 1.1 }}>
                      {s.val}{s.suffix}
                    </div>
                    <p style={{ color: '#000', fontSize: 13, lineHeight: 1.4 }}>{s.label}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════ LOCATION ═══════════════════════════════════════════════════ */}
      <section style={{ background: BG, padding: '80px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: N, marginBottom: 14 }}>California's Hidden Gem for Recovery</h2>
            <p style={{ color: '#555', fontSize: 16, maxWidth: 800, margin: '0 auto', lineHeight: 1.65 }}>Tucked into the hills of Santa Clarita, our center draws people from across California and beyond — because when the care is right, it's worth the drive.</p>
          </FadeUp>
          <div className="location-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'stretch' }}>
            <FadeUp>
              <div style={{ borderRadius: 8, overflow: 'hidden', height: 398 }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d826!2d-118.5479!3d34.4284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c29a4e3d4b9a2b%3A0x0!2s22512+Garzota+Dr%2C+Santa+Clarita%2C+CA+91350!5e0!3m2!1sen!2sus!4v1"
                  width="100%" height="398" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" title="Healthy Living Location" />
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              {/* Joined photo + card — desktop 398 fixed (matches map height), mobile auto so text never clips */}
              <div className="location-card" style={{ borderRadius: 8, overflow: 'hidden', height: 398, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}>
                <div style={{ height: 240, flexShrink: 0 }}>
                  <OptImg loading="lazy" src={LOCATION_PHOTO} alt="Healthy Living exterior" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div className="location-text" style={{ background: '#fff', flex: 1, padding: '20px 30px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontWeight: 600, color: N, fontSize: 18, lineHeight: 1.2 }}>Healthy Living Residential Program</p>
                  <p style={{ color: '#386376', fontSize: 15 }}>22512 Garzota Drive, Santa Clarita, CA 91350</p>
                  <p style={{ color: '#333', fontSize: 14, lineHeight: 1.55 }}>A physician-owned detox and residential treatment center offering medically supervised care for adults ready to reclaim their lives.</p>
                </div>
              </div>
            </FadeUp>
          </div>
          <FadeUp style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
            <motion.a href="tel:+16619908165" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: N, color: '#fff', fontWeight: 500, fontSize: 18, padding: '14px 32px', borderRadius: 4, textDecoration: 'none' }}>
              Check Availability
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ FAQ ════════════════════════════════════════════════════════ */}
      <section style={{ background: BG, padding: '70px 0', position: 'relative', overflow: 'hidden' }}>
        <DecorativeBg position="bottom-left" size={340} opacity={1} offset={120} contrast="boost" />
        <div className="lp-inner" style={{ position: 'relative', zIndex: 1 }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2 style={{ fontSize: 40, fontWeight: 600, color: N }}>Frequently Asked Questions</h2>
          </FadeUp>
          <FAQ />
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <p style={{ fontSize: 22, color: N, fontWeight: 400 }}>Still Have Questions?</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: N }}>Give Us a Call</p>
          </div>
        </div>
      </section>

      {/* ════ MOBILE FORM ════════════════════════════════════════════════ */}
      <section id="form" className="mobile-form-section" style={{ background: BG, padding: '48px 24px' }}>
        <div style={{ maxWidth: 440, margin: '0 auto', background: '#fff', borderRadius: 12, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ color: N, fontWeight: 500, fontSize: 16 }}>Get Instant Insurance Verification</span>
            <OptImg loading="lazy" src={FORM_IC} alt="" style={{ height: 24, width: 'auto', maxWidth: 50, objectFit: 'contain', flexShrink: 0 }} />
          </div>
          <InsuranceForm />
        </div>
      </section>

      {/* ════ CTA ════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', textAlign: 'center', overflow: 'hidden', padding: '50px 0' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <OptImg loading="lazy" src={CTA_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.68)' }} />
        </div>
        <div className="lp-inner" style={{ position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <h2 style={{ color: '#fff', fontSize: 40, fontWeight: 600, marginBottom: 16 }}>Your Next Step Takes One Phone Call.</h2>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 18, lineHeight: 1.6, marginBottom: 36 }}>
              Same-day admissions available. We handle insurance, transportation, and intake &mdash; you just need to call.
            </p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.a href="tel:+16619908165" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: N, color: '#fff', fontWeight: 500, fontSize: 18, padding: '14px 28px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, textDecoration: 'none', lineHeight: 1 }}>
                <OptImg loading="lazy" src={PHONE_IC} alt="" style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0, filter: 'brightness(0) invert(1)' }} />
                <span>Call Now — (661) 990-8165</span>
              </motion.a>
              <motion.button onClick={() => setShowInsModal(true)}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: AMBER, color: NAVY_BTN, fontWeight: 500, fontSize: 18, padding: '14px 28px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit', lineHeight: 1 }}>
                <OptImg loading="lazy" src={INS_BTN_IC} alt="" style={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }} />
                <span>Verify Insurance</span>
              </motion.button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════ FOOTER ═════════════════════════════════════════════════════ */}
      <footer style={{ background: N, padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>© Copyright 2026 Healthy Living Residential Program | All Rights Reserved</p>
      </footer>

      {/* ════ INSURANCE MODAL ════════════════════════════════════════════ */}
      <AnimatePresence>
        {showInsModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowInsModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ins-modal-title"
              style={{ background: BG, borderRadius: 12, padding: '32px 28px', width: '100%', maxWidth: 560, maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.35)', position: 'relative' }}>
              <button onClick={() => setShowInsModal(false)} aria-label="Close insurance verification form"
                style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', fontSize: 18, color: N, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>✕</button>
              <div id="ins-modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 18 }}>
                <span style={{ color: N, fontWeight: 600, fontSize: 18 }}>Get Instant Insurance Verification</span>
                <OptImg loading="lazy" src={FORM_IC} alt="" style={{ height: 24, width: 'auto', maxWidth: 50, objectFit: 'contain', flexShrink: 0 }} />
              </div>
              <InsuranceForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
