import React from "react";
import PropTypes from "prop-types";
import styles from "./StatusPill.module.css";

const StatusPill = ({ status }) => {
  return (
    <span className={`${styles.statusPill} ${styles[status] || ""}`}>
      {/*{status === 'active' && 'Activated'}*/}
      {/*{status === 'paused' && 'Paused'}*/}
      {/*{status === 'completed' && 'Completed'}*/}
      {status.split("_").join(" ")}
    </span>
  );
};

StatusPill.propTypes = {
  status: PropTypes.oneOf(["active", "paused", "completed", "in_progress"])
    .isRequired,
};

export default StatusPill;
