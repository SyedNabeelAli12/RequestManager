import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"); // 32-byte key
const IV = CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210"); // 16-byte IV

export function encryptData(data) {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY, { iv: IV });
  return encrypted.toString(); // Base64-encoded string
}