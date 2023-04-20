import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import styles from "./select.module.css";
import CaretIcon from "public/images/icons/caret.inline.svg";

function SelectInner(
  {
    label,
    error,
    onChange,
    className,
    children,
    ...props
  }: {
    label?: any;
    error?: any;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    children?: React.ReactNode;
  } & React.SelectHTMLAttributes<HTMLSelectElement>,
  ref: React.Ref<HTMLSelectElement>,
) {
  const { id } = props;

  const emitEvent = (event: any, callable?: (event: any) => void) => {
    if (callable && typeof callable === "function") {
      callable(event);
    }
  };

  const handleChange = (e: any) => {
    emitEvent(e, onChange);
  };

  return (
    <div className={`${styles.selectWrapper} ${!label ? styles.noLabel : ""}`}>
      {label && (
        <label className={"label"} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={"relative"}>
        <select
          ref={ref}
          className={`${className || ""} ${styles.select}`}
          onChange={handleChange}
          {...props}
        >
          {children}
        </select>
        <span className={styles.caret}>
          <CaretIcon />
        </span>
      </div>
      {error && (
        <span className={styles.error}>
          {typeof error === "string"
            ? error
            : error?.message || "This field is required"}
        </span>
      )}
    </div>
  );
}

const Select = forwardRef(SelectInner);

Select.propTypes = {
  label: PropTypes.node,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

Select.displayName = "Custom Seelect";

export default Select;
