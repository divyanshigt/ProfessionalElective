import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await login(form)
      nav('/')
    } catch (e) {
      // For demo — bypass auth
      nav('/')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sp-bg flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-sp-accent/5 blur-3xl" />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-sp-teal/5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sp-accent to-sp-teal flex items-center justify-center text-xl mx-auto mb-3">
            ✦
          </div>
          <h1 className="text-xl font-semibold">StudentPlus AI</h1>
          <p className="text-[12px] text-sp-muted mt-1">Intelligent Academic Ecosystem</p>
        </div>

        {/* Card */}
        <div className="card space-y-4">
          <div>
            <p className="text-[11px] text-sp-muted mb-1.5">College Email</p>
            <input
              className="input-field"
              type="email"
              placeholder="roll@college.edu"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div>
            <p className="text-[11px] text-sp-muted mb-1.5">Password</p>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {error && <p className="text-[11px] text-sp-red">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <div className="text-center text-[11px] text-sp-muted">
            Demo mode: click Sign In to continue
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-sp-muted mt-6">
          Built with FastAPI + MySQL + React · ML-powered
        </p>
      </div>
    </div>
  )
}
