import { Request, Response, NextFunction } from "express";
import { validApiKey } from "../../Shared/infrastructure/security/securityUtils";
import GetAccountByIdService from "../domain/services/GetAccountByIdService";
import container from "~/server/api/dependency_injection";

export async function checkAccountCredentials(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestDomain = req.hostname;
  let accountId = req.headers.account_id;
  let apiKey = req.headers.api_key;

  if (!accountId || !apiKey)
    return res.status(401).json({ message: "Unauthorized" });

  accountId =
    typeof accountId === "string" ? accountId : (accountId[0] as string);
  apiKey = typeof apiKey === "string" ? apiKey : (apiKey[0] as string);

  const getAccountById = container.get<GetAccountByIdService>(
    "Accounts.domain.GetAccountByIdService",
  );
  const account = await getAccountById.execute(accountId);

  if (!isDomainValid(requestDomain, account.allowedDomains))
    return res.status(401).send("Not valid domain " + requestDomain);

  validApiKey(apiKey, account.hash, account.salt);

  // @ts-ignore
  req.user = {
    account,
  };

  next();
}

function isDomainValid(domain: string, allowedDomains?: string[]) {
  if (!allowedDomains || !allowedDomains.length) return true;
  if (domain === "localhost") return true;

  return allowedDomains.includes(domain);
}
