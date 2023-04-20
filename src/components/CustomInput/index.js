import React, {
  forwardRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import EyeIcon from "public/images/icons/eye.inline.svg";
import EyeCrossedIcon from "public/images/icons/eye-crossed.inline.svg";
import styles from "./input.module.css";

const Index = forwardRef(
  (
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
    },
    ref,
  ) => {
    const { value, defaultValue, id } = props;
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isValidValue = (v) => {
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
      !!(isValidValue(value) || isValidValue(defaultValue)),
    );

    const emitEvent = (event, callable) => {
      if (callable && typeof callable === "function") {
        callable(event);
      }
    };

    const handleChange = (e) => {
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

    const handleFocus = (e) => {
      setIsFocused(true);
      emitEvent(e, onFocus);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      emitEvent(e, onBlur);
    };

    const togglePassword = () => {
      setShowPassword((prevCheck) => !prevCheck);
    };

    const TextArea = useCallback(() => {
      return (
        <textarea
          ref={ref}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${styles.input} ${className || ""}`}
          {...props}
        />
      );
    }, []);

    const Text = useCallback(() => {
      return (
        <>
          <input
            ref={ref}
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
      );
    }, []);

    const Number = useCallback(() => {
      return (
        <input
          ref={ref}
          type={"number"}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${styles.input} ${className || ""} ${
            icon ? styles.hasIcon : ""
          }`}
          {...props}
        />
      );
    }, []);

    const Date = useCallback(() => {
      return (
        <input
          ref={ref}
          type={"date"}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${styles.input} ${className || ""} ${
            icon ? styles.hasIcon : ""
          }`}
          {...props}
        />
      );
    }, []);

    return (
      <div>
        <div
          variant={variant}
          weight={weight}
          className={`${styles.inputWrapper} ${
            hasValue ? styles.hasValue : ""
          } ${isFocused ? styles.isFocused : ""} ${
            !label ? styles.noLabel : ""
          } ${rootClass || ""}`}
        >
          {label && (
            <label className={"label"} htmlFor={id}>
              {label}
            </label>
          )}
          {type === "textarea" ? (
            <TextArea />
          ) : type === "text" || type === "string" ? (
            <Text />
          ) : type === "number" ? (
            <Number />
          ) : type === "date" ? (
            <Date />
          ) : (
            <Text />
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
  },
);

Index.propTypes = {
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

Index.defaultProps = {
  variant: "standard",
  weight: "medium",
};

Index.displayName = "Custom Input";

export default Index;
