import { Uuid } from '../../../../Context/Shared/domain/value-object/Uuid';

export default class FlowCouldNotBeCreatedError extends Error {
  constructor(flowId: Uuid) {
    super(`Flow could not be created: ${flowId.value}`);
  }
}
