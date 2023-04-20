import React from "react";
import TopBar from "~/components/Navigation/TopBar";
import Sidebar from "~/components/Settings/Sidebar";
import ConfigurationBlock from "~/components/Settings/ConfigurationBlock";
import { wrapper } from "~/styles/styles.module.css";
import styles from "./settings.module.css";

const Settings = ({}) => {
  return (
    <>
      <TopBar active={"settings"} />
      <div className={`${styles.wrapper} ${wrapper}`}>
        <div className={styles.left}>
          <Sidebar active={"configuration"} />
        </div>
        <div className={styles.right}>
          <ConfigurationBlock />
        </div>
      </div>
    </>
  );
};

export default Settings;
