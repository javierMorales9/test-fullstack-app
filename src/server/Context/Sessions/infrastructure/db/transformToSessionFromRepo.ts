import { Session } from '../../domain/session';
import { transformToFlowFromRepo } from '../../../Flows/infrastructure/db/repos/transformToArrayOfFlowsFromRepo';
import { createAnswerFromScratch } from '../../../Flows/domain/pages/answers/answerFactory';

export async function transformToArrayOfSessionsFromRepo(
  sessionsReceived: unknown[],
): Promise<Session[]> {
  const sessions: Session[] = [];

  for (const sessionReceived of sessionsReceived) {
    const session = await transformToSessionFromRepo(sessionReceived);

    if (session != null) sessions.push(session);
  }

  return sessions;
}

export async function transformToSessionFromRepo(
  entrySession: any,
): Promise<Session | null> {
  if (entrySession == null) return null;

  const session = entrySession._doc ? entrySession._doc : entrySession;

  const flow = transformToFlowFromRepo(session.flow);
  const answers = (
    await Promise.all(session.answers.map(transformToAnswerSub))
  ).filter((el) => el != null);

  if (!flow) throw new Error();

  return new Session({
    flow,
    subscription: session.subscription,
    userData: session.userData,
    id: session._id.toString(),
    token: session.token,
    answers,
    finished: session.finished,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    preview: session.preview,
  });
}

async function transformToAnswerSub(el: any) {
  if (!el) return null;

  el = el._doc ? el._doc : el;

  const page = el.page.toString();
  const type = el.type;
  const data = transformData(el.data);

  const answerToTransform = {
    page,
    type,
    answer: el.answer,
    data,
  };

  return await createAnswerFromScratch(answerToTransform);
}

function transformData(data: any): any {
  if (!data) return undefined;

  data = data._doc ? data._doc : data;
  const { offer, ...rest } = data;
  const offerString = offer.toString();

  return {
    offer: offerString,
    ...rest,
  };
}
