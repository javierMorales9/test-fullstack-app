import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";

export class Offer {
  readonly id: Uuid;
  readonly account: Uuid;

  constructor(
    readonly type: string,
    readonly title: string,
    readonly message: string,
    account: string,
    id?: string,
  ) {
    this.id = id ? new Uuid(id) : Uuid.random();
    this.account = new Uuid(account);
  }
}
