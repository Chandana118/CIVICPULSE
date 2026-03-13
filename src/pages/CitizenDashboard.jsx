import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ComplaintForm from '../components/ComplaintForm'
import MapView from '../components/MapView'
import { useAuth } from '../context/AuthContext'

const S = {
  pending:     {label:'Pending',     bg:'#FEF3C7',color:'#B45309',border:'#FCD34D'},
  in_progress: {label:'In Progress', bg:'#EEF2FF', color:'#4338CA',border:'#C7D2FE'},
  resolved:    {label:'Resolved',    bg:'#DCFCE7', color:'#15803D',border:'#86EFAC'},
}
const CAT_ICON = { Garbage:'🗑️', Pothole:'🚧', 'Water Leakage':'💧', 'Street Light':'💡', Drainage:'🌊' }

const TABS = [
  {id:'map',    label:'Live Map',   d:'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'},
  {id:'report', label:'New Report', d:'M12 4v16m8-8H4'},
  {id:'mine',   label:'My Reports', d:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'},
]

export default function CitizenDashboard() {
  const { user, logout, API } = useAuth()
  const navigate = useNavigate()
  const [tab,  setTab]  = useState('map')
  const [mine, setMine] = useState([])
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setBusy(true)
    try { const r = await axios.get(`${API}/reports/mine`); setMine(r.data) }
    catch(e){ console.error(e) } finally { setBusy(false) }
  }
  useEffect(()=>{ load() },[])

  const pending  = mine.filter(r=>r.status==='pending').length
  const resolved = mine.filter(r=>r.status==='resolved').length

  return (
    <div style={{minHeight:'100vh',background:'#F0F4FF',display:'flex',flexDirection:'column'}}>

      {/* ── TOP NAV ── */}
      <nav className="top-nav sticky top-0 z-30">
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link to="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#4F46E5,#2563EB)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne',fontWeight:800,fontSize:12,color:'#fff'}}>CP</div>
            <div className="hidden sm:block">
              <div style={{fontFamily:'Syne',fontWeight:800,fontSize:14,color:'#0F172A',lineHeight:1}}>CivicPulse</div>
              <div style={{fontSize:11,color:'#94A3B8',lineHeight:1,marginTop:2}}>Citizen Portal</div>
            </div>
          </Link>

          <div style={{display:'flex',alignItems:'center',gap:2}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} className={`nav-tab ${tab===t.id?'active':''}`}>
                <svg style={{width:15,height:15}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={t.d}/>
                </svg>
                <span className="hidden sm:inline">{t.label}</span>
                {t.id==='mine'&&mine.length>0&&<span style={{fontSize:10,padding:'1px 6px',borderRadius:100,background:'#4F46E5',color:'#fff',fontWeight:700}}>{mine.length}</span>}
              </button>
            ))}
          </div>

          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div className="hidden sm:flex" style={{alignItems:'center',gap:8,padding:'6px 12px',borderRadius:100,background:'#EEF2FF',border:'1px solid #C7D2FE'}}>
              <div style={{width:24,height:24,borderRadius:'50%',background:'linear-gradient(135deg,#4F46E5,#2563EB)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff'}}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span style={{fontSize:13,fontWeight:600,color:'#4338CA'}}>{user?.name?.split(' ')[0]}</span>
            </div>
            <button onClick={()=>{logout();navigate('/')}} className="btn btn-sm btn-ghost" style={{padding:'6px 10px'}}>
              <svg style={{width:15,height:15}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{flex:1,overflowY:'auto',padding:'20px'}}>
        <div style={{maxWidth:1200,margin:'0 auto',display:'flex',flexDirection:'column',gap:20}}>

          {/* KPI strip */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
            {[
              {label:'Total',    value:mine.length, c:'#4F46E5',bg:'#EEF2FF',b:'#C7D2FE'},
              {label:'Pending',  value:pending,     c:'#B45309',bg:'#FFFBEB',b:'#FCD34D'},
              {label:'Resolved', value:resolved,    c:'#15803D',bg:'#F0FDF4',b:'#86EFAC'},
            ].map(s=>(
              <div key={s.label} className="card" style={{textAlign:'center',padding:'18px 12px',background:s.bg,border:`1.5px solid ${s.b}`}}>
                <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.8rem',color:s.c,lineHeight:1}}>{s.value}</div>
                <div style={{fontSize:12,fontWeight:600,color:'#64748B',marginTop:4}}>{s.label} Reports</div>
              </div>
            ))}
          </div>

          {tab==='map'&&<MapView isAdmin={false}/>}
          {tab==='report'&&<ComplaintForm onSuccess={()=>{load();setTab('mine')}}/>}

          {tab==='mine'&&(
            <div className="card" style={{overflow:'hidden'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 24px',borderBottom:'1px solid #E0E7FF'}}>
                <div>
                  <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:15,color:'#0F172A'}}>My Submissions</h3>
                  <p style={{fontSize:12,color:'#94A3B8',marginTop:2}}>{mine.length} complaint{mine.length!==1?'s':''} filed</p>
                </div>
                <button onClick={load} className="btn btn-sm btn-ghost">↻ Refresh</button>
              </div>

              {busy?(
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'64px',gap:10,color:'#94A3B8',fontSize:14}}>
                  <div className="spin" style={{width:20,height:20,borderRadius:'50%',border:'2.5px solid #C7D2FE',borderTopColor:'#4F46E5'}}/>Loading…
                </div>
              ):mine.length===0?(
                <div style={{textAlign:'center',padding:'64px 24px'}}>
                  <div style={{width:56,height:56,borderRadius:16,background:'#EEF2FF',border:'1px solid #C7D2FE',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
                    <svg style={{width:28,height:28}} fill="none" viewBox="0 0 24 24" stroke="#4F46E5" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <div style={{fontFamily:'Syne',fontWeight:700,fontSize:16,color:'#0F172A',marginBottom:8}}>No reports yet</div>
                  <p style={{fontSize:13,color:'#94A3B8',marginBottom:20}}>File your first complaint to get started</p>
                  <button onClick={()=>setTab('report')} className="btn btn-primary btn-sm">File a Report</button>
                </div>
              ):mine.map(r=>{
                const st=S[r.status]||S.pending
                return (
                  <div key={r.id} className="table-row" style={{display:'flex',alignItems:'flex-start',gap:14,padding:'16px 24px',borderBottom:'1px solid #F0F4FF'}}>
                    <div style={{width:42,height:42,borderRadius:12,background:'#F8FAFF',border:'1px solid #E0E7FF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>
                      {CAT_ICON[r.category]||'📍'}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:3}}>
                        <span style={{fontWeight:700,fontSize:14,color:'#0F172A'}}>{r.category}</span>
                        <span className={`badge-${r.status}`}>{st.label}</span>
                      </div>
                      <p style={{fontSize:13,color:'#475569',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.description}</p>
                      <div style={{fontSize:11,color:'#94A3B8',marginTop:4}}>{new Date(r.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}