import React from "react";
import TopBar from "~/components/Navigation/TopBar";
import Sidebar from "~/components/Settings/Sidebar";
import HelpBlock from "~/components/Settings/HelpBlock";
import { wrapper } from "~/styles/styles.module.css";
import styles from "../settings.module.css";

const Help = () => {
  return (
    <>
      <TopBar active={"settings"} />
      <div className={`${styles.wrapper} ${wrapper}`}>
        <div className={styles.left}>
          <Sidebar active={"help"} />
        </div>
        <div className={styles.right}>
          <HelpBlock />
        </div>
      </div>
    </>
  );
};

export default Help;
