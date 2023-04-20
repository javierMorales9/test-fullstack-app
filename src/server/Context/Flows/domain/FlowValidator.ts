import { Flow } from "./Flow";

export class FlowValidator {
  private readonly flow: Flow;
  private readonly pageTypes: string[];
  private order: number;
  private errors: string[];

  constructor(flow: Flow) {
    this.flow = flow;
    this.pageTypes = flow.pages.map((el) => el.type);
    this.order = 0;
    this.errors = [];
  }

  validate() {
    this.validateTypes();

    for (const page of this.flow.pages) {
      this.validateOrder(page.order);
      this.order = page.order;
    }

    if (this.errors.length !== 0) throw new Error(JSON.stringify(this.errors));
  }

  validateTypes() {
    let count = 0;
    const fullSequence = [
      { name: "survey", required: true },
      { name: "offerpage", required: true },
      { name: "textarea", required: false },
      { name: "cancel", required: true },
    ];
    for (let i = 0; i < this.pageTypes.length; i++) {
      const flowType = this.pageTypes[i];
      const fullSequenceElement = fullSequence[count];
      if (!fullSequenceElement) throw new Error("Flow is not valid");

      if (fullSequenceElement.name === flowType) count++;
      else if (!fullSequenceElement.required) {
        count++;
        i--;
      } else
        this.errors.push(
          `Expected ${fullSequenceElement.name} but got ${flowType}`,
        );
    }
    return true;
  }

  validateOrder(pageOrder: number) {
    if (pageOrder - this.order !== 1)
      this.errors.push("order jumps from " + this.order + " to " + pageOrder);
  }
}
