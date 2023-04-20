import crypto from "crypto";
import { Flow } from "../../Flows/domain/Flow";
import { UserData } from "../../../Context/Shared/domain/UserData";
import { Answer } from "../../Flows/domain/pages/answers/Answer";
import logger from "../../../Context/Shared/infrastructure/logger/logger";
import { View } from "../../Flows/domain/pages/views/View";
import { createEmptyAnswer } from "../../Flows/domain/pages/answers/answerFactory";
import { Uuid } from "../../../Context/Shared/domain/value-object/Uuid";

type SessionOptions = {
  flow: Flow;
  subscription?: string;
  userData?: UserData;
  preview?: boolean;
  id?: string;
  token?: string;
  answers?: Answer[];
  finished?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Session {
  public id: string;
  readonly flow: Flow;
  readonly subscription: string;
  readonly user: string;
  readonly token: string;
  readonly userData: UserData;
  readonly preview: boolean;
  private finished: boolean;
  private readonly _answers: Answer[];
  readonly createdAt: Date;
  private _updatedAt: Date;

  constructor({
    flow,
    subscription,
    userData,
    preview,
    id,
    token,
    answers,
    finished,
    createdAt,
    updatedAt,
  }: SessionOptions) {
    this.id = id ? new Uuid(id).value : Uuid.random().value;
    this.flow = flow;
    this.subscription = subscription || "";
    this.user = subscription || "";
    this.token = token || Session.generateSessionToken(flow.name);
    this.userData = userData || UserData.createDefaultUserData();
    this.finished = finished || false;
    this._answers = answers || [];
    this.createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || this.createdAt;
    this.preview = !!preview;
  }

  private static generateSessionToken(flowName: string): string {
    const timestamp: number = Date.now();
    const hash = crypto.createHash("md5").update(flowName).digest("hex");

    const token = hash + timestamp;

    logger.info("Token generated: " + token);
    return token;
  }

  public async prepopulateAnswer(pageView: View) {
    const answer = await createEmptyAnswer(pageView);
    this.addAnswer(answer);
  }

  public completeLastAnswer(data: any) {
    if (!this._answers.length) return;

    this._answers[this._answers.length - 1].complete(data);
  }

  public deleteTheLastAnswer() {
    this._answers.pop();
    this._answers.pop();
  }

  public get answers() {
    return this._answers;
  }

  public addAnswer(answer: Answer) {
    this._answers.push(answer);
  }

  public finish() {
    this.finished = true;
  }

  public isFinished() {
    return this.finished;
  }

  public isTheCancellerSaved() {
    return this.answers[this.answers.length - 2].type === "offerpage";
  }

  public get updatedAt() {
    return this._updatedAt;
  }

  public updateDate() {
    return (this._updatedAt = new Date());
  }
}
