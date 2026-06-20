import { trackPageView, trackWalletConnect } from './lib/analytics.js';
import { getConnection, shortenAddress } from './lib/wallet.js';
import { showToast } from './components/toast.js';

const SUPPORTED_WALLETS = ['phantom', 'solflare', 'backpack', 'glow'];

function detectWallet() {
  if (window.solana?.isPhantom) return 'phantom';
  if (window.solflare?.isSolflare) return 'solflare';
  if (window.backpack) return 'backpack';
  if (window.glow) return 'glow';
  return null;
}

function getProvider(walletName) {
  switch (walletName) {
    case 'phantom': return window.solana;
    case 'solflare': return window.solflare;
    case 'backpack': return window.backpack;
    case 'glow': return window.glow;
    default: return null;
  }
}

async function connectWallet() {
  const wallet = detectWallet();
  if (!wallet) {
    showToast('No Solana wallet found. Install Phantom or Solflare.', 'warning');
    return null;
  }

  try {
    const provider = getProvider(wallet);
    const resp = await provider.connect();
    const address = resp.publicKey.toString();
    trackWalletConnect(wallet);
    showToast(`Connected: ${shortenAddress(address)}`, 'success');
    return { wallet, address, provider };
  } catch (err) {
    if (err.code === 4001) {
      showToast('Connection rejected by user', 'warning');
    } else {
      showToast('Failed to connect wallet', 'error');
    }
    return null;
  }
}

function init() {
  trackPageView();

  const conn = getConnection();
  conn.getSlot().then(slot => {
    console.log('[SolTrades] Connected to Solana, slot:', slot);
  }).catch(() => {
    console.warn('[SolTrades] RPC connection check failed');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { connectWallet, detectWallet, SUPPORTED_WALLETS };
