import axios from 'axios'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const CATS = [
  { key:'Garbage',       label:'Solid Waste',     color:'#15803D', bg:'#F0FDF4', border:'#86EFAC' },
  { key:'Pothole',       label:'Road Damage',     color:'#B45309', bg:'#FFFBEB', border:'#FCD34D' },
  { key:'Water Leakage', label:'Water Lines',     color:'#1D4ED8', bg:'#EFF6FF', border:'#93C5FD' },
  { key:'Street Light',  label:'Street Lighting', color:'#6D28D9', bg:'#F5F3FF', border:'#C4B5FD' },
  { key:'Drainage',      label:'Drainage',        color:'#0E7490', bg:'#ECFEFF', border:'#67E8F9' },
]
const CAT_ICON = { Garbage:'🗑️', Pothole:'🚧', 'Water Leakage':'💧', 'Street Light':'💡', Drainage:'🌊' }

const CITY_DATA = {
  'Hyderabad': {
    'Zone 1 – Central':    [{name:'Secunderabad',lat:17.4399,lng:78.4983},{name:'Begumpet',lat:17.4432,lng:78.4703},{name:'Marredpally',lat:17.4486,lng:78.5012},{name:'Trimulgherry',lat:17.4500,lng:78.5200}],
    'Zone 2 – North':      [{name:'Malkajgiri',lat:17.4547,lng:78.5315},{name:'Alwal',lat:17.4872,lng:78.5101},{name:'Kompally',lat:17.5301,lng:78.4856},{name:'Suraram',lat:17.5104,lng:78.4512}],
    'Zone 3 – South':      [{name:'Mehdipatnam',lat:17.3930,lng:78.4379},{name:'Attapur',lat:17.3710,lng:78.4290},{name:'Rajendranagar',lat:17.3432,lng:78.4102},{name:'Bandlaguda',lat:17.3305,lng:78.4487}],
    'Zone 4 – East':       [{name:'LB Nagar',lat:17.3462,lng:78.5517},{name:'Uppal',lat:17.4062,lng:78.5591},{name:'Nacharam',lat:17.4122,lng:78.5381},{name:'Hayathnagar',lat:17.3271,lng:78.5957}],
    'Zone 5 – West':       [{name:'Kukatpally',lat:17.4849,lng:78.4138},{name:'KPHB Colony',lat:17.4939,lng:78.3996},{name:'Miyapur',lat:17.4924,lng:78.3620},{name:'Bachupally',lat:17.5267,lng:78.3824}],
    'Zone 6 – IT Corridor':[{name:'Hitech City',lat:17.4435,lng:78.3772},{name:'Gachibowli',lat:17.4401,lng:78.3489},{name:'Madhapur',lat:17.4485,lng:78.3908},{name:'Kondapur',lat:17.4608,lng:78.3647}],
    'Zone 7 – Old City':   [{name:'Charminar',lat:17.3616,lng:78.4747},{name:'Falaknuma',lat:17.3279,lng:78.4681},{name:'Saidabad',lat:17.3378,lng:78.5127},{name:'Santoshnagar',lat:17.3487,lng:78.5071}],
    'Zone 8 – Suburbs':    [{name:'Medchal',lat:17.6286,lng:78.4876},{name:'Shamshabad',lat:17.2403,lng:78.4294},{name:'Ghatkesar',lat:17.4467,lng:78.6895},{name:'Patancheru',lat:17.5301,lng:78.2647}],
  },
  'Bengaluru': {
    'North': [{name:'Yelahanka',lat:13.1007,lng:77.5963},{name:'Hebbal',lat:13.0350,lng:77.5921},{name:'RT Nagar',lat:13.0200,lng:77.5985},{name:'Sadashivanagar',lat:13.0063,lng:77.5708}],
    'South': [{name:'Jayanagar',lat:12.9308,lng:77.5836},{name:'Banashankari',lat:12.9255,lng:77.5468},{name:'JP Nagar',lat:12.9063,lng:77.5857},{name:'BTM Layout',lat:12.9165,lng:77.6101}],
    'East':  [{name:'Indiranagar',lat:12.9784,lng:77.6408},{name:'Whitefield',lat:12.9698,lng:77.7500},{name:'Marathahalli',lat:12.9591,lng:77.6970},{name:'KR Puram',lat:13.0071,lng:77.6939}],
    'West':  [{name:'Rajajinagar',lat:12.9900,lng:77.5532},{name:'Vijayanagar',lat:12.9714,lng:77.5313},{name:'Kengeri',lat:12.9094,lng:77.4822},{name:'Malleswaram',lat:13.0032,lng:77.5685}],
  },
  'Chennai': {
    'North':   [{name:'Tondiarpet',lat:13.1183,lng:80.2941},{name:'Royapuram',lat:13.1097,lng:80.2916},{name:'Tiruvottiyur',lat:13.1613,lng:80.3079}],
    'Central': [{name:'Anna Nagar',lat:13.0850,lng:80.2101},{name:'T Nagar',lat:13.0418,lng:80.2341},{name:'Egmore',lat:13.0732,lng:80.2609},{name:'Nungambakkam',lat:13.0569,lng:80.2425}],
    'South':   [{name:'Adyar',lat:13.0012,lng:80.2565},{name:'Velachery',lat:12.9788,lng:80.2206},{name:'Guindy',lat:13.0067,lng:80.2206},{name:'Tambaram',lat:12.9229,lng:80.1275}],
  },
  'Mumbai': {
    'Western Suburbs': [{name:'Andheri',lat:19.1136,lng:72.8697},{name:'Borivali',lat:19.2307,lng:72.8567},{name:'Goregaon',lat:19.1663,lng:72.8526},{name:'Malad',lat:19.1872,lng:72.8481}],
    'Central':         [{name:'Dadar',lat:19.0176,lng:72.8429},{name:'Bandra',lat:19.0596,lng:72.8295},{name:'Kurla',lat:19.0728,lng:72.8826},{name:'Worli',lat:19.0118,lng:72.8165}],
    'South Mumbai':    [{name:'Fort',lat:18.9322,lng:72.8351},{name:'Colaba',lat:18.9067,lng:72.8147},{name:'Churchgate',lat:18.9353,lng:72.8254}],
  },
  'Delhi': {
    'North': [{name:'Rohini',lat:28.7495,lng:77.0658},{name:'Pitampura',lat:28.7014,lng:77.1314},{name:'Burari',lat:28.7574,lng:77.2021}],
    'South': [{name:'Saket',lat:28.5235,lng:77.2090},{name:'Vasant Kunj',lat:28.5201,lng:77.1545},{name:'Hauz Khas',lat:28.5494,lng:77.2001},{name:'Lajpat Nagar',lat:28.5700,lng:77.2373}],
    'East':  [{name:'Laxmi Nagar',lat:28.6298,lng:77.2769},{name:'Mayur Vihar',lat:28.6066,lng:77.2956},{name:'Preet Vihar',lat:28.6374,lng:77.2918}],
    'West':  [{name:'Janakpuri',lat:28.6219,lng:77.0822},{name:'Dwarka',lat:28.5921,lng:77.0460},{name:'Rajouri Garden',lat:28.6467,lng:77.1192}],
  },
}

export default function ComplaintForm({ onSuccess }) {
  const { API } = useAuth()
  const [cat,  setCat]  = useState('')
  const [desc, setDesc] = useState('')
  const [img,  setImg]  = useState(null)
  const [prev, setPrev] = useState(null)
  const [city, setCity] = useState('')
  const [zone, setZone] = useState('')
  const [ward, setWard] = useState('')
  const [lmrk, setLmrk] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err,  setErr]  = useState('')

  const zones   = city ? Object.keys(CITY_DATA[city]) : []
  const wards   = city && zone ? CITY_DATA[city][zone] : []
  const selWard = wards.find(w => w.name === ward)
  const canSubmit = !busy && !!cat && desc.trim().length > 0 && !!selWard

  const onCity = v => { setCity(v); setZone(''); setWard('') }
  const onZone = v => { setZone(v); setWard('') }

  const pickImg = e => {
    const f = e.target.files[0]; if (!f) return
    setImg(f); const r = new FileReader(); r.onload = () => setPrev(r.result); r.readAsDataURL(f)
  }

  const submit = async e => {
    e.preventDefault()
    if (!canSubmit) { setErr('Please fill in all required fields and select an area.'); return }
    setErr(''); setBusy(true)
    try {
      const fd = new FormData()
      fd.append('category',    cat)
      fd.append('description', lmrk.trim() ? `${desc} (near ${lmrk})` : desc)
      fd.append('latitude',    selWard.lat)
      fd.append('longitude',   selWard.lng)
      if (img) fd.append('image', img)
      await axios.post(`${API}/report`, fd, { headers:{'Content-Type':'multipart/form-data'} })
      setDone(true); setCat(''); setDesc(''); setImg(null); setPrev(null)
      setCity(''); setZone(''); setWard(''); setLmrk('')
      if (onSuccess) onSuccess()
      setTimeout(() => setDone(false), 6000)
    } catch(e) { setErr(e.response?.data?.error || 'Submission failed. Please try again.') }
    finally { setBusy(false) }
  }

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-5" style={{borderBottom:'1px solid #E8EDF5'}}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#2563EB,#0EA5E9)'}}>
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-base" style={{color:'#0F172A'}}>File a Complaint</h3>
          <p className="text-sm" style={{color:'#64748B'}}>Submit a civic issue for official review</p>
        </div>
      </div>

      {done && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-5" style={{background:'#F0FDF4',border:'1.5px solid #86EFAC'}}>
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="#15803D" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div><div className="font-semibold text-sm" style={{color:'#15803D'}}>Complaint submitted successfully!</div>
          <div className="text-xs mt-0.5" style={{color:'#16A34A'}}>You can track progress under My Reports.</div></div>
        </div>
      )}
      {err && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl mb-4 text-sm" style={{background:'#FEE2E2',border:'1px solid #FECACA',color:'#DC2626'}}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
          {err}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        {/* Step 1 — Category */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:'#2563EB'}}>1</div>
            <label className="text-sm font-semibold" style={{color:'#1E293B'}}>Issue Category <span style={{color:'#EF4444'}}>*</span></label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATS.map(c => (
              <button key={c.key} type="button" onClick={() => setCat(c.key)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
                style={cat===c.key
                  ? {background:c.bg, border:`2px solid ${c.border}`, color:c.color, fontWeight:700, transform:'scale(1.02)'}
                  : {background:'#F8FAFC', border:'1.5px solid #E2E8F0', color:'#475569'}}>
                <span className="text-lg">{CAT_ICON[c.key]}</span>
                <span className="text-xs font-semibold">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — Location */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:'#2563EB'}}>2</div>
            <label className="text-sm font-semibold" style={{color:'#1E293B'}}>Your Location <span style={{color:'#EF4444'}}>*</span></label>
          </div>

          <div className="p-4 rounded-xl mb-3" style={{background:'#F8FAFC',border:'1px solid #E2E8F0'}}>
            <p className="text-xs mb-3" style={{color:'#64748B'}}>Select your city, then narrow down to your area:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{color:'#374151'}}>📍 City</label>
                <select value={city} onChange={e=>onCity(e.target.value)} className="input">
                  <option value="">Choose city…</option>
                  {Object.keys(CITY_DATA).map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{color:'#374151'}}>🗺 Zone</label>
                <select value={zone} onChange={e=>onZone(e.target.value)} className="input" disabled={!city}>
                  <option value="">Choose zone…</option>
                  {zones.map(z=><option key={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{color:'#374151'}}>🏘 Area / Ward</label>
                <select value={ward} onChange={e=>setWard(e.target.value)} className="input" disabled={!zone}>
                  <option value="">Choose area…</option>
                  {wards.map(w=><option key={w.name}>{w.name}</option>)}
                </select>
              </div>
            </div>

            {selWard && (
              <div className="flex items-center gap-2.5 mt-3 px-3.5 py-2.5 rounded-xl" style={{background:'#F0FDF4',border:'1px solid #86EFAC'}}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="#15803D" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <div>
                  <span className="text-sm font-bold" style={{color:'#15803D'}}>{selWard.name}, {zone}, {city}</span>
                  <span className="text-xs ml-2 font-mono" style={{color:'#16A34A'}}>{selWard.lat.toFixed(4)}°N · {selWard.lng.toFixed(4)}°E</span>
                </div>
              </div>
            )}
          </div>

          <input value={lmrk} onChange={e=>setLmrk(e.target.value)} className="input"
            placeholder="📌 Nearby landmark (optional) — e.g. near HDFC Bank, opposite City Mall"/>
        </div>

        {/* Step 3 — Description */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:'#2563EB'}}>3</div>
            <label className="text-sm font-semibold" style={{color:'#1E293B'}}>Description <span style={{color:'#EF4444'}}>*</span></label>
          </div>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3} className="input resize-none"
            placeholder="Describe the issue clearly — what you see, how severe it is, how long it's been there…"/>
        </div>

        {/* Step 4 — Photo */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:'#94A3B8'}}>4</div>
            <label className="text-sm font-semibold" style={{color:'#1E293B'}}>Photo <span className="font-normal text-xs" style={{color:'#94A3B8'}}>(optional)</span></label>
          </div>
          {prev ? (
            <div className="relative rounded-xl overflow-hidden" style={{border:'1.5px solid #E2E8F0'}}>
              <img src={prev} className="w-full h-36 object-cover"/>
              <button type="button" onClick={()=>{setImg(null);setPrev(null)}}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                style={{background:'white',border:'1px solid #E2E8F0',color:'#64748B',boxShadow:'0 2px 6px rgba(0,0,0,.08)'}}>✕</button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-20 rounded-xl cursor-pointer transition-colors"
              style={{border:'2px dashed #CBD5E1',background:'#F8FAFC'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#93C5FD';e.currentTarget.style.background='#EFF6FF'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#CBD5E1';e.currentTarget.style.background='#F8FAFC'}}>
              <svg className="w-5 h-5 mb-1.5" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span className="text-xs" style={{color:'#94A3B8'}}>Click to attach a photo</span>
              <input type="file" accept="image/*" onChange={pickImg} className="hidden"/>
            </label>
          )}
        </div>

        {/* Submit */}
        <div className="pt-1">
          <button type="submit" disabled={!canSubmit}
            className="btn btn-primary w-full justify-center"
            style={{padding:'13px 20px',fontSize:'15px',borderRadius:'12px'}}>
            {busy
              ? <><div className="spin w-4 h-4 rounded-full" style={{border:'2px solid rgba(255,255,255,.3)',borderTopColor:'white'}}/>Submitting…</>
              : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>Submit Complaint</>}
          </button>
          {!selWard && <p className="text-center text-xs mt-2" style={{color:'#94A3B8'}}>Select a city, zone and area above to enable submit</p>}
        </div>
      </form>
    </div>
  )
}