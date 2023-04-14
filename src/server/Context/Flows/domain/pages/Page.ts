import { View } from './views/View';
import { Answer } from './answers/Answer';
import { Uuid } from '../../../../Context/Shared/domain/value-object/Uuid';

export abstract class Page {
  public id: string;

  protected constructor(
    public type: string,
    public order: number,
    id?: string,
  ) {
    this.id = id ? new Uuid(id).value : Uuid.random().value;
  }

  abstract generateView(
    answers: Answer[],
    accountId: string,
  ): Promise<View | null>;
}
