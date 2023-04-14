import { Session } from './session';
import { randomUUID } from 'crypto';
import { SurveyAnswer } from '../../Flows/domain/pages/answers/SurveyAnswer';

type SessionState = 'saved' | 'cancelled';

type SessionData = {
  session: string;
  ticket: number;
  cancellationReason: string;
  state: SessionState;
  date: Date;
};

export class CancellerHistory {
  public readonly id: string;
  public readonly cancellerId: string;
  public readonly sessionResults: SessionData[];
  private _state: SessionState;
  private _ticket: number;
  private _cancellationReason: string;
  public readonly account: string;
  private _isResaved: boolean;
  private _boostedRevenue: number;
  public _flow: string;

  constructor(
    id: string,
    cancellerId: string,
    sessionResults: SessionData[],
    state: SessionState,
    ticket: number,
    cancellationReason: string,
    account: string,
    flowId: string,
    isResaved?: boolean,
    boostedRevenue?: number,
  ) {
    this.id = id;
    this.cancellerId = cancellerId;
    this.sessionResults = sessionResults;
    this._state = state;
    this._ticket = ticket;
    this._cancellationReason = cancellationReason;
    this.account = account;
    this._flow = flowId;
    this._isResaved = isResaved || false;
    this._boostedRevenue = boostedRevenue || 0;
  }

  public static createNew(session: Session) {
    const id = randomUUID();
    const flow = session.flow.id;
    const cancellerId = session.subscription;
    const state = getState(session);
    const ticket = calculateTicket(session);
    const cancellationReason = getCancellationReason(session);
    const sessionResults = [
      {
        session: session.id,
        ticket,
        cancellationReason,
        state,
        date: new Date(),
      },
    ];
    const account = session.flow.account.id.value;
    const boostedRevenue = state === 'saved' ? ticket : 0;

    return new CancellerHistory(
      id,
      cancellerId,
      sessionResults,
      state,
      ticket,
      cancellationReason,
      account,
      flow.value,
      false,
      boostedRevenue,
    );
  }

  public addSession(session: Session) {
    const ticket = calculateTicket(session);
    const state = getState(session);
    const cancellationReason = getCancellationReason(session);

    this._state = state;
    this._ticket = ticket;
    this._cancellationReason = cancellationReason;
    this._isResaved = this.state === 'saved' && state === 'saved';
    this._flow = session.flow.id.value;

    this.sessionResults.push({
      session: session.id,
      ticket,
      cancellationReason,
      state,
      date: new Date(),
    });

    if (!this._isResaved && this._state === 'saved')
      this._boostedRevenue += this._ticket;
  }

  public get state() {
    return this._state;
  }

  public get ticket() {
    return this._ticket;
  }

  public get cancellationReason() {
    return this._cancellationReason;
  }

  public get isResaved() {
    return this._isResaved;
  }

  public get boostedRevenue() {
    return this._boostedRevenue;
  }

  public get flow() {
    return this._flow;
  }
}

function calculateTicket(session: Session) {
  return session.userData.subscriptionPrice;
}

function getState(session: Session): SessionState {
  return session.isTheCancellerSaved() ? 'saved' : 'cancelled';
}

function getCancellationReason(session: Session) {
  return (session.answers[0] as SurveyAnswer).answer!;
}
