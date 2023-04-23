import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Button from "~/components/Button";
import styles from "./Card.module.css";

const Card = ({ title, p0, pb0, mb4, children, backTo, className }) => {
  return (
    <div
      className={`${styles.card} ${mb4 ? styles.mb4 : ""} ${
        p0 ? styles.p0 : ""
      } ${pb0 ? styles.pb0 : ""} ${className}`}
    >
      {title && title.length && (
        <h3 className={styles.title}>
          <span>
            {typeof title === "string"
              ? title
              : title.map((t) => (
                  <React.Fragment key={t?.label || t}>
                    {typeof t === "string" ? (
                      t
                    ) : (
                      <Link href={t.href} className={styles.link}>
                        {t.label} >
                      </Link>
                    )}
                  </React.Fragment>
                ))}
          </span>
          {backTo && (
            <Link href={backTo}>
              <Button variant={"outline"}>Go Back</Button>
            </Link>
          )}
        </h3>
      )}
      {children}
    </div>
  );
};

Card.propTypes = {
  p0: PropTypes.bool,
  pb0: PropTypes.bool,
  mb4: PropTypes.bool,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.any),
  ]),
  children: PropTypes.node,
  className: PropTypes.string,
};

Card.defaultProps = {
  className: "",
};

export default Card;
