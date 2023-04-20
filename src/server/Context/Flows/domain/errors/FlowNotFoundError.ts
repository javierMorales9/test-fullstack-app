export default class FlowNotFoundError extends Error {
  constructor() {
    super("Flow not found");
  }
}
