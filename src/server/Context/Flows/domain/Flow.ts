import { FlowRequest } from "./pages/input/FlowRequest";
import { Page } from "./pages/Page";
import { PageRequest } from "./pages/input/PageRequest";
import { createPageFromRequest } from "./pages/PageFactory";
import { FlowValidator } from "./FlowValidator";
import { defaultFlowDesign, FlowDesign } from "./FlowDesign";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";
import logger from "../../../Context/Shared/infrastructure/logger/logger";
import { UserData } from "../../../Context/Shared/domain/UserData";
import GetPaymentProviderService from "../../PaymentProviders/domain/services/GetPaymentProviderService";
import CheckAudienceMatchesAUserService from "../../Audiences/domain/services/CheckAudienceMatchesAUserService";
import GetFlowByIdService from "./services/GetFlowByIdService";
import { Account } from "../../../Context/Accounts/domain/account";
import container from "~/server/api/dependency_injection";

type FlowConstructorOptions = {
  id: Uuid;
  name: string;
  description: string;
  pages: Page[];
  account: Account;
  audiences: string[];
  activated: boolean;
  design: FlowDesign;
  paymentProvider: string;
  createdAt?: Date;
  updatedAt?: Date;
  visualizations?: number;
  boostedRevenue?: number;
};

export class Flow {
  public id: Uuid;
  public readonly name: string;
  public readonly description: string;
  public readonly pages: Page[];
  public readonly account: Account;
  public audiences: string[];
  public activated: boolean;
  private _design: FlowDesign;
  public createdAt: Date;
  public updatedAt: Date;
  public visualizations: number;
  public boostedRevenue: number;
  public paymentProvider: string;

  constructor({
    id,
    name,
    description,
    pages,
    account,
    audiences,
    activated,
    design,
    createdAt,
    updatedAt,
    visualizations,
    boostedRevenue,
    paymentProvider,
  }: FlowConstructorOptions) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.pages = pages;
    this.account = account;
    this.audiences = audiences;
    this.activated = activated;
    this._design = design;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || this.createdAt;
    this.visualizations = visualizations || 0;
    this.boostedRevenue = boostedRevenue || 0;
    this.paymentProvider = paymentProvider || "stripe";
  }

  public static async fromRequest(
    request: FlowRequest,
    account: Account,
  ): Promise<Flow> {
    const id = request.id ? new Uuid(request.id) : Uuid.random();

    const getFlowByIdService = container.get<GetFlowByIdService>(
      "Flows.domain.GetFlowByIdService",
    );
    const currentFlow = await getFlowByIdService.execute(id.value);

    const { name, description } = request;
    const pages = this.generatePagesFromRequests(request.pages);
    const audiences = request.audiences;
    const paymentProvider = request.paymentProvider || "stripe";
    await this.checkThatPaymentProviderExist(paymentProvider, account.id.value);

    const activated = currentFlow ? currentFlow.activated : false;

    const newDate = new Date();
    const createdAt = currentFlow ? currentFlow.createdAt : newDate;
    const updatedAt = newDate;

    const visualizations = currentFlow ? currentFlow.visualizations : 0;
    const boostedRevenue = currentFlow ? currentFlow.boostedRevenue : 0;

    const flow = new Flow({
      id,
      name,
      description,
      pages,
      account,
      audiences,
      activated,
      design: defaultFlowDesign,
      createdAt,
      updatedAt,
      visualizations,
      boostedRevenue,
      paymentProvider,
    });

    new FlowValidator(flow).validate();
    return flow;
  }

  public static generatePagesFromRequests(requests: PageRequest[]): Page[] {
    if (requests.length === 0) throw new Error("The flow has no pages");

    return requests
      .map((page) => createPageFromRequest(page))
      .filter((el) => el != null) as Page[];
  }

  public getPageWithAnOrder = (order: number): Page | null => {
    logger.debug("Extracting the page with order: " + order);
    const pageWithOrder = this.pages.filter((page) => page.order === order);

    if (pageWithOrder.length > 1)
      throw new Error("The flow has more than 1 page with an order");

    return pageWithOrder[0] || null;
  };

  async checkUserData(userData: UserData): Promise<boolean> {
    logger.debug(
      "checking if flow " +
        this.id +
        " fulfills the Conditions for userId " +
        userData.userId,
    );

    const checkAudienceMatchesAUserService =
      container.get<CheckAudienceMatchesAUserService>(
        "Audiences.domain.CheckAudienceMatchesAUserService",
      );

    for (let i = 0; i < this.audiences.length; i++) {
      const audience = this.audiences[i]!;
      if (await checkAudienceMatchesAUserService.execute(audience, userData))
        return true;
    }

    return false;
  }

  public getDesign() {
    return this._design;
  }

  public set design(design: FlowDesign) {
    this._design = design;
  }

  public addVisualization() {
    this.visualizations += 1;
  }

  public increaseBoostedRevenue(increment: number) {
    this.boostedRevenue += increment;
  }

  private static async checkThatPaymentProviderExist(
    paymentProvider: string,
    accountId: string,
  ) {
    if (process.env.NODE_ENV === "development" && paymentProvider === "local")
      return;
    const getPaymentProvider = container.get<GetPaymentProviderService>(
      "PaymentProviders.domain.GetPaymentProviderService",
    );
    await getPaymentProvider.execute(paymentProvider, accountId);
  }
}
