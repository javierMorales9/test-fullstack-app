import React, { useState } from "react";
import ConditionGroup from "../Condition/ConditionGroup";
import Dispatcher from "../Dispatcher";
import UserPropertyForm from "../Condition/UserPropertyForm";
import { TriggerOption } from "../constants";
import styles from "./index.module.css";
import Image from "next/image";
import CloseIcon from "public/images/icons/close.svg";
import PerformedEventForm from "../Condition/PerformedEventForm";
import Button from "~/components/Button";
import Loader from "~/components/Loader";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  serializeEventPerformedCondition,
  serializeEventPerformedGroup,
  serializeUserPropertyCondition,
  serializeUserPropertyGroup,
} from "../Condition/utils";
import {
  defaultPerformedEventCondition,
  defaultUserPropertyObject,
} from "../Condition/schemas";

import { TriggerSchema } from "../Condition/schemas";
import { useBoolean } from "usehooks-ts";
import classnames from "classnames";

function Trigger({ onSubmit, initial }) {
  const { value: loading, setTrue, setFalse } = useBoolean(false);

  const methods = useForm({
    resolver: zodResolver(TriggerSchema),
    defaultValues: {
      triggerEvent: "",
      triggerType: initial?.triggerType || TriggerOption.USER_PERFORMS_AN_EVENT,
      userPropertyConditionChaining:
        initial?.userPropertyConditionChaining || "any",
      eventPerformedConditionChaining:
        initial?.eventPerformedConditionChaining || "any",
      userPropertyCondition: initial?.userPropertyCondition || [],
      eventPerformedCondition: initial?.eventPerformedCondition || [],
    },
  });
  const { errors } = methods.formState;
  const userPropertyFields = useFieldArray({
    control: methods.control,
    name: "userPropertyCondition",
  });

  const eventPerformedFields = useFieldArray({
    control: methods.control,
    name: "eventPerformedCondition",
  });

  const [isUserFilterGroup, setIsUserFilterGroup] = useState(
    initial?.isUserFilterGroup || false,
  );
  const [isEventFilterGroup, setIsEventFilterGroup] = useState(
    initial?.isEventFilterGroup || false,
  );

  const triggerType = methods.watch("triggerType");

  return (
    <FormProvider {...{ ...methods, condition: initial }}>
      <Dispatcher />
      {triggerType === TriggerOption.USER_MATCHES_ACONDITION && (
        <ConditionGroup
          fieldName="userPropertyCondition"
          fields={userPropertyFields.fields}
          isFilterGroup={isUserFilterGroup}
          addCondition={() => {
            const newObj = defaultUserPropertyObject();
            userPropertyFields.append(newObj);
          }}
          addConditionGroup={() => {
            setIsUserFilterGroup(true);
            const newObj = defaultUserPropertyObject();
            userPropertyFields.append(newObj);
          }}
        >
          {userPropertyFields.fields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <div className={styles.conditionContainer}>
                <UserPropertyForm
                  index={index}
                  fieldName={"userPropertyCondition"}
                />
                <button
                  className={`${styles.closeBtn}`}
                  onClick={() => {
                    if (userPropertyFields.fields.length === 1) {
                      setIsUserFilterGroup(false);
                    }
                    userPropertyFields.remove(index);
                  }}
                >
                  <Image src={CloseIcon} alt="Remove Condition" />
                </button>
              </div>
            </div>
          ))}
        </ConditionGroup>
      )}
      {triggerType === TriggerOption.USER_PERFORMS_AN_EVENT && (
        <ConditionGroup
          isFilterGroup={isEventFilterGroup}
          addCondition={() => {
            eventPerformedFields.append(defaultPerformedEventCondition());
          }}
          addConditionGroup={() => {
            setIsEventFilterGroup(true);
            eventPerformedFields.append(defaultPerformedEventCondition());
          }}
          fieldName="eventPerformedCondition"
          fields={eventPerformedFields.fields}
        >
          {eventPerformedFields.fields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <div className="flex justify-items-center">
                <div className="flex-1">
                  <PerformedEventForm
                    index={index}
                    fieldName={"eventPerformedCondition"}
                  />
                </div>
                <button
                  className="mt-3 self-start"
                  style={{
                    color: "#2e2c34",
                  }}
                  onClick={() => {
                    if (eventPerformedFields.fields.length === 1) {
                      setIsEventFilterGroup(false);
                    }
                    eventPerformedFields.remove(index);
                  }}
                >
                  <Image src={CloseIcon} alt="Remove Condition" />
                </button>
              </div>
            </div>
          ))}
        </ConditionGroup>
      )}
      {/*{errors?.condition?.message && (*/}
      {/*  <p className="mt-6 text-error">{errors.condition.message}</p>*/}
      {/*)}*/}
      <Button
        onClick={methods.handleSubmit((data) => {
          setTrue();
          const obj = {
            dispatcher: {
              event: "",
              type: data.triggerType,
            },
            condition: {},
          };

          if (data.triggerType === TriggerOption.USER_PERFORMS_AN_EVENT)
            obj.dispatcher.event = data.triggerEvent;

          if (data.triggerType === TriggerOption.USER_MATCHES_ACONDITION)
            if (isUserFilterGroup) {
              obj.condition = serializeUserPropertyGroup(data);
            } else {
              obj.condition = serializeUserPropertyCondition(
                data.userPropertyCondition[0],
              );
            }
          else if (data.triggerType === TriggerOption.USER_PERFORMS_AN_EVENT) {
            if (isEventFilterGroup)
              obj.condition = serializeEventPerformedGroup(data);
            else {
              obj.condition = serializeEventPerformedCondition(
                data.eventPerformedCondition[0],
              );
            }
          }
          onSubmit(obj).then(() => {
            setFalse();
          });
        })}
        className={classnames("mt-6", styles.btnWithLoader)}
        disabled={loading}
      >
        {loading ? <Loader small /> : "Save"}
      </Button>
    </FormProvider>
  );
}

export default Trigger;
