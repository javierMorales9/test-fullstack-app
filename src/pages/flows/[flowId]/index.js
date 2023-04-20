import React, { useEffect, useState } from "react";
import Link from "next/link";
import routes from "~/utils/routes";
import withAuth from "~/HOC/withAuth";
import { useRouter } from "next/router";
import Loader from "~/components/Loader";
import TopBar from "~/components/Navigation/TopBar";
import ChartIcon from "public/images/icons/chart.inline.svg";
import EditIcon from "public/images/icons/edit.svg";
import PauseIcon from "public/images/icons/pause-black.svg";
import EyeIcon from "public/images/icons/eye.inline.svg";
import PlayIcon from "public/images/icons/play-black.svg";
import Button from "~/components/Button";
import Modal from "~/components/Modal";
import CustomInput from "~/components/CustomInput/index2";
import useUser from "~/contexts/userContext";
import {
  getFlowAPI,
  activateFlowAPI,
  deactivateFlowAPI,
  deleteFlowAPI,
} from "~/apis/flow";
import { useForm } from "react-hook-form";
import StatusPill from "~/components/StatusPill";
import dayjs from "dayjs";
import Activity from "~/components/Activity";
import styles from "./flow.module.css";

const FlowDetail = () => {
  const { userData } = useUser();
  const router = useRouter();
  const { handleSubmit, register } = useForm();
  const { flowId = "" } = router.query;

  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [flowData, setFlowData] = useState(null);

  const [show, setShow] = useState(false);

  const fetchFlow = async () => {
    setLoading(true);
    const response = await getFlowAPI(flowId);
    if (response.isSuccess()) {
      setFlowData(response.success());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlow();
  }, []);

  if (loading) {
    return <Loader fullScreen />;
  }

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const activateFlow = async () => {
    setStatusLoading(true);
    const response = await activateFlowAPI(flowId);
    if (response.isSuccess()) {
      setFlowData(response.success());
    }
    setStatusLoading(false);
  };

  const deactivateFlow = async () => {
    setStatusLoading(true);
    const response = await deactivateFlowAPI(flowId);
    if (response.isSuccess()) {
      setFlowData(response.success());
    }
    setStatusLoading(false);
  };

  const deleteFlow = async ({ flowName }) => {
    if (flowName !== flowData?.name) {
      return;
    }
    setStatusLoading(true);
    const response = await deleteFlowAPI(flowId);
    if (response.isSuccess()) {
      router.push(routes.flows);
    }
    setStatusLoading(false);
  };

  const status = flowData?.activated ? "active" : "paused";

  return (
    <>
      <TopBar active={"flows"} />
      <div className={styles.brief}>
        <div className={styles.top}>
          <div className={styles.left}>
            <StatusPill status={status} />
            <h2 className={styles.title}>
              {flowData?.name}
              <div className={"stats-count mt-2"}>
                {flowData?.visualizations}
                <span className={"icon"}>
                  <ChartIcon />
                </span>
              </div>
            </h2>
            <p className={styles.description}>{flowData?.description}</p>
          </div>
          <div className={styles.right}>
            <div className={styles.info}>
              <p>Flow created</p>
              <span>
                {dayjs(flowData?.createdAt).format("MMMM D YYYY, H.mm")}h
              </span>
              {/*<span>May 12 2022, 12.43h</span>*/}
            </div>
            <div className={styles.info}>
              <p>Last edition</p>
              <span>
                {dayjs(flowData?.updatedAt).format("MMMM D YYYY, H.mm")}h
              </span>
            </div>
            <div className={styles.info}>
              <p>Editor</p>
              <span>
                {userData?.firstName} {userData?.lastName}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.buttonsWrapper}>
          <Link href={routes.editFlow(flowId)}>
            <a>
              <Button
                type={"button"}
                className={"w-full"}
                variant={"outline"}
                size={"large"}
                icon={EditIcon}
              >
                Edit Flow
              </Button>
            </a>
          </Link>
          <Link href={routes.previewFlow(flowId)}>
            <a>
              <Button
                type={"button"}
                className={"w-full"}
                variant={"outline"}
                size={"large"}
                icon={EyeIcon}
              >
                Preview Flow
              </Button>
            </a>
          </Link>
          <Button
            type={"button"}
            onClick={status === "active" ? deactivateFlow : activateFlow}
            className={"w-full"}
            variant={"outline"}
            size={"large"}
            icon={status === "active" ? PauseIcon : PlayIcon}
            disabled={statusLoading}
          >
            {status === "active" ? "Pause Flow" : "Activate Flow"}
          </Button>
          <Button
            variant={"outline-error"}
            type={"button"}
            className={"w-full"}
            size={"large"}
            onClick={handleShow}
          >
            Delete Flow
          </Button>
        </div>
      </div>

      <Activity />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>Delete Flow</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(deleteFlow)}>
            Are you sure you want to delete this flow? This action cannot be
            reverted and you will lose all the data. Please, confirm the flow
            name before deleting it.
            <div className={"my-6"}>
              <CustomInput
                {...register("flowName", { required: true })}
                label={"Flow name"}
              />
            </div>
            <Button
              disabled={statusLoading}
              type={"submit"}
              size={"large"}
              className={"w-full"}
              variant={"error"}
            >
              Confirm deletion
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default withAuth(FlowDetail);
