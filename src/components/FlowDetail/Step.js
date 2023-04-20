import React, { useState } from "react";
import CodeBlock from "~/components/CodeBlock";
import Button from "~/components/Button";
import styles from "./Step.module.css";

const tabs = [
  // { id: '0', tab: 'react', label: 'React' },
  { id: "1", tab: "js", label: "Javascript" },
  // { id: '2', tab: 'node', label: 'Node' },
  // { id: '3', tab: 'java', label: 'Java' },
];

const Step = ({ title, Description, code }) => {
  const [copyStatus, setCopyStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("js");

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopyStatus(true);
  };

  return (
    <div className={styles.step}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>
        <Description />
      </p>
      <div className={"tabs mt-12"}>
        {tabs.map(({ id, tab, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(tab)}
            type={"button"}
            className={`tab ${tab === activeTab ? "active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={"my-8"}>
        <CodeBlock code={code} />
      </div>
      <div className={styles.btnCopy}>
        <Button
          variant={"primary"}
          type={"button"}
          size={"large"}
          onClick={handleCopyCode}
        >
          {copyStatus ? "Code Copied!" : "Copy Code"}
        </Button>
      </div>
    </div>
  );
};

export default Step;
