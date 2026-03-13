import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AdminDashboard from './pages/AdminDashboard'
import CitizenDashboard from './pages/CitizenDashboard'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

function Guard({ children, admin = false }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#F1F5F9'}}>
      <div className="flex flex-col items-center gap-3">
        <div className="spin w-9 h-9 rounded-full" style={{border:'3px solid #BFDBFE',borderTopColor:'#2563EB'}}/>
        <p style={{color:'#94A3B8',fontSize:'14px',fontFamily:'Inter'}}>Loading…</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace/>
  if (admin && user.role !== 'admin') return <Navigate to="/citizen" replace/>
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Landing/>}/>
          <Route path="/login"    element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/citizen"  element={<Guard><CitizenDashboard/></Guard>}/>
          <Route path="/admin"    element={<Guard admin><AdminDashboard/></Guard>}/>
          <Route path="*"         element={<Navigate to="/" replace/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}