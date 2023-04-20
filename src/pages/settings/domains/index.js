import React from "react";
import TopBar from "~/components/Navigation/TopBar";
import { wrapper } from "~/styles/styles.module.css";
import Sidebar from "~/components/Settings/Sidebar";
import styles from "../settings.module.css";
import DomainsBlock from "~/components/Settings/ConfigurationBlock/DomainsBlock";

const Domains = () => {
  return (
    <>
      <TopBar active={"settings"} />
      <div className={`${styles.wrapper} ${wrapper}`}>
        <div className={styles.left}>
          <Sidebar active={"configuration"} />
        </div>
        <div className={styles.right}>
          <DomainsBlock defaultValues={{}} />
        </div>
      </div>
    </>
  );
};

export default Domains;
