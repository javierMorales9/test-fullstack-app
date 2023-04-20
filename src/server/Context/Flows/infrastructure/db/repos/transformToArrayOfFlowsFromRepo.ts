import { transformToArrayOfPagesFromRepo } from "./transformToArrayOfPagesFromRepo";
import { Flow } from "../../../domain/Flow";
import { Uuid } from "../../../../../Context/Shared/domain/value-object/Uuid";
import { transformToAccountFromRepo } from "../../../../../Context/Accounts/infrastructure/transformToAccountFromRepo";

export function transformToArrayOfFlowsFromRepo(mongoFlows: any[]): Flow[] {
  const flows: Flow[] = [];

  for (const mongoFlow of mongoFlows) {
    const flow = transformToFlowFromRepo(mongoFlow);

    if (flow != null) flows.push(flow);
  }

  return flows;
}

export function transformToFlowFromRepo(entryFlow: any): Flow | null {
  if (entryFlow == null) return null;

  const mongoFlow = entryFlow._doc ? entryFlow._doc : entryFlow;

  const pages = transformToArrayOfPagesFromRepo(mongoFlow.pages);
  const account = transformToAccountFromRepo(mongoFlow.account);
  const audiences = mongoFlow.audiences.map(
    (el: any) => el.toString() as string,
  ) as string[];

  if (account == null) return null;

  return new Flow({
    id: new Uuid(mongoFlow._id.toString()),
    name: mongoFlow.name,
    description: mongoFlow.description,
    pages,
    account,
    audiences,
    activated: mongoFlow.activated,
    design: mongoFlow.design,
    createdAt: mongoFlow.createdAt,
    updatedAt: mongoFlow.updatedAt,
    visualizations: mongoFlow.visualizations,
    boostedRevenue: mongoFlow.boostedRevenue,
    paymentProvider: mongoFlow.paymentProvider,
  });
}
