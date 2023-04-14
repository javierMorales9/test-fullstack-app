import { Flow } from '../Flow';

export default interface FlowRepository {
  getAll: () => Promise<Flow[]>;
  getFlowById: (id: string) => Promise<Flow | null>;
  getFlowByIdFromAccount: (
    flowId: string,
    accountId: string,
  ) => Promise<Flow | null>;
  getAllFlowsByAccountId: (
    accountId: string,
    filterValid?: boolean,
  ) => Promise<Flow[]>;
  getFlowsByAccountIdPaginated: (
    accountId: string,
    page?: number,
    limit?: number,
  ) => Promise<Flow[]>;
  saveOrUpdate: (flow: Flow) => Promise<Flow | null>;
  delete: (flowId: string, accountId: string) => Promise<void>;
  deleteAll: (accountId: string) => Promise<void>;
  getDates: (
    id: string,
  ) => Promise<{ createdAt: Date; updatedAt: Date } | null>;
  countAllFlows: (accountId: string) => Promise<number>;
  updateBoostedRevenue: (
    updateFlowData: { flow: string; ticket: number }[],
  ) => Promise<void>;
  getFlowsByAccountAndPaymentProvider: (
    accountId: string,
    paymentProvider: string,
  ) => Promise<Flow[]>;
}
