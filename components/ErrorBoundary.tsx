
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
    console.error("Uncaught error:", error, errorInfo);
    // In a production app, we would log this to Sentry here
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark p-8 text-center">
          <span className="material-symbols-outlined text-damage-red text-6xl mb-6">error</span>
          <h1 className="text-3xl font-black text-white italic uppercase mb-2">Resonance Shattered</h1>
          <p className="text-white/60 text-sm italic mb-8 max-w-xs">
            The Kingdom's voice has encountered a critical dissonance. Our scribes have been notified.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-primary text-background-dark rounded-xl font-black uppercase tracking-widest text-sm shadow-[0_0_30px_#0ddff2]"
          >
            Re-weave Reality
          </button>
          {this.state.error && (
            <pre className="mt-8 p-4 bg-black/40 rounded-lg text-[10px] text-damage-red/60 text-left overflow-auto max-w-full">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    // Fix: access children via this.props.children instead of this.children
    return this.props.children;
  }
}

export default ErrorBoundary;
