const DEFAULT_TIMEOUT = 30000;
const MAX_RETRIES = 3;

export async function rpcCall(endpoint, method, params = [], opts = {}) {
  const { timeout = DEFAULT_TIMEOUT, retries = MAX_RETRIES } = opts;

  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method,
          params,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        if (res.status === 429 && attempt < retries - 1) {
          await sleep(Math.pow(2, attempt) * 1000);
          continue;
        }
        throw new Error(`RPC error: ${res.status}`);
      }

      const json = await res.json();
      if (json.error) {
        throw new Error(json.error.message || 'RPC error');
      }

      return json.result;
    } catch (err) {
      clearTimeout(timer);
      if (attempt === retries - 1) throw err;
      await sleep(Math.pow(2, attempt) * 500);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getSlot(endpoint) {
  return rpcCall(endpoint, 'getSlot');
}

export async function getTokenAccountsByOwner(endpoint, owner, mint) {
  return rpcCall(endpoint, 'getTokenAccountsByOwner', [
    owner,
    { mint },
    { encoding: 'jsonParsed' },
  ]);
}
