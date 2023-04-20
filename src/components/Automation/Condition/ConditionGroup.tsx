import React from "react";
import { useFormContext } from "react-hook-form";
import styles from "./ConditionGroup.module.css";
import classnames from "classnames";
function ConditionGroup({
  children,
  addCondition,
  addConditionGroup,
  isFilterGroup,
  fieldName,
  fields,
}) {
  const { register, watch } = useFormContext();
  const chaining = watch(`${fieldName}Chaining`);
  return (
    <div>
      <div className={isFilterGroup ? "mb-4 flex" : "hidden"}>
        <label
          className={classnames(styles.chainButton, {
            [`${styles.selected}`]: chaining === "all",
          })}
        >
          <input
            {...register(`${fieldName}Chaining`)}
            type="radio"
            value="all"
          />
          All of the conditions below
        </label>
        <label
          className={classnames(styles.chainButton, {
            [`${styles.selected}`]: chaining === "any",
          })}
        >
          <input
            {...register(`${fieldName}Chaining`)}
            type="radio"
            value="any"
          />
          Any of the conditions below
        </label>
      </div>

      <div>{children}</div>
      <div
        className={`${
          // !isFilterGroup && fields.length !== 0 ? 'hidden' : 'flex'
          isFilterGroup || fields.length === 0 ? "flex" : "hidden"
        } pl-0`}
      >
        <button
          className={`${styles.addButton} mr-4`}
          type="button"
          onClick={addCondition}
        >
          + Add Condition
        </button>
        <button
          className={`${!isFilterGroup ? styles.addButton : "hidden"}`}
          onClick={addConditionGroup}
          type="button"
        >
          + Add group
        </button>
      </div>
    </div>
  );
}

export default ConditionGroup;
