import React, { useEffect, useMemo, useRef } from "react";
import CustomSelect from "~/components/CustomSelect";
import CustomInput from "~/components/CustomInput/index2";
import { useFormContext, useWatch } from "react-hook-form";
import withClientRendering from "~/HOC/withClientRendering";
import { ConditionInputType } from "./options";
import slugHolder, { getValidatorOptions } from "../../../utils/slugs";

function UserResponseForm({ index, fieldName }) {
  const { register, getValues, setValue } = useFormContext();
  setValue(`${fieldName}.${index}.inputType`, ConditionInputType.USER_RESPONSE);
  const condition = getValues()[`${fieldName}`][index];
  const conditionSelector = `${fieldName}.${index}`;

  const slugName = useWatch({
    name: `${conditionSelector}.slugName`,
    defaultValue: condition.slugName,
  });
  const slugType = useWatch({
    name: `${conditionSelector}.slugType`,
    defaultValue: condition.slugType,
  });

  const slugInputRef = useRef(null);
  useEffect(() => {
    const input = slugInputRef.current;
    if (slugName && slugType)
      input.value = `{"name":"${slugName}","type":"${slugType}"}`;
  }, []);

  const validator = useWatch({
    name: `${conditionSelector}.stringValidator`,
    defaultValue: condition.stringValidator,
  });
  const validators = useMemo(() => getValidatorOptions(slugType), [slugType]);

  const checkIfHasLastInput = () => {
    const validatorObj = validators.find((el) => validator === el.id);
    return !!validatorObj?.doNotRequireValue;
  };

  const updateSlugData = (e) => {
    const value = JSON.parse(e.target.value);
    setValue(`${conditionSelector}.slugName`, value.name);
    setValue(`${conditionSelector}.slugType`, value.type);
  };

  return (
    <div className="flex">
      <div className="mr-2 w-2/12">
        <CustomSelect onChange={updateSlugData} ref={slugInputRef}>
          <option value={""} selected hidden disabled>
            Select a User slug
          </option>
          {slugHolder.slugs.map((opt) => (
            <option
              key={opt.name}
              value={`{"name":"${opt.name}","type":"${opt.type}"}`}
            >
              {opt.name + "  (" + opt.type + ")"}
            </option>
          ))}
        </CustomSelect>
      </div>
      <div className="mr-2 w-2/12">
        <CustomSelect {...register(`${fieldName}.${index}.stringValidator`)}>
          <option value="" selected hidden disabled>
            Select a Validator
          </option>
          {validators.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </CustomSelect>
      </div>
      {!checkIfHasLastInput() ? (
        <div className="mr-6 w-4/12">
          <CustomInput
            type={slugType}
            {...register(`${fieldName}.${index}.value`)}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default withClientRendering(UserResponseForm);
