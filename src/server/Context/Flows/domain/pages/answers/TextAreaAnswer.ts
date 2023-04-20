import { Page } from "../Page";
import { getPageByIdService } from "../PageFactory";
import { IncorrectPageAnsweredError } from "../../../../Sessions/domain/IncorrectPageAnsweredError";
import { TextAreaView } from "../views/TextAreaView";

export class TextAreaAnswer {
  public readonly type = "textarea";

  constructor(public page: Page, public answer: string | null) {}

  public static async createFromScratch(data: any) {
    if (!data.page || data.type !== "textarea")
      throw new Error("Bad Text Area page answer");

    const page = await getPageByIdService(data.page);
    const answer = data.answer as string;

    return new TextAreaAnswer(page, answer);
  }

  public static async createEmpty(view: TextAreaView) {
    const page = await getPageByIdService(view.id);
    return new TextAreaAnswer(page, null);
  }

  public complete(data: any) {
    if (data.page !== this.page.id)
      throw new IncorrectPageAnsweredError(this.page, data);

    if (!(typeof data.answer === "string"))
      throw new Error("Bad Text Area page answer");

    this.answer = data.answer;
  }
}
