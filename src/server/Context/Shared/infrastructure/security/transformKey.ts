import fs from "fs";

export function transformKey(key: string | undefined): string {
  if (!key) throw new Error("No key");

  const newKey = Buffer.from(key, "base64").toString("ascii");

  return newKey;
}

export function transformKeysToBase64(keys?: {
  publicKey: string;
  privateKey: string;
}) {
  const PUB_KEY = keys
    ? keys.publicKey
    : fs.readFileSync("./src/shared/security/id_rsa_pub.pem", "utf-8");
  const PRIV_KEY = keys
    ? keys.privateKey
    : fs.readFileSync("./src/shared/security/id_rsa_priv.pem", "utf-8");

  const pubBuff = Buffer.from(PUB_KEY);
  const privBuff = Buffer.from(PRIV_KEY);

  const base64Pub = pubBuff.toString("base64");
  const base64Priv = privBuff.toString("base64");

  return { base64Pub, base64Priv };
}

//const {base64Pub, base64Priv} = transformKeysToBase64();
