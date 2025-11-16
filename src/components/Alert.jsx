import { useEffect } from 'react';

export default function Alert({ message, type = 'error', onDismiss }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onDismiss?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const isError = type === 'error';
  const isSuccess = type === 'success';
  const isWarning = type === 'warning';

  return (
    <div
      className={`alert alert-${type}`}
      role="alert"
      aria-live="polite"
    >
      <div className="alert-content">
        <span className="alert-icon">
          {isError && '✕'}
          {isSuccess && '✓'}
          {isWarning && '!'}
        </span>
        <span className="alert-message">{message}</span>
      </div>
      <button
        className="alert-close"
        onClick={() => onDismiss?.()}
        aria-label="Dismiss alert"
      >
        ×
      </button>
    </div>
  );
}