import React, { useEffect } from "react";
import CustomSelect from "~/components/CustomSelect";
import CustomInput from "~/components/CustomInput/index2";
import Button from "~/components/Button";
import Image from "next/image";
import CloseIcon from "public/images/icons/close.svg";
import styles from "./Conditions.module.css";
import useForm from "~contexts/useFormContext";

//   ["plan", ["=", "!="]],
//   ["subscriptionPrice", ["=", "!=","<", ">","<=", ">="]],
//   ["billingInterval", ["=", "!="]],
//   ["subscriptionAge", ["=", "!=","<", ">","<=", ">="]],
//   ["subscriptionStartDate", ["=", "!=","<", ">","<=", ">="]],
//   ["subscriptionStatus", ["=", "!="]],

const defaultOperator = "Discrete";
const operators = {
  Discrete: [
    { id: 1, label: "is", value: "is" },
    { id: 2, label: "is not", value: "is not" },
  ],
  RangeNumber: [
    { id: 1, label: "less than or equal to", value: "less than or equal to" },
    {
      id: 2,
      label: "greater than or equal to",
      value: "greater than or equal to",
    },
    { id: 3, label: "between", end: true, value: "between" },
    { id: 4, label: "is not between", end: true, value: "is not between" },
  ],
  RangeDate: [
    { id: 1, label: "less than or equal to", value: "less than or equal to" },
    {
      id: 2,
      label: "greater than or equal to",
      value: "greater than or equal to",
    },
    { id: 3, label: "between", end: true, value: "between" },
    { id: 4, label: "is not between", end: true, value: "is not between" },
  ],
};
``;
const Condition = ({ id, removeCondition, currentValue, plans }) => {
  const {
    register,
    unregister,
    setValue,
    formState: { errors },
  } = useForm();

  const fields = [
    {
      id: 1,
      label: "Plan",
      type: "Discrete",
      value: "plan",
      options: plans.map((plan) => ({
        ...plan,
        label: `${plan.name || plan.id} (${plan.price})`,
      })),
    },
    {
      id: 2,
      label: "Subscription Price",
      type: "RangeNumber",
      value: "subscriptionPrice",
      unit: "$",
    },
    {
      id: 3,
      label: "Billing Interval",
      type: "Discrete",
      value: "billingInterval",
      options: [
        { id: "day", label: "Day" },
        { id: "week", label: "Week" },
        { id: "month", label: "Month" },
        { id: "year", label: "Year" },
      ],
    },
    {
      id: 4,
      label: "Subscription Age",
      type: "RangeNumber",
      value: "subscriptionAge",
      unit: "months",
    },
    {
      id: 5,
      label: "Subscription Start Date",
      type: "RangeDate",
      value: "subscriptionStartDate",
    },
    {
      id: 6,
      label: "Subscription Status",
      type: "Discrete",
      value: "subscriptionStatus",
      options: [
        { id: "active", label: "active" },
        { id: "canceled", label: "canceled" },
        { id: "incomplete", label: "incomplete" },
        { id: "incomplete_expired", label: "incomplete_expired" },
        { id: "past_due", label: "past_due" },
        { id: "trialing", label: "trialing" },
        { id: "unpaid", label: "unpaid" },
      ],
    },
  ];

  const currentField = fields.find(
    ({ value }) => value === currentValue?.field,
  );
  const currentOperator = operators[currentField?.type || defaultOperator].find(
    ({ value }) => value === currentValue?.operator,
  );

  useEffect(() => {
    if (!currentOperator?.end) {
      unregister(`conditions.${id}.value2`);
    }
    if (!currentOperator) {
      const operator =
        operators[currentField?.type || defaultOperator][0].value;
      setValue(`conditions.${id}.operator`, operator);
    }
  }, [currentOperator]);

  return (
    <div className={styles.condition}>
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-5">
        <div className={"md:col-span-3"}>
          <CustomSelect
            {...register(`conditions.${id}.field`, { required: true })}
          >
            {fields.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </CustomSelect>
        </div>
        <div className={"md:col-span-2"}>
          <CustomSelect
            {...register(`conditions.${id}.operator`, { required: true })}
          >
            {operators[currentField?.type || defaultOperator].map(
              (operator) => (
                <option key={operator.id} value={operator.value}>
                  {operator.label}
                </option>
              ),
            )}
          </CustomSelect>
        </div>
        <div className={styles.answerInput}>
          {currentField?.type === "Discrete" &&
            (currentField?.options?.length ? (
              <CustomSelect
                error={errors?.conditions?.[id]?.value}
                {...register(`conditions.${id}.value`, { required: true })}
              >
                {currentField?.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </CustomSelect>
            ) : (
              <CustomInput
                error={errors?.conditions?.[id]?.value}
                {...register(`conditions.${id}.value`, { required: true })}
                weight={"semi-bold"}
                unit={currentField?.unit}
                defaultValue={""}
                type={"text"}
              />
            ))}
          {(currentField?.type === "RangeNumber" ||
            currentField?.type === "RangeDate") && (
            <>
              <CustomInput
                weight={"semi-bold"}
                unit={currentField?.unit}
                type={currentField?.type === "RangeNumber" ? "number" : "date"}
                error={errors?.conditions?.[id]?.value}
                {...register(`conditions.${id}.value`, { required: true })}
              />
              {currentOperator?.end && (
                <div className={"mt-3"}>
                  <CustomInput
                    weight={"semi-bold"}
                    unit={currentField?.unit}
                    type={
                      currentField?.type === "RangeNumber" ? "number" : "date"
                    }
                    error={errors?.conditions?.[id]?.value2}
                    {...register(`conditions.${id}.value2`, { required: true })}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Button
        type={"button"}
        variant={"clean"}
        size={"small"}
        className={styles.remove}
        onClick={() => removeCondition(id)}
      >
        <Image src={CloseIcon} />
      </Button>
    </div>
  );
};

export default Condition;
