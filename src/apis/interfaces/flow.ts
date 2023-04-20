import { reorderFlowAPI } from "../flow";

export interface FlowsAttr {
  page?: string;
  length?: string;
}

export interface FlowAttr {
  id?: string;
  name: string;
  pages: [SurveyPageAttr, OfferPageAttr, CancelPageAttr, FinalPageAttr];
  audiences: string[];
}

interface SurveyPageAttr {
  type: "survey";
  title: string;
  hint: string;
  options: string[];
  order: number;
}

interface OfferPageAttr {
  type: "offerpage";
  maps: object[];
  order: number;
}

interface CancelPageAttr {
  type: "cancel";
  title: string;
  message: string;
  order: number;
}

interface FinalPageAttr {
  type: "final";
  order: number;
}

export interface DesignAttr {
  buttonColor: string;
  buttonTextColor: string;
  acceptButtonTextColor: string;
  wrongAnswerButtonTextColor: string;
  mainTitleColor: string;
  descriptionTextColor: string;
  subtitleTextColor: string;
  surveyOptionsColor: string;
  surveyBoxColor: string;
  typography: string;
}

export interface reorderFlowAttr {
  id: string;
  order: number | string;
}
