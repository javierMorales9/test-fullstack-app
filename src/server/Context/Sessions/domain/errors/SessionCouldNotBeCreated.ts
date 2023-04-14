export default class SessionCouldNotBeCreated extends Error {
  constructor(sessionId: string) {
    super(`Session ${sessionId} could not be created`);
  }
}
