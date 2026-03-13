import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const FEATURES = [
  { icon:'🗺️', title:'Geospatial Heatmaps',   desc:'Real-time incident density maps with cluster detection across every city zone.' },
  { icon:'📊', title:'Live Analytics',         desc:'Category breakdowns, trend charts, and resolution velocity dashboards.' },
  { icon:'🤖', title:'Intelligence Alerts',    desc:'Automated hotspot detection surfaces rising issues before they escalate.' },
  { icon:'📸', title:'Photo Evidence',         desc:'Citizen photo uploads attached to every complaint for faster verification.' },
  { icon:'🔔', title:'Status Transparency',    desc:'Citizens track every report from submission through to resolution.' },
  { icon:'🏙️', title:'Area-Based Routing',    desc:'Select your ward or zone — complaints auto-route to the correct department.' },
]
const STATS = [
  { v:'50K+', l:'Issues Resolved' },
  { v:'120+', l:'Municipalities' },
  { v:'99.2%',l:'Platform Uptime' },
  { v:'4.2m', l:'Avg Response' },
]
const CATS = [
  { name:'Solid Waste',    color:'#22C55E', icon:'🗑️' },
  { name:'Road Damage',    color:'#F59E0B', icon:'🚧' },
  { name:'Water Lines',    color:'#3B82F6', icon:'💧' },
  { name:'Street Lighting',color:'#A78BFA', icon:'💡' },
  { name:'Drainage',       color:'#06B6D4', icon:'🌊' },
]

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [mOpen, setMOpen] = useState(false)
  const [count, setCount] = useState({ issues:0, cities:0 })

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Animated counters
  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i += 2
      setCount({ issues: Math.min(i * 500, 50000), cities: Math.min(Math.floor(i * 1.2), 120) })
      if (i >= 100) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: '#030712', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@600;700;800&display=swap');
        .cp-nav-link { color: rgba(255,255,255,0.5); font-size: .875rem; font-weight: 500; text-decoration: none; transition: color .2s; }
        .cp-nav-link:hover { color: #fff; }
        .cp-feat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 28px; transition: all .25s; cursor: default; }
        .cp-feat-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(59,130,246,0.4); transform: translateY(-3px); }
        .cp-cat-row { display: flex; align-items: center; gap: 14px; padding: 12px 16px; border-radius: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); margin-bottom: 8px; transition: all .2s; }
        .cp-cat-row:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); }
        .glow-blue { box-shadow: 0 0 80px rgba(59,130,246,0.25), 0 0 160px rgba(59,130,246,0.1); }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes floatCard { 0%,100% { transform:translateY(0px) rotate(1deg); } 50% { transform:translateY(-12px) rotate(1deg); } }
        @keyframes pulseRing { 0%,100% { opacity:.6; transform:scale(1); } 50% { opacity:.2; transform:scale(1.15); } }
        .anim-hero { animation: fadeSlideUp .8s ease-out both; }
        .anim-hero-2 { animation: fadeSlideUp .8s .15s ease-out both; }
        .anim-hero-3 { animation: fadeSlideUp .8s .3s ease-out both; }
        .card-float { animation: floatCard 6s ease-in-out infinite; }
        .pulse-ring { animation: pulseRing 2s ease-in-out infinite; }
        .grid-bg { background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 60px 60px; }
        .noise::after { content:''; position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events:none; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all .3s',
        background: scrolled ? 'rgba(3,7,18,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#3B82F6,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne', fontWeight: 700, fontSize: 13, color: '#fff' }}>CP</div>
            <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '-.02em' }}>CivicPulse</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden md:flex">
            {['Features','Solutions','About'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="cp-nav-link">{l}</a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login">
              <button style={{ padding: '8px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Sign In</button>
            </Link>
            <Link to="/register">
              <button style={{ padding: '8px 18px', borderRadius: 10, background: 'linear-gradient(135deg,#3B82F6,#06B6D4)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(59,130,246,0.4)', fontFamily: 'inherit' }}>Get Access</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="noise" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 80, overflow: 'hidden' }}>
        {/* Ambient glows */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', top: '40%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}/>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', width: '100%' }}>
          {/* Left */}
          <div>
            <div className="anim-hero" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', marginBottom: 32 }}>
              <div className="pulse-ring" style={{ width: 7, height: 7, borderRadius: '50%', background: '#3B82F6' }}/>
              <span style={{ color: '#93C5FD', fontSize: 13, fontWeight: 600 }}>Live across 120+ Municipalities</span>
            </div>

            <h1 className="anim-hero-2" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2.8rem,5.5vw,4.2rem)', lineHeight: 1.05, color: '#fff', letterSpacing: '-.03em', marginBottom: 28 }}>
              Turn citizen<br/>reports into<br/>
              <span style={{ background: 'linear-gradient(135deg,#3B82F6,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>civic intelligence.</span>
            </h1>

            <p className="anim-hero-3" style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', maxWidth: 440, marginBottom: 40 }}>
              CivicPulse converts every complaint into geospatial intelligence — helping municipalities detect hotspots, dispatch teams, and resolve issues faster.
            </p>

            <div className="anim-hero-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register">
                <button style={{ padding: '14px 30px', borderRadius: 12, background: 'linear-gradient(135deg,#3B82F6,#06B6D4)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 24px rgba(59,130,246,0.45)', fontFamily: 'inherit', letterSpacing: '-.01em' }}>
                  Get Started →
                </button>
              </Link>
              <a href="#features" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '14px 30px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
                  See Platform
                </button>
              </a>
            </div>

            {/* Floating stats */}
            <div style={{ display: 'flex', gap: 28, marginTop: 52 }} className="anim-hero-3">
              {[
                { v: count.issues.toLocaleString() + '+', l: 'Issues Resolved' },
                { v: count.cities + '+', l: 'Cities Live' },
                { v: '99.2%', l: 'Uptime' },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: '#fff', lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4, fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating dashboard card */}
          <div className="card-float" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: 380, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 24, boxShadow: '0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, color: '#fff', fontSize: 15 }}>Command Center</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Hyderabad Municipal Corp.</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
                  <div className="pulse-ring" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }}/>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#4ADE80' }}>Live</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[['247','Total','#3B82F6','rgba(59,130,246,0.1)'],['89','Pending','#F59E0B','rgba(245,158,11,0.1)'],['158','Resolved','#22C55E','rgba(34,197,94,0.1)']].map(([v,l,c,bg])=>(
                  <div key={l} style={{ textAlign: 'center', padding: '14px 8px', borderRadius: 12, background: bg }}>
                    <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.4rem', color: c }}>{v}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>

              {[
                {e:'🗑️',t:'Solid Waste',l:'Sector 4',c:'#22C55E',s:'Pending'},
                {e:'🚧',t:'Road Damage',l:'MG Road', c:'#F59E0B',s:'Active'},
                {e:'💧',t:'Water Line', l:'Block B2', c:'#3B82F6',s:'Pending'},
              ].map(r=>(
                <div key={r.t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{r.e}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{r.t}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{r.l}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: `${r.c}1A`, color: r.c, border: `1px solid ${r.c}33` }}>{r.s}</span>
                </div>
              ))}

              <div style={{ marginTop: 14, padding: '12px', borderRadius: 12, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <span style={{ fontSize: 12, color: '#93C5FD' }}>🔥 <strong>Alert:</strong> Solid Waste up 34% in Sector 4 this week.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, textAlign: 'center' }}>
          {STATS.map(({v,l}) => (
            <div key={l}>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2rem', background: 'linear-gradient(135deg,#3B82F6,#06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6, fontWeight: 500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', color: '#93C5FD', letterSpacing: '.08em', marginBottom: 20 }}>PLATFORM CAPABILITIES</div>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem,4vw,2.8rem)', color: '#fff', letterSpacing: '-.03em', marginBottom: 16, lineHeight: 1.1 }}>Built for Modern<br/>Urban Governance</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 460, margin: '0 auto', lineHeight: 1.75, fontSize: 15 }}>A complete civic intelligence stack — from complaint intake to resolution analytics.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {FEATURES.map((f,i) => (
              <div key={i} className="cp-feat-card">
                <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS ── */}
      <section id="solutions" style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ADE80', letterSpacing: '.08em', marginBottom: 24 }}>ISSUE CATEGORIES</div>
            <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: '#fff', letterSpacing: '-.03em', marginBottom: 16, lineHeight: 1.1 }}>Every Civic Issue,<br/>Classified & Routed</h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.45)', marginBottom: 32 }}>Smart classification with priority scoring and automatic routing to the correct municipal department.</p>
            <div>
              {CATS.map(c => (
                <div key={c.name} className="cp-cat-row">
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{c.icon}</div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)', flex: 1 }}>{c.name}</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }}/>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', padding: 28, backdropFilter: 'blur(20px)' }}>
            <div style={{ fontFamily: 'Syne', fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 4 }}>Intelligence Engine</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>Auto-generated · Every 15 min</div>
            {['🔥 Solid Waste rising 34% in Zone 4 this week','📍 Road damage cluster — MG Road corridor (8 reports)','💧 Water surge post-monsoon in Ward 12','✅ Lighting resolution avg: 2.1 days','⚠️ Drainage backlog Sector 7 — escalate'].map((item,i) => (
              <div key={i} style={{ padding: '10px 14px', marginBottom: 6, borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{item}</div>
            ))}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 10, fontWeight: 600, letterSpacing: '.06em' }}>RESOLUTION RATE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ width: '73%', height: '100%', borderRadius: 6, background: 'linear-gradient(90deg,#22C55E,#4ADE80)' }}/>
                </div>
                <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 15, color: '#4ADE80' }}>73%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#C4B5FD', letterSpacing: '.08em', marginBottom: 24 }}>ABOUT</div>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', color: '#fff', letterSpacing: '-.03em', marginBottom: 20, lineHeight: 1.1 }}>Engineered for the Cities of Tomorrow</h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(255,255,255,0.45)', marginBottom: 48 }}>
            CivicPulse was built by civic-technology engineers who believed municipal governments deserve enterprise-grade analytics. We bridge the gap between citizens and administrators with a real-time data feedback loop.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {[['🌐','Open Architecture'],['🔒','Privacy by Design'],['⚡','Deploy in Hours']].map(([icon,label]) => (
              <div key={label} style={{ padding: '28px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: '#fff' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: '#fff', letterSpacing: '-.03em', lineHeight: 1.05, marginBottom: 20 }}>Ready to Deploy?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', marginBottom: 40, lineHeight: 1.7 }}>Join 120+ municipalities delivering faster, smarter civic services.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/register">
              <button style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg,#3B82F6,#06B6D4)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 24px rgba(59,130,246,0.4)', fontFamily: 'inherit' }}>Request Access →</button>
            </Link>
            <Link to="/login">
              <button style={{ padding: '14px 32px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>Administrator Login</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#3B82F6,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'Syne' }}>CP</div>
            <span style={{ fontFamily: 'Syne', fontWeight: 700, color: '#fff', fontSize: 14 }}>CivicPulse</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2024 CivicPulse Technologies. Ground Reality Intelligence Platform.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['Sign In','/login'],['Register','/register']].map(([l,h]) => (
              <Link key={l} to={h} style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontWeight: 500 }}>{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}