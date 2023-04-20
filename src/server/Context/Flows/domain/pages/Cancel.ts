import { Page } from "./Page";
import { CancelRequest } from "./input/CancelRequest";
import { CancelView } from "./views/CancelView";
import { Answer } from "./answers/Answer";

export class Cancel extends Page {
  constructor(
    type: "cancel",
    order: number,
    public title: string,
    public message: string,
    id?: string,
  ) {
    super(type, order, id);
  }

  public static fromPageRequest(request: CancelRequest): Cancel {
    return new Cancel(
      request.type,
      request.order,
      request.title,
      request.message,
      request.id,
    );
  }

  public generateView(answers: Answer[]): Promise<CancelView | null> {
    const previousAnswer = answers[answers.length - 1];
    if (!previousAnswer)
      throw new Error(
        "Unexpected error. No previous answers found in the cancel view creation.",
      );

    if (previousAnswer.type !== "offerpage")
      return Promise.resolve(new CancelView(this));

    if (previousAnswer.answer === false)
      return Promise.resolve(new CancelView(this));

    return Promise.resolve(null);
  }
}
