import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import Card from "~/components/Settings/Card";
import CustomInput from "~/components/CustomInput/index2";
import Button from "~/components/Button";
import useUser from "~/contexts/userContext";
import Link from "next/link";
import routes from "~/utils/routes";
import DomainIcon from "public/images/icons/domain.svg";
import { addDomainsAPI, deleteDomainAPI } from "~/apis/account";
import Modal from "~/components/Modal";
import parentStyles from "../ConfigurationBlock.module.css";
import styles from "./DomainsBlock.module.css";

const DomainsBlock = () => {
  const { accountData, verifyUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [deleteDomain, setDeleteDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    register: deleteRegister,
    reset: deleteReset,
    handleSubmit: deleteHandleSubmit,
    setError: deleteSetError,
    formState: { errors: deleteErrors },
  } = useForm();

  useEffect(() => {
    if (!showModal) {
      reset();
    }
  }, [showModal]);

  useEffect(() => {
    if (!deleteDomain) {
      deleteReset();
    }
  }, [deleteDomain]);

  const handleAddDomain = async ({ domain = "" }) => {
    setLoading(true);
    console.log("formSubmitted", domain);
    const response = await addDomainsAPI({ domains: [domain] });
    if (response.isSuccess()) {
      verifyUser();
      setShowModal(false);
    }
    setLoading(false);
  };

  const handleDeleteDomain = async ({ domain }) => {
    if (domain !== deleteDomain) {
      deleteSetError("domain", {
        type: "custom",
        message: "Domain name does not match",
      });

      return;
    }
    setDeleteLoading(true);
    const response = await deleteDomainAPI({ domain: deleteDomain });
    if (response.isSuccess()) {
      verifyUser();
      setDeleteDomain("");
    }
    setDeleteLoading(false);
  };

  return (
    <>
      <Card
        p0
        backTo={routes.settings}
        title={[
          { label: "Company Configuration", href: routes.settings },
          "My Domains",
        ]}
      >
        {/*<h3 className={title}></h3>*/}
        <div className={"mb-6"}>
          <Button onClick={() => setShowModal(true)}>+ Add new Domain</Button>
        </div>
        <hr />
        {accountData?.allowedDomains?.length ? (
          accountData?.allowedDomains?.map((d, i) => (
            <React.Fragment key={i}>
              <div className={styles.domain}>
                <div>
                  <img src={DomainIcon.src} alt="Domain" />
                  <p>{d}</p>
                </div>
                <button
                  className={parentStyles.button}
                  onClick={() => setDeleteDomain(d)}
                >
                  Delete
                </button>
              </div>
              <hr />
            </React.Fragment>
          ))
        ) : (
          <div className={"mt-6"}>No Domains Added</div>
        )}
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>Add Domain</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(handleAddDomain)}>
            <p>
              Add a new domain to let Clickout know where the valid request
              should come from.
            </p>
            <div className={"mb-7 mt-5"}>
              <CustomInput
                label={"URL"}
                error={errors["domain"]?.message}
                {...register("domain", {
                  validate: {
                    validURL: (str) => {
                      const pattern = new RegExp(
                        "^(https?:\\/\\/)?" + // protocol
                          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                          "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                          "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                          "(\\#[-a-z\\d_]*)?$",
                        "i",
                      ); // fragment locator
                      if (!pattern.test(str)) {
                        return "Please enter a valid Domain";
                      }
                      return !!pattern.test(str);
                    },
                  },
                  required: "This field is required",
                })}
              />
            </div>
            <Button
              type={"submit"}
              size={"large"}
              className={"w-full"}
              variant={"primary"}
              disabled={loading}
              loading={loading}
            >
              Add domain
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={deleteDomain} onHide={() => setDeleteDomain("")}>
        <Modal.Header>Delete Domain</Modal.Header>
        <Modal.Body>
          <form onSubmit={deleteHandleSubmit(handleDeleteDomain)}>
            <p>
              Are you sure you want to delete the domain? You will lose access
              from this domain and you will have to add it again. Please write
              your domain to confirm.
            </p>
            <div className={"my-6"}>
              <CustomInput
                label={"Domain"}
                error={deleteErrors["domain"]?.message}
                {...deleteRegister("domain", {
                  required: "This field is required",
                })}
              />
            </div>
            <Button
              type={"submit"}
              size={"large"}
              className={"w-full"}
              variant={"error"}
              loading={deleteLoading}
              disabled={deleteLoading}
            >
              Confirm deletion
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

DomainsBlock.propTypes = {};

DomainsBlock.defaultProps = {};

export default DomainsBlock;
