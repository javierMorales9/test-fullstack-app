import React, { useState, useEffect } from "react";
import hljs from "highlight.js/lib/common";
import styles from "./CodeBlock.module.css";

const CodeBlock = ({ code = "" }) => {
  const lines = (code.match(/\n/g) || []).length + 1;
  return (
    <pre className={styles.codeWrapper}>
      <code
        className={styles.codeBlock}
        dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(code).value }}
      />
      <div className={styles.lines}>
        {Array.from(Array(lines).keys()).map((line) => (
          <span key={line} className={styles.line}>
            {line + 1}
          </span>
        ))}
      </div>
    </pre>
  );
};

export default CodeBlock;
