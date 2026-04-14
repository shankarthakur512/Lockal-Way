const VARIANT_STYLES = {
  default: "border-sand-dark bg-sand/30 dark:border-white/10 dark:bg-white/5",
  error: "border-terracotta/25 bg-terracotta/10 dark:border-terracotta/30 dark:bg-terracotta/10",
};

const StatePanel = ({
  eyebrow,
  title,
  message,
  actionLabel,
  onAction,
  compact = false,
  variant = "default",
}) => (
  <div
    className={`surface-panel flex flex-col items-center justify-center text-center ${
      compact ? "min-h-[180px] p-6" : "min-h-[320px] p-10"
    } ${VARIANT_STYLES[variant] || VARIANT_STYLES.default}`}
  >
    {eyebrow ? (
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
        {eyebrow}
      </p>
    ) : null}
    <h2 className="mt-4 text-3xl font-semibold text-forest dark:text-cream">{title}</h2>
    <p className="mt-4 max-w-xl text-sm leading-8 text-slate dark:text-sand/70">{message}</p>
    {actionLabel && onAction ? (
      <button onClick={onAction} className="brand-button mt-8 rounded-full">
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default StatePanel;
