import { AudienceRepository } from "../domain/AudienceRepository";
import { Audience } from "../domain/Audience";
import { AudienceModel, AudienceMongo } from "./AudienceMongo";
import {
  transformToArrayOfAudiencesFromRepo,
  transformToAudienceFromRepo,
} from "./transformToAudienceFromRepo";
import logger from "../../../Context/Shared/infrastructure/logger/logger";
import AudienceCouldNotBeCreated from "../domain/errors/AudienceCouldNotBeCreated";
import AudienceAlreadyExistError from "../domain/errors/AudienceAlreadyExistError";

export default class MongoAudienceRepository implements AudienceRepository {
  public async getAll(accountId: string): Promise<Audience[]> {
    const audiences = await AudienceModel.find({ account: accountId });
    return transformToArrayOfAudiencesFromRepo(audiences);
  }

  public async getById(audienceId: string): Promise<Audience | null> {
    const audience = await AudienceModel.findById(audienceId);
    return transformToAudienceFromRepo(audience);
  }

  public async save(audience: Audience): Promise<Audience | null> {
    const audienceMongo = createAudienceMongo(audience);

    logger.debug("Saving an audience with id " + audience.id);
    try {
      const savedAudience = await AudienceModel.findOneAndUpdate(
        { _id: audienceMongo._id },
        { ...audienceMongo },
        { upsert: true, new: true },
      );

      logger.debug("Saved the audience request the db");
      return transformToAudienceFromRepo(savedAudience);
    } catch (err) {
      handleAudienceCreationError(err, audience);
      throw new Error();
    }
  }

  public async delete(audienceId: string, accountId: string): Promise<void> {
    logger.info("Deleting the audience " + audienceId + " from mongo");

    try {
      await AudienceModel.deleteOne(
        { _id: audienceId, account: accountId },
        { upsert: true, new: true },
      );
    } catch (err: any) {
      logger.info("Error deleting the audience " + err.message);
      throw new Error("Could not delete the audience");
    }
  }

  public async deleteAll(accountId: string): Promise<void> {
    logger.info("Deleting all the audiences from " + accountId + " from mongo");

    try {
      await AudienceModel.deleteMany(
        { account: accountId },
        { upsert: true, new: true },
      );
    } catch (err: any) {
      logger.info("Error deleting the audiences " + err.message);
      throw new Error("Could not delete the audiences");
    }
  }
}

function createAudienceMongo(audience: Audience): AudienceMongo {
  return {
    _id: audience.id.value,
    name: audience.name,
    segments: audience.segments,
    account: audience.account.value,
  };
}

function handleAudienceCreationError(err: any, audience: Audience) {
  const errMessage = err.message as string;

  logger.debug("Error while creating the audience: " + err.message);

  if (errMessage.includes("duplicate key error"))
    throw new AudienceAlreadyExistError(audience.id);

  throw new AudienceCouldNotBeCreated(audience.id);
}
