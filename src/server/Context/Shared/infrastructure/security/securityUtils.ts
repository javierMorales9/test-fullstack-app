import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import { transformKey } from "./transformKey";
import bcrypt from "bcrypt";
import ApiKeyNotValidError from "./ApiKeyNotValidError";
import { User } from "../../../Users/domain/User";

/**
 * -------------- HELPER FUNCTIONS ----------------
 */
export function validApiKey(apiKey: string, hash: string, salt: string) {
  const hashVerify = crypto
    .pbkdf2Sync(apiKey, salt, 10000, 64, "sha512")
    .toString("hex");

  if (hash !== hashVerify) throw new ApiKeyNotValidError();

  return true;
}

export function validPassword(user: User, password: string) {
  const valid = bcrypt.compareSync(password, user.encryptedPassword);

  if (!valid) throw new Error("Not valid credentials");
}

export function encryptApiKey(apiKey: string) {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(apiKey, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

export function issueUserJWT(user: User) {
  const PRIV_KEY = transformKey(process.env.PRIV_KEY);
  const email = user.email;

  if (!email) throw new Error("the user has no email");

  const expiresIn = "1d";

  const payload = {
    sub: email,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: signedToken,
    expires: expiresIn,
  };
}
