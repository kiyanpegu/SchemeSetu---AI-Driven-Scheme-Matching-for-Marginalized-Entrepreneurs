import React from "react";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "SchemeSetu ErrorBoundary caught an error:",
      error,
      errorInfo,
    );
  }

  handleReset = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem("schemeSetuLang");
    } catch (e) {
      console.warn("Storage clear error:", e);
    }
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={36} />
            </div>

            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Something went wrong
            </h1>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              SchemeSetu encountered an unexpected issue while rendering this
              page. You can safely reload the portal or return to the home
              screen.
            </p>

            {this.state.error?.message && (
              <div className="bg-slate-100 text-slate-700 text-xs font-mono p-3 rounded-lg text-left mb-6 overflow-x-auto border border-slate-200">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <RefreshCw size={16} /> Reset & Reload
              </button>
              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all border border-slate-200 active:scale-95 cursor-pointer"
              >
                <Home size={16} /> Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
