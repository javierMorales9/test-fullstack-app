import { Account } from "../domain/account";

export function transformToArrayOfAccountsFromRepo(
  mongoAccounts: any[],
): Account[] {
  const accounts: Account[] = [];

  for (const accountToTransform of mongoAccounts) {
    const account = transformToAccountFromRepo(accountToTransform);

    if (account != null) accounts.push(account);
  }

  return accounts;
}

export function transformToAccountFromRepo(entryAccount: any): Account | null {
  if (entryAccount === null) return null;

  const mongoAccount = entryAccount._doc ? entryAccount._doc : entryAccount;

  return Account.fromFields(
    mongoAccount._id.toString(),
    mongoAccount.apiKey,
    mongoAccount.paymentType,
    mongoAccount.privateKey,
    mongoAccount.hash,
    mongoAccount.salt,
    mongoAccount.companyData,
    mongoAccount.imageUrl,
    mongoAccount.allowedDomains,
  );
}
