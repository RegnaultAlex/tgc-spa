import { defineStore } from 'pinia'

import { useApi } from '@/composables/useApi'
import { useStorage } from '@/composables/useStorage'
import type { User } from '@/types'
import type { SignInPayload, SignUpPayload } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
}

interface AuthError {
  error: string | null
  message: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const storage = useStorage()

    return {
      token: storage.get<string>('token') ?? null,
      user: storage.get<User>('user') ?? null,
      loading: false,
      error: null,
    }
  },

  getters: {
    isAuthenticated: (state: AuthState) => !!state.token,

    username: (state: AuthState) => state.user?.username ?? '',
  },

  actions: {
    async SignIn(payload: SignInPayload) {
      const api = useApi()
      const storage = useStorage()

      this.loading = true
      this.error = null

      try {
        const { token, user } = await api.signIn(payload)

        this.token = token
        this.user = user
        storage.set('token', token)
        storage.set('user', user)
      } catch (e: unknown) {
        const authError = e as AuthError
        this.error = authError.message
        throw e
      } finally {
        this.loading = false
      }
    },

    async SignUp(payload: SignUpPayload) {
      const api = useApi()
      const storage = useStorage()

      this.loading = true
      this.error = null

      try {
        const { token, user } = await api.signUp(payload)

        this.token = token
        this.user = user
        storage.set('token', token)
        storage.set('user', user)
      } catch (e: unknown) {
        const authError = e as AuthError
        this.error = authError.message
        throw e
      } finally {
        this.loading = false
      }
    },
    Logout() {
      const storage = useStorage()

      this.token = null
      this.user = null
      storage.remove('token')
      storage.remove('user')
    },
  },
})
