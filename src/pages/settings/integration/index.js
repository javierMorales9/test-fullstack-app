import React from "react";
import TopBar from "~/components/Navigation/TopBar";
import Sidebar from "~/components/Settings/Sidebar";
import { wrapper } from "~/styles/styles.module.css";
import IntegrationBlock from "~/components/Settings/IntegrationBlock";
import styles from "../settings.module.css";

const Integration = () => {
  return (
    <>
      <TopBar active={"settings"} />
      <div className={`${styles.wrapper} ${wrapper}`}>
        <div className={styles.left}>
          <Sidebar active={"integration"} />
        </div>
        <div className={styles.right}>
          <IntegrationBlock />
        </div>
      </div>
    </>
  );
};

export default Integration;
