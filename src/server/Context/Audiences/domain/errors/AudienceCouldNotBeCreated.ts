import { Uuid } from '../../../../Context/Shared/domain/value-object/Uuid';

export default class AudienceCouldNotBeCreated extends Error {
  constructor(audienceId: Uuid) {
    super('Audience could not be created: ' + audienceId.value);
  }
}
