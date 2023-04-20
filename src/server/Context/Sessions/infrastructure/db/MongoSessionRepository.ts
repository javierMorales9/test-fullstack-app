import { SessionRepository } from "../../domain/SessionRepository";
import { SessionModel, SessionMongo } from "./sessionMongo";
import { Session } from "../../domain/session";
import {
  transformToArrayOfSessionsFromRepo,
  transformToSessionFromRepo,
} from "./transformToSessionFromRepo";
import { SurveyAnswerModel, SurveyAnswerMongo } from "./SurveyAnswerMongo";
import {
  CouponAnswerDataModel,
  CouponAnswerDataMongo,
  CustomContentAnswerDataModel,
  CustomContentAnswerDataMongo,
  OfferAnswerPageMongo,
  OfferPageAnswerModel,
  PauseAnswerDataModel,
  PauseAnswerDataMongo,
} from "./OfferAnswerPageMongo";
import { CancelAnswerModel, CancelAnswerMongo } from "./CancelAnswerMongo";
import { AnswerMongo } from "./AnswerMongo";
import {
  TextareaAnswerModel,
  TextAreaAnswerMongo,
} from "./TextAreaAnswerMongo";
import logger from "../../../../Context/Shared/infrastructure/logger/logger";
import SessionCouldNotBeCreated from "../../domain/errors/SessionCouldNotBeCreated";
import { OfferAnswerData } from "../../../Flows/domain/pages/answers/OfferPageAnswer";
import { Answer } from "../../../Flows/domain/pages/answers/Answer";

export default class MongoSessionRepository implements SessionRepository {
  public async getAll(): Promise<Session[]> {
    const session = await SessionModel.find()
      .populate({
        path: "flow",
        populate: {
          path: "pages",
          model: "Page",
        },
      })
      .populate({
        path: "flow",
        populate: {
          path: "account",
          model: "Account",
        },
      });
    return transformToArrayOfSessionsFromRepo(session);
  }

  public async getById(id: string): Promise<Session | null> {
    const session = await SessionModel.findById(id)
      .populate({
        path: "flow",
        populate: {
          path: "pages",
          model: "Page",
        },
      })
      .populate({
        path: "flow",
        populate: {
          path: "account",
          model: "Account",
        },
      });

    return transformToSessionFromRepo(session);
  }

  public async getAllFromAccount(accountId: string): Promise<Session[]> {
    const sessions = await SessionModel.aggregate([
      {
        $lookup: {
          from: "flows",
          localField: "flow",
          foreignField: "_id",
          as: "flow",
        },
      },
      { $unwind: "$flow" },
      {
        $match: {
          "flow.account": accountId,
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "flow.account",
          foreignField: "_id",
          as: "flow.account",
        },
      },
      {
        $lookup: {
          from: "pages",
          localField: "flow.pages",
          foreignField: "_id",
          as: "flow.pages",
        },
      },
      {
        $unwind: {
          path: "$flow.account",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return transformToArrayOfSessionsFromRepo(sessions);
  }

  public async getAllFromFlowFiltered(
    flowId: string,
    startDate: Date,
    endDate: Date,
    page: number,
    length: number,
  ): Promise<{ sessions: Session[]; count: number }> {
    const skip = (page - 1) * length;
    const limit = page * length;

    const total = await SessionModel.count({
      flow: flowId,
      updatedAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const sessions = await SessionModel.find({
      flow: flowId,
      preview: false,
      updatedAt: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "flow",
        populate: {
          path: "pages",
          model: "Page",
        },
      })
      .populate({
        path: "flow",
        populate: {
          path: "account",
          model: "Account",
        },
      });
    return {
      sessions: await transformToArrayOfSessionsFromRepo(sessions),
      count: total,
    };
  }

  public async getAllFromFlow(flowId: string): Promise<Session[]> {
    const sessions = await SessionModel.find({
      flow: flowId,
    })
      .populate({
        path: "flow",
        populate: {
          path: "pages",
          model: "Page",
        },
      })
      .populate({
        path: "flow",
        populate: {
          path: "account",
          model: "Account",
        },
      });
    return transformToArrayOfSessionsFromRepo(sessions);
  }

  public async getByToken(token: string): Promise<Session | null> {
    const session = await SessionModel.findOne({
      token: token,
      finished: false,
    })
      .populate({
        path: "flow",
        populate: {
          path: "pages",
          model: "Page",
        },
      })
      .populate({
        path: "flow",
        populate: {
          path: "account",
          model: "Account",
        },
      });

    return transformToSessionFromRepo(session);
  }

  public async save(session: Session): Promise<Session | null> {
    try {
      const sessionMongo = await SessionModel.findOneAndUpdate(
        { _id: session.id },
        { ...createMongoSession(session) },
        { upsert: true, new: true },
      )
        .populate({
          path: "flow",
          populate: {
            path: "pages",
            model: "Page",
          },
        })
        .populate({
          path: "flow",
          populate: {
            path: "account",
            model: "Account",
          },
        });

      return transformToSessionFromRepo(sessionMongo);
    } catch (err: any) {
      logger.debug("Session creation error: " + err.message);
      throw new SessionCouldNotBeCreated(session.id);
    }
  }

  public async deleteAllFromAFlow(flowId: string) {
    logger.info("Deleting all the sessions from " + flowId + " from mongo");

    try {
      await SessionModel.deleteMany(
        { flow: flowId },
        { upsert: true, new: true },
      );
    } catch (err: any) {
      logger.info("Error deleting the sessions: " + err.message);
      throw new Error("Error deleting the sessions from account" + flowId);
    }
  }

  public async deleteById(id: string): Promise<void> {
    await SessionModel.findByIdAndDelete(id);
  }

  public async deleteByToken(token: string): Promise<void> {
    await SessionModel.deleteOne({ token: token });
  }
}

function createMongoSession(session: Session): SessionMongo {
  return {
    _id: session.id,
    flow: session.flow.id.value,
    subscription: session.subscription,
    user: session.user,
    token: session.token,
    userData: session.userData,
    finished: session.isFinished(),
    answers: createMongoAnswers(session.answers),
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    preview: session.preview,
  };
}

function createMongoAnswers(answers: Answer[]) {
  return answers.map((el) => createMongoAnswer(el)) as AnswerMongo[];
}

function createMongoAnswer(answer: Answer) {
  const base = {
    page: answer.page.id,
    answer: answer.answer,
  };

  switch (answer.type) {
    case "survey":
      return new SurveyAnswerModel({
        ...base,
      }) as SurveyAnswerMongo;
    case "offerpage":
      return new OfferPageAnswerModel({
        ...base,
        data: createOfferDataMongo(answer.data),
      }) as OfferAnswerPageMongo;
    case "textarea":
      return new TextareaAnswerModel({
        ...base,
      }) as TextAreaAnswerMongo;
    case "cancel":
      return new CancelAnswerModel({
        ...base,
      }) as CancelAnswerMongo;
  }
}

function createOfferDataMongo(data: OfferAnswerData) {
  const { offer, ...rest } = data;
  const offerId = offer.id;

  switch (offer.type) {
    case "pause":
      return new PauseAnswerDataModel({
        offer: offerId,
        ...rest,
      }) as PauseAnswerDataMongo;
    case "coupon":
      return new CouponAnswerDataModel({
        offer: offerId,
        ...rest,
      }) as CouponAnswerDataMongo;
    case "customcontent":
      return new CustomContentAnswerDataModel({
        offer: offerId,
        ...rest,
      }) as CustomContentAnswerDataMongo;
    default:
      throw new Error();
  }
}
