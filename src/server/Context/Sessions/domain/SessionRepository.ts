import { Session } from "./session";

export interface SessionRepository {
  getAll(): Promise<Session[]>;
  getById(id: string): Promise<Session | null>;
  getAllFromAccount(accountId: string): Promise<Session[]>;
  getAllFromFlow(flowId: string): Promise<Session[]>;
  getAllFromFlowFiltered(
    flowId: string,
    startDate: Date,
    endDate: Date,
    page: number,
    length: number,
  ): Promise<{ sessions: Session[]; count: number }>;
  getByToken(token: string): Promise<Session | null>;
  save(session: Session): Promise<Session | null>;
  deleteAllFromAFlow(flowId: string): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteByToken(token: string): Promise<void>;
}
