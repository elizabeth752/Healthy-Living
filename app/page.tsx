'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* ── All assets pulled directly from Figma MCP ─────────────────────────── */
const f = (id: string) => `https://www.figma.com/api/mcp/asset/${id}`;

// Header
const LOGO     = f('d07d3847-d242-45af-812f-44c5dca2a12a');
const PHONE_IC = f('b21093ed-0f8e-41b4-b20e-8983f39c116a');

// Hero/Banner (node 3574:2753)
const HERO_BG  = f('b98d49b5-9f35-465b-88d4-d034211e775a');
const CHECK_IC = f('1dfb5845-c530-4f9d-918f-fd25e200aa50');
const BADGE_G  = f('7531f52f-8434-4e7e-a3ea-40dd900f73ad');
const BADGE_B  = f('e86764f0-b6a7-4558-bb7d-7eee1d297c87');
const DHCS     = f('7f8a9c03-dca4-4f31-81a1-e5f13eba1139');
const PSYCH    = f('ce846d8b-9e2a-4e94-95c0-7407931a7cd7');
const SAMHSA   = f('1ee1d93b-ec86-4022-ad83-705dca16313b');
const FORM_IC  = f('4841cde0-bceb-4fba-bb18-908740aad935');

// Carousel arrow
const CAR_ARR  = f('a22864e4-c981-403e-a2e6-4827de9e9761');

// Facility photos (node 6041:3105 — Seccion 1)
const FACILITY = [
  f('5c6ecc85-d659-4f9f-8385-7c2f680faf70'),
  f('358929a5-95fd-44f4-ba70-54754635bdc7'),
  f('99a773b4-b8d1-4be2-a231-038ae9f874f1'),
  f('1c7c93db-8d50-4fde-9db2-eb25ebf61eed'),
  f('3f53217c-b4c1-453a-980f-17f81a56c281'),
  f('988c538c-85dc-4c04-8b8c-e5d251c0412a'),
  f('aa92df69-2f4a-428c-9426-8ca742b16d76'),
  f('bd90d69f-3f77-4f34-b4c5-647c89c1f0ab'),
  f('924693b0-5a19-4e5a-b7c8-47cd33538f87'),
  f('7474da6c-6e63-4d2d-b103-7c67da882b92'),
  f('c6b56340-07cd-41c8-965d-5d79215b5a0a'),
  f('246e6c2c-3428-42db-ad1c-ba9a6023668d'),
  f('aedb0a73-ea7d-409e-a044-11f4dc061bcc'),
  f('dd0ac0f6-9636-4139-b832-c5512b76ca53'),
  f('cc361b6e-f352-475a-9afc-89c1831e5cc9'),
  f('9ed7f966-0050-4183-ab48-ecbe978662dd'),
];

// Amenity icons
const AMEN_1 = f('af4e30dc-f24c-4589-86b8-fa57aae5ef55');
const AMEN_2 = f('809aa185-9d20-43f5-bd45-0bab4a25ca1b');
const AMEN_3 = f('2baaa94b-5cbc-4666-8e73-d76dd145698b');
const AMEN_4 = f('b006e088-8294-412e-a99c-19afc09a900b');
const AMEN_5 = f('e043a9de-af0d-4392-ba0d-b91701480d9e');

// Condition icons
const IC_ALCOHOL  = f('7b436f39-0056-4b72-b656-1ac9065f51c3');
const IC_OPIOID   = f('a228c9f5-dd18-422d-af88-72c069c37822');
const IC_BENZO    = f('91942f7a-e33c-412d-ac2e-56b9f2605701');
const IC_COCAINE  = f('6ce1dd58-85f8-4783-8bc5-90fb03d26e9f');
const IC_FENTANYL = f('5282761b-1072-4bc1-a2a7-43c1077fee69');
const IC_HEROIN   = f('4a9aa952-3a3b-49cd-9d69-8f52fc2f45e8');
const IC_DUAL     = f('46bf0366-8192-4901-8a31-4be2193272f6');

// Team headshots (fresh from full-page pull)
const TEAM_NARINE = f('47c14a8c-1861-456e-8f45-d6224e83109e');
const TEAM_HAROUT = f('0f004f6c-58af-4090-92ba-91df9de1c458');
const TEAM_RITSA  = f('637effc5-6e18-4e2e-a252-bed4a074b696');
const TEAM_JULIE  = f('c02dcd51-ff0e-4efb-a10d-2ce09270748b');

// Reviews
const STARS     = f('6d0d84c4-5abf-4e0c-b267-1051986a3f8e');
const GOOGLE_IC = f('3f47f82b-a218-4854-a023-584579dd8955');
const REVIEWERS = [
  { photo: f('83127b99-39f2-43fc-b3a9-e05a78fa8046'), name: 'Jose Martinez',    text: "Well first off the staff are all about assisting the clients with their needs — they go above and beyond. The food is beyond great. The medical attention is on point. I've been to a few programs and this is the best one hands down." },
  { photo: f('01fd596c-5475-41ba-a47e-62c21b16814a'), name: 'Melissa Jenkins',  text: "This was my first experience at a treatment program. I was very nervous but the staff were unbelievable! I ended up staying the full 30 days and I'm so glad I did. I can't recommend Healthy Living enough." },
  { photo: f('758779c3-d3a0-4c04-8122-9ffe4aa02913'), name: 'Gilbert Pimienta', text: "Healthy Living truly exceeded my expectations. The staff is highly professional and incredibly compassionate. The facility is clean and comfortable. Thanks to Healthy Living, I've made meaningful progress." },
  { photo: f('cfc93faa-711c-4f7f-8543-08991d40fcbe'), name: 'Jordan',           text: "The staff here really care about you and your wellbeing. During detox they made it as smooth and comfortable as possible. The food is amazing. The counseling and therapy is top notch. 10 out of 10." },
  { photo: f('e19e5a4d-5ea0-41e4-8627-4e7b8302721c'), name: 'Nicolas Arp',      text: "I had a really good experience here. We did a lot of really cool activities like hiking, time by the fireplace, outings to the movies and going thrifting. I would highly recommend!" },
  { photo: f('13dda1b7-ca89-44b0-a6a3-54d45a5f8a9a'), name: 'C Los',            text: "Healthy Living is the best detox and residential program around, hands down. They picked up as soon as I called, I was in treatment the following day. You get to keep your phone, therapy every week, I had my own room and private bathroom." },
  { photo: f('78190423-3e6e-423a-a256-30242a43bf9b'), name: 'Rachel Vassell',   text: "This treatment center was a great experience. It's like living at a five-star hotel — they cater to your every need mentally and physically and go above and beyond. Thank you so much Healthy Living." },
];

// FAQ / CTA
const FAQ_OPEN = f('318ecfed-37ab-4e53-8c81-4e39aa469df5');
const FAQ_SHUT = f('35ac22b3-934f-45d7-8e76-60cfdca371cd');
const CTA_BG   = f('b5cddfeb-0c27-48fd-82b3-51892007dec5');

/* ── Design tokens ──────────────────────────────────────────────────────── */
const N  = '#0D3442';
const T  = '#56B5B7';
const O  = '#F9A21C';
const BG = '#EDF4F4';
const DT = '#174154';

/* ── Utilities ──────────────────────────────────────────────────────────── */
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

/* ── Insurance form ─────────────────────────────────────────────────────── */
function InsuranceForm() {
  const [f, setF] = useState({ name: '', phone: '', email: '', policyId: '', carrier: 'Aetna', dob: '' });
  const [done, setDone] = useState(false);
  const u = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF(p => ({ ...p, [k]: e.target.value }));
  const INP: React.CSSProperties = { width: '100%', height: 40, padding: '0 12px', border: `1px solid ${T}`, borderRadius: 4, fontSize: 14, background: '#fff', boxSizing: 'border-box', outline: 'none', color: '#3a3a3a', fontFamily: 'inherit' };
  const LBL: React.CSSProperties = { display: 'block', fontSize: 13, marginBottom: 6, color: '#000', fontWeight: 400 };

  if (done) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 48, color: T, marginBottom: 12 }}>✓</div>
      <p style={{ fontWeight: 700, fontSize: 18, color: N }}>We'll call you within 15 minutes.</p>
      <p style={{ fontSize: 14, color: '#555', marginTop: 8 }}>Or call: <a href="tel:+16617625668" style={{ color: T, fontWeight: 700 }}>(661) 762-5668</a></p>
    </motion.div>
  );

  return (
    <form onSubmit={e => { e.preventDefault(); setDone(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><label style={LBL}>Your Name<span style={{ color: '#d80027' }}>*</span></label><input required style={INP} value={f.name} onChange={u('name')} /></div>
        <div><label style={LBL}>Your Phone<span style={{ color: '#d80027' }}>*</span></label><input required type="tel" style={INP} value={f.phone} onChange={u('phone')} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><label style={LBL}>Email<span style={{ color: '#d80027' }}>*</span></label><input required type="email" style={INP} value={f.email} onChange={u('email')} /></div>
        <div><label style={LBL}>Membership Policy ID<span style={{ color: '#d80027' }}>*</span></label><input style={INP} value={f.policyId} onChange={u('policyId')} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
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

/* ── Facility Carousel ──────────────────────────────────────────────────── */
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
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', height: 320 }}>
        <AnimatePresence mode="wait">
          <motion.img key={i} src={FACILITY[i]} alt=""
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
        </AnimatePresence>
        {[{ fn: prev, side: 'left' as const, rot: 'rotate(180deg)' }, { fn: next, side: 'right' as const, rot: 'none' }].map(({ fn, side, rot }) => (
          <button key={side} onClick={fn}
            style={{ position: 'absolute', [side]: 20, top: '50%', transform: 'translateY(-50%)', width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 2 }}>
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
          <button key={idx} onClick={() => setI(idx)}
            style={{ flexShrink: 0, padding: 0, background: 'none', border: 'none', cursor: 'pointer', position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
            <img src={src} alt="" style={{ width: 168, height: 80, objectFit: 'cover', display: 'block', borderRadius: 4 }} />
            {idx !== i && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.65)', borderRadius: 4 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Conditions Carousel ────────────────────────────────────────────────── */
function ConditionsCarousel({ conditions }: { conditions: { icon: string; title: string; desc: string }[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = conditions.length;
  const next = () => setIdx(a => (a + 1) % total);

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
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 70px', height: 110, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src={LOGO} alt="Healthy Living Residential Program" style={{ height: 44, objectFit: 'contain' }} />
          <motion.a href="tel:+16617625668" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{ background: O, color: N, fontWeight: 500, fontSize: 18, padding: '14px 16px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            <img src={PHONE_IC} alt="" style={{ width: 20, height: 20 }} />
            Call Us &nbsp;(661) 762-5668
          </motion.a>
        </div>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function Page() {

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

  const TEAM = [
    { name: 'Dr. Narine Arutyounian M.D.', role: 'Medical Director',               img: TEAM_NARINE, pos: '-5.48% -5.29%',  size: '110.97% 148%'  },
    { name: 'Dr. Harout Mesrobian',         role: 'CEO',                            img: TEAM_HAROUT, pos: '-18.23% -5.19%', size: '136.46% 182%'  },
    { name: 'Ritsa Fistes, LMFT',           role: 'Clinical Director',              img: TEAM_RITSA,  pos: '-9.92% -24.76%', size: '123.72% 165%'  },
    { name: 'Julie Tatian',                 role: 'Psychiatric Nurse Practitioner', img: TEAM_JULIE,  pos: '0% -9.57%',      size: '100% 124.95%'  },
  ];

  const RECOVERY_ITEMS = [
    { icon: '👫', title: 'Couples Welcome',        desc: "We're one of the few centers that allows couples to heal together, side by side." },
    { icon: '🐕', title: 'Dog-Friendly',            desc: 'Comfort and connection are part of healing, and sometimes that comes on four legs.' },
    { icon: '🌿', title: 'Holistic Care',           desc: 'Music, art, movement, sound, animals, and time in nature treats the whole person, not just the addiction.' },
    { icon: '🛡️', title: 'Comfort-First Detox',    desc: "Detox doesn't have to feel like punishment. Our medical team & MAT protocols keeps you safe and comfortable." },
    { icon: '⚕️', title: 'Medical Leadership',      desc: 'Founded and overseen by two board-certified addiction physicians, clinical excellence isn\'t a feature, it\'s the foundation.' },
    { icon: '💼', title: 'Professional Pathways',   desc: "Built for people who can't step away from everything, our program offers the structure and discretion that professionals need." },
    { icon: '🍽️', title: 'Chef-Prepared Meals',    desc: "In-house chef prepares nourishing meals daily, because a body that's well-fed heals faster and feels more like itself again." },
    { icon: '📱', title: 'Flexible Tech Policies',  desc: "Phones and technology are allowed (with limits), because isolation isn't part of our approach to recovery." },
  ];

  const INSURERS = ['Aetna','Anthem','Cigna','Humana','United','BlueCross','Magellan','Beacon','Optum','ComPsych','MHN','Molina','MultiPlan','Ambetter'];

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 160;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  }

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", color: N }}>
      <Header />

      {/* ════ HERO / BANNER (node 3574:2753) ═════════════════════════════ */}
      <section style={{ position: 'relative', paddingTop: 160 }}>
        {/* full-bleed background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={HERO_BG} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center right' }} />
          {/* Figma gradient: to-left, transparent 5.2% → 90% opaque 41.9% */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(237,244,244,0) 5.208%, rgba(237,244,244,0.9) 41.855%)' }} />
        </div>

        {/* Hero content — px-70 matches Figma lp-wide, 1300px inner width */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1440, margin: '0 auto', padding: '50px 70px 40px' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', width: 1300 }}>

            {/* LEFT — 750px */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ width: 750, flexShrink: 0 }}>
              <h1 style={{ fontSize: 50, fontWeight: 700, lineHeight: '60px', color: N, marginBottom: 20 }}>
                Physician-Owned Detox &<br />Residential Treatment
              </h1>
              <p style={{ color: '#386376', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                ⭐️⭐️⭐️⭐️⭐ 4.9/5 on Google from 78+ Reviews
              </p>
              <p style={{ fontSize: 18, color: N, lineHeight: '22px', marginBottom: 20, maxWidth: 728 }}>
                Founded by two board-certified addiction physicians and built around the whole person, we offer a comfortable, medically guided path to lasting change in the hills of Santa Clarita.
              </p>

              {/* Bullet grid — 2 cols, gap-60 between cols */}
              <div style={{ display: 'flex', gap: 60, marginBottom: 30 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {['Same-Day Admissions 24/7', 'Comfort-Focused Detox & MAT'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={CHECK_IC} alt="" style={{ width: 22, height: 22, flexShrink: 0 }} />
                      <span style={{ fontSize: 16, color: N }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {['Couples Are Welcome', 'Pet-Friendly'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={CHECK_IC} alt="" style={{ width: 22, height: 22, flexShrink: 0 }} />
                      <span style={{ fontSize: 16, color: N }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA + trust badges */}
              <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <motion.a href="tel:+16617625668" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ background: N, color: '#fff', fontWeight: 500, fontSize: 18, padding: '14px 16px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  <img src={PHONE_IC} alt="" style={{ width: 20, height: 20 }} />
                  Speak with Admissions 24/7
                </motion.a>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'nowrap' }}>
                  <img src={BADGE_G}  alt="" style={{ width: 42, height: 42,  objectFit: 'contain', flexShrink: 0 }} />
                  <img src={BADGE_B}  alt="" style={{ width: 37, height: 40,  objectFit: 'contain', flexShrink: 0 }} />
                  <img src={DHCS}     alt="" style={{ width: 105, height: 22, objectFit: 'contain', flexShrink: 0 }} />
                  <img src={PSYCH}    alt="" style={{ width: 98,  height: 28, objectFit: 'contain', flexShrink: 0 }} />
                  <img src={SAMHSA}   alt="" style={{ width: 83,  height: 28, objectFit: 'contain', flexShrink: 0 }} />
                </div>
              </div>
            </motion.div>

            {/* RIGHT — form card 530px */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-form"
              style={{ width: 530, flexShrink: 0, backdropFilter: 'blur(5px)', background: 'rgba(237,244,244,0.8)', border: '1px solid rgba(237,244,244,0.04)', borderRadius: 6, boxShadow: '0 4px 8px rgba(0,0,0,0.2)', padding: '30px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ color: N, fontWeight: 500, fontSize: 16 }}>Get Instant Insurance Verification</span>
                <img src={FORM_IC} alt="" style={{ height: 24, objectFit: 'contain' }} />
              </div>
              <InsuranceForm />
            </motion.div>
          </div>
        </div>

        {/* Sub-nav — white bar, px-180 matches Figma */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 110, zIndex: 40 }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 180px', display: 'flex', justifyContent: 'center', gap: 48 }}>
            {[
              { label: 'Our Center',          id: 'our-center' },
              { label: 'Conditions We Treat', id: 'conditions' },
              { label: 'Programs',            id: 'programs'   },
            ].map(({ label, id }) => (
              <button key={id} onClick={() => scrollTo(id)}
                style={{ padding: '12px 0', fontSize: 16, color: N, fontWeight: 400, background: 'none', border: 'none', cursor: 'pointer', borderBottom: '2px solid transparent', fontFamily: 'inherit' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ════ FACILITY / OUR CENTER ══════════════════════════════════════ */}
      <section id="our-center" style={{ background: 'linear-gradient(to top, #0D3442, #386376)', padding: '70px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ textAlign: 'center', marginBottom: 30 }}>
            <h2 style={{ fontSize: 40, fontWeight: 500, color: '#fff', marginBottom: 16 }}>Healthy Living Isn't Just Our Name</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>It's what we help you achieve.</p>
          </FadeUp>
          <FadeUp delay={0.1}><Carousel /></FadeUp>
          <FadeUp delay={0.15} style={{ marginTop: 22 }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
                {AMENITIES.map(a => (
                  <div key={a.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, width: 150 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img src={a.icon} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: 14, color: '#fff', lineHeight: 1.4 }}>{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.2} style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: O, color: N, fontWeight: 500, fontSize: 18, padding: '14px 28px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <img src={PHONE_IC} alt="" style={{ width: 20, height: 20 }} />Call (661) 762-5668
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ RECOVERY — THE WAY IT SHOULD FEEL ═════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 0' }}>
        <div className="lp-inner">
          <FadeUp style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 500, color: N, marginBottom: 16 }}>Recovery, The Way It Should Feel</h2>
            <p style={{ color: '#555', fontSize: 16, lineHeight: 1.65, maxWidth: 900 }}>
              We built this program around the belief that comfort, dignity, and real human connection aren't luxuries in recovery — they're necessities.
            </p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 60px' }}>
            {RECOVERY_ITEMS.map((item, idx) => (
              <FadeUp key={item.title} delay={idx * 0.07}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', padding: '24px 0', borderBottom: idx < 6 ? '1px solid #f0f0f0' : 'none' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16, color: N, marginBottom: 6 }}>{item.title}</p>
                    <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ background: N, color: '#fff', fontWeight: 500, fontSize: 18, padding: '14px 32px', borderRadius: 4, textDecoration: 'none' }}>
              Connect with Treatment
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ CONDITIONS ═════════════════════════════════════════════════ */}
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
              style={{ background: O, color: N, fontWeight: 500, fontSize: 18, padding: '14px 32px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <img src={PHONE_IC} alt="" style={{ width: 20, height: 20 }} />We're Here to Support
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ TEAM ═══════════════════════════════════════════════════════ */}
      <section style={{ background: BG, padding: '80px 0' }}>
        <div className="lp-wide">
          <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 500, color: N, marginBottom: 14 }}>The Medical Team Behind Your Recovery</h2>
            <p style={{ color: '#555', fontSize: 16, maxWidth: 700, margin: '0 auto' }}>We know what addiction does to the brain, body, and spirit. You don't need more willpower — you need the right medical team.</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {TEAM.map((m, idx) => (
              <FadeUp key={m.name} delay={idx * 0.08}>
                <motion.div whileHover={{ y: -4 }}>
                  <div style={{ width: '100%', height: 310, borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                    <img src={m.img} alt={m.name}
                      style={{ position: 'absolute', width: m.size.split(' ')[0], height: m.size.split(' ')[1], left: m.pos.split(' ')[0], top: m.pos.split(' ')[1], maxWidth: 'none' }} />
                  </div>
                  <div style={{ padding: '14px 10px 0' }}>
                    <p style={{ fontWeight: 700, color: N, fontSize: 18, lineHeight: '22px' }}>{m.name}</p>
                    <p style={{ color: T, fontSize: 12, marginTop: 2 }}>{m.role}</p>
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
              style={{ background: O, color: N, fontWeight: 500, fontSize: 18, padding: '14px 32px', borderRadius: 4, textDecoration: 'none' }}>
              Verify Insurance Coverage
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ HOW IT WORKS ═══════════════════════════════════════════════ */}
      <section style={{ background: N, padding: '80px 0' }}>
        <div className="lp-wide">
          <FadeUp style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, color: '#fff', marginBottom: 14 }}>You Call. We Handle The Rest.</h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 700 }}>Connect with care anytime, day or night. Our team walks you through everything and can get you enrolled in treatment the same day.</p>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { title: 'Step 1: Call & Speak With a Care Specialist',      body: 'Our team is available 24/7 to answer your questions, understand your situation, and help you determine the next right step.' },
              { title: 'Step 2: Complete a Brief Pre-Admission Screening',  body: "We'll walk you through a short, structured screening to better understand your needs, clinical history, and what level of care is right." },
              { title: 'Step 3: Review Insurance and Payment Options',      body: 'Our team will verify your insurance benefits and clearly explain coverage and costs so you can make an informed decision without pressure.' },
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

      {/* ════ TESTIMONIALS ═══════════════════════════════════════════════ */}
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

      {/* ════ STATS ══════════════════════════════════════════════════════ */}
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

      {/* ════ LOCATION ═══════════════════════════════════════════════════ */}
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
              style={{ background: O, color: N, fontWeight: 500, fontSize: 18, padding: '14px 32px', borderRadius: 4, textDecoration: 'none' }}>
              Check Availability
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ════ FAQ ════════════════════════════════════════════════════════ */}
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

      {/* ════ MOBILE FORM ════════════════════════════════════════════════ */}
      <section id="form" style={{ background: BG, padding: '48px 24px' }} className="lg:hidden">
        <div style={{ maxWidth: 440, margin: '0 auto', background: '#fff', borderRadius: 12, padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ color: N, fontWeight: 500, fontSize: 16 }}>Get Instant Insurance Verification</span>
            <img src={FORM_IC} alt="" style={{ height: 24, objectFit: 'contain' }} />
          </div>
          <InsuranceForm />
        </div>
      </section>

      {/* ════ CTA ════════════════════════════════════════════════════════ */}
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
                style={{ background: N, color: '#fff', fontWeight: 500, fontSize: 18, padding: '14px 24px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <img src={PHONE_IC} alt="" style={{ width: 20, height: 20 }} />Call Now — (661) 762-5668
              </motion.a>
              <motion.a href="#form" onClick={e => { e.preventDefault(); document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }); }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ background: O, color: N, fontWeight: 500, fontSize: 18, padding: '14px 24px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                Verify Insurance
              </motion.a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ════ FOOTER ═════════════════════════════════════════════════════ */}
      <footer style={{ background: N, padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>© Copyright 2026 Healthy Living Residential Program | All Rights Reserved</p>
      </footer>
    </div>
  );
}
