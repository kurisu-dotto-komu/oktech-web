// Improved seeded random number generator with better distribution
export function seededRandom(seed: string) {
  // Use a more complex hashing algorithm for better distribution
  let hash1 = 0x811c9dc5; // FNV offset basis
  let hash2 = 0;

  // FNV-1a hash for first pass
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash1 ^= char;
    hash1 = Math.imul(hash1, 0x01000193); // FNV prime
    hash2 = hash2 * 31 + char; // Secondary hash
  }

  // Combine hashes for better distribution
  const combined = hash1 ^ hash2;

  // Use both sin and modulo for better pseudo-randomness
  const x = Math.sin(combined * 9.9) * 10000;
  const y = (combined * 2654435761) % 2147483647; // Knuth's multiplicative method

  // Combine both methods
  const result = (x - Math.floor(x) + y / 2147483647) / 2;
  return result - Math.floor(result);
}

// Generate random values within a range using seed
export function randomInRange(seed: string, min: number, max: number, offset: number = 0) {
  const rand = seededRandom(seed + offset.toString());
  return min + rand * (max - min);
}
