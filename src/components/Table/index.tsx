import React from "react";
import styles from "./index.module.css";

function Table({ children }: { children: React.ReactNode }) {
  return <table className={styles.table}>{children}</table>;
}

function TableHead({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>;
}

function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

function RowActionButton({ children }: { children: React.ReactNode }) {
  return <div className={styles.actionButtons}>{children}</div>;
}

Table.Head = TableHead;
Table.Body = TableBody;
Table.RowActionButtons = RowActionButton;

export default Table;
