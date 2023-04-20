export default class AudienceNotFoundError extends Error {
  constructor() {
    super("Audience not found");
  }
}
