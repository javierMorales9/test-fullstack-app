import { Flow } from "../../Flow";
import { PageResponse } from "./PageResponse";
import { createPageResponse } from "../PageFactory";
import { FlowDesign } from "../../FlowDesign";
import { AccountResponse } from "../../../../../Context/Accounts/domain/response/accountResponse";

export class FlowResponse {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly pages: PageResponse[];
  readonly account: AccountResponse;
  readonly audiences: string[];
  readonly activated: boolean;
  readonly design?: FlowDesign;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly visualizations: number;
  readonly boostedRevenue: number;
  readonly paymentProvider: string;

  constructor(flow: Flow) {
    this.id = flow.id.value;
    this.name = flow.name;
    this.description = flow.description;
    this.pages = flow.pages.map((el) => createPageResponse(el));
    this.audiences = flow.audiences;
    this.account = new AccountResponse(flow.account);
    this.activated = flow.activated;
    this.design = flow.getDesign();
    this.createdAt = flow.createdAt;
    this.updatedAt = flow.updatedAt;
    this.visualizations = flow.visualizations;
    this.boostedRevenue = flow.boostedRevenue;
    this.paymentProvider = flow.paymentProvider;
  }
}
