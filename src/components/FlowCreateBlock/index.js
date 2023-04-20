import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import styles from "./block.module.css";
import Switch from "~/components/Switch";

const Block = forwardRef(
  (
    {
      children,
      title,
      iconWidth,
      icon: Icon,
      className,
      p0,
      enabled,
      onChange,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={styles.block}>
        <div
          className={`${styles.top} ${
            typeof enabled === "boolean" ? (enabled ? "" : styles.disabled) : ""
          }`}
        >
          <span className={styles.icon}>
            {typeof Icon === "object" ? (
              <Image src={Icon} layout="fixed" width={iconWidth} />
            ) : (
              <Icon />
            )}
          </span>
          <h4 className={styles.title}>{title}</h4>
          {typeof enabled === "boolean" && (
            <Switch
              checked={enabled}
              onChange={onChange}
              className={styles.switch}
            />
          )}
        </div>
        {typeof enabled === "boolean" && !enabled ? (
          ""
        ) : (
          <div
            className={`${className || ""} ${styles.bottom} ${
              p0 ? styles.p0 : ""
            }`}
          >
            {children}
          </div>
        )}
      </div>
    );
  },
);

Block.displayName = "Block";

Block.propTypes = {
  title: PropTypes.node.isRequired,
  iconWidth: PropTypes.number,
  icon: PropTypes.any,
  className: PropTypes.string,
  p0: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Block;
