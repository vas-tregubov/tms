import { baseApi } from '@/shared/api'

export type LoginCredentials = {
  fullName: string
  password: string
}

export type AuthenticatedUser = {
  fullName: string
}

// Temporary MVP mock: replace queryFn with a backend request when authentication exists.
const MOCK_DISPATCHER = { fullName: 'Алексей Петров', password: 'password' }

const normalizeName = (value: string) =>
  value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('ru')

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthenticatedUser, LoginCredentials>({
      queryFn: async ({ fullName, password }) => {
        await new Promise<void>((resolve) => setTimeout(resolve, 150))
        const isValid =
          normalizeName(fullName) === normalizeName(MOCK_DISPATCHER.fullName) &&
          password === MOCK_DISPATCHER.password
        return isValid
          ? { data: { fullName: MOCK_DISPATCHER.fullName } }
          : { error: { status: 401, message: 'Неверный пароль' } }
      },
    }),
  }),
})

export const { useLoginMutation } = authApi
