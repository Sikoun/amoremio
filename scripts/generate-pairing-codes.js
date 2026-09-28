// Generates two pairing codes for Vercel env vars PARTNER1_CODE / PARTNER2_CODE.
// Run: node scripts/generate-pairing-codes.js
const { randomInt } = require('crypto');

// No 0/O/1/I/L so codes are easy to read aloud and type on a phone
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function code() {
  const chars = Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)]);
  return [0, 4, 8].map((i) => chars.slice(i, i + 4).join('')).join('-');
}

console.log(`PARTNER1_CODE=${code()}`);
console.log(`PARTNER2_CODE=${code()}`);
