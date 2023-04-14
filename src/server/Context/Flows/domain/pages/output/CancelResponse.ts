import { Cancel } from '../Cancel';

export class CancelResponse {
  public id: string;
  public type: 'cancel';
  public title: string;
  public message: string;
  public order: number;

  constructor(cancel: Cancel) {
    this.id = cancel.id;
    this.type = 'cancel';
    this.title = cancel.title;
    this.message = cancel.message;
    this.order = cancel.order;
  }
}
