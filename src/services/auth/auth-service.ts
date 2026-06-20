import { supabase } from '@/lib/supabase'
import { handleServiceError } from '@/lib/service-error'

export class AuthService {
  async loginWithEmail(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    } catch (error) {
      handleServiceError(error, 'authService.loginWithEmail')
    }
  }

  async loginWithGoogle() {
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
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      handleServiceError(error, 'authService.logout')
    }
  }

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    } catch (error) {
      handleServiceError(error, 'authService.getSession')
    }
  }

  async getUser() {
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
