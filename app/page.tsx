'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* ─── Facility photos (Figma CDN — valid 7 days, replace with permanent URLs before launch) ─── */
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
  'https://www.figma.com/api/mcp/asset/dece1b74-6442-482f-891a-495368627fe5',
  'https://www.figma.com/api/mcp/asset/f89db978-4ac3-41bd-8ce7-fa1dcd866d13',
  'https://www.figma.com/api/mcp/asset/9d5c7b8d-2375-43ab-b825-6b235af841d1',
];

/* ─── Animation helper ─── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = target / 60;
    const t = setInterval(() => { n += step; if (n >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(n)); }, 18);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Insurance Form ─── */
function InsuranceForm({ dark = false }: { dark?: boolean }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', policyId: '', carrier: 'Aetna', dob: '' });
  const [done, setDone] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
      <div className="text-4xl mb-3 text-[#56B5B7]">✓</div>
      <p className="font-bold text-[#0D3442] text-lg">We'll call you within 15 minutes.</p>
      <p className="text-sm text-gray-500 mt-1">Or call us now: <a href="tel:+16617625668" className="text-[#56B5B7] font-semibold">(661) 762-5668</a></p>
    </motion.div>
  );

  const inputCls = `w-full border border-[#56B5B7] rounded bg-white px-4 h-10 text-sm text-[#0D3442] focus:outline-none focus:ring-2 focus:ring-[#56B5B7]/50`;

  return (
    <form onSubmit={e => { e.preventDefault(); setDone(true); }} className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-black">Your Name<span className="text-red-600">*</span></label>
          <input required className={inputCls} value={form.name} onChange={set('name')} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-black">Your Phone<span className="text-red-600">*</span></label>
          <input required type="tel" className={inputCls} value={form.phone} onChange={set('phone')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-black">Email<span className="text-red-600">*</span></label>
          <input required type="email" className={inputCls} value={form.email} onChange={set('email')} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-black">Membership Policy ID<span className="text-red-600">*</span></label>
          <input className={inputCls} value={form.policyId} onChange={set('policyId')} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-black">Insurance Carrier<span className="text-red-600">*</span></label>
          <select className={inputCls} value={form.carrier} onChange={set('carrier')}>
            {['Aetna','Anthem','Cigna','Humana','UnitedHealthcare','BlueCross','Beacon','Optum','Magellan','Other PPO'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-black">Date of Birth</label>
          <input type="text" placeholder="MM/DD/YYYY" className={inputCls} value={form.dob} onChange={set('dob')} />
        </div>
      </div>
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        className="w-full bg-[#F9A21C] text-[#0D3442] font-semibold text-lg py-3 rounded">
        Check Your Coverage
      </motion.button>
      <p className="text-center text-xs text-gray-500 italic">Your information is private and secure. No pressure to commit.</p>
    </form>
  );
}

/* ─── Photo carousel ─── */
function PhotoCarousel() {
  const [active, setActive] = useState(0);
  const visible = 2;
  const prev = () => setActive(a => (a - 1 + FACILITY.length) % FACILITY.length);
  const next = () => setActive(a => (a + 1) % FACILITY.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded">
        <div className="flex gap-4 transition-transform duration-500"
          style={{ transform: `translateX(-${active * (530 + 16)}px)`, width: `${FACILITY.length * (530 + 16)}px` }}>
          {FACILITY.map((src, i) => (
            <img key={i} src={src} alt={`Healthy Living facility ${i + 1}`}
              className="rounded object-cover shrink-0" style={{ width: 530, height: 320 }} />
          ))}
        </div>
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white">
          <svg width="12" height="20" viewBox="0 0 12 20" fill="#0D3442"><path d="M10 0L0 10l10 10"/></svg>
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white">
          <svg width="12" height="20" viewBox="0 0 12 20" fill="#0D3442"><path d="M2 0l10 10L2 20"/></svg>
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FACILITY.slice(0, 6).map((src, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`shrink-0 rounded overflow-hidden border-2 transition-all ${active === i ? 'border-[#56B5B7]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
            <img src={src} alt="" className="object-cover" style={{ width: 168, height: 80 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Mobile photo carousel ─── */
function MobileCarousel() {
  const [active, setActive] = useState(0);
  const prev = () => setActive(a => (a - 1 + FACILITY.length) % FACILITY.length);
  const next = () => setActive(a => (a + 1) % FACILITY.length);
  return (
    <div className="relative overflow-hidden rounded">
      <img src={FACILITY[active]} alt="" className="w-full object-cover rounded" style={{ height: 320 }} />
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow">
        <svg width="10" height="18" viewBox="0 0 12 20" fill="#0D3442"><path d="M10 0L0 10l10 10"/></svg>
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow">
        <svg width="10" height="18" viewBox="0 0 12 20" fill="#0D3442"><path d="M2 0l10 10L2 20"/></svg>
      </button>
    </div>
  );
}

/* ─── Sticky Header ─── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <AnimatePresence>
        {!scrolled && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="bg-[#56B5B7] overflow-hidden">
            <div className="text-white text-center text-sm font-medium py-2 px-4">
              <span className="hidden sm:inline">Support Available 24/7 — ⚠️ We do not accept Medicare or Medicaid</span>
              <span className="sm:hidden">
                <div>Support Available 24/7</div>
                <div className="text-xs">⚠️ We do not accept Medicare or Medicaid</div>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-[1440px] mx-auto px-[70px] sm:px-6 py-4 sm:py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg width="158" height="23" viewBox="0 0 303 44" fill="none">
              <text x="0" y="32" fontFamily="Georgia, serif" fontSize="28" fontWeight="700" fill="#0D3442" letterSpacing="2">HEALTHY LIVING</text>
              <text x="0" y="44" fontFamily="Georgia, serif" fontSize="10" fill="#CEA36F" letterSpacing="3">RESIDENTIAL PROGRAM</text>
            </svg>
          </div>
          {/* Phone CTA */}
          <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="pulse bg-[#F9A21C] text-[#0D3442] font-semibold px-5 py-3 rounded text-sm sm:text-base flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
            <span className="hidden sm:inline">Call Us </span>(661) 762-5668
          </motion.a>
        </div>
      </div>
    </header>
  );
}

/* ─── Sub-nav ─── */
function SubNav() {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-[180px] sm:px-6 py-2 flex items-center justify-center gap-8">
        {[
          { label: 'Our Center', active: true },
          { label: 'Conditions We Treat', active: false },
          { label: 'Programs', active: false },
        ].map(({ label, active }) => (
          <button key={label} className={`text-sm pb-1 transition-colors ${active ? 'text-[#CEA36F] font-semibold border-b-2 border-[#CEA36F]' : 'text-[#0D3442] hover:text-[#56B5B7]'}`}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

const AMENITIES = [
  { icon: '🌿', label: 'Outdoor Activities & Beach Access' },
  { icon: '🌱', label: 'Nature Immersion & Gardening' },
  { icon: '🎨', label: 'Music, Art & Movement Therapy' },
  { icon: '🍽️', label: 'Chef-Prepared Meals & Nutrition Plans' },
  { icon: '📱', label: 'Cellphones Allowed & Wifi Available' },
];

const TEAM = [
  { name: 'Dr. Narine Arutyounian M.D.', role: 'Medical Director' },
  { name: 'Dr. Harout Mesrobian', role: 'CEO' },
  { name: 'Ritsa Fistes, LMFT', role: 'Clinical Director' },
  { name: 'Julie Tatian', role: 'Psychiatric Nurse Practitioner' },
];

const STATS = [
  { val: 90, suffix: '%', label: 'Client satisfaction based on post-treatment surveys' },
  { val: 175, suffix: '+', label: 'Years of combined experience across our clinical team' },
  { val: 30, suffix: '+', label: 'Evidence-based and holistic treatment modalities' },
  { val: 93, suffix: '%', label: 'Completion rate for residential treatment' },
];

const TESTIMONIALS = [
  { quote: 'The doctors here actually cared about my whole health, not just the addiction. I left feeling like a real person again.', name: 'Michael T.', tag: 'Completed Residential · 2024' },
  { quote: 'Being able to bring my dog made all the difference. I couldn\'t have done it without her by my side.', name: 'Sarah K.', tag: 'Pet-Friendly Detox · 2024' },
  { quote: 'My husband and I went through detox together. Having that support changed everything.', name: 'Amanda & James R.', tag: 'Couples Program · 2023' },
  { quote: 'Same-day admission meant I didn\'t have time to talk myself out of going. That saved my life.', name: 'Derek M.', tag: 'Same-Day Admission · 2024' },
  { quote: 'The mountain setting is incredibly peaceful. It felt more like a retreat than a treatment center.', name: 'Lisa P.', tag: 'Residential Treatment · 2024' },
];

/* ─── MAIN PAGE ─── */
export default function Page() {
  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", color: '#0D3442' }}>
      <Header />

      {/* ── HERO ── */}
      <section className="relative pt-[110px] sm:pt-[160px]">
        {/* Background photo */}
        <div className="absolute inset-0 overflow-hidden" style={{ top: 0 }}>
          <img src="/hero-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          {/* Left gradient for text readability */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(237,244,244,0.92) 42%, rgba(237,244,244,0) 65%)' }} />
          {/* Mobile overlay */}
          <div className="sm:hidden absolute inset-0 bg-[rgba(237,244,244,0.88)]" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-[70px] sm:px-6 py-12 sm:py-10 flex items-start gap-5">
          {/* Left — hero copy */}
          <div className="flex-1 max-w-[750px]">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-[#0D3442] font-bold leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.125rem)', lineHeight: '1.15' }}>
              Physician-Owned Detox &<br />Residential Treatment
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[#386376] text-sm font-bold mb-3">
              ⭐️⭐️⭐️⭐️⭐ 4.9/5 on Google from 78+ Reviews
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="text-[#0D3442] text-lg leading-[1.6] mb-6 max-w-[728px]">
              Founded by two board-certified addiction physicians and built around the whole person, we offer a comfortable, medically guided path to lasting change in the hills of Santa Clarita.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-x-10 gap-y-3 mb-8">
              {['Same-Day Admissions 24/7', 'Couples Are Welcome', 'Comfort-Focused Detox & MAT', 'Pet-Friendly'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <img src="/check.png" alt="" className="w-5 h-5 shrink-0" />
                  <span className="text-[#0D3442] text-base">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center gap-4">
              <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="bg-[#0D3442] text-white font-medium text-lg px-6 py-3.5 rounded">
                Speak with Admissions 24/7
              </motion.a>
              <div className="flex items-center gap-3">
                <img src="/trust-badge-1.png" alt="Certified" className="h-10 w-10 object-contain" />
                <img src="/trust-badge-2.png" alt="Joint Commission" className="h-9 object-contain" />
                <img src="/dhcs-logo.png" alt="DHCS" className="h-5 object-contain" />
                <img src="/psychology-today.png" alt="Psychology Today" className="h-7 object-contain" />
                <img src="/samhsa.png" alt="SAMHSA" className="h-7 object-contain" />
              </div>
            </motion.div>
          </div>

          {/* Right — form card (desktop only) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden sm:flex flex-col gap-5 w-[530px] shrink-0 bg-[rgba(237,244,244,0.85)] backdrop-blur-sm border border-white/20 rounded-md shadow-lg px-5 py-7">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[#0D3442] font-medium text-base">Get Instant Insurance Verification</span>
              <img src="/form-icon.png" alt="" className="h-6 object-contain" />
            </div>
            <InsuranceForm />
          </motion.div>
        </div>
      </section>

      {/* ── SUB-NAV ── */}
      <SubNav />

      {/* ── SECTION 1: Facility / Amenities ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-[180px] sm:px-6">
          <FadeUp className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D3442]">Healthy Living Isn't Just Our Name</h2>
            <p className="text-gray-500 mt-2">It's what we help you achieve.</p>
          </FadeUp>

          <FadeUp delay={0.1}>
            {/* Desktop carousel */}
            <div className="hidden sm:block">
              <PhotoCarousel />
            </div>
            {/* Mobile carousel */}
            <div className="sm:hidden">
              <MobileCarousel />
            </div>
          </FadeUp>

          {/* Amenities — horizontal on desktop, vertical on mobile */}
          <FadeUp delay={0.2} className="mt-8">
            <div className="hidden sm:flex justify-between gap-4 bg-[#EDF4F4] rounded-lg px-8 py-6">
              {AMENITIES.map(a => (
                <div key={a.label} className="flex flex-col items-center text-center gap-2 max-w-[180px]">
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-sm text-[#0D3442] font-medium leading-tight">{a.label}</span>
                </div>
              ))}
            </div>
            <div className="sm:hidden flex flex-col gap-4 bg-[#EDF4F4] rounded-lg px-6 py-5">
              {AMENITIES.map(a => (
                <div key={a.label} className="flex items-center gap-4">
                  <span className="text-2xl shrink-0">{a.icon}</span>
                  <span className="text-sm text-[#0D3442] font-medium">{a.label}</span>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.25} className="flex justify-center mt-8">
            <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="bg-[#F9A21C] text-[#0D3442] font-semibold px-8 py-3 rounded flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              Call (661) 762-5668
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ── TRAUMA / TRUST SECTION ── */}
      <section className="py-16 sm:py-20" style={{ background: '#0D3442' }}>
        <div className="max-w-[1440px] mx-auto px-[180px] sm:px-6">
          <div className="grid sm:grid-cols-2 gap-10 items-center">
            <FadeUp>
              <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-4">
                Addiction Rarely Tells The Whole Story. Trauma Does.
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Our team is also trained to recognize and gently address the trauma that drives addiction — including EMDR therapy for those who are ready to go deeper and end the cycle of trauma.
              </p>
              <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-[#F9A21C] text-[#0D3442] font-semibold px-6 py-3 rounded">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                Call Today (661) 762-5668
              </motion.a>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="rounded-lg overflow-hidden bg-[#0a2a38] h-72 flex items-center justify-center border border-white/10">
                <img src={FACILITY[2]} alt="Healthy Living facility" className="w-full h-full object-cover opacity-80" />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── TREATMENT PATH ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-[180px] sm:px-6">
          <FadeUp className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D3442]">Your Recovery Path to Healthy Living</h2>
            <p className="text-gray-500 mt-2 max-w-2xl">Whether you're seeking intensive support or looking to balance treatment with daily life, we offer a full continuum of care that meets you where you are in life.</p>
          </FadeUp>

          <div className="flex flex-col gap-0">
            {[
              {
                title: 'Medical Detox & Medication-Assisted Treatment (MAT)',
                img: FACILITY[4],
                body: "When you arrive, one of our physicians will sit down with you for a thorough medical evaluation — not just to check boxes, but to truly understand where you are and what you need. If Medication-Assisted Treatment (MAT) can make withdrawal more manageable, we'll talk through it together and decide what's right for you. Throughout your stay, our care team is with you around the clock — watching, adjusting, and making sure you're never navigating this alone. Most people stay between 5 and 14 days, though we tailor that entirely to your health, your history, and how your body responds.",
                left: false
              },
              {
                title: 'Inpatient Residential Treatment Program',
                img: FACILITY[7],
                body: "Once you're stable, our team of therapists, counselors, and experiential instructors work with you to build a recovery plan that's truly yours. Our residential program focuses on healing the mind, body, and spirit through a structured daily schedule that includes clinical therapy, experiential work, and consistent support. Located in the hills of Santa Clarita, our residential setting provides a calm, private environment where clients can focus fully on treatment. Most residential stays range from 1 to 3 months, depending on individual progress and treatment needs.",
                left: true
              },
              {
                title: 'Aftercare Planning, Ongoing Care, & Alumni',
                img: FACILITY[11],
                body: "Recovery is a lifelong journey, and the work doesn't stop after completing residential treatment. We ensure you have the resources and support to maintain sobriety and continue healing. We connect you with outpatient and sober living services in Santa Clarita and Los Angeles to provide ongoing care and prevent relapse as you transition back to daily life. As part of our alumni program, you'll gain access to online support groups and monthly meetings to stay connected with others in recovery.",
                left: false
              },
            ].map(({ title, img, body, left }, i) => (
              <div key={title}>
                <FadeUp delay={i * 0.1}>
                  <div className={`flex flex-col sm:flex-row ${left ? 'sm:flex-row-reverse' : ''} gap-0 items-stretch`}>
                    <div className="sm:w-[310px] shrink-0 h-56 sm:h-auto overflow-hidden">
                      <img src={img} alt={title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6 sm:p-8">
                      <h3 className="font-bold text-lg text-[#0D3442] mb-3">{title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                    </div>
                  </div>
                </FadeUp>
                {i < 2 && <hr className="border-gray-100" />}
              </div>
            ))}
          </div>

          <FadeUp className="flex justify-center mt-10">
            <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="bg-[#F9A21C] text-[#0D3442] font-semibold px-8 py-3 rounded">
              Begin Treatment
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-16 sm:py-20 bg-[#EDF4F4]">
        <div className="max-w-[1440px] mx-auto px-[70px] sm:px-6">
          <FadeUp className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D3442]">The Medical Team Behind Your Recovery</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">We know what addiction does to the brain, body, and spirit. You don't need more willpower, you need the right medical team.</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {TEAM.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.08}>
                <motion.div whileHover={{ y: -3 }} className="text-center">
                  <div className="w-[310px] max-w-full h-[310px] mx-auto bg-gray-200 rounded overflow-hidden mb-3">
                    <img src={FACILITY[i + 12]} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="font-bold text-[#0D3442] text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{t.role}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSURANCE LOGOS ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-[180px] sm:px-6">
          <FadeUp className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D3442]">Care Backed by Major Insurance</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">We accept all PPO insurance plans and private pay. Call our admissions team and we'll walk you through your benefits so you know exactly what's covered before you commit to anything.</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="overflow-hidden">
              <div className="marquee-track">
                {[...Array(2)].flatMap(() =>
                  ['Aetna','Anthem','Cigna','Humana','United','BlueCross','Magellan','Beacon','Optum','ComPsych','MHN','Molina','MultiPlan','Ambetter'].map((name, i) => (
                    <div key={`${name}-${i}`} className="flex-shrink-0 bg-[#EDF4F4] rounded-lg px-6 py-3 border border-gray-100 text-[#0D3442] font-semibold text-sm whitespace-nowrap">
                      {name}
                    </div>
                  ))
                )}
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="flex justify-center mt-8">
            <motion.a href="#form" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="bg-[#F9A21C] text-[#0D3442] font-semibold px-8 py-3 rounded"
              onClick={e => { e.preventDefault(); document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Verify Insurance Coverage
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-20 bg-[#EDF4F4]">
        <div className="max-w-[1440px] mx-auto px-[70px] sm:px-6">
          <FadeUp className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D3442] text-center sm:text-left">You Call. We Handle The Rest.</h2>
            <p className="text-gray-500 mt-2 text-center sm:text-left">Connect with care anytime, day or night. Our team walks you through everything and can get you enrolled in treatment on the same day.</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: '📞', step: 'Step 1: Call & Speak With a Care Specialist', body: 'Our team is available 24/7 to answer your questions, understand your situation, and help you determine the next right step.' },
              { icon: '🛡️', step: 'Step 2: Complete a Brief Pre-Admission Screening', body: "We'll walk you through a short, structured screening to better understand your needs, clinical history, and what level of care is appropriate." },
              { icon: '📋', step: 'Step 3: Review Insurance and Payment Options', body: 'Our team will verify your insurance benefits and clearly explain coverage, costs, and private pay options so you can make an informed decision without pressure or surprises.' },
            ].map((s, i) => (
              <FadeUp key={s.step} delay={i * 0.1}>
                <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center gap-4 h-full">
                  <div className="text-4xl">{s.icon}</div>
                  <h3 className="font-bold text-[#0D3442] text-base">{s.step}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-20 bg-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-[180px] sm:px-6">
          <FadeUp>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0D3442]">Real People. Real Recovery.</h2>
                <p className="text-gray-500 mt-1">These are the stories that remind us why we do this work.</p>
              </div>
            </div>
          </FadeUp>
          <div className="overflow-hidden">
            <div className="marquee-track" style={{ animationDuration: '50s' }}>
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] bg-[#EDF4F4] rounded-xl p-5 border border-gray-100">
                  <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, j) => <span key={j} className="text-[#F9A21C] text-sm">★</span>)}</div>
                  <p className="text-[#0D3442] text-sm leading-relaxed mb-3">"{t.quote}"</p>
                  <p className="font-bold text-[#0D3442] text-xs">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.tag}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 sm:py-20 bg-[#EDF4F4]">
        <div className="max-w-[1440px] mx-auto px-[180px] sm:px-6">
          <FadeUp className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D3442]">Thousands Served — Decades of Trust</h2>
          </FadeUp>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.08} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-[#0D3442] mb-2">
                  <CountUp target={s.val} suffix={s.suffix} />
                </div>
                <p className="text-gray-500 text-sm leading-snug">{s.label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-[180px] sm:px-6">
          <FadeUp className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D3442]">California's Hidden Gem for Recovery</h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">Tucked into the hills of Santa Clarita, our center draws people from across California and beyond — because when the care is right, it's worth the drive.</p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 gap-6">
            <FadeUp>
              <div className="rounded-lg overflow-hidden h-64 sm:h-[398px] bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3302.5!2d-118.5!3d34.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s22512+Garzota+Dr+Santa+Clarita+CA+91350!5e0!3m2!1sen!2sus!4v1"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  title="Healthy Living location"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="flex flex-col h-full">
                <div className="rounded-lg overflow-hidden h-48 sm:h-[240px] mb-4">
                  <img src={FACILITY[0]} alt="Facility exterior" className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#EDF4F4] rounded-lg p-6 flex-1">
                  <h3 className="font-bold text-[#0D3442] mb-2">Healthy Living Residential Program</h3>
                  <p className="text-[#0D3442] text-sm mb-1">22512 Garzota Drive, Santa Clarita, CA 91350</p>
                  <p className="text-gray-500 text-sm leading-relaxed">A physician-owned detox and residential treatment center offering medically supervised care for adults ready to reclaim their lives.</p>
                </div>
              </div>
            </FadeUp>
          </div>
          <FadeUp className="flex justify-center mt-8" delay={0.15}>
            <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="bg-[#F9A21C] text-[#0D3442] font-semibold px-8 py-3 rounded">
              Check Availability
            </motion.a>
          </FadeUp>
        </div>
      </section>

      {/* ── MOBILE FORM SECTION (mobile only — appears near bottom per Figma) ── */}
      <section id="form" className="sm:hidden py-12 bg-[#EDF4F4]">
        <div className="max-w-[440px] mx-auto px-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="text-[#0D3442] font-medium text-base text-center">Get Instant Insurance Verification</span>
              <img src="/form-icon.png" alt="" className="h-5 object-contain" />
            </div>
            <InsuranceForm dark />
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="py-16 bg-[#56B5B7]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">The right time to call is right now.</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Beds are limited. A physician is available. Same-day admission is possible.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a href="tel:+16617625668" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="pulse bg-white text-[#0D3442] font-bold text-lg px-8 py-4 rounded-full flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                (661) 762-5668
              </motion.a>
              <a href="#form"
                onClick={e => { e.preventDefault(); document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="border-2 border-white text-white font-semibold text-lg px-8 py-4 rounded-full hover:bg-white/10 transition-colors text-center">
                Verify Insurance
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0D3442] py-6">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <p className="text-white/40 text-sm">© Copyright 2026 Healthy Living Residential Program | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
