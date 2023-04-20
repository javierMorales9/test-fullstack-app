import React from "react";
import PropTypes from "prop-types";
import ArrowLeftIcon from "public/images/icons/chevron_left.inline.svg";
import ArrowRightIcon from "public/images/icons/chevron_right.inline.svg";
import styles from "./Pagination.module.css";

const pagesToShow = 11;
const leftPages = Math.ceil(pagesToShow / 2);

const Pagination = ({
  currentPage,
  limit,
  totalCount,
  onPrev,
  onNext,
  onPageClick,
}) => {
  const totalPages = Math.ceil((totalCount || 0) / limit);

  const getPages = () => {
    if (currentPage < leftPages) {
      return Array.from({ length: pagesToShow }, (_, i) => i + 1).slice(
        0,
        totalPages,
      );
    } else if (currentPage > totalPages - (leftPages - 1)) {
      const startPage = totalPages - pagesToShow;
      return Array.from(
        { length: pagesToShow },
        (_, i) => i + 1 + startPage,
      ).slice(-totalPages);
    } else {
      const startPage = currentPage - leftPages;
      return Array.from({ length: pagesToShow }, (_, i) => i + 1 + startPage);
    }
  };

  return (
    <div className={styles.pagination}>
      <span className={styles.count}>
        Showing {(currentPage - 1) * limit + 1} -{" "}
        {Math.min(currentPage * limit, totalCount)} from {totalCount} items
      </span>
      <div className={styles.pages}>
        <button
          type={"button"}
          disabled={currentPage <= 1}
          onClick={onPrev}
          className={styles.actionButton}
        >
          <ArrowLeftIcon className={"mr-2"} />
        </button>
        {getPages().map((p) => (
          <button
            key={p}
            onClick={() => onPageClick(p)}
            className={`${styles.page} ${
              currentPage === p ? styles.active : ""
            }`}
            disabled={currentPage === p}
          >
            {p}
          </button>
        ))}
        <button
          type={"button"}
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className={styles.actionButton}
        >
          <ArrowRightIcon className={"ml-2"} />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  limit: PropTypes.number,
  totalCount: PropTypes.number,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  onPageClick: PropTypes.func,
};

Pagination.defaultProps = {
  currentPage: 0,
  limit: 0,
  totalCount: 0,
};

export default Pagination;
