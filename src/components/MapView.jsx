import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const API = 'http://127.0.0.1:5000'

const CATS = {
  'Garbage':       { color: '#16A34A', label: 'Solid Waste',     icon: '🗑️' },
  'Pothole':       { color: '#D97706', label: 'Road Damage',     icon: '🚧' },
  'Water Leakage': { color: '#2563EB', label: 'Water Lines',     icon: '💧' },
  'Street Light':  { color: '#7C3AED', label: 'Street Lighting', icon: '💡' },
  'Drainage':      { color: '#0891B2', label: 'Drainage',        icon: '🌊' },
}

const STATUS = {
  pending:     { label: 'Pending',     bg: '#FEF3C7', color: '#D97706' },
  in_progress: { label: 'In Progress', bg: '#DBEAFE', color: '#2563EB' },
  resolved:    { label: 'Resolved',    bg: '#DCFCE7', color: '#16A34A' },
}

// Green → Orange → Red based on local cluster density
function pinColor(localCount) {
  if (localCount <= 2) return '#16A34A'
  if (localCount <= 5) return '#EA580C'
  return '#DC2626'
}

export default function MapView({ isAdmin = false, onResolve }) {
  const mapRef  = useRef(null)
  const mapInst = useRef(null)
  const markers = useRef([])
  const heatRef = useRef(null)

  const [reports, setReports] = useState([])
  const [filter,  setFilter]  = useState('All')
  const [heat,    setHeat]    = useState(false)
  const [loading, setLoading] = useState(true)
  const [counts,  setCounts]  = useState({})

  const load = async () => {
    try {
      const r = await axios.get(`${API}/reports`)
      setReports(r.data)
      const c = {}
      r.data.forEach(rep => { c[rep.category] = (c[rep.category] || 0) + 1 })
      setCounts(c)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInst.current) return
    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      const map = L.map(mapRef.current, { center: [17.385, 78.4867], zoom: 13 })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19
      }).addTo(map)
      mapInst.current = map
    })
    return () => { if (mapInst.current) { mapInst.current.remove(); mapInst.current = null } }
  }, [])

  // Markers — re-render when reports or filter change
  useEffect(() => {
    if (!mapInst.current || !reports.length) return
    import('leaflet').then(L => {
      markers.current.forEach(m => m.remove())
      markers.current = []

      const list = filter === 'All' ? reports : reports.filter(r => r.category === filter)

      // Compute local density: round coords to ~1km grid cells
      const cellCount = {}
      list.forEach(r => {
        const k = `${Math.round(r.latitude * 40)},${Math.round(r.longitude * 40)}`
        cellCount[k] = (cellCount[k] || 0) + 1
      })

      list.forEach(rep => {
        const cfg       = CATS[rep.category] || { color:'#64748B', label:rep.category, icon:'📍' }
        const st        = STATUS[rep.status] || STATUS.pending
        const cellKey   = `${Math.round(rep.latitude * 40)},${Math.round(rep.longitude * 40)}`
        const localCnt  = cellCount[cellKey] || 1
        const pc        = pinColor(localCnt)

        const icon = L.divIcon({
          html: `<div style="
            width:38px;height:38px;
            background:${pc};
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:3px solid white;
            box-shadow:0 3px 10px ${pc}55,0 1px 4px rgba(0,0,0,0.15);
            display:flex;align-items:center;justify-content:center;
          "><span style="transform:rotate(45deg);font-size:15px;line-height:32px;display:block;text-align:center">${cfg.icon}</span></div>`,
          className: '',
          iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -42],
        })

        const imgHtml = rep.image_path
          ? `<img src="${API}/uploads/${rep.image_path}" style="width:100%;height:110px;object-fit:cover;border-radius:8px 8px 0 0;" onerror="this.style.display='none'"/>`
          : ''

        const resolveHtml = isAdmin && rep.status !== 'resolved'
          ? `<button onclick="window._cpResolve(${rep.id})" style="width:100%;padding:9px 0;margin-top:10px;background:#2563EB;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:12px;font-family:Inter,sans-serif;letter-spacing:.01em;">✓ Mark Resolved</button>`
          : ''

        const densityBadge = localCnt > 1
          ? `<div style="margin-top:7px;padding:4px 8px;background:${pc}15;border-radius:6px;font-size:10.5px;font-weight:700;color:${pc};border:1px solid ${pc}30;">⚠ ${localCnt} nearby reports · ${localCnt > 5 ? 'HIGH' : localCnt > 2 ? 'MEDIUM' : 'LOW'} density</div>`
          : ''

        const popup = L.popup({ maxWidth: 260, minWidth: 230 }).setContent(`
          <div style="font-family:Inter,sans-serif;overflow:hidden;border-radius:12px;">
            ${imgHtml}
            <div style="padding:14px 14px 10px;">
              <div style="display:flex;align-items:center;gap:7px;margin-bottom:6px;">
                <span style="font-size:17px;">${cfg.icon}</span>
                <span style="font-weight:700;font-size:14px;color:#0F172A;font-family:Poppins,sans-serif;">${rep.category}</span>
              </div>
              <p style="color:#475569;font-size:12.5px;line-height:1.6;margin-bottom:9px;">${rep.description}</p>
              <span style="background:${st.bg};color:${st.color};padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;">${st.label}</span>
              <div style="color:#94A3B8;font-size:11px;margin-top:8px;">${rep.user_name} · ${new Date(rep.timestamp).toLocaleDateString()}</div>
              ${densityBadge}
              ${resolveHtml}
            </div>
          </div>
        `)

        const m = L.marker([rep.latitude, rep.longitude], { icon }).bindPopup(popup).addTo(mapInst.current)
        markers.current.push(m)
      })

      window._cpResolve = async (id) => {
        try {
          await axios.put(`${API}/report/${id}/resolve`, { status: 'resolved' })
          await load()
          mapInst.current.closePopup()
          if (onResolve) onResolve()
        } catch { alert('Failed — ensure you are logged in as an administrator.') }
      }
    })
  }, [reports, filter, isAdmin])

  // Heatmap with alarming red gradient
  useEffect(() => {
    if (!mapInst.current) return
    const run = async () => {
      if (heat && reports.length) {
        try {
          await import('leaflet.heat')
          const L = await import('leaflet')
          if (heatRef.current) heatRef.current.remove()
          heatRef.current = L.heatLayer(
            reports.map(r => [r.latitude, r.longitude, 0.8]),
            { radius: 42, blur: 30, gradient: { 0.2: '#22C55E', 0.5: '#F97316', 0.75: '#EF4444', 1: '#991B1B' } }
          ).addTo(mapInst.current)
        } catch (e) { console.warn(e) }
      } else {
        if (heatRef.current) { heatRef.current.remove(); heatRef.current = null }
      }
    }
    run()
  }, [heat, reports])

  const cats = ['All', ...Object.keys(CATS)]

  return (
    <div className="card overflow-hidden">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        style={{borderBottom:'1px solid #E2E8F0'}}>
        <div className="flex items-center gap-2 flex-wrap">
          {cats.map(c => {
            const cnt = c === 'All' ? reports.length : (counts[c] || 0)
            const dc  = c !== 'All' ? pinColor(cnt) : '#2563EB'
            return (
              <button key={c} onClick={() => setFilter(c)}
                className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all flex items-center gap-1.5"
                style={filter === c
                  ? { background: dc, color: 'white', boxShadow: `0 2px 8px ${dc}40` }
                  : { background: '#F1F5F9', color: '#64748B', border: '1.5px solid #E2E8F0' }}>
                {c !== 'All' && <span>{CATS[c]?.icon}</span>}
                {c}
                {cnt > 0 && <span style={{opacity:.75}}>({cnt})</span>}
              </button>
            )
          })}
        </div>
        <button onClick={() => setHeat(!heat)}
          className="btn btn-sm font-semibold"
          style={heat
            ? { background:'#FEF3C7', color:'#D97706', border:'1.5px solid #FDE68A' }
            : { background:'#F1F5F9', color:'#64748B', border:'1.5px solid #E2E8F0' }}>
          🌡️ Density Map
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-5 gap-2 text-sm" style={{color:'#94A3B8'}}>
          <div className="spin w-4 h-4 rounded-full" style={{border:'2.5px solid #BFDBFE',borderTopColor:'#2563EB'}}/>
          Loading incidents…
        </div>
      )}

      <div ref={mapRef} style={{ height:'480px', width:'100%' }}/>

      {/* Legend */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3"
        style={{borderTop:'1px solid #E2E8F0'}}>
        <div className="flex flex-wrap gap-3">
          {Object.entries(CATS).map(([name, { color, icon }]) => (
            <div key={name} className="flex items-center gap-1.5 text-xs" style={{color:'#64748B'}}>
              <div className="w-2.5 h-2.5 rounded-full" style={{background:color}}/>
              {icon} {name}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs" style={{color:'#94A3B8'}}>
          <span className="font-medium" style={{color:'#64748B'}}>Pin density:</span>
          {[['Low','#16A34A'],['Medium','#EA580C'],['High','#DC2626']].map(([l,c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{background:c}}/>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}