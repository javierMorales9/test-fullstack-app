import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ChromePicker } from "react-color";
import CaretIcon from "~/public/images/icons/caret.inline.svg";
import styles from "./ColorPicker.module.css";
import {
  select as selectStyles,
  caret,
} from "~/components/CustomSelect/select.module.css";

const ColorPicker = ({ label, onChange, name, defaultValue }) => {
  const randomColor =
    defaultValue ||
    `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  const [color, setColor] = useState(randomColor);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (onChange && typeof onChange === "function") {
      onChange(getHexColor(), name);
    }
  }, [color]);

  const getHexColor = () => {
    if (typeof color === "string") {
      return color;
    }
    let r = color.r.toString(16);
    let g = color.g.toString(16);
    let b = color.b.toString(16);
    let a = Math.round(color.a * 255).toString(16);

    if (r.length === 1) r = "0" + r;
    if (g.length === 1) g = "0" + g;
    if (b.length === 1) b = "0" + b;
    if (a.length === 1) a = "0" + a;

    if (a === "ff") {
      return "#" + r + g + b;
    }

    return "#" + r + g + b + a;
  };
  const togglePicker = () => {
    setShowPicker((prevState) => !prevState);
  };

  const closePicker = () => {
    setShowPicker(false);
  };

  return (
    <div className={"relative"}>
      <label className={"label"}>{label}</label>
      <button type={"button"} className={selectStyles} onClick={togglePicker}>
        <span className={styles.transparentBg}>
          <span
            style={{ backgroundColor: getHexColor() }}
            className={styles.color}
          />
        </span>
        {getHexColor().toUpperCase()}
        <span className={caret}>
          <CaretIcon />
        </span>
      </button>
      {showPicker && (
        <div className={styles.pickerWrapper}>
          <div
            role={"button"}
            className={styles.overlay}
            onClick={closePicker}
          />
          <ChromePicker
            name={"buttonPrimary"}
            color={color}
            onChange={(c) => {
              setColor(c.rgb);
            }}
          />
        </div>
      )}
    </div>
  );
};

ColorPicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export default ColorPicker;
