import React from "react";
import CustomSelect from "~/components/CustomSelect";
import { triggerOptions, eventOptions, TriggerOption } from "../constants";
import { useFormContext } from "react-hook-form";

function Dispatcher() {
  const { register, watch } = useFormContext();
  const triggerType = watch("triggerType");
  return (
    <>
      <div className="mb-8 flex">
        <div className="mr-2 w-4/12">
          <CustomSelect {...register("triggerType")}>
            {triggerOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </CustomSelect>
        </div>
        {triggerType === TriggerOption.USER_PERFORMS_AN_EVENT ? (
          <div className="w-4/12">
            <CustomSelect {...register("triggerEvent")}>
              {eventOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </CustomSelect>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Dispatcher;
