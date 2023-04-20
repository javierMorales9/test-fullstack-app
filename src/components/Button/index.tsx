import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Loader from "~/components/Loader";
import styles from "./Button.module.css";

function ButtonInner(
  {
    htmlFor,
    children,
    className,
    icon: Icon,
    variant = "primary",
    size,
    align,
    weight,
    loading,
    ...props
  }: {
    htmlFor?: string;
    children?: React.ReactNode;
    className?: string;
    icon?: any;
    variant?: string;
    size?: "small" | "large";
    align?: "left" | "right";
    weight?: "normal";
    loading?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.LabelHTMLAttributes<HTMLLabelElement>,
  ref: React.Ref<HTMLButtonElement>,
) {
  // @ts-nocheck
  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        // @ts-ignore
        variant={variant}
        // @ts-ignore
        variantsize={size}
        className={`${className || ""} ${styles.btn}`}
        {...props}
      >
        <div className={styles.wrapper}>
          {Icon && (
            <span className={styles.icon}>
              {typeof Icon === "object" ? (
                <Image src={Icon} alt={"button icon"} />
              ) : (
                <Icon />
              )}
            </span>
          )}
          {children}
        </div>
      </label>
    );
  }
  return (
    <button
      ref={ref}
      // @ts-ignore
      variant={variant}
      // @ts-ignore
      variantsize={size}
      className={`${className || ""} ${styles.btn} ${
        loading ? styles.loading : ""
      }`}
      {...props}
    >
      {loading && <Loader className={styles.loader} />}
      {/* @ts-ignore */}
      <div className={styles.wrapper} align={align} weight={weight}>
        {Icon && (
          <span className={styles.icon}>
            {typeof Icon === "object" ? (
              <Image src={Icon} alt={"button icon"} />
            ) : (
              <Icon />
            )}
          </span>
        )}
        {children}
      </div>
    </button>
  );
}

const Button = forwardRef(ButtonInner);

Button.displayName = "Button";

Button.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "error",
    "outline",
    "outline-error",
    "outline-primary",
    "clean",
  ]).isRequired,
  size: PropTypes.oneOf(["small", "large"]),
  align: PropTypes.oneOf(["left", "right"]),
  weight: PropTypes.oneOf(["normal"]),
  icon: PropTypes.any,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  variant: "primary",
};

export default Button;
