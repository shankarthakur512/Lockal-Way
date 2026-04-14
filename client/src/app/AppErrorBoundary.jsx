import React from "react";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Keep the fallback simple while still leaving breadcrumbs for debugging.
    console.error("AppErrorBoundary", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-6 text-ink dark:bg-charcoal dark:text-cream">
          <div className="surface-panel max-w-xl p-8 text-center dark:border-white/10 dark:bg-[#18211E]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-clay">
              Something slipped
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">
              The app hit an unexpected issue.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate dark:text-sand/70">
              Reload the page to continue. If it keeps happening, there is likely a UI bug we should fix in this flow.
            </p>
            <button onClick={this.handleReload} className="brand-button mt-8 rounded-full">
              Reload app
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
