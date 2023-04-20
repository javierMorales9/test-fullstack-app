import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "~/components/Settings/Card";
import CustomInput from "~/components/CustomInput/index2";
import Button from "~/components/Button";
import Link from "next/link";
import routes from "~/utils/routes";
import { useForm } from "react-hook-form";
import styles from "./CompanyBlock.module.css";

const CompanyBlock = ({
  defaultValues,
  accountImage,
  handleAccountInfo,
  loading,
}) => {
  const [logoURL, setLogoURL] = useState(accountImage);
  const { register, reset, handleSubmit, resetField, watch } =
    useForm(defaultValues);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    setLogoURL(accountImage);
  }, [accountImage]);

  const image = watch("accountImage")?.[0];

  useEffect(() => {
    if (image) {
      if (typeof image !== "string") {
        setLogoURL(URL.createObjectURL(image));
      }
    } else {
      setLogoURL("");
    }
  }, [image]);

  return (
    <>
      <Card
        p0
        backTo={routes.settings}
        title={[
          { label: "Company Configuration", href: routes.settings },
          "My Company",
        ]}
      >
        {/*<h3 className={title}></h3>*/}
        <form onSubmit={handleSubmit(handleAccountInfo)}>
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  label={"Nombre"}
                  {...register("name")}
                />
              </div>
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  label={"Social Reason"}
                  {...register("socialReason")}
                />
              </div>
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  label={"Localization"}
                  {...register("localization")}
                />
              </div>
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  label={"CIF"}
                  {...register("cif")}
                />
              </div>
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  label={"Address"}
                  {...register("address")}
                />
              </div>
              <div className={"mb-6"}>
                <CustomInput
                  variant={"floating"}
                  label={"Postal Code"}
                  {...register("postalCode")}
                />
              </div>
              <div className={"mb-10"}>
                <CustomInput
                  variant={"floating"}
                  label={"Phone"}
                  {...register("phone")}
                />
              </div>
            </div>
            <div className={styles.right}>
              {logoURL && (
                <div className={styles.companyLogo}>
                  <img src={logoURL} />
                </div>
              )}
              <input
                id={"logo"}
                type="file"
                className={"hidden"}
                accept={"image/*"}
                {...register("accountImage")}
              />
              <Button
                htmlFor="logo"
                type={"button"}
                variant={"outline-primary"}
                className={"w-full"}
                disabled={loading}
              >
                + Upload Logo
              </Button>
              <Button
                type={"button"}
                disabled={loading}
                onClick={() => {
                  if (!image && logoURL) {
                    setLogoURL("");
                  }
                  resetField("accountImage");
                }}
                variant={"clean"}
                className={"text-black-3 mt-2 w-full"}
              >
                Delete logo
              </Button>
              <p className={"label mt-12"}>
                Manage your company logo. It will be visible in messages and
                alerts.{" "}
                <Link href={"#"}>
                  <a className={"link"}>Más info</a>
                </Link>
              </p>
            </div>
          </div>
          <hr />
          <div
            className={"mt-6 flex flex-wrap items-center justify-start gap-3"}
          >
            <Button disabled={loading} type={"button"} variant={"outline"}>
              Cancel
            </Button>
            <Button
              disabled={loading}
              type={"submit"}
              variant={"primary"}
              loading={loading}
            >
              Save changes
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

CompanyBlock.propTypes = {
  defaultValues: PropTypes.object,
  accountImage: PropTypes.string,
  handleAccountInfo: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

CompanyBlock.defaultProps = {
  defaultValues: {},
};

export default CompanyBlock;
