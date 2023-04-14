import { Session } from '../session';
import { FlowResponse } from '../../../Flows/domain/pages/output/FlowResponse';
import { Answer } from '../../../Flows/domain/pages/answers/Answer';
import { UserData } from '../../../../Context/Shared/domain/UserData';

export class SessionResponse {
  private id?: string;
  private flow: FlowResponse;
  private subscription: string;
  private user: string;
  private token: string;
  private finished: boolean;
  private answers: Answer[];
  private userData: UserData;
  private createdAt?: Date;
  private updatedAt?: Date;
  private preview: boolean;

  constructor(session: Session) {
    this.id = session.id;
    this.flow = new FlowResponse(session.flow);
    this.subscription = session.subscription;
    this.user = session.user;
    this.token = session.token;
    this.userData = session.userData;
    this.finished = session.isFinished();
    this.answers = session.answers;
    this.createdAt = session.createdAt;
    this.updatedAt = session.updatedAt;
    this.preview = session.preview;
  }
}
