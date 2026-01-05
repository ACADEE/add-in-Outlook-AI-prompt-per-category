import crypto from "crypto";

const ALGO = "aes-256-gcm";

export function encryptString(plaintext, masterKey) {
  if (!masterKey || masterKey.length < 32) {
    throw new Error("MASTER_KEY must be at least 32 chars.");
  }
  const key = crypto.createHash("sha256").update(masterKey).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

export function decryptString(ciphertextB64, masterKey) {
  const raw = Buffer.from(ciphertextB64, "base64");
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const enc = raw.subarray(28);
  const key = crypto.createHash("sha256").update(masterKey).digest();
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString("utf8");
}
