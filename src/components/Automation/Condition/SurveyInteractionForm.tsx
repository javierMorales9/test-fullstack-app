import React, { useEffect, useState } from "react";
import withClientRendering from "../../../HOC/withClientRendering";
import { useFormContext } from "react-hook-form";
import { ConditionInputType } from "./options";
import CustomSelect from "../../../components/CustomSelect";
import CustomInput from "../../CustomInput/index2";
import { interactionTypes, timeOperators } from "../constants";
import { getSurveysAPI } from "../../../apis/surveys";

function SurveyInteractionFrom({ index, fieldName }) {
  const [surveys, setSurveys] = useState([]);
  const { register, setValue } = useFormContext();
  useEffect(() => {
    getSurveysAPI().then((res) => setSurveys(res.success()));
  }, []);

  setValue(
    `${fieldName}.${index}.inputType`,
    ConditionInputType.SURVEY_INTERACTION,
  );

  return (
    <div className="flex items-center">
      <div className="mr-2 w-2/12">
        <CustomSelect {...register(`${fieldName}.${index}.survey`)}>
          <option selected key={1} value={"all"}>
            All
          </option>
          {surveys.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name || opt.id}
            </option>
          ))}
        </CustomSelect>
      </div>
      <div className="mr-2 w-3/12">
        <CustomSelect {...register(`${fieldName}.${index}.interaction`)}>
          <option value="" selected hidden disabled>
            Select a User interaction
          </option>
          {interactionTypes.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </CustomSelect>
      </div>
      <span style={{ marginLeft: "0.18rem" }}>in the last</span>
      <div style={{ display: "flex" }}>
        <div className={"w-[400px]"} style={{ flex: 2, marginLeft: "1em" }}>
          <CustomInput
            type={"number"}
            defaultValue={0}
            {...register(`${fieldName}.${index}.timeframeValue`, {
              shouldUnregister: true,
              valueAsNumber: true,
            })}
          />
        </div>
        <div style={{ flex: 10, marginLeft: "1em", marginRight: "1em" }}>
          <CustomSelect
            {...register(`${fieldName}.${index}.timeframeOperator`, {
              shouldUnregister: true,
            })}
          >
            {timeOperators.map((opt) => (
              <option value={opt.id} key={opt.id}>
                {opt.label}
              </option>
            ))}
          </CustomSelect>
        </div>
      </div>
    </div>
  );
}

export default withClientRendering(SurveyInteractionFrom);
