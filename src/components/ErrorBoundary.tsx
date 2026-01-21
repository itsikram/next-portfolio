import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#1e293b',
          color: '#e2e8f0',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#cbd5e1', marginBottom: '2rem' }}>
            An error occurred while loading this page.
          </p>
          <details style={{ 
            backgroundColor: '#0f172a', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'left',
            maxWidth: '600px'
          }}>
            <summary style={{ cursor: 'pointer', color: '#3b82f6' }}>
              Error details
            </summary>
            <pre style={{ 
              color: '#fca5a5', 
              fontSize: '0.9rem',
              overflow: 'auto',
              marginTop: '1rem'
            }}>
              {this.state.error?.stack}
            </pre>
          </details>
          <button
            onClick={() => window.location.href = '/admin/services'}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Go back to Services
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
