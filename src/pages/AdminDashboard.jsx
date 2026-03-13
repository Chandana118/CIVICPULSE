import axios from 'axios'
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import { Link, useNavigate } from 'react-router-dom'
import MapView from '../components/MapView'
import { useAuth } from '../context/AuthContext'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const CAT_COLOR = { Garbage:'#22C55E', Pothole:'#F59E0B', 'Water Leakage':'#3B82F6', 'Street Light':'#A78BFA', Drainage:'#06B6D4' }
const CAT_ICON  = { Garbage:'🗑️', Pothole:'🚧', 'Water Leakage':'💧', 'Street Light':'💡', Drainage:'🌊' }
const S = {
  pending:     {label:'Pending',     bg:'#FEF3C7',color:'#B45309',border:'#FCD34D'},
  in_progress: {label:'In Progress', bg:'#EEF2FF', color:'#4338CA',border:'#C7D2FE'},
  resolved:    {label:'Resolved',    bg:'#DCFCE7', color:'#15803D',border:'#BBF7D0'},
}

const TIP = { backgroundColor:'#1E1B4B',borderColor:'rgba(99,102,241,0.3)',borderWidth:1,titleColor:'#E0E7FF',bodyColor:'rgba(224,231,255,0.7)',padding:12,cornerRadius:10,titleFont:{family:'Syne',size:12,weight:'700'},bodyFont:{family:'DM Sans',size:11} }

const barOpts = {
  responsive:true, maintainAspectRatio:false,
  plugins:{ legend:{display:false}, tooltip:TIP },
  scales:{
    x:{grid:{display:false},ticks:{color:'#94A3B8',font:{family:'DM Sans',size:11}},border:{display:false}},
    y:{grid:{color:'#F0F4FF',lineWidth:1},ticks:{color:'#94A3B8',font:{family:'DM Sans',size:11},stepSize:1},border:{display:false}},
  }
}
const pieOpts = {
  responsive:true, maintainAspectRatio:false,
  plugins:{
    legend:{display:true,position:'bottom',labels:{color:'#475569',font:{family:'DM Sans',size:12},padding:16,usePointStyle:true,pointStyleWidth:8}},
    tooltip:TIP,
  },
}

const TABS = [
  {id:'dashboard',label:'Dashboard', d:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'},
  {id:'map',      label:'Live Map',  d:'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'},
  {id:'reports',  label:'Complaints',d:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'},
  {id:'analytics',label:'Analytics', d:'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'},
]

export default function AdminDashboard() {
  const { user, logout, API } = useAuth()
  const navigate = useNavigate()
  const [tab,      setTab]      = useState('dashboard')
  const [stats,    setStats]    = useState(null)
  const [reports,  setReports]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [resolving,setResolving]= useState(null)
  const [mapKey,   setMapKey]   = useState(0)

  const load = async () => {
    setLoading(true)
    try {
      const [sR,rR] = await Promise.all([axios.get(`${API}/stats`),axios.get(`${API}/reports`)])
      setStats(sR.data); setReports(rR.data)
    } catch(e){ console.error(e) } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[])

  const resolve = async (id, status='resolved') => {
    setResolving(id)
    try { await axios.put(`${API}/report/${id}/resolve`,{status}); await load(); setMapKey(k=>k+1) }
    catch{ alert('Update failed') } finally { setResolving(null) }
  }

  const barData = stats ? {
    labels: Object.keys(stats.categories),
    datasets:[{
      data: Object.values(stats.categories),
      backgroundColor: Object.keys(stats.categories).map(c=>(CAT_COLOR[c]||'#4F46E5')+'28'),
      borderColor:     Object.keys(stats.categories).map(c=> CAT_COLOR[c]||'#4F46E5'),
      borderWidth: 2.5, borderRadius: 10, borderSkipped: false,
      hoverBackgroundColor: Object.keys(stats.categories).map(c=>(CAT_COLOR[c]||'#4F46E5')+'50'),
    }]
  } : null

  const pieData = stats ? {
    labels:['Pending','In Progress','Resolved'],
    datasets:[{
      data:[stats.pending, stats.in_progress, stats.resolved],
      backgroundColor:['#FEF3C7','#EEF2FF','#DCFCE7'],
      borderColor:    ['#F59E0B','#6366F1','#22C55E'],
      borderWidth:3, hoverOffset:8,
    }]
  } : null

  return (
    <div style={{minHeight:'100vh',background:'#F0F4FF',display:'flex',flexDirection:'column'}}>

      {/* ── TOP NAV ── */}
      <nav className="top-nav sticky top-0 z-30">
        <div style={{maxWidth:1400,margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:56}}>
          <Link to="/" style={{textDecoration:'none',display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <div style={{width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#4F46E5,#2563EB)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne',fontWeight:800,fontSize:12,color:'#fff'}}>CP</div>
            <div className="hidden sm:block">
              <div style={{fontFamily:'Syne',fontWeight:800,fontSize:14,color:'#0F172A',lineHeight:1}}>CivicPulse</div>
              <div style={{fontSize:11,color:'#94A3B8',lineHeight:1,marginTop:2}}>Admin Console</div>
            </div>
          </Link>

          <div style={{display:'flex',alignItems:'center',gap:2,overflowX:'auto'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} className={`nav-tab ${tab===t.id?'active':''}`}>
                <svg style={{width:15,height:15,flexShrink:0}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={t.d}/>
                </svg>
                <span className="hidden md:inline">{t.label}</span>
                {t.id==='reports'&&reports.length>0&&<span style={{fontSize:10,padding:'1px 6px',borderRadius:100,background:'#4F46E5',color:'#fff',fontWeight:700}}>{reports.length}</span>}
              </button>
            ))}
          </div>

          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
            <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:100,background:'#DCFCE7',border:'1px solid #BBF7D0'}}>
              <div className="pulse-dot" style={{width:6,height:6,borderRadius:'50%',background:'#22C55E'}}/>
              <span style={{fontSize:11,fontWeight:700,color:'#15803D'}}>Live</span>
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
        <div style={{maxWidth:1400,margin:'0 auto'}}>

        {loading ? (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'120px 0',gap:16}}>
            <div className="spin" style={{width:40,height:40,borderRadius:'50%',border:'3px solid #C7D2FE',borderTopColor:'#4F46E5'}}/>
            <p style={{color:'#94A3B8',fontSize:14}}>Loading dashboard…</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:20}}>

          {/* ── DASHBOARD ── */}
          {tab==='dashboard'&&<>
            {/* KPI row */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16}}>
              {stats&&[
                {l:'Total Reports',v:stats.total,      c:'#4F46E5',bg:'#EEF2FF',b:'#C7D2FE',icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'},
                {l:'Pending',      v:stats.pending,    c:'#B45309',bg:'#FFFBEB',b:'#FCD34D',icon:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',sub:stats.total>0?`${Math.round(stats.pending/stats.total*100)}% of total`:null},
                {l:'Investigating',v:stats.in_progress,c:'#6D28D9',bg:'#F5F3FF',b:'#C4B5FD',icon:'M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z'},
                {l:'Resolved',     v:stats.resolved,   c:'#15803D',bg:'#F0FDF4',b:'#86EFAC',icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',sub:stats.total>0?`${Math.round(stats.resolved/stats.total*100)}% success`:null},
              ].map(s=>(
                <div key={s.l} className="stat-card" style={{borderTop:`4px solid ${s.c}`,background:s.bg,border:`1px solid ${s.b}`,borderTopColor:s.c}}>
                  <div style={{width:40,height:40,borderRadius:12,background:'rgba(255,255,255,0.7)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:16,border:`1px solid ${s.b}`}}>
                    <svg style={{width:20,height:20}} fill="none" viewBox="0 0 24 24" stroke={s.c} strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon}/>
                    </svg>
                  </div>
                  <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'2rem',color:s.c,lineHeight:1}}>{s.v}</div>
                  <div style={{fontSize:13,fontWeight:600,color:'#475569',marginTop:4}}>{s.l}</div>
                  {s.sub&&<div style={{fontSize:11,color:s.c,marginTop:6,fontWeight:600}}>{s.sub}</div>}
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:20}}>
              {barData&&(
                <div className="card" style={{padding:24}}>
                  <div style={{marginBottom:20}}>
                    <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:15,color:'#0F172A'}}>Reports by Category</h3>
                    <p style={{fontSize:12,color:'#94A3B8',marginTop:2}}>Total complaints per issue type</p>
                  </div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:12,marginBottom:16}}>
                    {Object.entries(stats.categories).map(([cat,cnt])=>(
                      <div key={cat} style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:10,height:10,borderRadius:3,background:CAT_COLOR[cat]||'#4F46E5'}}/>
                        <span style={{fontSize:12,color:'#64748B'}}>{CAT_ICON[cat]} {cat} <strong style={{color:'#0F172A'}}>({cnt})</strong></span>
                      </div>
                    ))}
                  </div>
                  <div style={{height:220}}><Bar data={barData} options={barOpts}/></div>
                </div>
              )}
              {pieData&&(
                <div className="card" style={{padding:24}}>
                  <div style={{marginBottom:20}}>
                    <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:15,color:'#0F172A'}}>Status Breakdown</h3>
                    <p style={{fontSize:12,color:'#94A3B8',marginTop:2}}>Resolution pipeline</p>
                  </div>
                  <div style={{height:220}}><Pie data={pieData} options={pieOpts}/></div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:16}}>
                    {[{l:'Pending',v:stats.pending,c:'#F59E0B'},{l:'Active',v:stats.in_progress,c:'#6366F1'},{l:'Done',v:stats.resolved,c:'#22C55E'}].map(x=>(
                      <div key={x.l} style={{textAlign:'center',padding:'10px 6px',borderRadius:10,background:'#F8FAFF'}}>
                        <div style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.3rem',color:x.c}}>{x.v}</div>
                        <div style={{fontSize:11,color:'#94A3B8'}}>{x.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Intelligence Alerts */}
            {stats?.insights?.length>0&&(
              <div className="card" style={{padding:24}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                  <div style={{width:36,height:36,borderRadius:10,background:'#EEF2FF',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <svg style={{width:18,height:18}} fill="none" viewBox="0 0 24 24" stroke="#4F46E5" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:15,color:'#0F172A'}}>Intelligence Alerts</h3>
                    <p style={{fontSize:12,color:'#94A3B8'}}>Auto-detected patterns & anomalies</p>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                  {stats.insights.map((ins,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,padding:14,borderRadius:12,background:'#F8FAFF',border:'1px solid #E0E7FF',fontSize:13,color:'#374151',lineHeight:1.55}}>
                      <div style={{width:20,height:20,borderRadius:'50%',background:'#EEF2FF',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
                        <svg style={{width:12,height:12}} fill="none" viewBox="0 0 24 24" stroke="#4F46E5" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01"/></svg>
                      </div>
                      {ins}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotspots */}
            {stats?.hotspots?.length>0&&(
              <div className="card" style={{padding:24}}>
                <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:15,color:'#0F172A',marginBottom:4}}>🔥 Incident Hotspots</h3>
                <p style={{fontSize:12,color:'#94A3B8',marginBottom:16}}>Highest complaint-density clusters</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
                  {stats.hotspots.map((h,i)=>{
                    const [c,bg,b]=i===0?['#DC2626','#FEF2F2','#FECACA']:i===1?['#D97706','#FFFBEB','#FCD34D']:['#4F46E5','#EEF2FF','#C7D2FE']
                    return (
                      <div key={i} style={{padding:16,borderRadius:14,background:bg,border:`1.5px solid ${b}`}}>
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                          <span style={{fontFamily:'Syne',fontWeight:800,fontSize:'1.3rem',color:c}}>#{i+1}</span>
                          <span style={{fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:100,background:c,color:'#fff'}}>{i===0?'CRITICAL':i===1?'HIGH':'MEDIUM'}</span>
                        </div>
                        <div style={{fontSize:11,fontFamily:'monospace',color:'#64748B',marginBottom:6}}>{h.lat.toFixed(4)}°N, {h.lng.toFixed(4)}°E</div>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <span style={{fontWeight:700,fontSize:13,color:c}}>{h.count} reports</span>
                          <span>{[...new Set(h.categories)].slice(0,3).map(cat=>CAT_ICON[cat]||'📍').join(' ')}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>}

          {/* ── MAP ── */}
          {tab==='map'&&<MapView key={mapKey} isAdmin={true} onResolve={load}/>}

          {/* ── COMPLAINTS TABLE ── */}
          {tab==='reports'&&(
            <div className="card" style={{overflow:'hidden'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 24px',borderBottom:'1px solid #E0E7FF'}}>
                <div>
                  <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:15,color:'#0F172A'}}>All Complaints</h3>
                  <p style={{fontSize:12,color:'#94A3B8',marginTop:2}}>{reports.length} total submissions</p>
                </div>
              </div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:'#F8FAFF',borderBottom:'1px solid #E0E7FF'}}>
                      {['#','Category','Description','Reporter','Location','Date','Status','Action'].map(h=>(
                        <th key={h} style={{textAlign:'left',padding:'12px 16px',fontSize:11,fontWeight:700,color:'#94A3B8',textTransform:'uppercase',letterSpacing:'.06em',whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map(r=>{
                      const st=S[r.status]||S.pending
                      return (
                        <tr key={r.id} className="table-row" style={{borderBottom:'1px solid #F0F4FF'}}>
                          <td style={{padding:'12px 16px',fontSize:12,fontFamily:'monospace',color:'#94A3B8'}}>#{r.id}</td>
                          <td style={{padding:'12px 16px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:7,whiteSpace:'nowrap'}}>
                              <span style={{fontSize:16}}>{CAT_ICON[r.category]||'📍'}</span>
                              <span style={{fontSize:13,fontWeight:700,color:'#0F172A'}}>{r.category}</span>
                            </div>
                          </td>
                          <td style={{padding:'12px 16px'}}><p style={{fontSize:13,color:'#475569',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.description}</p></td>
                          <td style={{padding:'12px 16px',fontSize:13,color:'#475569',whiteSpace:'nowrap'}}>{r.user_name}</td>
                          <td style={{padding:'12px 16px',fontSize:11,fontFamily:'monospace',color:'#94A3B8',whiteSpace:'nowrap'}}>{r.latitude?.toFixed(3)}, {r.longitude?.toFixed(3)}</td>
                          <td style={{padding:'12px 16px',fontSize:12,color:'#94A3B8',whiteSpace:'nowrap'}}>{new Date(r.timestamp).toLocaleDateString()}</td>
                          <td style={{padding:'12px 16px'}}>
                            <span className={`badge-${r.status}`}>{st.label}</span>
                          </td>
                          <td style={{padding:'12px 16px'}}>
                            {r.status!=='resolved'&&(
                              <div style={{display:'flex',gap:6}}>
                                {r.status==='pending'&&<button onClick={()=>resolve(r.id,'in_progress')} disabled={resolving===r.id} className="btn btn-sm btn-outline" style={{fontSize:11,padding:'4px 9px'}}>Activate</button>}
                                <button onClick={()=>resolve(r.id,'resolved')} disabled={resolving===r.id} className="btn btn-sm btn-success" style={{fontSize:11,padding:'4px 9px'}}>{resolving===r.id?'…':'Resolve'}</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {reports.length===0&&<div style={{textAlign:'center',padding:'48px',fontSize:14,color:'#94A3B8'}}>No complaints yet.</div>}
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab==='analytics'&&(
            <div style={{display:'flex',flexDirection:'column',gap:20}}>
              <div className="card" style={{padding:24}}>
                <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:15,color:'#0F172A',marginBottom:4}}>Category Volume</h3>
                <p style={{fontSize:12,color:'#94A3B8',marginBottom:24}}>Complaints per issue type</p>
                {stats?.recent_categories&&Object.keys(stats.recent_categories).length>0?(
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    {Object.entries(stats.recent_categories).sort((a,b)=>b[1]-a[1]).map(([cat,cnt])=>{
                      const mx=Math.max(...Object.values(stats.recent_categories))
                      const pct=mx>0?Math.round(cnt/mx*100):0
                      const col=CAT_COLOR[cat]||'#4F46E5'
                      return (
                        <div key={cat} style={{display:'flex',alignItems:'center',gap:14}}>
                          <div style={{width:120,fontSize:13,display:'flex',alignItems:'center',gap:6,color:'#475569',flexShrink:0}}>
                            <span>{CAT_ICON[cat]}</span><span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{cat}</span>
                          </div>
                          <div style={{flex:1,height:28,borderRadius:8,background:'#F0F4FF',overflow:'hidden'}}>
                            <div style={{width:`${Math.max(pct,6)}%`,height:'100%',background:col,borderRadius:8,display:'flex',alignItems:'center',paddingLeft:10,transition:'width .7s'}}>
                              <span style={{fontSize:11,fontWeight:700,color:'#fff'}}>{cnt}</span>
                            </div>
                          </div>
                          <div style={{width:32,textAlign:'right',fontSize:12,fontWeight:700,color:col,flexShrink:0}}>{pct}%</div>
                        </div>
                      )
                    })}
                  </div>
                ):<p style={{fontSize:13,color:'#94A3B8'}}>No data yet.</p>}
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                <div className="card" style={{padding:24}}>
                  <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:15,color:'#0F172A',marginBottom:4}}>AI Insights</h3>
                  <p style={{fontSize:12,color:'#94A3B8',marginBottom:16}}>Auto-detected patterns</p>
                  {stats?.insights?.length>0?(
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      {stats.insights.map((ins,i)=>(
                        <div key={i} style={{display:'flex',gap:10,padding:12,borderRadius:10,background:'#EEF2FF',fontSize:13,color:'#3730A3',lineHeight:1.55}}>
                          <span>💡</span>{ins}
                        </div>
                      ))}
                    </div>
                  ):<p style={{fontSize:13,color:'#94A3B8'}}>No insights yet.</p>}
                </div>
                <div className="card" style={{padding:24}}>
                  <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:15,color:'#0F172A',marginBottom:4}}>Resolution Metrics</h3>
                  <p style={{fontSize:12,color:'#94A3B8',marginBottom:20}}>Performance indicators</p>
                  {stats&&(
                    <div style={{display:'flex',flexDirection:'column',gap:18}}>
                      {[
                        {l:'Resolution Rate',    v:stats.total>0?Math.round(stats.resolved/stats.total*100):0,    c:'#22C55E'},
                        {l:'Pending Backlog',     v:stats.total>0?Math.round(stats.pending/stats.total*100):0,     c:'#F59E0B'},
                        {l:'Under Investigation',v:stats.total>0?Math.round(stats.in_progress/stats.total*100):0, c:'#6366F1'},
                      ].map(m=>(
                        <div key={m.l}>
                          <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:8}}>
                            <span style={{color:'#475569',fontWeight:500}}>{m.l}</span>
                            <span style={{fontFamily:'Syne',fontWeight:800,color:m.c}}>{m.v}%</span>
                          </div>
                          <div style={{height:8,borderRadius:100,background:'#F0F4FF'}}>
                            <div style={{width:`${m.v}%`,height:'100%',borderRadius:100,background:m.c,transition:'width .7s'}}/>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {pieData&&(
                <div className="card" style={{padding:24}}>
                  <h3 style={{fontFamily:'Syne',fontWeight:700,fontSize:15,color:'#0F172A',marginBottom:4}}>Full Status Distribution</h3>
                  <p style={{fontSize:12,color:'#94A3B8',marginBottom:16}}>Complete pipeline breakdown</p>
                  <div style={{height:280,display:'flex',justifyContent:'center'}}>
                    <Pie data={pieData} options={pieOpts}/>
                  </div>
                </div>
              )}
            </div>
          )}

          </div>
        )}
        </div>
      </div>
    </div>
  )
}