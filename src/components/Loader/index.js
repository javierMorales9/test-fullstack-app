import React from "react";
import PropTypes from "prop-types";
import SpinIcon from "public/images/icons/spinner.inline.svg";
import styles from "./Loader.module.css";
import classnames from "classnames";

const Loader = ({ fullScreen, relative, className, small }) => (
  <div
    className={classnames(
      className,
      styles.wrapper,
      {
        [`${styles.fullScreen}`]: fullScreen,
      },
      {
        [`${styles.relative}`]: relative,
      },
      {
        [`${styles.small}`]: small,
      },
    )}
  >
    <SpinIcon />
  </div>
);

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  relative: PropTypes.bool,
  small: PropTypes.bool,
};

Loader.defaultProps = {
  fullScreen: false,
  relative: false,
  className: "",
  small: false,
};

export default Loader;
