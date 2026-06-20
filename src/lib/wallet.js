import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'mainnet-beta';
const ENDPOINT = process.env.SOLANA_RPC_URL || clusterApiUrl(NETWORK);

let _connection = null;

export function getConnection() {
  if (!_connection) {
    _connection = new Connection(ENDPOINT, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    });
  }
  return _connection;
}

export function shortenAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function isValidSolanaAddress(address) {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getBalance(walletAddress) {
  const conn = getConnection();
  const pubkey = new PublicKey(walletAddress);
  const lamports = await conn.getBalance(pubkey);
  return lamports / 1e9;
}

export async function getRecentBlockhash() {
  const conn = getConnection();
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
  return { blockhash, lastValidBlockHeight };
}

export function lamportsToSol(lamports) {
  return Number(lamports) / 1e9;
}

export function solToLamports(sol) {
  return Math.round(Number(sol) * 1e9);
}
