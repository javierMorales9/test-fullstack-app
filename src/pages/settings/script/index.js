import React from "react";
import TopBar from "~/components/Navigation/TopBar";
import Sidebar from "~/components/Settings/Sidebar";
import Integration from "~/components/FlowDetail/Integration";
import { wrapper } from "~/styles/styles.module.css";
import styles from "../settings.module.css";

const Script = () => {
  return (
    <>
      <TopBar active={"settings"} />
      <div className={`${styles.wrapper} ${wrapper}`}>
        <div className={styles.left}>
          <Sidebar active={"script"} />
        </div>
        <div className={styles.right}>
          <h2 className={styles.title}>Integrate Flow</h2>
          <Integration />
        </div>
      </div>
    </>
  );
};

export default Script;
