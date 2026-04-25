'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  type: 'login' | 'register'
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only Gmail addresses are allowed')
      setLoading(false)
      return
    }

    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = type === 'login' 
        ? { email, password }
        : { email, password, name }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('userName', data.name || name)
      
      setTimeout(() => {
        router.push('/chat')
      }, 100)
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      {type === 'register' && (
        <div>
          <label className="block text-sm font-medium text-olive-gray mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
            placeholder="Your name"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-olive-gray mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
          placeholder="you@gmail.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-olive-gray mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-error-crimson/10 text-error-crimson text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? 'Loading...' : type === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  )
}
