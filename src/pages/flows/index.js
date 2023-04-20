import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import withAuth from "~/HOC/withAuth";
import router from "next/router";
import Link from "next/link";
import routes from "~/utils/routes";
import Loader from "~/components/Loader";
import TopBar from "~/components/Navigation/TopBar";
import DotIcon from "/public/images/icons/dot.inline.svg";
import addIcon from "/public/images/icons/add.svg";
import Button from "~/components/Button";
import { getFlowsAPI } from "~/apis/flow";
import useUser from "~/contexts/userContext";
import styles from "./flows.module.css";

const FlowsList = dynamic(() => import("~/components/FlowsList"), {
  ssr: false,
});

const Flows = () => {
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [flows, setFlows] = useState([]);
  const stats = [
    {
      id: 0,
      iconClass: "fill-error",
      count: flows.filter((flow) => !flow.activated).length,
      title: "Paused",
    },
    {
      id: 1,
      iconClass: "fill-success-2",
      count: flows.filter((flow) => flow.activated).length,
      title: "Activated",
    },
  ];
  const fetchFlows = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }
    const response = await getFlowsAPI();
    if (response.isSuccess()) {
      setFlows(response.success());
    }
    if (showLoader) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFlows();
  }, []);

  const CreateFlowComponent = () => (
    <div className={"flex-grow py-20"}>
      <div className={styles.createNew}>
        <div className={styles.content}>
          <h4 className={styles.title}>Create your first flow</h4>
          <p>
            Configure your first Clickout in a few minutes and integrate it in
            your platform with a simple 10 lines script
          </p>
          <Button
            type={"button"}
            onClick={() => router.push(routes.createFlow)}
            size={"large"}
            className={styles.btnCreate}
            icon={addIcon}
          >
            Create new
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TopBar active={"flows"} />
      <div className={styles.info}>
        <h2 className={styles.userName}>👋🏼 Hello {userData?.firstName}</h2>
        <p>Create your first flow now and start saving clients</p>
        <div className={styles.stats}>
          {stats.map(({ id, iconClass, count, title }) => (
            <div key={id} className={styles.card}>
              <span className={styles.icon}>
                <DotIcon className={iconClass} />
              </span>
              <span className={"text-black"}>{count}</span> <span>{title}</span>
            </div>
          ))}
        </div>
      </div>
      {loading ? (
        <div className={"flex-grow py-20"}>
          <Loader />
        </div>
      ) : (
        <>
          {flows && flows.length ? (
            <div className={styles.flows}>
              <Link href={routes.createFlow}>
                <a>
                  <Button
                    size={"large"}
                    className={styles.btnCreate}
                    icon={addIcon}
                  >
                    Create new
                  </Button>
                </a>
              </Link>
              <FlowsList fetchFlows={fetchFlows} flows={flows} />
            </div>
          ) : (
            <CreateFlowComponent />
          )}
        </>
      )}
    </>
  );
};

Flows.propTypes = {};

export default withAuth(Flows);
