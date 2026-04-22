'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* ── Figma assets ──────────────────────────────────────────────────── */
const LOGO      = 'https://www.figma.com/api/mcp/asset/95149e25-61a7-43bb-b5d8-51f47f2471ec';
const CHECK_IC  = 'https://www.figma.com/api/mcp/asset/abfeea39-627e-49a2-9c6d-f6ce7dac3834';
const BADGE_G   = 'https://www.figma.com/api/mcp/asset/e778e28a-f7bc-4890-8dc9-76f797149c07';
const BADGE_B   = 'https://www.figma.com/api/mcp/asset/ac55cd49-4d39-4d9a-a7c7-02f1173479f1';
const DHCS      = 'https://www.figma.com/api/mcp/asset/309f06dd-d5f7-4810-9cc1-dedb9959abd4';
const PSYCH     = 'https://www.figma.com/api/mcp/asset/5e4cff02-23aa-45a1-ba31-6bbc65c73cbd';
const SAMHSA    = 'https://www.figma.com/api/mcp/asset/32e81d88-f4a7-4133-92b6-1587706458cf';
const FORM_IC   = 'https://www.figma.com/api/mcp/asset/54b75fc0-72ff-472f-bcf7-2043d2e92f90';
const HERO_BG   = 'https://www.figma.com/api/mcp/asset/6f3bedab-6b7f-4114-8c91-e19be080da03';
const CTA_BG    = 'https://www.figma.com/api/mcp/asset/b5cddfeb-0c27-48fd-82b3-51892007dec5';
const STARS     = 'https://www.figma.com/api/mcp/asset/6d0d84c4-5abf-4e0c-b267-1051986a3f8e';
const GOOGLE_IC = 'https://www.figma.com/api/mcp/asset/3f47f82b-a218-4854-a023-584579dd8955';
const FAQ_OPEN  = 'https://www.figma.com/api/mcp/asset/318ecfed-37ab-4e53-8c81-4e39aa469df5';
const FAQ_SHUT  = 'https://www.figma.com/api/mcp/asset/35ac22b3-934f-45d7-8e76-60cfdca371cd';
const CAR_ARR   = 'https://www.figma.com/api/mcp/asset/a22864e4-c981-403e-a2e6-4827de9e9761';
/* Amenity icons */
const AMEN_1 = 'https://www.figma.com/api/mcp/asset/af4e30dc-f24c-4589-86b8-fa57aae5ef55';
const AMEN_2 = 'https://www.figma.com/api/mcp/asset/809aa185-9d20-43f5-bd45-0bab4a25ca1b';
const AMEN_3 = 'https://www.figma.com/api/mcp/asset/2baaa94b-5cbc-4666-8e73-d76dd145698b';
const AMEN_4 = 'https://www.figma.com/api/mcp/asset/b006e088-8294-412e-a99c-19afc09a900b';
const AMEN_5 = 'https://www.figma.com/api/mcp/asset/e043a9de-af0d-4392-ba0d-b91701480d9e';
/* Condition icons */
const IC_ALCOHOL  = 'https://www.figma.com/api/mcp/asset/7b436f39-0056-4b72-b656-1ac9065f51c3';
const IC_OPIOID   = 'https://www.figma.com/api/mcp/asset/a228c9f5-dd18-422d-af88-72c069c37822';
const IC_BENZO    = 'https://www.figma.com/api/mcp/asset/91942f7a-e33c-412d-ac2e-56b9f2605701';
const IC_COCAINE  = 'https://www.figma.com/api/mcp/asset/6ce1dd58-85f8-4783-8bc5-90fb03d26e9f';
const IC_FENTANYL = 'https://www.figma.com/api/mcp/asset/5282761b-1072-4bc1-a2a7-43c1077fee69';
const IC_HEROIN   = 'https://www.figma.com/api/mcp/asset/4a9aa952-3a3b-49cd-9d69-8f52fc2f45e8';
const IC_DUAL     = 'https://www.figma.com/api/mcp/asset/46bf0366-8192-4901-8a31-4be2193272f6';
/* Facility photos */
const FACILITY = [
  'https://www.figma.com/api/mcp/asset/f512ffa9-59e2-4924-85f1-89485252fd52',
  'https://www.figma.com/api/mcp/asset/3f813642-1471-43e4-8af8-a03216d94521',
  'https://www.figma.com/api/mcp/asset/bb59a618-cf5c-4f75-84fb-b7537f90aea4',
  'https://www.figma.com/api/mcp/asset/3af565a6-fb71-4dfa-8df8-b483dbfe43b2',
  'https://www.figma.com/api/mcp/asset/04b6b52b-4fe3-4e1f-901f-095bf942e6d6',
  'https://www.figma.com/api/mcp/asset/66837714-dd12-4975-aba8-69289f2122d8',
  'https://www.figma.com/api/mcp/asset/21c19e84-39bc-41fd-a486-22adffbfda81',
  'https://www.figma.com/api/mcp/asset/7373332a-00b3-4899-af92-2d0f9cb927bc',
  'https://www.figma.com/api/mcp/asset/6ccc3bda-6a5d-49e7-8b57-60628f583c07',
  'https://www.figma.com/api/mcp/asset/08330834-0336-470f-bc74-45f724e35d66',
  'https://www.figma.com/api/mcp/asset/bdce1109-c1b5-4b79-a074-98b0ec265ee7',
  'https://www.figma.com/api/mcp/asset/8997a457-d514-4a90-9dcd-a0b8ef975293',
  'https://www.figma.com/api/mcp/asset/9ea0bc5b-c397-434e-9b19-434ecaf285fb',
  'https://www.figma.com/api/mcp/asset/489e13dc-e9db-474a-9b56-6605b18cfbc7',
  'https://www.figma.com/api/mcp/asset/e16460e9-ec69-41f1-b71c-1e5bc2149710',
  'https://www.figma.com/api/mcp/asset/f18cce0f-42a4-469f-b950-d90c59611c76',
];
/* Real Google reviewers */
const REVIEWERS = [
  { photo: 'https://www.figma.com/api/mcp/asset/83127b99-39f2-43fc-b3a9-e05a78fa8046', name: 'Jose Martinez',     text: 'Well first off the staff are all about assisting the clients with their needs — they go above and beyond. The food is beyond great. The medical attention is on point. I\'ve been to a few programs and this is the best one hands down.' },
  { photo: 'https://www.figma.com/api/mcp/asset/01fd596c-5475-41ba-a47e-62c21b16814a', name: 'Melissa Jenkins',   text: 'This was my first experience at a treatment program. I was very nervous but the staff were unbelievable! I ended up staying the full 30 days and I\'m so glad I did. I can\'t recommend Healthy Living enough.' },
  { photo: 'https://www.figma.com/api/mcp/asset/758779c3-d3a0-4c04-8122-9ffe4aa02913', name: 'Gilbert Pimienta',  text: 'Healthy Living truly exceeded my expectations. The staff is highly professional and incredibly compassionate. The facility is clean and comfortable. Thanks to Healthy Living, I\'ve made meaningful progress.' },
  { photo: 'https://www.figma.com/api/mcp/asset/cfc93faa-711c-4f7f-8543-08991d40fcbe', name: 'Jordan',            text: 'The staff here really care about you and your wellbeing. During detox they made it as smooth and comfortable as possible. The food is amazing. The counseling and therapy is top notch. 10 out of 10.' },
  { photo: 'https://www.figma.com/api/mcp/asset/e19e5a4d-5ea0-41e4-8627-4e7b8302721c', name: 'Nicolas Arp',       text: 'I had a really good experience here. We did a lot of really cool activities like hiking, time by the fireplace, outings to the movies and going thrifting. I would highly recommend!' },
  { photo: 'https://www.figma.com/api/mcp/asset/13dda1b7-ca89-44b0-a6a3-54d45a5f8a9a', name: 'C Los',             text: 'Healthy Living is the best detox and residential program around, hands down. They picked up as soon as I called, I was in treatment the following day. You get to keep your phone, therapy every week, I had my own room and private bathroom.' },
  { photo: 'https://www.figma.com/api/mcp/asset/78190423-3e6e-423a-a256-30242a43bf9b', name: 'Rachel Vassell',    text: 'This treatment center was a great experience. It\'s like living at a five-star hotel — they cater to your every need mentally and physically and go above and beyond. Thank you so much Healthy Living.' },
];

/* ── Design tokens ─────────────────────────────────────── */
const N  = '#0D3442';
const T  = '#56B5B7';
const O  = '#F9A21C';
const BG = '#EDF4F4';
const DT = '#174154';
const G  = '#CEA36F';

/* ── Tiny utilities ────────────────────────────────────── */
function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }} style={style}>
      {children}
    </motion.div>
  );
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let v = 0; const step = target / 60;
    const t = setInterval(() => { v += step; if (v >= target) { setN(target); clearInterval(t); } else setN(Math.floor(v)); }, 18);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.01L6.6 10.8z"/>
    </svg>
  );
}

/* ── Insurance form ─────────────────────────────────────── */
function InsuranceForm() {
  const [f, setF] = useState({ name: '', phone: '', email: '', policyId: '', carrier: 'Aetna', dob: '' });
  const [done, setDone] = useState(false);
  const u = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF(p => ({ ...p, [k]: e.target.value }));
  const INP: React.CSSProperties = { width: '100%', height: 40, padding: '0 12px', border: `1px solid ${T}`, borderRadius: 4, fontSize: 14, background: '#fff', boxSizing: 'border-box', outline: 'none', color: '#3a3a3a', fontFamily: 'inherit' };
  const LBL: React.CSSProperties = { display: 'block', fontSize: 13, marginBottom: 6, color: '#000', fontWeight: 500 };

  if (done) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 48, color: T, marginBottom: 12 }}>✓</div>
      <p style={{ fontWeight: 700, fontSize: 18, color: N }}>We'll call you within 15 minutes.</p>
      <p style={{ fontSize: 14, color: '#555', marginTop: 8 }}>Or call: <a href="tel:+16617625668" style={{ color: T, fontWeight: 700 }}>(661) 762-5668</a></p>
    </motion.div>
  );

  return (
    <form onSubmit={e => { e.preventDefault(); setDone(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={LBL}>Your Name<span style={{ color: '#d80027' }}>*</span></label><input required style={INP} value={f.name} onChange={u('name')} /></div>
        <div><label style={LBL}>Your Phone<span style={{ color: '#d80027' }}>*</span></label><input required type="tel" style={INP} value={f.phone} onChange={u('phone')} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div><label style={LBL}>Email<span style={{ color: '#d80027' }}>*</span></label><input required type="email" style={INP} value={f.email} onChange={u('email')} /></div>
        <div><label style={LBL}>Membership Policy ID</label><input style={INP} value={f.policyId} onChange={u('policyId')} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={LBL}>Insurance Carrier<span style={{ color: '#d80027' }}>*</span></label>
          <select required style={{ ...INP, paddingRight: 32 }} value={f.carrier} onChange={u('carrier')}>
            {['Aetna','Anthem','Cigna','Humana','United','BlueCross','Beacon','Optum','Magellan','Other PPO'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label style={LBL}>Date of Birth</label><input placeholder="MM/DD/YYYY" style={INP} value={f.dob} onChange={u('dob')} /></div>
      </div>
      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        style={{ width: '100%', padding: '14px 16px', background: O, color: N, border: 'none', borderRadius: 4, fontSize: 18, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
        Check Your Coverage
      </motion.button>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#666', fontStyle: 'italic', margin: 0 }}>
        Your information is private and secure. No pressure to commit.
      </p>
    </form>
  );
}

/* ── Facility Carousel (auto-advances every 4s) ─────────── */
function Carousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const prev = () => setI(a => (a - 1 + FACILITY.length) % FACILITY.length);
  const next = () => setI(a => (a + 1) % FACILITY.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI(a => (a + 1) % FACILITY.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', height: 320 }}>
        <AnimatePresence mode="wait">
          <motion.img key={i} src={FACILITY[i]} alt=""
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
        </AnimatePresence>
        {[{ fn: prev, side: 'left', rot: 'rotate(180deg)' }, { fn: next, side: 'right', rot: 'none' }].map(({ fn, side, rot }) => (
          <button key={side} onClick={fn} style={{ position: 'absolute', [side]: 20, top: '50%', transform: 'translateY(-50%)', width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 2 }}>
            <img src={CAR_ARR} alt="" style={{ width: 20, height: 20, transform: rot }} />
          </button>
        ))}
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 2 }}>
          {FACILITY.slice(0, 12).map((_, di) => (
            <button key={di} onClick={() => setI(di)}
              style={{ width: di === i ? 18 : 6, height: 6, borderRadius: 3, background: di === i ? '#fff' : 'rgba(255,255,255,0.45)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
        {FACILITY.slice(0, 6).map((src, idx) => (
          <button key={idx} onClick={() => setI(idx)} style={{ flexShrink: 0, padding: 0, background: 'none', border: 'none', cursor: 'pointer', position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
            <img src={src} alt="" style={{ width: 168, height: 80, objectFit: 'cover', display: 'block', borderRadius: 4 }} />
            {idx !== i && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.65)', borderRadius: 4 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Conditions Carousel (auto-advances every 3.5s) ─────── */
function ConditionsCarousel({ conditions }: { conditions: { icon: string; title: string; desc: string }[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = conditions.length;
  const next = () => setIdx(a => (a + 1) % total);
  const prev = () => setIdx(a => (a - 1 + total) % total);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 3500);
    return () => clearInterval(t);
  }, [paused]);

  const getSlice = () => Array.from({ length: 3 }, (_, o) => conditions[(idx + o) % total]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Common Conditions:</p>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {getSlice().map((c, o) => (
            <motion.div key={o} whileHover={{ y: -4, boxShadow: '0 10px 28px rgba(0,0,0,0.18)' }}
              style={{ background: '#fff', borderRadius: 10, padding: '28px 20px', boxShadow: '0 4px 4px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={c.icon} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />
              </div>
              <p style={{ fontSize: 17, fontWeight: 600, color: N, lineHeight: 1.3 }}>{c.title}</p>
              <p style={{ fontSize: 13, color: '#444', lineHeight: 1.65 }}>{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 22 }}>
        {conditions.map((_, di) => (
          <button key={di} onClick={() => setIdx(di)}
            style={{ width: di === idx ? 20 : 8, height: 8, borderRadius: 4, background: di === idx ? O : 'rgba(255,255,255,0.35)', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

/* ── FAQ ────────────────────────────────────────────────── */
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
    { q: 'What happens after I complete the residential program?', a: 'We connect you with outpatient programs, sober living, and ongoing therapy in Santa Clarita and Los Angeles. Our alumni program provides online support groups and monthly meetings.' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 860, margin: '0 auto' }}>
      {items.map((item, idx) => (
        <div key={idx} style={{ borderRadius: 10, overflow: 'hidden' }}>
          <button onClick={() => setOpen(open === idx ? null : idx)}
            style={{ width: '100%', background: open === idx ? '#386376' : N, border: 'none', padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ color: '#fff', fontSize: 17, fontWeight: 500, textAlign: 'left', lineHeight: 1.35 }}>{item.q}</span>
            <img src={open === idx ? FAQ_OPEN : FAQ_SHUT} alt="" style={{ width: 26, height: 26, flexShrink: 0 }} />
          </button>
          <AnimatePresence>
            {open === idx && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden', background: '#fff' }}>
                <p style={{ padding: '16px 20px', color: '#333', fontSize: 15, lineHeight: 1.7 }}>{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
      <AnimatePresence>
        {!scrolled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 50, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ background: T, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, textAlign: 'center', padding: '0 16px' }}>
              Support Available 24/7 — ⚠️ We do not accept Medicare or Medicaid
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ background: N, boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.35)' : 'none' }}>
        <div className="lp-wide" style={{ height: 110, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={LOGO} alt="Healthy Living Residential Program" style={{ height: 44, objectFit: 'contain' }} />
          <motion.a href="tel:+16617625668" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ background: O, color: N, fontWeight: 600, fontSize: 17, padding: '14px 20px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            <PhoneIcon />Call Us &nbsp;(661) 762-5668
          </motion.a>
        </div>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Page() {

  const AMENITIES = [
    { label: 'Outdoor Activities & Beach Access',    icon: AMEN_1 },
    { label: 'Nature Immersion & Gardening',          icon: AMEN_2 },
    { label: 'Music, Art & Movementt Therapy',        icon: AMEN_3 },
    { label: 'Chef-Prepared Meals & Nutrition Plans', icon: AMEN_4 },
    { label: 'Cellphones Allowed & Wifi Available',   icon: AMEN_5 },
  ];

  const CONDITIONS = [
    { icon: IC_ALCOHOL,  title: 'Alcohol Addiction',          desc: 'Alcohol withdrawal can be dangerous — our medical team monitors you closely from day one.' },
    { icon: IC_OPIOID,   title: 'Opioid Addiction',           desc: 'Prescription opioid dependence often begins with real pain — we treat the whole picture.' },
    { icon: IC_BENZO,    title: 'Benzodiazepine Addiction',   desc: 'Often prescribed with the best intentions. Our medically supervised care helps you taper safely.' },
    { icon: IC_COCAINE,  title: 'Cocaine Addiction',          desc: 'Cocaine rewires how the brain experiences pleasure — we help you find joy without it.' },
    { icon: IC_FENTANYL, title: 'Fentanyl Addiction',         desc: 'Fentanyl withdrawal can be dangerous — our medical team is here to get you through it safely.' },
    { icon: IC_HEROIN,   title: 'Heroin Addiction',           desc: "We know how deeply heroin takes hold. We're here to meet you exactly where you are, without judgment." },
    { icon: IC_DUAL,     title: 'Co-Occurring Disorders',     desc: 'When addiction and mental health challenges exist together, we address both at the same time.' },
  ];

  const TEAM = [
    { name: 'Dr. Narine Arutyounian M.D.', role: 'Medical Director',               img: 'https://www.figma.com/api/mcp/asset/1432219b-6001-4c1c-a00b-622e4a20eb79' },
    { name: 'Dr. Harout Mesrobian',         role: 'CEO',                            img: 'https://www.figma.com/api/mcp/asset/44608dac-be6f-4e77-99d1-22fca21e2080' },
    { name: 'Ritsa Fistes, LMFT',           role: 'Clinical Director',              img: 'https://www.figma.com/api/mcp/asset/0b000bb6-f333-4821-af9a-fd606badaab9' },
    { name: 'Julie Tatian',                 role: 'Psychiatric Nurse Practitioner', img: 'https://www.figma.com/api/mcp/asset/d0f26f81-5f32-470f-ad9a-e06997fd668f' },
  ];

  const INSURERS = ['Aetna','Anthem','Cigna','Humana','United','BlueCross','Magellan','Beacon','Optum','ComPsych','MHN','Molina','MultiPlan','Ambetter'];

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", color: N }}>
      <Header />

      {/* ════ HERO ════════════════════════════════════════ */}
      <section style={{ position: 'relative', background: BG }}>
        {/* push content below fixed header */}
        <div style={{ height: 160 }} />
        {/* full-bleed background photo */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={HERO_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center right' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(237,244,244,0.98) 0%, rgba(237,244,244,0.95) 35%, rgba(237,244,244,0.7) 60%, rgba(237,244,244,0.1) 80%, rgba(237,244,244,0) 100%)' }} />
        </div>
        {/* content */}
        <div className="lp-inner" style={{ position: 'relative', zIndex: 1, paddingTop: 50, paddingBottom: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {/* LEFT */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                style={{ fontSize: 50, fontWeight: 800, lineHeight: 1.15, color: N, marginBottom: 16 }}>
                Physician-Owned Detox &<br />Residential Treatment
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                style={{ color: '#386376', fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
                ⭐️⭐️⭐️⭐️⭐ 4.9/5 on Google from 78+ Reviews
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                style={{ color: N, fontSize: 16, lineHeight: 1.65, marginBottom: 24, maxWidth: 560 }}>
                Founded by two board-certified addiction physicians and built around the whole person, we offer a comfortable, medically guided path to lasting change in the hills of Santa Clarita.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 40px', marginBottom: 28, maxWidth: 460 }}>
                {['Same-Day Admissions 24/7', 'Couples Are Welcome', 'Comfort-Focused Detox & MAT', 'Pet-Friendly'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={CHECK_IC} alt="" style={{ width: 20, height: 20, flexShrink: 0 }} />
                    <span style={{ fontSize: 15, color: N }}>{t}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
                <motion.a href="tel:+16617625668" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ background: N, color: '#fff', fontWeight: 500, fontSize: 17, padding: '14px 20px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  <PhoneIcon />Speak with Admissions 24/7
                </motion.a>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'nowrap' }}>
                  <img src={BADGE_G}  alt="Badge" style={{ height: 38, objectFit: 'contain', flexShrink: 0 }} />
                  <img src={BADGE_B}  alt="Badge" style={{ height: 36, objectFit: 'contain', flexShrink: 0 }} />
                  <img src={DHCS}     alt="DHCS"  style={{ height: 20, objectFit: 'contain', flexShrink: 0 }} />
                  <img src={PSYCH}    alt="Psychology Today" style={{ height: 24, objectFit: 'contain', flexShrink: 0 }} />
                  <img src={SAMHSA}   alt="SAMHSA" style={{ height: 24, objectFit: 'contain', flexShrink: 0 }} />
                </div>
              </motion.div>
            </div>
            {/* RIGHT — form card, desktop only */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-form"
              style={{ width: 530, flexShrink: 0, background: 'rgba(237,244,244,0.88)', backdropFilter: 'blur(8px)', border: '1px solid rgba(86,181,183,0.18)', borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', padding: '28px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <span style={{ color: N, fontWeight: 600, fontSize: 15 }}>Get Instant Insurance Verification</span>
                <img src={FORM_IC} alt="" style={{ height: 22, objectFit: 'contain' }} />
              </div>
              <InsuranceForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════ SUB-NAV ══════════════════════════════════════ */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 110, zIndex: 40 }}>
        <div className="lp-inner" style={{ display: 'flex', justifyContent: 'center', gap: 48 }}>
          {[
            { label: 'Our Center',          href: 'our-center' },
            { label: 'Conditions We Treat', href: 'conditions' },
            { label: 'Programs',            href: 'programs'   },
          ].map(({ label, href }) => (
            <button key={label} onClick={() => {
              const el = document.getElementById(href);
              if (!el) return;
              const offset = 110 + 48; // sticky header + subnav height
              const top = el.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: 'smooth' });
            }} style={{ padding: '12px 0', fontSize: 15, color: N, fontWeight: 400, borderBottom: `2px solid transparent`, background: 'none', cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ════ FACILITY ════════════════════════════════════ */}
      <section id="our-center" style={{ background: 'linear-gradient(to top, #0D3442, #386376)', padding: '70px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2 style={{ fontSize: 40, fontWeight: 500, color: '#fff', marginBottom: 16 }}>Healthy Living Isn't Just Our Name</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>It's what we help you achieve.</p>
          </FadeUp>
          <FadeUp delay={0.1}><Carousel /></FadeUp>
          <FadeUp delay={0.15} style={{ marginTop: 22 }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, boxShadow: '0 4px 4px rgba(0,0,0,0.25)', padding: '30px 30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
                {AMENITIES.map(a => (
                  <div key={a.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, width: 150 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img src={a.icon} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: 14, color: '#fff', lineHeight: 1.4, fontWeight: 400 }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.2} style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: O, color: N, fontWeight: 600, fontSize: 17, padding: '14px 28px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <PhoneIcon />Call (661) 762-5668
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ TRAUMA ═══════════════════════════════════════ */}
      <section style={{ background: N, padding: '80px 0' }}>
        <div className="lp-inner" style={{ display: 'flex', gap: 60, alignItems: 'center', flexWrap: 'wrap' }}>
          <FadeUp style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ color: '#fff', fontSize: 36, fontWeight: 700, lineHeight: 1.25, marginBottom: 20 }}>
              Addiction Rarely Tells The Whole Story. Trauma Does.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.75, marginBottom: 32, maxWidth: 640 }}>
              Our team is also trained to recognize and gently address the trauma that drives addiction — including EMDR therapy for those who are ready to go deeper and end the cycle of trauma.
            </p>
            <motion.a href="tel:+16617625668" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ background: O, color: N, fontWeight: 600, fontSize: 17, padding: '14px 24px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <PhoneIcon />Call Today (661) 762-5668
            </motion.a>
          </FadeUp>
          <FadeUp delay={0.15} style={{ flexShrink: 0 }}>
            <div style={{ width: 310, height: 351, borderRadius: 8, overflow: 'hidden' }}>
              <img src={FACILITY[2]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════ TREATMENT PATH ═══════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: N, marginBottom: 14 }}>Your Recovery Path to Healthy Living</h2>
            <p style={{ color: '#666', fontSize: 16, lineHeight: 1.65, maxWidth: 800 }}>Whether you're seeking intensive support or looking to balance treatment with daily life, we offer a full continuum of care that meets you where you are.</p>
          </FadeUp>
          {[
            { title: 'Medical Detox & Medication-Assisted Treatment (MAT)', img: FACILITY[4], left: false,
              body: "When you arrive, one of our physicians will sit down with you for a thorough medical evaluation — not just to check boxes, but to truly understand where you are and what you need. If Medication-Assisted Treatment can make withdrawal more manageable, we'll discuss it together. Our care team is with you around the clock. Most people stay between 5 and 14 days, tailored to your health, your history, and how your body responds." },
            { title: 'Inpatient Residential Treatment Program', img: FACILITY[7], left: true,
              body: "Once you're stable, our team of therapists, counselors, and experiential instructors work with you to build a recovery plan that's truly yours. Our residential program focuses on healing the mind, body, and spirit through clinical therapy, experiential work, and consistent support in the hills of Santa Clarita. Most residential stays range from 1 to 3 months." },
            { title: 'Aftercare Planning, Ongoing Care & Alumni', img: FACILITY[11], left: false,
              body: "Recovery is a lifelong journey. We ensure you have the resources and support to maintain sobriety and continue healing. We connect you with outpatient and sober living services in Santa Clarita and Los Angeles. Our alumni program provides online support groups and monthly meetings to stay connected with others in recovery." },
          ].map(({ title, img, left, body }, idx) => (
            <div key={title}>
              <FadeUp delay={idx * 0.1}>
                <div style={{ display: 'flex', flexDirection: left ? 'row-reverse' : 'row', gap: 0, alignItems: 'stretch', flexWrap: 'wrap' }}>
                  <div style={{ width: 310, flexShrink: 0, overflow: 'hidden', minHeight: 280 }}>
                    <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ flex: 1, padding: '32px 40px', minWidth: 200 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: N, marginBottom: 16 }}>{title}</h3>
                    <p style={{ color: '#555', fontSize: 15, lineHeight: 1.8 }}>{body}</p>
                  </div>
                </div>
              </FadeUp>
              {idx < 2 && <div style={{ borderTop: '1px solid #e5e7eb' }} />}
            </div>
          ))}
          <FadeUp style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: O, color: N, fontWeight: 600, fontSize: 17, padding: '14px 32px', borderRadius: 4, textDecoration: 'none' }}>
              Begin Treatment
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ CONDITIONS ═══════════════════════════════════ */}
      <section id="conditions" style={{ background: DT, padding: '70px 0' }}>
        <div className="lp-wide">
          <FadeUp style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 40, fontWeight: 500, color: '#fff', marginBottom: 16 }}>Care for Every Type of Addiction</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.6, maxWidth: 700, margin: '0 auto' }}>
              Addiction doesn't look the same for everyone — and neither does our care. Whatever you're facing, we have the experience and the compassion to help.
            </p>
          </FadeUp>
          <ConditionsCarousel conditions={CONDITIONS} />
          <FadeUp delay={0.2} style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
            <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: O, color: N, fontWeight: 600, fontSize: 17, padding: '14px 32px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <PhoneIcon />We're Here to Support
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ TEAM ═════════════════════════════════════════ */}
      <section style={{ background: BG, padding: '80px 0' }}>
        <div className="lp-wide">
          <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: N, marginBottom: 14 }}>The Medical Team Behind Your Recovery</h2>
            <p style={{ color: '#555', fontSize: 16, maxWidth: 700, margin: '0 auto' }}>We know what addiction does to the brain, body, and spirit. You don't need more willpower — you need the right medical team.</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {TEAM.map((m, idx) => (
              <FadeUp key={m.name} delay={idx * 0.08}>
                <motion.div whileHover={{ y: -4 }}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: 4, overflow: 'hidden' }}>
                    <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ paddingTop: 14 }}>
                    <p style={{ fontWeight: 700, color: N, fontSize: 15 }}>{m.name}</p>
                    <p style={{ color: T, fontSize: 13, marginTop: 3 }}>{m.role}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════ INSURANCE ════════════════════════════════════ */}
      <section id="programs" style={{ background: '#fff', padding: '80px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: N, marginBottom: 14 }}>Care Backed by Major Insurance</h2>
            <p style={{ color: '#555', fontSize: 16, maxWidth: 800, margin: '0 auto', lineHeight: 1.65 }}>We accept all PPO insurance plans and private pay. Call our admissions team and we'll walk you through your benefits so you know exactly what's covered before you commit to anything.</p>
          </FadeUp>
          <FadeUp delay={0.1} style={{ overflow: 'hidden', marginBottom: 36 }}>
            <div className="marquee-track">
              {[...INSURERS, ...INSURERS].map((name, idx) => (
                <div key={idx} style={{ flexShrink: 0, background: BG, borderRadius: 8, padding: '12px 24px', border: '1px solid #dde8e8', color: N, fontWeight: 600, fontSize: 14 }}>
                  {name}
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp style={{ display: 'flex', justifyContent: 'center' }}>
            <motion.a href="#form" onClick={e => { e.preventDefault(); document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }); }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: O, color: N, fontWeight: 600, fontSize: 17, padding: '14px 32px', borderRadius: 4, textDecoration: 'none' }}>
              Verify Insurance Coverage
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ HOW IT WORKS ══════════════════════════════════ */}
      <section style={{ background: N, padding: '80px 0' }}>
        <div className="lp-wide">
          <FadeUp style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: '#fff', marginBottom: 14 }}>You Call. We Handle The Rest.</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 700 }}>Connect with care anytime, day or night. Our team walks you through everything and can get you enrolled in treatment the same day.</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { title: 'Step 1: Call & Speak With a Care Specialist',       body: 'Our team is available 24/7 to answer your questions, understand your situation, and help you determine the next right step.' },
              { title: 'Step 2: Complete a Brief Pre-Admission Screening',   body: "We'll walk you through a short, structured screening to better understand your needs, clinical history, and what level of care is right." },
              { title: 'Step 3: Review Insurance and Payment Options',       body: 'Our team will verify your insurance benefits and clearly explain coverage and costs so you can make an informed decision without pressure.' },
            ].map((s, idx) => (
              <FadeUp key={s.title} delay={idx * 0.1}>
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '40px 28px', textAlign: 'center', height: '100%' }}>
                  <div style={{ width: 70, height: 70, borderRadius: '50%', background: T, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{idx + 1}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 12, lineHeight: 1.4 }}>{s.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.75 }}>{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════ TESTIMONIALS ══════════════════════════════════ */}
      <section style={{ background: BG, padding: '70px 0' }}>
        <div className="lp-inner" style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <FadeUp style={{ width: 280, flexShrink: 0 }}>
            <h2 style={{ fontSize: 38, fontWeight: 500, color: N, lineHeight: 1.2, marginBottom: 16 }}>Real People.<br />Real Recovery.</h2>
            <p style={{ color: '#444', fontSize: 16, lineHeight: 1.6 }}>These are the stories that remind us why we do this work.</p>
          </FadeUp>
          <div style={{ flex: 1, overflowX: 'auto', minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 16, padding: '10px 0' }}>
              {REVIEWERS.map((r, idx) => (
                <div key={idx} style={{ background: '#fff', padding: 20, boxShadow: '0 4px 4px rgba(0,0,0,0.15)', width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 4 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <img src={r.photo} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: '#000' }}>{r.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        <img src={STARS} alt="5 stars" style={{ height: 14, width: 78 }} />
                        <img src={GOOGLE_IC} alt="Google" style={{ width: 12, height: 12 }} />
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#222', lineHeight: 1.65, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' } as any}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ STATS ════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #174154 0%, #0D3442 100%)', padding: '80px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: '#fff' }}>Thousands Served — Decades of Trust</h2>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, textAlign: 'center' }}>
            {[
              { val: 90,  suffix: '%', label: 'Client satisfaction based on post-treatment surveys' },
              { val: 175, suffix: '+', label: 'Years of combined experience across our clinical team' },
              { val: 30,  suffix: '+', label: 'Evidence-based and holistic treatment modalities' },
              { val: 93,  suffix: '%', label: 'Completion rate for residential treatment' },
            ].map((s, idx) => (
              <FadeUp key={s.label} delay={idx * 0.08}>
                <div style={{ fontSize: 52, fontWeight: 800, color: O, marginBottom: 12 }}>
                  <CountUp target={s.val} suffix={s.suffix} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.55 }}>{s.label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ════ LOCATION ══════════════════════════════════════ */}
      <section style={{ background: BG, padding: '80px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: N, marginBottom: 14 }}>California's Hidden Gem for Recovery</h2>
            <p style={{ color: '#555', fontSize: 16, maxWidth: 800, margin: '0 auto', lineHeight: 1.65 }}>Tucked into the hills of Santa Clarita, our center draws people from across California and beyond — because when the care is right, it's worth the drive.</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,530px) 1fr', gap: 24, alignItems: 'start' }}>
            <FadeUp>
              <div style={{ borderRadius: 8, overflow: 'hidden', height: 398 }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d826!2d-118.5479!3d34.4284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c29a4e3d4b9a2b%3A0x0!2s22512+Garzota+Dr%2C+Santa+Clarita%2C+CA+91350!5e0!3m2!1sen!2sus!4v1"
                  width="100%" height="398" style={{ border: 0, display: 'block' }} allowFullScreen loading="lazy" title="Healthy Living Location" />
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ borderRadius: 8, overflow: 'hidden', height: 240 }}>
                  <img src={FACILITY[0]} alt="Facility" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ background: '#fff', borderRadius: 8, padding: '20px 24px' }}>
                  <p style={{ fontWeight: 700, color: N, marginBottom: 6, fontSize: 16 }}>Healthy Living Residential Program</p>
                  <p style={{ color: N, fontSize: 14, marginBottom: 8 }}>22512 Garzota Drive, Santa Clarita, CA 91350</p>
                  <p style={{ color: '#666', fontSize: 14, lineHeight: 1.65 }}>A physician-owned detox and residential treatment center offering medically supervised care for adults ready to reclaim their lives.</p>
                </div>
              </div>
            </FadeUp>
          </div>
          <FadeUp style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
            <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: O, color: N, fontWeight: 600, fontSize: 17, padding: '14px 32px', borderRadius: 4, textDecoration: 'none' }}>
              Check Availability
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ FAQ ══════════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 40, fontWeight: 500, color: N }}>Frequently Asked Questions</h2>
          </FadeUp>
          <FAQ />
          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <p style={{ fontSize: 22, color: N, fontWeight: 400 }}>Still Have Questions?</p>
            <p style={{ fontSize: 22, fontWeight: 700, color: N }}>Give Us a Call</p>
          </div>
        </div>
      </section>

      {/* ════ MOBILE FORM ═══════════════════════════════════ */}
      <section id="form" style={{ background: BG, padding: '48px 24px' }} className="lg:hidden">
        <div style={{ maxWidth: 440, margin: '0 auto', background: '#fff', borderRadius: 12, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ color: N, fontWeight: 600, fontSize: 15 }}>Get Instant Insurance Verification</span>
            <img src={FORM_IC} alt="" style={{ height: 22, objectFit: 'contain' }} />
          </div>
          <InsuranceForm />
        </div>
      </section>

      {/* ════ CTA ══════════════════════════════════════════ */}
      <section style={{ position: 'relative', textAlign: 'center', overflow: 'hidden', padding: '80px 0' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={CTA_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.68)' }} />
        </div>
        <div className="lp-inner" style={{ position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <h2 style={{ color: '#fff', fontSize: 40, fontWeight: 500, marginBottom: 16 }}>You Deserve to Actually Live Healthy</h2>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 18, lineHeight: 1.6, marginBottom: 36 }}>
              Our physicians are here to make sure you get well, comfortable and safely.
            </p>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: N, color: '#fff', fontWeight: 600, fontSize: 17, padding: '14px 24px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <PhoneIcon />Call Now — (661) 762-5668
              </motion.a>
              <motion.a href="#form" onClick={e => { e.preventDefault(); document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }); }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: O, color: N, fontWeight: 600, fontSize: 17, padding: '14px 24px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                Verify Insurance
              </motion.a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════ FOOTER ════════════════════════════════════════ */}
      <footer style={{ background: N, padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>© Copyright 2026 Healthy Living Residential Program | All Rights Reserved</p>
      </footer>
    </div>
  );
}
