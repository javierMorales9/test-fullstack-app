import { Page } from "../Page";
import { getPageByIdService } from "../PageFactory";
import { CancelView } from "../views/CancelView";
import { IncorrectPageAnsweredError } from "../../../../Sessions/domain/IncorrectPageAnsweredError";

export class CancelAnswer {
  public readonly type = "cancel";

  constructor(public readonly page: Page, public answer: boolean | null) {}

  public static async createFromScratch(data: any) {
    if (!data.page || data.type !== "cancel")
      throw new Error("Bad Cancel page answer");

    const page = await getPageByIdService(data.page);
    const answer = data.answer as boolean;

    return new CancelAnswer(page, answer);
  }

  public static async createEmpty(view: CancelView) {
    const page = await getPageByIdService(view.id);
    return new CancelAnswer(page, null);
  }

  public complete(data: any) {
    if (data.page !== this.page.id)
      throw new IncorrectPageAnsweredError(this.page, data);

    if (!(typeof data.answer === "boolean"))
      throw new Error("Bad Cancel page answer");

    this.answer = data.answer;
  }
}
