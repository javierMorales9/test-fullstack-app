import React, { useEffect, useRef, useState } from "react";
import CustomSelect from "~/components/CustomSelect";
import CustomInput from "~/components/CustomInput/index2";
import {
  Occurrence,
  occurrenceOperators,
  quantityOptions,
  timeOperators,
} from "~/components/Automation/constants";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { ConditionInputType } from "./options";
import ConditionGroup from "./ConditionGroup";
import Image from "next/image";
import CloseIcon from "public/images/icons/close.svg";
import EventPropertyForm from "./EventPropertyForm";
import { useUpdateEffect } from "usehooks-ts";
import withClientRendering from "~/HOC/withClientRendering";
import { defaultEventPropertyObject } from "./schemas";
import { getEventsAPI } from "../../../apis/events";

function PerformedEventForm({ index, fieldName }) {
  const { register, watch, control, setValue, getValues } = useFormContext();
  const [events, setEvents] = useState([]);
  useEffect(() => {
    getEventsAPI().then((res) => setEvents(res.success()));
  }, []);

  const conditionSelector = `${fieldName}.${index}`;
  const eventCondition = getValues()[`${fieldName}`][index];
  setValue(
    `${conditionSelector}.inputType`,
    ConditionInputType.USER_EVENT_INPUT,
  );
  const occurrenceValidatorType = watch(
    `${conditionSelector}.occurrenceValidatorType`,
  );
  const eventPropertyFieldName = `${conditionSelector}.children`;
  register(`${conditionSelector}.hasFilterGroup`);
  const [isFilterGroup, setIsFilterGroup] = useState(
    eventCondition?.hasFilterGroup || false,
  );
  const fieldArrayMethods = useFieldArray({
    control,
    name: eventPropertyFieldName,
  });

  useUpdateEffect(
    () => setValue(`${conditionSelector}.hasFilterGroup`, isFilterGroup),
    [isFilterGroup],
  );

  const event = useWatch({
    name: `${conditionSelector}.event`,
    defaultValue: eventCondition?.event,
  });
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.value = event;
  }, []);

  return (
    <div>
      <div className="flex">
        <div className="mr-2 w-2/12">
          <CustomSelect ref={ref} {...register(`${conditionSelector}.event`)}>
            <option hidden disabled>
              Select an Event
            </option>
            {events.map((opt, id) => {
              return (
                <option key={id} value={opt.name}>
                  {opt.name}
                </option>
              );
            })}
          </CustomSelect>
        </div>
        <div className="mr-2 w-1/12">
          <CustomSelect
            {...register(`${conditionSelector}.timesValidatorType`)}
          >
            {quantityOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </CustomSelect>
        </div>
        <div className="mr-2 flex w-[10%] items-center">
          <CustomInput
            defaultValue={0}
            type="number"
            {...register(`${conditionSelector}.timesValidatorValue`, {
              valueAsNumber: true,
            })}
          />
          <span style={{ marginLeft: "0.18rem" }}>times</span>
        </div>
        <div className="w-2/12">
          <CustomSelect
            {...register(`${conditionSelector}.occurrenceValidatorType`)}
          >
            {occurrenceOperators.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </CustomSelect>
        </div>

        <div className="mr-6 w-4/12">
          {occurrenceValidatorType === Occurrence.WITHIN_LAST && (
            <div style={{ display: "flex" }}>
              <div className="w-[400px]" style={{ flex: 2, marginLeft: "1em" }}>
                <CustomInput
                  type={"number"}
                  {...register(`${conditionSelector}.withinLastValue`, {
                    shouldUnregister: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div style={{ flex: 10, marginLeft: "1em", marginRight: "1em" }}>
                <CustomSelect
                  {...register(`${conditionSelector}.withinLastOperator`, {
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
          )}
          {occurrenceValidatorType === Occurrence.SINCE && (
            <div
              style={{ marginLeft: "1em", marginRight: "1em", width: "50%" }}
            >
              <CustomInput
                type={"date"}
                {...register(`${conditionSelector}.since`, {
                  shouldUnregister: true,
                })}
              />
            </div>
          )}
          {occurrenceValidatorType === Occurrence.BETWEEN && (
            <div
              style={{ display: "flex", marginLeft: "1em", marginRight: "1em" }}
            >
              <div style={{ flex: 1 }}>
                <CustomInput
                  type={"date"}
                  {...register(`${conditionSelector}.startDate`, {
                    shouldUnregister: true,
                  })}
                />
              </div>
              <div style={{ flex: 1, marginLeft: "1em" }}>
                <CustomInput
                  type={"date"}
                  {...register(`${conditionSelector}.endDate`, {
                    shouldUnregister: true,
                  })}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="ml-4 border-l-2 border-black px-4 py-4">
        <ConditionGroup
          isFilterGroup={isFilterGroup}
          addCondition={() => {
            fieldArrayMethods.append(defaultEventPropertyObject());
          }}
          addConditionGroup={() => {
            setIsFilterGroup(true);
            fieldArrayMethods.append(defaultEventPropertyObject());
          }}
          fieldName={`${conditionSelector}.children`}
          fields={fieldArrayMethods.fields}
        >
          {fieldArrayMethods.fields.map((field, index) => (
            <div key={field.id} className="mb-2 flex justify-items-center">
              <div className="flex-1">
                <EventPropertyForm
                  index={index}
                  fieldName={eventPropertyFieldName}
                />
              </div>
              <button
                style={{
                  color: "#2e2c34",
                }}
                className="align-top"
                onClick={() => {
                  if (fieldArrayMethods.fields.length === 1) {
                    setIsFilterGroup(false);
                  }
                  fieldArrayMethods.remove(index);
                }}
              >
                <Image src={CloseIcon} alt="Remove Condition" />
              </button>
            </div>
          ))}
        </ConditionGroup>
      </div>
    </div>
  );
}

export default withClientRendering(PerformedEventForm);
