import React, { useState } from "react";
import MinusIcon from "public/images/icons/minus.inline.svg";
import PlusIcon from "public/images/icons/plus.inline.svg";
import { title as titleCss } from "~/components/Settings/settings.module.css";
import styles from "./Collapse.module.css";

const Collapse = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <h4 onClick={toggleCollapse} className={`${styles.title} ${titleCss}`}>
        {title}
        <button
          type={"button"}
          className={`${styles.button} ${isOpen ? styles.open : ""}`}
        >
          <MinusIcon className={styles.minus} />
          <PlusIcon className={styles.plus} />
        </button>
      </h4>
      {isOpen && (
        <div className={styles.wrapper}>
          <div>{children}</div>
        </div>
      )}
    </>
  );
};

export default Collapse;
