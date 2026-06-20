import { getConnection } from './wallet.js';
import { PublicKey } from '@solana/web3.js';

const METAPLEX_PROGRAM = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export async function fetchCollectionMetadata(mintAddress) {
  const conn = getConnection();
  const mintPubkey = new PublicKey(mintAddress);

  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('metadata'), METAPLEX_PROGRAM.toBuffer(), mintPubkey.toBuffer()],
    METAPLEX_PROGRAM
  );

  const accountInfo = await conn.getAccountInfo(metadataPDA);
  if (!accountInfo) return null;

  return parseMetadata(accountInfo.data);
}

function parseMetadata(buffer) {
  let offset = 1 + 32 + 32;
  const nameLen = buffer.readUInt32LE(offset);
  offset += 4;
  const name = buffer.slice(offset, offset + nameLen).toString('utf8').replace(/\0/g, '');
  offset += nameLen;

  const symbolLen = buffer.readUInt32LE(offset);
  offset += 4;
  const symbol = buffer.slice(offset, offset + symbolLen).toString('utf8').replace(/\0/g, '');
  offset += symbolLen;

  const uriLen = buffer.readUInt32LE(offset);
  offset += 4;
  const uri = buffer.slice(offset, offset + uriLen).toString('utf8').replace(/\0/g, '');

  return { name, symbol, uri };
}

export async function getNFTsByOwner(ownerAddress) {
  const conn = getConnection();
  const owner = new PublicKey(ownerAddress);
  const tokenAccounts = await conn.getParsedTokenAccountsByOwner(owner, {
    programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  });

  return tokenAccounts.value
    .filter(ta => {
      const amount = ta.account.data.parsed.info.tokenAmount;
      return amount.decimals === 0 && amount.uiAmount === 1;
    })
    .map(ta => ta.account.data.parsed.info.mint);
}

export function getMintPageUrl(collectionId) {
  return `/mint/${collectionId}`;
}
