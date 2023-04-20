import { PageRequest } from "./PageRequest";
import { createPageRequest } from "../PageFactory";

export class FlowRequest {
  public id?: string;
  public name: string;
  public description: string;
  public pages: PageRequest[];
  public audiences: string[];
  public paymentProvider: string;

  constructor(data: any) {
    if (
      !data.name ||
      !data.description ||
      !data.pages ||
      data.audiences === undefined
    )
      throw new Error("Incorrect Flow data");

    this.id = data.id || undefined;
    this.name = data.name;
    this.description = data.description;
    this.pages = data.pages.map((page: any) => createPageRequest(page));
    this.audiences = data.audiences;
    this.paymentProvider = data.paymentProvider;
  }
}
