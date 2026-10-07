/**
 * cryptoUtils.js
 * Cryptographic helpers for secure client-side storage (e.g., Vault PIN hashing).
 */

export async function hashPin(pin) {
  if (!pin) return '';
  const salt = 'dhaara_vault_pin_salt_v1';
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
