'use client'

import React, { useState } from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  componentName: string
  onRetry?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ContentErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const logMessage = `[ERROR] [${this.props.componentName}] - ${error.message}`
    console.error(logMessage, { error, errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
    this.props.onRetry?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="py-16 sm:py-24 bg-parish-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center">
              <p className="text-senior-lg text-parish-navy font-bold mb-2">
                ⚠️ {this.props.componentName}: Contenido no disponible
              </p>
              <p className="text-senior-sm text-parish-muted mb-6">
                Hubo un problema al cargar este contenido. Por favor, intenta de nuevo o contacta la oficina parroquial.
              </p>

              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 bg-parish-gold text-parish-navy
                           font-bold text-senior-base rounded-lg
                           hover:bg-parish-gold/90 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-parish-gold focus:ring-offset-2
                           min-h-[56px] min-w-[120px]"
              >
                🔄 Reintentar
              </button>
            </div>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
