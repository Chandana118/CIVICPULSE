import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [em,setEm]=useState(''); const [pw,setPw]=useState('')
  const [err,setErr]=useState(''); const [busy,setBusy]=useState(false)
  const { login } = useAuth(); const nav = useNavigate()

  const submit = async e => {
    e.preventDefault(); setErr(''); setBusy(true)
    try { const u = await login(em,pw); nav(u.role==='admin'?'/admin':'/citizen') }
    catch(e){ setErr(e.response?.data?.error||'Invalid credentials.') } finally { setBusy(false) }
  }

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#EEF2FF 0%,#F0F4FF 50%,#E8F0FF 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{position:'fixed',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#4F46E5,#2563EB,#06B6D4)'}}/>
      <div className="fade-up" style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:44,height:44,borderRadius:13,background:'linear-gradient(135deg,#4F46E5,#2563EB)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Syne',fontWeight:800,fontSize:15,color:'#fff',margin:'0 auto 16px',boxShadow:'0 6px 20px rgba(79,70,229,0.35)'}}>CP</div>
          <div style={{fontFamily:'Syne',fontWeight:800,fontSize:22,color:'#0F172A'}}>CivicPulse</div>
          <div style={{fontSize:13,color:'#94A3B8',marginTop:4}}>Ground Reality Intelligence</div>
        </div>

        <div className="card" style={{padding:32}}>
          <h2 style={{fontFamily:'Syne',fontWeight:700,fontSize:20,color:'#0F172A',marginBottom:6}}>Welcome back</h2>
          <p style={{fontSize:13,color:'#64748B',marginBottom:24}}>Sign in to your account</p>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:24}}>
            {[
              {label:'Admin',   email:'admin@civicpulse.gov',   pw:'admin123',   c:'#4F46E5',bg:'#EEF2FF',b:'#C7D2FE'},
              {label:'Citizen', email:'citizen@civicpulse.gov', pw:'citizen123', c:'#15803D',bg:'#F0FDF4',b:'#86EFAC'},
            ].map(x=>(
              <button key={x.label} type="button" onClick={()=>{setEm(x.email);setPw(x.pw);setErr('')}}
                style={{padding:12,borderRadius:12,background:x.bg,border:`1.5px solid ${x.b}`,cursor:'pointer',textAlign:'left',transition:'transform .15s'}}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
                onMouseLeave={e=>e.currentTarget.style.transform=''}>
                <div style={{fontWeight:700,fontSize:13,color:x.c}}>Demo: {x.label}</div>
                <div style={{fontSize:11,color:'#94A3B8',marginTop:2}}>Click to auto-fill</div>
              </button>
            ))}
          </div>

          {err&&<div style={{padding:'10px 14px',borderRadius:10,background:'#FEE2E2',border:'1px solid #FECACA',color:'#DC2626',fontSize:13,marginBottom:16}}>⚠ {err}</div>}

          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:16}}>
            {[{l:'Email',t:'email',v:em,s:setEm,p:'you@municipality.gov'},{l:'Password',t:'password',v:pw,s:setPw,p:'••••••••'}].map(({l,t,v,s,p})=>(
              <div key={l}>
                <label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6}}>{l}</label>
                <input type={t} value={v} onChange={e=>s(e.target.value)} className="input" placeholder={p} required/>
              </div>
            ))}
            <button type="submit" disabled={busy} className="btn btn-primary" style={{padding:13,justifyContent:'center',marginTop:4}}>
              {busy?<><div className="spin" style={{width:16,height:16,borderRadius:'50%',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff'}}/>Signing in…</>:'Sign In →'}
            </button>
          </form>

          <p style={{textAlign:'center',fontSize:13,marginTop:20,paddingTop:20,borderTop:'1px solid #E0E7FF',color:'#94A3B8'}}>
            New user? <Link to="/register" style={{color:'#4F46E5',fontWeight:700,textDecoration:'none'}}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}