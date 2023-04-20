import { Flow } from "../../../domain/Flow";
import {
  transformToArrayOfFlowsFromRepo,
  transformToFlowFromRepo,
} from "./transformToArrayOfFlowsFromRepo";
import { FlowMongo, FlowModel } from "../models/flowMongo";
import FlowRepository from "../../../domain/repos/FlowRepository";
import { PageRepository } from "../../../domain/repos/PageRepository";
import { Page } from "../../../domain/pages/Page";
import mongoose from "mongoose";
import logger from "../../../../../Context/Shared/infrastructure/logger/logger";
import FlowAlreadyExistError from "../../../domain/errors/FlowAlreadyExistError";
import FlowCouldNotBeCreatedError from "../../../domain/errors/FlowCouldNotBeCreatedError";
import MongoPageRepository from "./MongoPageRepository";

export default class MongoFlowRepository implements FlowRepository {
  private pageRepo: PageRepository = new MongoPageRepository();

  public async getAll(): Promise<Flow[]> {
    const flows = await FlowModel.find({})
      .populate("pages")
      .populate("account");
    return transformToArrayOfFlowsFromRepo(flows);
  }

  public async getFlowById(id: string): Promise<Flow | null> {
    const flow = await FlowModel.findById(id)
      .populate("pages")
      .populate("account");
    return transformToFlowFromRepo(flow);
  }

  public async getFlowByIdFromAccount(
    flowId: string,
    accountId: string,
  ): Promise<Flow | null> {
    const flow = await FlowModel.findOne({ _id: flowId, account: accountId })
      .populate("pages")
      .populate("account");

    return transformToFlowFromRepo(flow);
  }

  public async getAllFlowsByAccountId(
    accountId: string,
    filterActivated?: boolean,
  ): Promise<Flow[]> {
    const filter: { account: string; activated?: boolean } = {
      account: accountId,
    };

    if (filterActivated) filter["activated"] = true;

    const flows = await FlowModel.find(filter)
      .populate("pages")
      .populate("account");

    return transformToArrayOfFlowsFromRepo(flows);
  }

  public async getFlowsByAccountIdPaginated(
    accountId: string,
    page?: number,
    length?: number,
  ): Promise<Flow[]> {
    const skip = page && length ? (page - 1) * length : 0;
    const limit = page && length ? page * length : 30;

    const flows = await FlowModel.find({ account: accountId })
      .skip(skip)
      .limit(limit)
      .populate("pages")
      .populate("account");

    return transformToArrayOfFlowsFromRepo(flows);
  }

  public async saveOrUpdate(flow: Flow): Promise<Flow | null> {
    logger.debug("entered request save or Update");
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const pages = await this.pageRepo.savePages(flow.pages);
      logger.debug("pages created");

      const flowToUpdate: FlowMongo = createMongoFlow(flow, pages);
      const mongoFlow = await FlowModel.findOneAndUpdate(
        { _id: flowToUpdate._id },
        { $set: { ...flowToUpdate } },
        { upsert: true, new: true },
      )
        .populate("account")
        .populate("pages");

      logger.debug("Flow saved request database " + flowToUpdate._id);

      await session.commitTransaction();
      await session.endSession();
      return transformToFlowFromRepo(mongoFlow);
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      handleFlowCreationError(err, flow);
      throw new Error();
    }
  }

  public async delete(flowId: string, accountId: string): Promise<void> {
    logger.info("Deleting the flow " + flowId + " from mongo");

    try {
      await FlowModel.deleteOne(
        { _id: flowId, account: accountId },
        { upsert: true, new: true },
      );
    } catch (err: any) {
      logger.info("Error deleting the flow: " + err.message);
      throw new Error("Error deleting the flow " + flowId);
    }
  }

  public async deleteAll(accountId: string): Promise<void> {
    logger.info("Deleting all the flows from " + accountId + " from mongo");

    try {
      await FlowModel.deleteMany(
        { account: accountId },
        { upsert: true, new: true },
      );
    } catch (err: any) {
      logger.info("Error deleting the flows: " + err.message);
      throw new Error("Error deleting the flows from account" + accountId);
    }
  }

  public async getDates(id: string) {
    const flow = await FlowModel.findById({ _id: id });
    return !flow
      ? null
      : { createdAt: flow.createdAt, updatedAt: flow.updatedAt };
  }

  public async countAllFlows(accountId: string): Promise<number> {
    const query = await FlowModel.countDocuments({ account: accountId });
    return query;
  }

  public async updateBoostedRevenue(
    updateFlowData: { flow: string; ticket: number }[],
  ): Promise<void> {
    for (const data of updateFlowData) {
      console.log(data);
      await FlowModel.updateOne(
        { _id: data.flow },
        {
          $inc: {
            boostedRevenue: data.ticket,
          },
        },
      );
    }
  }

  public async getFlowsByAccountAndPaymentProvider(
    accountId: string,
    paymentProvider: string,
  ) {
    const flows = await FlowModel.find({
      account: accountId,
      paymentProvider,
      activated: true,
    })
      .populate("account")
      .populate("pages");
    return transformToArrayOfFlowsFromRepo(flows);
  }
}

function createMongoFlow(flow: Flow, pages: Page[]): FlowMongo {
  return {
    _id: flow.id.value,
    name: flow.name,
    description: flow.description,
    account: flow.account.id.value,
    pages: pages.map((page) => page.id),
    audiences: flow.audiences,
    activated: flow.activated,
    design: flow.getDesign(),
    createdAt: flow.createdAt,
    updatedAt: flow.updatedAt,
    visualizations: flow.visualizations,
    boostedRevenue: flow.boostedRevenue,
    paymentProvider: flow.paymentProvider,
  };
}

function handleFlowCreationError(err: any, flow: Flow) {
  const errMessage = err.message as string;

  logger.debug("Error while creating the flow: " + err.message);

  if (errMessage.includes("duplicate key error"))
    throw new FlowAlreadyExistError(flow.id);

  throw new FlowCouldNotBeCreatedError(flow.id);
}
