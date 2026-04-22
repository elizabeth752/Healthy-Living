'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* ─── Animation primitives ─── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
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
    let start = 0;
    const steps = 60;
    const inc = target / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 18);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Insurance / CTA form ─── */
function InsuranceForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [insurance, setInsurance] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to CRM / email
    setDone(true);
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-4"
      >
        <div className="text-5xl mb-4">✓</div>
        <p className="text-xl font-700 text-[var(--navy)]">We'll call you within 15 minutes.</p>
        <p className="text-[var(--navy)] opacity-70 mt-2">Or call us now: <a href="tel:+18005551234" className="font-600 underline">(800) 555-1234</a></p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <input
        required
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-[var(--navy)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
      />
      <input
        required
        type="tel"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        placeholder="Phone number"
        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-[var(--navy)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
      />
      <select
        value={insurance}
        onChange={e => setInsurance(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-[var(--navy)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--teal)]"
      >
        <option value="">Insurance (optional)</option>
        <option>Aetna</option>
        <option>Anthem / Blue Cross</option>
        <option>Cigna</option>
        <option>Humana</option>
        <option>UnitedHealthcare</option>
        <option>BCBS</option>
        <option>Other PPO</option>
        <option>Self-pay</option>
      </select>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="pulse w-full py-4 rounded-lg bg-[var(--orange)] text-white font-700 text-lg tracking-wide shadow-lg"
      >
        Check My Insurance — Free
      </motion.button>
      <p className="text-center text-xs text-gray-400">Confidential · No obligation · Available 24/7</p>
    </form>
  );
}

/* ─── Phone CTA bar ─── */
function CallCTA({ dark = false }: { dark?: boolean }) {
  return (
    <motion.a
      href="tel:+18005551234"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`pulse inline-flex items-center gap-3 px-8 py-4 rounded-full font-700 text-lg shadow-xl ${
        dark
          ? 'bg-[var(--orange)] text-white'
          : 'bg-white text-[var(--navy)]'
      }`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
      </svg>
      (800) 555-1234
    </motion.a>
  );
}

/* ─── Sticky header ─── */
function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[var(--teal)] text-white text-center text-sm font-500 py-2 overflow-hidden"
          >
            Same-day admissions available · Physician-owned · Most PPO insurance accepted
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 py-4'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[var(--teal)] flex items-center justify-center">
              <span className="text-white font-800 text-sm">HL</span>
            </div>
            <span className="font-700 text-[var(--navy)] text-lg">Healthy Living</span>
          </div>
          <a
            href="tel:+18005551234"
            className="hidden sm:flex items-center gap-2 text-[var(--navy)] font-600 hover:text-[var(--teal)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            (800) 555-1234
          </a>
          <motion.a
            href="#verify"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="sm:hidden pulse bg-[var(--orange)] text-white font-600 text-sm px-5 py-2.5 rounded-full"
          >
            Verify Insurance
          </motion.a>
        </div>
      </div>
    </header>
  );
}

/* ─── Insurance logos ─── */
const insurers = ['Aetna','Anthem','Cigna','Humana','United','BlueCross','Magellan','Beacon','Optum','ComPsych','MHN','Molina'];

/* ─── Testimonials ─── */
const testimonials = [
  { quote: "The doctors here actually cared about my whole health, not just the addiction. I left feeling like a real person again.", name: "Michael T.", tag: "Completed Residential · 2024" },
  { quote: "Being able to bring my dog made all the difference. I couldn't have done it without her by my side.", name: "Sarah K.", tag: "Pet-Friendly Detox · 2024" },
  { quote: "My husband and I went through detox together. Having that support changed everything.", name: "Amanda & James R.", tag: "Couples Program · 2023" },
  { quote: "Same-day admission meant I didn't have time to talk myself out of going. That saved my life.", name: "Derek M.", tag: "Same-Day Admission · 2024" },
  { quote: "The mountain setting is incredibly peaceful. It felt more like a retreat than a treatment center.", name: "Lisa P.", tag: "Residential Treatment · 2024" },
];

/* ─── Treatment path ─── */
const steps = [
  { num: '01', title: 'Call or submit your info', body: 'A care coordinator picks up — not a voicemail. We verify benefits while you\'re on the phone.' },
  { num: '02', title: 'Same-day assessment', body: 'A physician evaluates you the same day you call. Medical detox begins as soon as you arrive.' },
  { num: '03', title: 'Personalized treatment plan', body: 'Physician-led care tailored to your specific substances, health history, and life goals.' },
  { num: '04', title: 'Ongoing support after discharge', body: 'Alumni programming, case management, and aftercare referrals so recovery doesn\'t stop at the door.' },
];

/* ─── Team ─── */
const team = [
  { name: 'Dr. Robert Chen, MD', role: 'Medical Director · Board-Certified Addiction Medicine', img: null },
  { name: 'Dr. Lisa Navarro, DO', role: 'Physician · Internal Medicine & Addiction', img: null },
  { name: 'Marcus Williams, LCSW', role: 'Clinical Director · 15 Years BH Experience', img: null },
  { name: 'Diana Park, RN', role: 'Lead Nurse · Detox & Residential', img: null },
];

/* ─── Main page ─── */
export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <Header />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0D3442 0%, #0a2a38 50%, #102e3e 100%)',
        }}
      >
        {/* Background texture overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #56B5B7 0%, transparent 60%), radial-gradient(circle at 80% 20%, #F9A21C 0%, transparent 50%)' }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left — copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[var(--teal)]/20 border border-[var(--teal)]/40 text-[var(--teal)] text-sm font-600 px-4 py-1.5 rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--teal)] animate-pulse" />
              Beds Available Now — Santa Clarita, CA
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white text-4xl sm:text-5xl lg:text-[3.4rem] font-800 leading-[1.12] mb-6"
            >
              Real Recovery,<br />
              <span className="text-[var(--teal)]">Physician-Led.</span><br />
              Starting Today.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg"
            >
              Medically supervised detox and residential treatment in the hills of Santa Clarita.
              Couples welcome. Pets welcome. Most PPO insurance accepted.
            </motion.p>

            {/* Differentiators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {['Same-Day Admission', 'Physician-Owned', 'Couples Welcome', 'Pet-Friendly', 'Covered by Insurance'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-sm px-3 py-1.5 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#56B5B7"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <CallCTA dark />
              <a
                href="#verify"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white font-600 text-lg px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
              >
                Verify Insurance Free
              </a>
            </motion.div>
          </div>

          {/* Right — form card */}
          <motion.div
            id="verify"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            <h2 className="text-[var(--navy)] text-2xl font-700 mb-1">Check Your Insurance</h2>
            <p className="text-gray-500 text-sm mb-6">Free verification in under 15 minutes. No obligation.</p>
            <InsuranceForm />
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"/>
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { val: 98, suffix: '%', label: 'Insurance approval rate' },
                { val: 24, suffix: '/7', label: 'Admissions available' },
                { val: 500, suffix: '+', label: 'Lives changed' },
                { val: 15, suffix: ' min', label: 'Benefits verified' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-4xl font-800 text-[var(--teal)]">
                    <CountUp target={s.val} suffix={s.suffix} />
                  </div>
                  <div className="text-[var(--navy)] text-sm font-500 mt-1 opacity-70">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── INSURANCE MARQUEE ── */}
      <section className="bg-[var(--bg-light)] py-10 overflow-hidden">
        <FadeUp>
          <p className="text-center text-[var(--navy)] font-600 text-sm uppercase tracking-widest mb-6 opacity-60">Most PPO Insurance Accepted</p>
        </FadeUp>
        <div className="overflow-hidden">
          <div className="marquee-track">
            {[...insurers, ...insurers].map((name, i) => (
              <div key={i} className="flex-shrink-0 bg-white rounded-xl px-6 py-3 shadow-sm border border-gray-100 text-[var(--navy)] font-600 text-sm whitespace-nowrap">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY HEALTHY LIVING ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-800 text-[var(--navy)]">Why Families Choose Us</h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">We're not a revolving door. We're a physician-owned program built around one goal: lasting recovery.</p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🩺', title: 'Physician-Owned & Led', body: 'Real doctors make every treatment decision. Your detox is medically supervised from day one — no shortcuts.' },
              { icon: '⚡', title: 'Same-Day Admissions', body: 'Waiting kills momentum. We admit the same day you call, 24 hours a day, 365 days a year.' },
              { icon: '💑', title: 'Couples Can Heal Together', body: 'Unique couples program lets partners support each other\'s recovery side by side.' },
              { icon: '🐾', title: 'Bring Your Pet', body: 'Pets reduce anxiety and improve treatment outcomes. Your dog is welcome here.' },
              { icon: '🏔️', title: 'Tranquil Hill Setting', body: 'Nestled in the Santa Clarita hills — far from triggers, surrounded by nature, close to Los Angeles.' },
              { icon: '🛡️', title: 'Fully Confidential', body: '42 CFR Part 2 compliant. Your records are protected beyond standard HIPAA requirements.' },
            ].map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(13,52,66,0.10)' }}
                  transition={{ duration: 0.25 }}
                  className="bg-[var(--bg-light)] rounded-2xl p-7 h-full"
                >
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-[var(--navy)] font-700 text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.body}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TREATMENT PATH ── */}
      <section className="py-24 bg-[var(--navy)]">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-800 text-white">Your Path to Recovery</h2>
            <p className="text-white/60 mt-3 max-w-xl mx-auto">From your first call to long-term sobriety — here's exactly what happens.</p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-8">
            {steps.map((s, i) => (
              <FadeUp key={s.num} delay={i * 0.1}>
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--teal)]/20 border border-[var(--teal)]/40 flex items-center justify-center text-[var(--teal)] font-800 text-sm">
                    {s.num}
                  </div>
                  <div>
                    <h3 className="text-white font-700 text-lg mb-1">{s.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp className="text-center mt-14" delay={0.4}>
            <CallCTA />
          </FadeUp>
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-800 text-[var(--navy)]">Levels of Care</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Every patient gets the right level of care for where they are right now.</p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Medical Detox', days: '5–10 days', desc: '24/7 physician monitoring. Safe, comfortable withdrawal management using evidence-based protocols. All substances.' },
              { title: 'Residential Treatment', days: '30–90 days', desc: 'Full-day programming: individual therapy, group therapy, trauma work, family therapy, dual-diagnosis treatment.' },
              { title: 'Aftercare & Alumni', days: 'Ongoing', desc: 'Discharge planning, IOP referrals, case management, and a community of alumni who know exactly what you\'re going through.' },
            ].map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="border-2 border-gray-100 rounded-2xl p-8 hover:border-[var(--teal)] transition-colors"
                >
                  <div className="inline-block bg-[var(--teal)]/10 text-[var(--teal)] text-xs font-700 px-3 py-1 rounded-full mb-4">{p.days}</div>
                  <h3 className="text-[var(--navy)] font-700 text-xl mb-3">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-24 bg-[var(--bg-light)]">
        <div className="max-w-5xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-800 text-[var(--navy)]">Meet Your Care Team</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Every person on staff is licensed, credentialed, and here because recovery is their calling.</p>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.08}>
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                    {/* Photo placeholder — replace with real headshot */}
                    <div className="w-full h-full bg-gradient-to-br from-[var(--teal)]/30 to-[var(--navy)]/20 flex items-center justify-center">
                      <span className="text-2xl text-[var(--navy)]/40 font-800">{t.name.split(' ').map(n => n[0]).slice(0,2).join('')}</span>
                    </div>
                  </div>
                  <h3 className="text-[var(--navy)] font-700 text-sm">{t.name}</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-snug">{t.role}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS MARQUEE ── */}
      <section className="py-20 bg-white overflow-hidden">
        <FadeUp className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-800 text-[var(--navy)]">Real Stories</h2>
          <p className="text-gray-500 mt-2">From people who walked out and didn't look back.</p>
        </FadeUp>

        <div className="overflow-hidden">
          <div className="marquee-track" style={{ animationDuration: '50s' }}>
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-80 bg-[var(--bg-light)] rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-[var(--orange)] text-sm">★</span>)}
                </div>
                <p className="text-[var(--navy)] text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-700 text-[var(--navy)] text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section className="py-24 bg-[var(--navy)]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <h2 className="text-3xl sm:text-4xl font-800 text-white mb-4">Nestled in the Santa Clarita Hills</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Our facility sits in a peaceful residential neighborhood surrounded by hills and open sky — far enough from the city to reset, close enough to LA for family visits.
              </p>
              <ul className="space-y-3 mb-8">
                {['Minutes from the 5 and 14 freeways','Private, residential setting','Airport pickup available','Private rooms available'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-white/80 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#56B5B7"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <CallCTA />
            </FadeUp>

            {/* Map placeholder */}
            <FadeUp delay={0.15}>
              <div className="rounded-2xl overflow-hidden h-72 bg-[var(--teal)]/20 border border-[var(--teal)]/30 flex items-center justify-center">
                <div className="text-center text-white/50">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-3 opacity-40">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <p className="text-sm">Santa Clarita, CA</p>
                  <p className="text-xs opacity-60 mt-1">Exact address provided after verification</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 bg-[var(--teal)]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl sm:text-4xl font-800 text-white mb-4">
              The right time to call is right now.
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Beds are limited. A physician is available. Same-day admission is possible.
              Don't let today slip by.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CallCTA />
              <a
                href="#verify"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white font-600 text-lg px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
                onClick={e => { e.preventDefault(); document.getElementById('verify')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Verify Insurance
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[var(--navy)] border-t border-white/10 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-[var(--teal)] flex items-center justify-center">
                  <span className="text-white font-800 text-xs">HL</span>
                </div>
                <span className="font-700 text-white">Healthy Living</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">Physician-owned detox and residential treatment. Santa Clarita, CA.</p>
            </div>
            <div>
              <h4 className="text-white font-600 text-sm mb-3">Programs</h4>
              <ul className="space-y-2">
                {['Medical Detox','Residential Treatment','Couples Program','Alumni & Aftercare'].map(p => (
                  <li key={p} className="text-white/50 text-sm hover:text-white/80 cursor-pointer transition-colors">{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-600 text-sm mb-3">Contact</h4>
              <a href="tel:+18005551234" className="text-[var(--teal)] font-700 text-lg block mb-1">(800) 555-1234</a>
              <p className="text-white/50 text-sm">Available 24/7 · Confidential</p>
              <p className="text-white/50 text-sm mt-2">Santa Clarita, CA 91350</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-white/30 text-xs">
            <p>© 2024 Healthy Living Residential Program. All rights reserved.</p>
            <p>Privacy Policy · HIPAA Notice · 42 CFR Part 2 Compliant</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
