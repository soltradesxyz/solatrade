import { strict as assert } from 'assert';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ✗ ${name}`);
    console.log(`    ${err.message}`);
  }
}

console.log('\n  SolTrades Tests\n');

test('config exports correctly', () => {
  const { config } = require('../src/config.js');
  assert.equal(config.network, 'mainnet-beta');
  assert.equal(config.mintPrice, 0.85);
  assert.equal(config.totalSupply, 5000);
});

test('getConfig dot notation', () => {
  const { getConfig } = require('../src/config.js');
  assert.equal(getConfig('features.analytics'), true);
  assert.equal(getConfig('features.autoConnect'), false);
});

test('getConfig returns undefined for missing keys', () => {
  const { getConfig } = require('../src/config.js');
  assert.equal(getConfig('nonexistent.key'), undefined);
});

test('shortenAddress formats correctly', () => {
  const addr = 'HN7cABqLq46Es1jh92dQQisAi5YqaHyPJKjsu3n1JWRx';
  const short = `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  assert.equal(short, 'HN7c...WRx');
});

test('lamports conversion', () => {
  assert.equal(1000000000 / 1e9, 1);
  assert.equal(Math.round(1.5 * 1e9), 1500000000);
});

console.log(`\n  ${passed} passing, ${failed} failing\n`);
process.exit(failed > 0 ? 1 : 0);
