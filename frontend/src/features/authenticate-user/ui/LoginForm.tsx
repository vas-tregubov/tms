import { useState, type FormEvent, type ReactNode } from 'react'

import type { ApiError } from '@/shared/api'
import Button from '@/shared/ui/button'
import Input from '@/shared/ui/input'
import Loader from '@/shared/ui/loader'

import { useLoginMutation } from '../api/authApi'

type LoginFormProps = {
  onSuccess: () => void
  forgotPasswordLink?: ReactNode
}

type LoginErrors = {
  fullName?: string
  password?: string
}

const FULL_NAME_HELPER = 'Как при регистрации'

const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' &&
  error !== null &&
  'status' in error &&
  'message' in error

const LoginForm = ({ onSuccess, forgotPasswordLink }: LoginFormProps) => {
  const [login, { isLoading }] = useLoginMutation()
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [authError, setAuthError] = useState<string>()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return
    const nextErrors: LoginErrors = {
      fullName: fullName.trim() ? undefined : 'Введите имя и фамилию',
      password: password ? undefined : 'Введите пароль',
    }
    setErrors(nextErrors)
    setAuthError(undefined)
    if (nextErrors.fullName || nextErrors.password) return
    try {
      await login({ fullName: fullName.trim(), password }).unwrap()
      onSuccess()
    } catch (error) {
      setAuthError(
        isApiError(error) && error.status === 401
          ? error.message
          : 'Не удалось выполнить вход. Попробуйте ещё раз.',
      )
    }
  }

  return (
    <form
      noValidate
      aria-label="Вход в систему"
      className="flex w-full flex-col gap-6"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-3">
        <Input
          label="Имя и фамилия"
          name="fullName"
          autoComplete="username"
          placeholder="Введите имя и фамилию"
          value={fullName}
          readOnly={isLoading}
          helper={FULL_NAME_HELPER}
          error={errors.fullName ?? (authError ? FULL_NAME_HELPER : undefined)}
          onChange={(event) => {
            setFullName(event.target.value)
            setErrors((previous) => ({ ...previous, fullName: undefined }))
            setAuthError(undefined)
          }}
        />
        <Input
          label="Пароль"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Введите пароль"
          value={password}
          readOnly={isLoading}
          error={errors.password ?? authError}
          onChange={(event) => {
            setPassword(event.target.value)
            setErrors((previous) => ({ ...previous, password: undefined }))
            setAuthError(undefined)
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader size="sm" label="Выполняется вход" />
              Вход…
            </>
          ) : (
            'Войти'
          )}
        </Button>
        {forgotPasswordLink}
      </div>
    </form>
  )
}

export default LoginForm
