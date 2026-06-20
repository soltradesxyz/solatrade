# SolTrades

Solana NFT launchpad and marketplace.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Deploy

```bash
npm run deploy
```

## Architecture

```
src/
  lib/        — core wallet + RPC logic
  components/ — UI components
  styles/     — theme + token system
public/
  assets/     — static media
tests/        — unit tests
```

## License

MIT
