import React, { useMemo } from "react";
import CustomSelect from "~/components/CustomSelect";
import CustomInput from "~/components/CustomInput/index2";
import { useFormContext, useWatch } from "react-hook-form";
import fieldHolder, {
  getFieldOptions,
  getFieldType,
  getValidatorOptions,
} from "~/utils/fields";
import withClientRendering from "~/HOC/withClientRendering";
import { ConditionInputType } from "./options";

function UserPropertyForm({ index, fieldName }) {
  const { register, getValues, setValue } = useFormContext();
  setValue(`${fieldName}.${index}.inputType`, ConditionInputType.USER_PROPERTY);
  const condition = getValues()[`${fieldName}`][index];
  const conditionSelector = `${fieldName}.${index}`;
  const field = useWatch({
    name: `${conditionSelector}.propertyKey`,
    defaultValue: condition.propertyKey,
  });
  const validator = useWatch({
    name: `${conditionSelector}.stringValidator`,
    defaultValue: condition.stringValidator,
  });
  const fieldType = useMemo(
    () => getFieldType(fieldHolder.userFields, field),
    [field],
  );
  const validators = useMemo(() => getValidatorOptions(fieldType), [fieldType]);

  const checkIfHasLastInput = () => {
    const validatorObj = validators.find((el) => validator === el.id);
    return !!validatorObj?.doNotRequireValue;
  };

  return (
    <div className="flex">
      <div className="mr-2 w-2/12">
        <CustomSelect {...register(`${fieldName}.${index}.propertyKey`)}>
          <option value={""} selected hidden disabled>
            Select a User Property
          </option>
          {getFieldOptions(fieldHolder.userFields).map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
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
            type={fieldType}
            {...register(`${fieldName}.${index}.value`)}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default withClientRendering(UserPropertyForm);
