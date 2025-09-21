import React, { useCallback, useEffect, useState } from 'react'
import api, { setAccessToken, getAccessToken } from '../api/axios'
import { AuthContext, type AuthContextValue, type User } from '../hooks/useAuth'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/api/auth/me')
      setUser(res.data ?? null)
    } catch (err) {
      console.error(err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const r = await api.post(
          '/api/auth/refresh',
          {},
          { withCredentials: true }
        )
        const token = r.data?.accessToken as string | undefined
        if (token) {
          setAccessToken(token)
        }
      } catch (err) {
        console.error(err)
        setAccessToken(null)
      }
      await fetchMe()
    })()
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post(
        '/api/auth/login',
        { email, password },
        { withCredentials: true }
      )
      const token = res.data?.accessToken as string | undefined
      if (token) setAccessToken(token)
      await fetchMe()
    },
    [fetchMe]
  )

  const register = useCallback(
    async (email: string, password: string) => {
      await api.post('/api/auth/register', { email, password })
      // optionally auto-login after register:
      await login(email, password)
    },
    [login]
  )

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout', {}, { withCredentials: true })
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }, [])

  const refresh = useCallback(async () => {
    const r = await api.post('/api/auth/refresh', {}, { withCredentials: true })
    const token = r.data?.accessToken as string | undefined
    if (token) setAccessToken(token)
  }, [])

  const ctx: AuthContextValue = {
    user,
    loading,
    login,
    register,
    logout,
    getAccessToken,
    refresh,
  }

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>
}
