export function createModal(options = {}) {
  const { title = '', content = '', onClose = null } = options;

  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10000',
    opacity: '0',
    transition: 'opacity 0.2s',
  });

  const dialog = document.createElement('div');
  Object.assign(dialog.style, {
    background: '#1a2332',
    borderRadius: '16px',
    border: '1px solid #334155',
    padding: '32px',
    maxWidth: '480px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    transform: 'scale(0.95)',
    transition: 'transform 0.2s',
  });

  if (title) {
    const h = document.createElement('h3');
    h.textContent = title;
    Object.assign(h.style, {
      fontFamily: "'Space Grotesk', sans-serif",
      fontSize: '1.3rem',
      marginBottom: '16px',
    });
    dialog.appendChild(h);
  }

  if (typeof content === 'string') {
    const p = document.createElement('p');
    p.innerHTML = content;
    p.style.color = '#94a3b8';
    dialog.appendChild(p);
  } else if (content instanceof HTMLElement) {
    dialog.appendChild(content);
  }

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    dialog.style.transform = 'scale(1)';
  });

  function close() {
    overlay.style.opacity = '0';
    dialog.style.transform = 'scale(0.95)';
    setTimeout(() => overlay.remove(), 200);
    if (onClose) onClose();
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  return { overlay, dialog, close };
}
