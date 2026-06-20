export const config = {
  network: 'mainnet-beta',
  rpcEndpoint: 'https://api.mainnet-beta.solana.com',
  commitment: 'confirmed',
  mintPrice: 0.85,
  maxPerWallet: 5,
  totalSupply: 5000,
  royaltyBps: 500,
  treasury: null,
  features: {
    analytics: true,
    toasts: true,
    autoConnect: false,
  },
};

export function getConfig(key) {
  return key.split('.').reduce((obj, k) => obj?.[k], config);
}
