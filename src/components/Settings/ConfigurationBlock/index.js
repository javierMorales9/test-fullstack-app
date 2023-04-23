import React, { useState } from "react";
import Link from "next/link";
import routes from "~/utils/routes";
import Card from "~/components/Settings/Card";
import Button from "~/components/Button";
import Modal from "~/components/Modal";
import CustomInput from "~/components/CustomInput/index2";
import useUser from "~/contexts/userContext";
import { useForm } from "react-hook-form";
import { deleteAccountAPI } from "~/apis/account";
import styles from "./ConfigurationBlock.module.css";

const ConfigurationBlock = () => {
  const { accountData, userData, logout } = useUser();
  const { handleSubmit, register } = useForm();

  const [show, setShow] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const deleteAccount = async ({ email }) => {
    // deleteFlowAPI
    if (email !== userData?.email) {
      return;
    }
    setStatusLoading(true);
    const response = await deleteAccountAPI();
    if (response.isSuccess()) {
      logout();
    }
    setStatusLoading(false);
  };
  return (
    <>
      <Card title={"Company Configuration"}>
        <div className={styles.block}>
          <div className={styles.top}>
            <h5 className={styles.title}>
              {accountData?.companyData?.name || "My company"}
            </h5>
            <Link href={routes.settingsConfigurationCompany}>
              <a className={styles.button}>Manage</a>
            </Link>
          </div>
        </div>
        <div className={styles.block}>
          <div className={styles.top}>
            <h5 className={styles.title}>Account Id</h5>
          </div>
          <p className={styles.info}>{accountData?.id}</p>
        </div>
        <div className={styles.block}>
          <div className={styles.top}>
            <h5 className={styles.title}>Api Key</h5>
          </div>
          <p className={styles.info}>{accountData?.apiKey}</p>
        </div>
        <div className={styles.block}>
          <div className={styles.top}>
            <h5 className={styles.title}>Authorized domains</h5>
            <Link href={routes.settingsDomains}>
              <a className={styles.button}>Manage</a>
            </Link>
          </div>
        </div>
      </Card>

      <Card title={"Account Configuration"}>
        {/*<div className={styles.block}>*/}
        {/*  <div className={styles.top}>*/}
        {/*    <h5 className={styles.title}>Password</h5>*/}
        {/*    <button className={styles.button}>Manage</button>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className={styles.block}>
          <div className={styles.top}>
            <h5 className={styles.title}>Access email</h5>
            {/*<button className={styles.button}>Change</button>*/}
          </div>
          <p className={styles.info}>
            Your current email is: {userData?.email}
          </p>
        </div>
      </Card>

      <Card p0>
        <div className={styles.block}>
          <div className={styles.top}>
            <h5 className={styles.title}>Delete my account</h5>
          </div>
          <p className={styles.info}>
            When the account is deleted you will lose the access to the Clickout
            services and we will delete all your personal data.
          </p>
          <div
            className={
              "mt-5 flex flex-wrap items-center justify-start gap-y-2 gap-x-4"
            }
          >
            <input id={"confirm"} type="checkbox" />
            <label htmlFor={"confirm"} className={`linkText`}>
              Confirm that I want to delete my account
            </label>
          </div>
        </div>
        <div className={"mt-6 flex flex-wrap items-center justify-start gap-3"}>
          <Button variant={"outline"} size={"small"}>
            Read More
          </Button>
          <Button
            type={"button"}
            onClick={handleShow}
            variant={"error"}
            size={"small"}
          >
            Delete my account
          </Button>
        </div>
      </Card>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>Delete Account</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(deleteAccount)}>
            <p className={styles.description}>
              Are you sure you want to delete the account? This action is not
              reversible and you will lose all the data. Please write your
              account email to confirm
            </p>
            <div className={"my-6"}>
              <CustomInput
                label={"Account email"}
                {...register("email", { required: true })}
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

export default ConfigurationBlock;
