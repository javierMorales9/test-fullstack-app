import React, { useMemo } from "react";
import CustomSelect from "~/components/CustomSelect";
import CustomInput from "~/components/CustomInput/index2";
import { useFormContext } from "react-hook-form";
import fieldHolder, {
  getValidatorOptions,
  getFieldOptions,
  getFieldType,
} from "~/utils/fields";
import withClientRendering from "~/HOC/withClientRendering";

function EventPropertyForm({ index, fieldName }) {
  const fieldRegisterName = `${fieldName}.${index}`;
  const {
    register,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();
  const field = watch(`${fieldName}.${index}.property`) || ""; // TODO: Remove after inserting the default values
  const fieldType = useMemo(
    () => getFieldType(fieldHolder.eventFields, field),
    [field],
  );
  return (
    <div className="flex">
      <div className="mr-2 w-4/12">
        <CustomSelect {...register(`${fieldRegisterName}.property`)}>
          <option disabled value="" hidden>
            Select an Event Property
          </option>
          {getFieldOptions(fieldHolder.eventFields).map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </CustomSelect>
      </div>
      <div className="mr-2 w-2/12">
        <CustomSelect {...register(`${fieldRegisterName}.operand`)}>
          <option value="" hidden disabled>
            Select a Validator
          </option>
          {getValidatorOptions(fieldType).map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </CustomSelect>
      </div>
      <div className="mr-6 w-6/12">
        <CustomInput {...register(`${fieldRegisterName}.value`)} />
      </div>
    </div>
  );
}

export default withClientRendering(EventPropertyForm);
