import { Uuid } from "../../../../Context/Shared/domain/value-object/Uuid";

export default class AudienceAlreadyExistError extends Error {
  constructor(audienceId: Uuid) {
    super("Audience already exist: " + audienceId.value);
  }
}
