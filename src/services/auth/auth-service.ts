import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { handleServiceError } from '@/lib/service-error'

export class AuthService {
  async loginWithEmail(email: string, password: string) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured. Use demo mode or set environment variables.')
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    } catch (error) {
      handleServiceError(error, 'authService.loginWithEmail')
    }
  }

  async loginWithGoogle() {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.')
    }
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback` },
      })
      if (error) throw error
      return data
    } catch (error) {
      handleServiceError(error, 'authService.loginWithGoogle')
    }
  }

  async loginWithGithub() {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.')
    }
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback` },
      })
      if (error) throw error
      return data
    } catch (error) {
      handleServiceError(error, 'authService.loginWithGithub')
    }
  }

  async sendMagicLink(email: string) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.')
    }
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
      })
      if (error) throw error
      return data
    } catch (error) {
      handleServiceError(error, 'authService.sendMagicLink')
    }
  }

  async register(email: string, password: string, displayName?: string) {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase not configured.')
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      })
      if (error) throw error
      return data
    } catch (error) {
      handleServiceError(error, 'authService.register')
    }
  }

  async logout() {
    if (!isSupabaseConfigured || !supabase) {
      return
    }
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      handleServiceError(error, 'authService.logout')
    }
  }

  async getSession() {
    if (!isSupabaseConfigured || !supabase) {
      return null
    }
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    } catch (error) {
      handleServiceError(error, 'authService.getSession')
    }
  }

  async getUser() {
    if (!isSupabaseConfigured || !supabase) {
      return null
    }
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    } catch (error) {
      handleServiceError(error, 'authService.getUser')
    }
  }
}

export const authService = new AuthService()
