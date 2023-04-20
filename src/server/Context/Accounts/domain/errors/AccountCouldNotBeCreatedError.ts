import { Uuid } from "../../../Shared/domain/value-object/Uuid";

export default class AccountCouldNotBeCreatedError extends Error {
  constructor(accountId: Uuid) {
    super(`Account ${accountId.value} could not be created`);
  }
}
