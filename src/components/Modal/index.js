import React, { createContext, useContext } from "react";
import Image from "next/image";
import CloseIcon from "public/images/icons/close.svg";
import styles from "./Modal.module.css";

const ModalContext = createContext({ show: false, onHide: () => {} });

const Modal = ({ show, onHide, children, className = "", ...restProps }) => {
  const handleBackDropClick = () => {
    if (onHide && typeof onHide === "function") onHide();
  };
  return (
    show && (
      <>
        <ModalContext.Provider value={{ show, onHide }}>
          <div onClick={handleBackDropClick} className={styles.modalWrapper}>
            <div onClick={(e) => e.stopPropagation()} className={styles.modal}>
              <div
                className={`${className || ""} ${styles.modalContent}`}
                {...restProps}
              >
                {children}
              </div>
            </div>
          </div>
        </ModalContext.Provider>
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      </>
    )
  );
};

export default Modal;

const ModalHeader = ({ className = "", children, ...restProps }) => {
  const { onHide } = useContext(ModalContext);
  return (
    <div className={`${className || ""} ${styles.header}`} {...restProps}>
      {children}
      <button className={styles.btnClose} onClick={onHide}>
        <Image src={CloseIcon} />
      </button>
    </div>
  );
};
ModalHeader.displayName = "Modal Header";
Modal.Header = ModalHeader;

const ModalBody = ({ className = "", children, ...restProps }) => {
  return (
    <div className={`${className || ""} ${styles.body}`} {...restProps}>
      {children}
    </div>
  );
};
ModalBody.displayName = "Modal Body";
Modal.Body = ModalBody;
