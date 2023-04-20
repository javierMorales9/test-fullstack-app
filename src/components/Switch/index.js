import React from "react";
import styles from "./switch.module.css";
const Switch = ({ ...props }) => {
  return (
    <div className={styles.switch}>
      <input type="checkbox" {...props} />
    </div>
  );
};

export default Switch;
