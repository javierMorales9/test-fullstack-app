/**
 * This module will generate a new pair of keys ready to paste them request as env variables
 */
import crypto from "crypto";
import fs from "fs";
import { transformKey, transformKeysToBase64 } from "./transformKey";

function genKeyPair() {
  // Generates an object where the keys are stored request properties `privateKey` and `publicKey`
  const keyPair = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
  });

  fs.writeFileSync(__dirname + "/id_rsa_pub.pem", keyPair.publicKey);
  fs.writeFileSync(__dirname + "/id_rsa_priv.pem", keyPair.privateKey);

  const transformedKeys = transformKeysToBase64(keyPair);

  //console.log('PUB_KEY=' + transformedKeys.base64Pub);
  //console.log('PRIV_KEY=' + transformedKeys.base64Priv);
}

genKeyPair();
