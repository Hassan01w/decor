import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in The Decor Diary app:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      // ignore
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F4EE] text-[#242522] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5DED2] shadow-xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 mx-auto flex items-center justify-center border border-amber-200 shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-serif text-2xl font-bold text-[#242522]">
                Something went wrong
              </h1>
              <p className="text-xs sm:text-sm text-[#7A7369] leading-relaxed">
                An unexpected display error occurred. You can safely reload the journal or restore default data.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-[#2F3A32] hover:bg-[#202722] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-[#F7F4EE] hover:bg-[#EFEAE1] text-[#7A7369] hover:text-[#242522] border border-[#E5DED2] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset & Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
