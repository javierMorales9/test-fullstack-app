import { Page } from "./Page";
import { Answer } from "./answers/Answer";
import { View } from "./views/View";
import { TextAreaRequest } from "./input/TextAreaRequest";
import { TextAreaView } from "./views/TextAreaView";

export class TextArea extends Page {
  constructor(
    type: "textarea",
    order: number,
    public title: string,
    public description: string,
    id?: string,
  ) {
    super(type, order, id);
  }

  public static fromPageRequest(request: TextAreaRequest): TextArea {
    return new TextArea(
      request.type,
      request.order,
      request.title,
      request.description,
      request.id,
    );
  }

  public generateView(
    answers: Answer[],
    accountId: string,
  ): Promise<View | null> {
    const previousAnswer = answers[answers.length - 1];
    if (!previousAnswer)
      throw new Error(
        "Unexpected error. No previous answers found in the final view creation.",
      );

    if (previousAnswer.type === "offerpage" && previousAnswer.answer)
      return Promise.resolve(null);

    return Promise.resolve(new TextAreaView(this));
  }
}
