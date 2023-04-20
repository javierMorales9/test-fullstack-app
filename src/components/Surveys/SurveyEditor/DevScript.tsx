import "../../../../public/build/dev_sdk";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { useWatch } from "react-hook-form";
import { useEffect } from "react";
function DevScript({ surveyVisible, currentStep }) {
  const questions = useWatch({ name: "questions" });
  const design = useWatch({ name: "design" });
  const currentQuestion = questions[currentStep];
  const totalQuestions = questions.length;
  useEffectOnce(() => {
    window.sdk.init();
  });
  useUpdateEffect(() => {
    if (surveyVisible) window.sdk.showSurvey();
    else window.sdk.hideSurvey();
  }, [surveyVisible]);
  useUpdateEffect(() => {
    window.sdk.setSteps(currentStep + 1);
  }, [currentStep]);
  useEffect(() => {
    window.sdk.setQuestion(currentQuestion);
  }, [currentQuestion]);
  useEffect(() => {
    window.sdk.setTotalSteps(totalQuestions);
  }, [totalQuestions]);
  useEffect(() => {
    window.sdk.setSurveyDesign(design);
  }, [design]);
  return <></>;
}

export default DevScript;
