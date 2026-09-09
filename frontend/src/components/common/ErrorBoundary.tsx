import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AGRINEXT Global Error Boundary caught an exception:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '36px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <AlertTriangle size={32} />
            </div>
            
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
              Something went wrong
            </h2>
            
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
              AGRINEXT could not load this section properly. Don't worry, your farm data is safe.
            </p>

            <button
              onClick={this.handleReload}
              className="btn btn-primary"
              style={{ padding: '12px 24px', borderRadius: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <RefreshCw size={18} />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
