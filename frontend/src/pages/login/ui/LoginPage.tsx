import { useNavigate } from 'react-router'

import LoginForm from '@/features/authenticate-user'
import TextLink from '@/shared/ui/text-link'

// MVP: the Routes list is the temporary start screen after login.
const AFTER_LOGIN_PATH = '/routes'
// MVP: password recovery is not implemented; the link leads to Registration.
const FORGOT_PASSWORD_PATH = '/register'

const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-4 sm:p-10">
      <section
        aria-labelledby="login-title"
        className="flex w-full max-w-[480px] flex-col items-center gap-6 rounded-card border border-border bg-surface p-6 shadow-card sm:p-8"
      >
        <p className="text-2xl leading-8 font-semibold text-foreground">TMS</p>
        <div className="flex w-full flex-col gap-1 text-center">
          <h1
            id="login-title"
            className="text-xl leading-7 font-semibold text-foreground"
          >
            Вход в систему
          </h1>
          <p className="text-sm leading-5 text-muted">
            Войдите в аккаунт диспетчера
          </p>
        </div>
        <LoginForm
          onSuccess={() => navigate(AFTER_LOGIN_PATH, { replace: true })}
          forgotPasswordLink={
            <TextLink
              href={FORGOT_PASSWORD_PATH}
              onClick={(event) => {
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return
                event.preventDefault()
                navigate(FORGOT_PASSWORD_PATH)
              }}
            >
              Забыли пароль?
            </TextLink>
          }
        />
      </section>
    </main>
  )
}

export default LoginPage
