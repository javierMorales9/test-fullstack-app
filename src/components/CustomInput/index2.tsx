import React, { forwardRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import EyeIcon from "public/images/icons/eye.inline.svg";
import EyeCrossedIcon from "public/images/icons/eye-crossed.inline.svg";
import styles from "./input.module.css";

function InputInner(
  {
    label,
    variant,
    type,
    error,
    onChange,
    unit,
    onFocus,
    onBlur,
    className,
    weight,
    rootClass,
    helperText,
    icon,
    ...props
  }: {
    label?: string;
    variant?: string;
    type?: string;
    error?: any;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    unit?: string;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
    weight?: string;
    rootClass?: string;
    helperText?: string;
    icon?: React.ReactNode;
  } & React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  ref: React.Ref<HTMLInputElement> | React.Ref<HTMLTextAreaElement>,
) {
  const { value, defaultValue, id } = props;
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValidValue = (v: any) => {
    const type = typeof v;
    switch (type) {
      case "string":
        return !!(v && v.length);
      case "number":
        return true;
      default:
        return !!v;
    }
  };

  useEffect(() => {
    if (ref) {
      // @ts-ignore
      const value = document.getElementsByName(props.name)?.[0]?.value;
      if (value) {
        const isValid = isValidValue(value);
        if (isValid && !hasValue) {
          setHasValue(true);
        }
      }
    }
  }, [ref]);

  const [hasValue, setHasValue] = useState(
    isValidValue(value) || isValidValue(defaultValue),
  );

  const emitEvent = (event: any, callable?: (event: any) => void) => {
    if (callable && typeof callable === "function") {
      callable(event);
    }
  };

  const handleChange = (e: any) => {
    const v = e.currentTarget.value;

    const isValid = isValidValue(v);

    if (isValid && !hasValue) {
      setHasValue(true);
    }
    if (!isValid && hasValue) {
      setHasValue(false);
    }

    emitEvent(e, onChange);
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    emitEvent(e, onFocus);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    emitEvent(e, onBlur);
  };

  const togglePassword = () => {
    setShowPassword((prevCheck) => !prevCheck);
  };

  return (
    <div>
      <div
        // @ts-ignore
        variant={variant}
        // @ts-ignore
        weight={weight}
        className={`${styles.inputWrapper} ${hasValue ? styles.hasValue : ""} ${
          isFocused ? styles.isFocused : ""
        } ${!label ? styles.noLabel : ""} ${rootClass || ""}`}
      >
        {label && (
          <label className={"label"} htmlFor={id}>
            {label}
          </label>
        )}
        {type === "textarea" ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${styles.input} ${className || ""}`}
            {...props}
          />
        ) : (
          <>
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              type={showPassword ? "text" : type}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`${styles.input} ${className || ""} ${
                icon ? styles.hasIcon : ""
              }`}
              {...props}
            />
            {unit && <span className={styles.unit}>{unit}</span>}
            {icon && <div className={styles.iconWrapper}>{icon}</div>}
            {type === "password" && (
              <button
                type={"button"}
                className={`${styles.passwordToggle} ${
                  showPassword ? styles.active : ""
                }`}
                onClick={togglePassword}
              >
                <div className={styles.eyeIcon}>
                  <EyeIcon />
                </div>
                <div className={styles.eyeCrossedIcon}>
                  <EyeCrossedIcon />
                </div>
              </button>
            )}
          </>
        )}
        {helperText && <span>{helperText}</span>}
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

const Input = forwardRef(InputInner);

Input.propTypes = {
  variant: PropTypes.oneOf(["floating", "standard"]),
  weight: PropTypes.oneOf(["bold", "medium", "semi-bold", "regular"]),
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  rootClass: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.node,
  unit: PropTypes.string,
};

Input.defaultProps = {
  variant: "standard",
  weight: "medium",
};

Input.displayName = "Custom Input";

export default Input;
