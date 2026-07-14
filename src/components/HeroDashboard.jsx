import React, { useState, useEffect, useRef } from 'react';

/* ── Book pages content ─────────────────────────────────────────────────── */
const BOOK_PAGES = [
  {
    label: 'COVER', bg: 'linear-gradient(155deg,#1e1b4b 0%,#312e81 60%,#1a1638 100%)',
    accent: '#a78bfa',
    content: null, // rendered as front cover
  },
  {
    label: 'Ch 1–3', bg: 'linear-gradient(150deg,#0c1a30 0%,#0f2447 100%)',
    accent: '#38bdf8',
    content: ['OSI Model (7 Layers)', 'TCP/IP Stack (4 Layers)', 'Network Types: LAN/WAN/MAN', 'PDUs per Layer', 'Encapsulation Process'],
  },
  {
    label: 'Ch 4–6', bg: 'linear-gradient(150deg,#0a1a10 0%,#0d2318 100%)',
    accent: '#4ade80',
    content: ['IP Addressing & CIDR', 'Subnetting Step-by-Step', 'Routing Algorithms', "Dijkstra's Shortest Path", 'Distance Vector vs Link State'],
  },
  {
    label: 'Ch 7–9', bg: 'linear-gradient(150deg,#1a0f00 0%,#2d1a00 100%)',
    accent: '#fbbf24',
    content: ['TCP vs UDP', 'Sliding Window Protocol', 'Error Control: CRC, Hamming', 'Flow Control & Congestion', 'Stop-and-Wait / Go-Back-N'],
  },
  {
    label: 'Formulas', bg: 'linear-gradient(150deg,#1a000d 0%,#2d0017 100%)',
    accent: '#f472b6',
    content: ['Shannon Capacity: C = B·log₂(1+SNR)', 'Nyquist: C = 2B·log₂(L)', 'Propagation Delay = d/v', 'Efficiency η = T_t/(T_t+2T_p)', 'Hamming: 2ⁿ ≥ m + n + 1'],
  },
];

/* ── Stat counter with count-up animation ───────────────────────────────── */
function StatCounter({ value, suffix, label, icon, color, started }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const dur = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, value]);

  return (
    <div style={{
      background: 'rgba(15,23,42,0.6)',
      border: `1px solid ${color}30`,
      borderRadius: '14px',
      padding: '14px 12px',
      textAlign: 'center',
      transition: 'border-color 0.2s',
    }}>
      <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Fira Code, monospace', color, lineHeight: 1 }}>
        {displayed}{suffix}
      </div>
      <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
        {label}
      </div>
    </div>
  );
}

/* ── 3D CSS Book ────────────────────────────────────────────────────────── */
function Book3D({ currentPage, total, onFlip }) {
  // Pages render back-to-front so CSS stacking is correct
  return (
    <div
      onClick={onFlip}
      title="Click to turn page"
      style={{ perspective: '1100px', perspectiveOrigin: '50% 40%', cursor: 'pointer', userSelect: 'none' }}
    >
      <div style={{
        position: 'relative',
        width: '200px',
        height: '280px',
        transformStyle: 'preserve-3d',
        transform: 'rotateY(-22deg) rotateX(6deg)',
        filter: 'drop-shadow(24px 36px 48px rgba(0,0,0,0.7))',
        transition: 'transform 0.3s ease',
      }}>
        {/* Book spine */}
        <div style={{
          position: 'absolute',
          width: '36px',
          height: '280px',
          left: '0',
          top: '0',
          transformOrigin: 'right center',
          transform: 'rotateY(-90deg) translateX(18px)',
          background: 'linear-gradient(180deg,#1a1638,#0f0c29)',
          borderRadius: '4px 0 0 4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            color: '#7c3aed',
            fontSize: '9px',
            fontWeight: 900,
            letterSpacing: '0.25em',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontFamily: 'Outfit, sans-serif',
            textTransform: 'uppercase',
          }}>
            CN SURVIVAL KIT
          </span>
        </div>

        {/* Back cover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg,#0f0c29,#1a1638)',
          borderRadius: '2px 8px 8px 2px',
          transform: 'translateZ(-3px)',
        }} />

        {/* Pages (rendered back→front so front cover is z-highest) */}
        {BOOK_PAGES.map((page, idx) => {
          const isFlipped = idx < currentPage;
          const zUnflipped = (BOOK_PAGES.length - idx) * 2;
          const zFlipped = idx * 2 + 1;

          return (
            <div key={idx} style={{
              position: 'absolute', inset: 0,
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(-175deg)' : 'rotateY(0deg)',
              transition: 'transform 0.65s cubic-bezier(0.645,0.045,0.355,1)',
              zIndex: isFlipped ? zFlipped : zUnflipped,
            }}>
              {/* Front face */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                background: page.bg,
                borderRadius: '2px 8px 8px 2px',
                padding: '18px 16px',
                overflow: 'hidden',
                boxShadow: '-2px 0 10px rgba(0,0,0,0.5)',
              }}>
                {idx === 0 ? (
                  // Front cover design
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '9px', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'monospace' }}>
                        PREMIUM EDITION
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 900, color: '#e2e8f0', fontFamily: 'Outfit,sans-serif', lineHeight: 1.2, marginBottom: '6px' }}>
                        Computer<br />Networks
                      </div>
                      <div style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 700, marginBottom: '16px', fontFamily: 'Outfit,sans-serif' }}>
                        Survival Kit
                      </div>
                      <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg,#7c3aed,#4f46e5)', borderRadius: '2px', marginBottom: '12px' }} />
                      <div style={{ fontSize: '9px', color: '#6366f1', fontFamily: 'monospace', lineHeight: 1.8 }}>
                        {'> OSI & TCP/IP Models'}<br />
                        {'> Subnetting & Routing'}<br />
                        {'> Error & Flow Control'}<br />
                        {'> Simulators & Exams'}
                      </div>
                    </div>
                    <div style={{ fontSize: '8px', color: '#4c1d95', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                      CLICK TO EXPLORE ▸
                    </div>
                  </div>
                ) : (
                  // Inner page
                  <div style={{ height: '100%', overflow: 'hidden' }}>
                    <div style={{ fontSize: '8px', color: page.accent, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'monospace', borderBottom: `1px solid ${page.accent}30`, paddingBottom: '6px' }}>
                      {page.label}
                    </div>
                    {page.content?.map((line, i) => (
                      <div key={i} style={{ fontSize: '8.5px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '4px', display: 'flex', gap: '5px' }}>
                        <span style={{ color: page.accent, fontWeight: 700 }}>▸</span>
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Back face (what you see after flip) */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: BOOK_PAGES[Math.min(idx + 1, BOOK_PAGES.length - 1)].bg,
                borderRadius: '2px 8px 8px 2px',
                padding: '18px 16px',
                overflow: 'hidden',
              }}>
                {idx + 1 < BOOK_PAGES.length && BOOK_PAGES[idx + 1].content && (
                  <div>
                    <div style={{ fontSize: '8px', color: BOOK_PAGES[idx + 1].accent, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: 'monospace', borderBottom: `1px solid ${BOOK_PAGES[idx + 1].accent}30`, paddingBottom: '6px' }}>
                      {BOOK_PAGES[idx + 1].label}
                    </div>
                    {BOOK_PAGES[idx + 1].content?.map((line, i) => (
                      <div key={i} style={{ fontSize: '8.5px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '4px', display: 'flex', gap: '5px' }}>
                        <span style={{ color: BOOK_PAGES[idx + 1].accent, fontWeight: 700 }}>▸</span>
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Caption */}
      <div style={{ textAlign: 'center', marginTop: '18px' }}>
        <div style={{ fontSize: '10px', color: '#475569', fontFamily: 'monospace' }}>
          Click to turn page · {Math.min(currentPage, BOOK_PAGES.length - 1)}/{BOOK_PAGES.length - 1}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '8px' }}>
          {BOOK_PAGES.map((_, i) => (
            <div key={i} style={{
              width: i === Math.min(currentPage, BOOK_PAGES.length - 1) ? '16px' : '5px',
              height: '5px',
              borderRadius: '3px',
              background: i < currentPage ? '#7c3aed' : i === currentPage ? '#a78bfa' : '#1e293b',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Feature cards ──────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: '📖', title: 'Complete Theory', desc: '10 chapters, OSI to Application Layer with analogies, traps & mnemonics', tab: 'theory', color: '#38bdf8' },
  { icon: '🧮', title: 'Formula Bible', desc: 'Every formula with derivation, units, and worked examples', tab: 'formulas', color: '#818cf8' },
  { icon: '⚡', title: 'Simulators', desc: 'TCP Reno, Dijkstra routing, subnetting, CRC, sliding window & OSI diagram', tab: 'simulators', color: '#4ade80' },
  { icon: '🎤', title: 'Viva Flashcards', desc: '250+ Q&A cards with mastery tracking — randomized for every session', tab: 'viva', color: '#fbbf24' },
  { icon: '📝', title: 'Mock Exams', desc: 'Full-length exam papers with MCQs and long-answer marking schemes', tab: 'mocks', color: '#f472b6' },
  { icon: '🎲', title: 'Numerical Gen', desc: 'Unlimited randomized problems with step-by-step LaTeX solutions', tab: 'simulators', color: '#fb923c' },
];

/* ── Main HeroDashboard component ───────────────────────────────────────── */
export default function HeroDashboard({ onNavigate, chapterProgress, chaptersData }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [countStarted, setCountStarted] = useState(false);

  // Start count-up after short delay
  useEffect(() => {
    const t = setTimeout(() => setCountStarted(true), 400);
    return () => clearTimeout(t);
  }, []);

  // Auto-flip book pages on an interval
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentPage(p => p >= BOOK_PAGES.length - 1 ? 0 : p + 1);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  const handleFlip = () => setCurrentPage(p => p >= BOOK_PAGES.length - 1 ? 0 : p + 1);

  // Compute progress stats
  const TASKS = ['theory', 'formula', 'numericals', 'pyqs', 'revision'];
  const totalChapters = chaptersData?.length || 0;
  const completedChapters = (chaptersData || []).filter(ch => {
    const c = (chapterProgress || {})[ch.id] || {};
    return TASKS.every(t => c[t]);
  }).length;
  const overallPct = totalChapters > 0
    ? Math.round((chaptersData || []).reduce((s, ch) => {
        const c = (chapterProgress || {})[ch.id] || {};
        return s + TASKS.filter(t => c[t]).length;
      }, 0) / (totalChapters * TASKS.length) * 100)
    : 0;

  const STATS = [
    { value: 120, suffix: '+', label: 'Theory Pages', icon: '📖', color: '#38bdf8' },
    { value: 100, suffix: '+', label: 'Numericals',   icon: '🔢', color: '#818cf8' },
    { value: 40,  suffix: '',  label: 'Comp. Tables', icon: '📊', color: '#4ade80' },
    { value: 250, suffix: '+', label: 'Viva Q&As',    icon: '🎤', color: '#fbbf24' },
    { value: 7,   suffix: '',  label: 'Simulators',   icon: '⚡', color: '#f472b6' },
    { value: 2,   suffix: '',  label: 'Mock Exams',   icon: '📝', color: '#fb923c' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* ── Hero Row ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center', marginBottom: '48px' }}
           className="lg-hero-row">
        
        {/* Left: headline + stats + CTA */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '20px', padding: '4px 14px', fontSize: '10px', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Fira Code, monospace', marginBottom: '20px' }}>
            🔥 Premium Study Edition — CN Survival Kit
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1.1, color: '#f1f5f9', marginBottom: '14px' }}>
            Computer Networks<br />
            <span style={{ background: 'linear-gradient(90deg,#38bdf8 0%,#818cf8 50%,#c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Survival Kit
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: '500px', marginBottom: '24px' }}>
            The most comprehensive CN resource — theory notes, formula bible, interactive simulators, 250+ flashcards, and mock exams. Everything you need, nowhere else.
          </p>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
            {STATS.map((s, i) => (
              <StatCounter key={i} {...s} started={countStarted} />
            ))}
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', fontSize: '11px', color: '#475569', fontFamily: 'Fira Code, monospace', marginBottom: '28px' }}>
            <span>📅 Updated: <strong style={{ color: '#64748b' }}>July 2026</strong></span>
            <span>⏱️ Quick Revision: <strong style={{ color: '#64748b' }}>~45 min</strong></span>
            <span>🎯 Syllabus: <strong style={{ color: '#64748b' }}>100% Covered</strong></span>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('theory')}
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', borderRadius: '12px', padding: '13px 28px', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '0 0 24px rgba(124,58,237,0.45)', transition: 'transform 0.15s ease, box-shadow 0.15s ease', fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(124,58,237,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(124,58,237,0.45)'; }}
            >
              📖 Continue Learning
            </button>
            <button
              onClick={() => onNavigate('simulators')}
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid #1e293b', borderRadius: '12px', padding: '13px 24px', color: '#94a3b8', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#38bdf8'; e.currentTarget.style.color = '#38bdf8'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              ⚡ Open Simulators
            </button>
          </div>
        </div>

        {/* Right: 3D Book */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <Book3D currentPage={currentPage} total={BOOK_PAGES.length} onFlip={handleFlip} />
        </div>
      </div>

      {/* ── Progress Overview ── */}
      {totalChapters > 0 && (
        <div style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Fira Code, monospace' }}>
                📊 Your Learning Progress
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>
                <strong style={{ color: '#f1f5f9' }}>{completedChapters}</strong> of {totalChapters} chapters fully completed
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Fira Code, monospace', color: overallPct >= 80 ? '#4ade80' : overallPct >= 40 ? '#fbbf24' : '#60a5fa' }}>
                {overallPct}%
              </div>
              <div style={{ fontSize: '10px', color: '#475569' }}>overall</div>
            </div>
          </div>
          <div style={{ height: '8px', background: '#0f172a', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '6px',
              width: `${overallPct}%`,
              background: overallPct >= 80 ? 'linear-gradient(90deg,#10b981,#4ade80)' : overallPct >= 40 ? 'linear-gradient(90deg,#d97706,#fbbf24)' : 'linear-gradient(90deg,#2563eb,#60a5fa)',
              transition: 'width 1s ease',
            }} />
          </div>
          {overallPct === 0 && (
            <div style={{ fontSize: '11px', color: '#475569', marginTop: '10px', fontFamily: 'Fira Code, monospace' }}>
              Start reading → open Theory Notes and tick off tasks as you complete them 📝
            </div>
          )}
        </div>
      )}

      {/* ── Feature Cards ── */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Fira Code, monospace', marginBottom: '16px' }}>
          🗂️ Quick Access
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {FEATURES.map((f, i) => (
            <button
              key={i}
              onClick={() => onNavigate(f.tab)}
              style={{
                textAlign: 'left',
                background: 'rgba(15,23,42,0.5)',
                border: `1px solid #1e293b`,
                borderRadius: '14px',
                padding: '18px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = f.color + '60';
                e.currentTarget.style.background = `rgba(15,23,42,0.85)`;
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${f.color}18`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e293b';
                e.currentTarget.style.background = 'rgba(15,23,42,0.5)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{f.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>{f.title}</div>
              <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.5 }}>{f.desc}</div>
              <div style={{ marginTop: '12px', fontSize: '10px', fontWeight: 700, color: f.color, fontFamily: 'Fira Code, monospace' }}>
                Open →
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
