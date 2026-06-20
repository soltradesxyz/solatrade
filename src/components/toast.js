let container = null;

function ensureContainer() {
  if (container) return container;
  container = document.createElement('div');
  container.id = 'toast-container';
  Object.assign(container.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '9999',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  });
  document.body.appendChild(container);
  return container;
}

export function showToast(message, type = 'info', duration = 4000) {
  const el = document.createElement('div');
  const colors = {
    info: '#3b82f6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  };

  Object.assign(el.style, {
    background: '#1a2332',
    color: '#f1f5f9',
    padding: '12px 20px',
    borderRadius: '10px',
    borderLeft: `4px solid ${colors[type] || colors.info}`,
    fontSize: '0.9rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    transform: 'translateX(120%)',
    transition: 'transform 0.3s ease',
    maxWidth: '340px',
  });

  el.textContent = message;
  ensureContainer().appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    el.style.transform = 'translateX(120%)';
    setTimeout(() => el.remove(), 300);
  }, duration);
}
