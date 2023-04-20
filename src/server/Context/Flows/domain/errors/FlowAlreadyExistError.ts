import { Uuid } from "../../../../Context/Shared/domain/value-object/Uuid";

export default class FlowAlreadyExistError extends Error {
  constructor(flowId: Uuid) {
    super(`Flow already exist: ${flowId.value}`);
  }
}
