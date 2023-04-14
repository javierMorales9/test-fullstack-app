import { View } from "./View";
import { Session } from "../../../../Sessions/domain/session";

export class FinalView extends View {
  public message: string;

  constructor(session: Session) {
    super("", "final");

    const answers = session.answers;
    let message = "";
    const previousAnswer = answers[answers.length - 1];
    if (!previousAnswer) throw new Error("Unexpected error. No previous answers found in the final View creation.");

    if (previousAnswer.type === "offerpage")
      message = previousAnswer.data.offer.type;

    if (previousAnswer.type === "cancel") message = "Cancel";

    this.message = message;
  }
}
