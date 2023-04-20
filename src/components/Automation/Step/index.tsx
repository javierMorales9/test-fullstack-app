import React, { useEffect, useReducer, useRef } from "react";
import Icon from "~/components/Icon";
import styles from "./index.module.css";
import CaretRight from "public/images/icons/caret_right.svg";

const ACTIONS = {
  OPEN: "open",
  CLOSE: "close",
  RESIZE: "resize",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.OPEN:
      return { isOpen: true, height: action.payload.height };
    case ACTIONS.CLOSE:
      return { isOpen: false, height: 0 };
    case ACTIONS.RESIZE:
      return { ...state, height: state.isOpen ? action.payload.height : 0 };
    default:
      return state;
  }
}

function Step({ IconSource, stepMessage, children }) {
  const bodyRef = useRef<HTMLDivElement>();
  const [{ isOpen, height }, dispatch] = useReducer(reducer, {
    isOpen: false,
    height: 0,
  });

  function getElementHeight() {
    if (bodyRef.current) return bodyRef.current.scrollHeight;
    return 0;
  }

  useEffect(() => {
    const accordionBody: HTMLElement = bodyRef.current
      .firstChild as HTMLElement;
    const resizeObserver = new ResizeObserver(() => {
      dispatch({
        type: ACTIONS.RESIZE,
        payload: { height: getElementHeight() },
      });
    });
    resizeObserver.observe(accordionBody);
    return () => {
      resizeObserver.unobserve(accordionBody);
    };
  }, []);

  function openAccordion() {
    dispatch({ type: ACTIONS.OPEN, payload: { height: getElementHeight() } });
  }

  function closeAccordion() {
    dispatch({ type: ACTIONS.CLOSE });
  }

  return (
    <div className={styles.accordion}>
      <div
        className={styles.accordionHeader}
        onClick={isOpen ? closeAccordion : openAccordion}
      >
        <Icon IconSource={IconSource} DecorationClass={styles.icon} />
        <span className={styles.text}>{stepMessage}</span>
        <Icon
          IconSource={CaretRight}
          DecorationClass={`${styles.caret} ${isOpen ? "rotate-90" : ""}`}
        />
      </div>
      <div
        className={`${styles.accordionBody}`}
        style={{
          maxHeight: `${height}px`,
        }}
        ref={bodyRef}
      >
        <div className="m-8">{children}</div>
      </div>
    </div>
  );
}

export default Step;
