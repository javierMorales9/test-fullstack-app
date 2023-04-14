import { FlowDesign } from '../../../Flows/domain/FlowDesign';

export type SessionCreatedResponse = {
  token: string;
  design: FlowDesign;
};
