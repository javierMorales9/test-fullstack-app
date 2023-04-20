import { UserData } from "../../../../Context/Shared/domain/UserData";
import { Flow } from "../../../Flows/domain/Flow";
import FlowRepository from "../../../Flows/domain/repos/FlowRepository";
import AddFlowVisualizationService from "../../../Flows/domain/services/AddFlowVisualizationService";

export default class ResolveFlowService {
  constructor(
    private readonly flowRepo: FlowRepository,
    private readonly addFlowVisualizationService: AddFlowVisualizationService,
  ) {}

  public async execute(
    userData: UserData,
    accountId: string,
    paymentProvider: string,
  ): Promise<Flow> {
    const flows = await this.flowRepo.getFlowsByAccountAndPaymentProvider(
      accountId,
      paymentProvider,
    );

    for (let i = 0; i < flows.length; i++)
      if (await flows[i].checkUserData(userData)) {
        const flow = flows[i];
        await this.addFlowVisualizationService.execute(flow.id.value);
        return flow;
      }

    throw new Error("No flow fulfills the necessary Conditions");
  }
}
