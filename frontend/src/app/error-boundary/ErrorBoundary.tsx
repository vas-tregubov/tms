import { Component, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback: ReactNode
  resetKey?: string
}

type ErrorBoundaryState = {
  hasError: boolean
  resetKey?: string
}

// React's native error boundary API requires a class component.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    resetKey: this.props.resetKey,
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): Partial<ErrorBoundaryState> | null {
    if (props.resetKey !== state.resetKey) {
      return { hasError: false, resetKey: props.resetKey }
    }
    return null
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

export default ErrorBoundary
