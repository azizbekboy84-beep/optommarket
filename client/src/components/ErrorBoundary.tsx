import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, you would send this to an error tracking service
    // e.g., Sentry, LogRocket, etc.
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Error icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
                </div>
                <div className="absolute inset-0 w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full animate-ping opacity-20" />
              </div>
            </div>

            {/* Error message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Xatolik yuz berdi
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Kechirasiz, nimadir noto'g'ri ketdi. Iltimos, qayta urinib ko'ring.
              </p>
            </div>

            {/* Error details (dev only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-left">
                <p className="text-sm font-mono text-red-600 dark:text-red-400 break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600"
              >
                <RefreshCcw className="w-4 h-4" />
                Qayta urinish
              </Button>
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Bosh sahifaga
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
