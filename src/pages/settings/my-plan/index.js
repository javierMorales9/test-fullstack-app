import React from "react";
import TopBar from "~/components/Navigation/TopBar";
import Sidebar from "~/components/Settings/Sidebar";
import MyPlanBlock from "~/components/Settings/MyPlanBlock";
import { wrapper } from "~/styles/styles.module.css";
import styles from "../settings.module.css";

const MyPlan = () => {
  return (
    <>
      <TopBar active={"settings"} />
      <div className={`${styles.wrapper} ${wrapper}`}>
        <div className={styles.left}>
          <Sidebar active={"plan"} />
        </div>
        <div className={styles.right}>
          <MyPlanBlock />
        </div>
      </div>
    </>
  );
};

export default MyPlan;
