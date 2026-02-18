import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to error tracking service (e.g., Sentry) in production
    if (import.meta.env.MODE === 'production') {
      console.error('Error logged:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="error-boundary-container"
          role="alert"
          aria-live="assertive"
        >
          <div className="error-boundary-content">
            <div className="error-icon">⚠️</div>
            <h1>Oops! Something went wrong</h1>
            <p>We apologize for the inconvenience. The app encountered an unexpected error.</p>

            {import.meta.env.MODE === 'development' && (
              <details className="error-details" style={{ whiteSpace: 'pre-wrap' }}>
                <summary>Error details (Development only)</summary>
                <div className="error-stack">
                  <strong>Error:</strong>
                  <p>{this.state.error?.toString()}</p>
                  <strong>Stack:</strong>
                  <p>{this.state.errorInfo?.componentStack}</p>
                </div>
              </details>
            )}

            <div className="error-actions">
              <button
                onClick={this.resetError}
                className="error-button error-button-primary"
                aria-label="Retry and continue using the app"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="error-button error-button-secondary"
                aria-label="Go back to home page"
              >
                Go to Home
              </button>
            </div>

            {this.state.errorCount > 3 && (
              <p className="error-warning">
                Multiple errors detected. Please refresh the page or clear your browser cache.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
