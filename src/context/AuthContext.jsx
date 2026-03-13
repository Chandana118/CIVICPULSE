import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const Ctx = createContext(null)
export const API = 'http://127.0.0.1:5000'

axios.defaults.timeout = 10000
axios.defaults.headers.common['Content-Type'] = 'application/json'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('cp_token')
    const u = localStorage.getItem('cp_user')
    if (t && u) {
      try {
        setUser(JSON.parse(u))
        axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
      } catch {
        localStorage.removeItem('cp_token')
        localStorage.removeItem('cp_user')
      }
    }
    setLoading(false)
  }, [])

  const _save = (token, user) => {
    localStorage.setItem('cp_token', token)
    localStorage.setItem('cp_user', JSON.stringify(user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
  }

  const login = async (email, password) => {
    const { data } = await axios.post('http://127.0.0.1:5000/login', { email, password })
    _save(data.token, data.user)
    return data.user
  }

  const register = async (name, email, password) => {
    const { data } = await axios.post('http://127.0.0.1:5000/register', { name, email, password })
    _save(data.token, data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('cp_token')
    localStorage.removeItem('cp_user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, API }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
