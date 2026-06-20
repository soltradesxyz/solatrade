const ANALYTICS_ENDPOINT = '/api/events';
const SESSION_KEY = 'st_session';

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function trackEvent(name, properties = {}) {
  if (typeof navigator === 'undefined') return;

  const payload = {
    event: name,
    session: getSessionId(),
    timestamp: Date.now(),
    url: window.location.pathname,
    referrer: document.referrer || null,
    ...properties,
  };

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_ENDPOINT, JSON.stringify(payload));
  } else {
    fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  }
}

export function trackPageView() {
  trackEvent('page_view', {
    title: document.title,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  });
}

export function trackWalletConnect(walletName) {
  trackEvent('wallet_connect', { wallet: walletName });
}

export function trackMint(txSignature, amount) {
  trackEvent('mint', { tx: txSignature, amount });
}
