import Button from '@/shared/ui/button'
import ResultIndicator from '@/shared/ui/result-indicator'

type ErrorFallbackProps = {
  onGoHome?: () => void
  onReload?: () => void
}

const ErrorFallback = ({
  onGoHome,
  onReload = () => window.location.reload(),
}: ErrorFallbackProps) => {
  const content = (
    <section
      role="alert"
      className="flex flex-col items-center gap-5 text-center"
    >
      <ResultIndicator variant="error" />
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl leading-8 font-semibold">
          {onGoHome
            ? 'Не удалось отобразить страницу'
            : 'Произошла непредвиденная ошибка'}
        </h1>
        <p className="text-sm leading-5 text-muted">
          {onGoHome
            ? 'Произошла непредвиденная ошибка. Попробуйте обновить страницу или вернуться на главную.'
            : 'Не удалось отобразить приложение. Попробуйте обновить страницу.'}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={onReload}>Обновить страницу</Button>
        {onGoHome && (
          <Button variant="secondary" onClick={onGoHome}>
            На главную
          </Button>
        )}
      </div>
    </section>
  )

  return onGoHome ? (
    <div className="flex min-h-full items-center justify-center">{content}</div>
  ) : (
    <main className="flex min-h-dvh items-center justify-center bg-background p-5 text-foreground">
      {content}
    </main>
  )
}

export default ErrorFallback
