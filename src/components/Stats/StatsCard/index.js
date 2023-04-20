import React from "react";
import PropTypes from "prop-types";
import ArrowIcon from "public/images/icons/graph_arrow.inline.svg";
import styles from "./StatsCard.module.css";

const StatsCard = ({
  variant,
  icon: Icon,
  title,
  value,
  info,
  subInfo,
  change,
}) => {
  return (
    <div variant={variant} className={styles.card}>
      <h4 className={styles.title}>
        <div className={styles.iconWrapper}>
          <Icon />
        </div>
        {title}
      </h4>
      <p className={styles.value}>{value}</p>
      {/*<div className={styles.bottom} change={change}>*/}
      {/*  <ArrowIcon />*/}
      {/*  {info} {subInfo && <span>{subInfo}</span>}*/}
      {/*</div>*/}
    </div>
  );
};

StatsCard.propTypes = {
  variant: PropTypes.oneOf(["primary"]),
  icon: PropTypes.any,
  title: PropTypes.string,
  value: PropTypes.string,
  info: PropTypes.string,
  subInfo: PropTypes.string,
  change: PropTypes.oneOf(["positive", "negative"]),
};

export default StatsCard;
