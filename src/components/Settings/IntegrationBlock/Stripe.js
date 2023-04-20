import React, { useEffect, useState } from "react";
import Card from "~/components/Settings/Card";
import { title as titleCss } from "../settings.module.css";
import Image from "next/image";
import Icon1 from "public/images/dummy/integrations/stripe.png";
import CheckIcon from "public/images/icons/check_circle.svg";
import CancelIcon from "public/images/icons/cancel_circle.svg";
import routes from "~/utils/routes";
import CustomInput from "~/components/CustomInput/index2";
import Button from "~/components/Button";
import useUser from "~contexts/userContext";
import { useForm } from "react-hook-form";
import { addInfoAPI } from "~/apis/account";
import { toast } from "react-toastify";
import { PAYMENT_PROVIDERS } from "~/utils/constants";
import styles from "pages/settings/settings.module.css";

const StripeIntegration = ({ provider }) => {
  const [loading, setLoading] = useState(false);

  const { accountData, setAccountData } = useUser();
  const { register, setValue, handleSubmit } = useForm();

  const isStripe = accountData?.paymentType === PAYMENT_PROVIDERS.STRIPE;

  useEffect(() => {
    if (isStripe && accountData?.privateKey) {
      setValue("privateKey", accountData?.privateKey);
    }
  }, [accountData]);

  const handleStripe = async ({ privateKey }) => {
    setLoading(true);
    const payload = { paymentType: PAYMENT_PROVIDERS.STRIPE, privateKey };
    const response = await addInfoAPI(payload);
    if (response.isSuccess()) {
      setAccountData(response.success() || {});
      const msg = "Stripe key updated";
      toast.success(msg);
    } else {
      const msg = response.fail()?.data?.error;
      toast.error(msg);
    }
    setLoading(false);
  };

  return (
    <>
      <div className={styles.left}>
        <Card className={styles.shadow}>
          <div className={`${titleCss} ${styles.provider}`}>
            <Image src={Icon1} width={36} height={36} />
            {provider}
          </div>
        </Card>
        <div
          className={`${isStripe ? styles.active : styles.inactive}  ${
            styles.status
          }`}
        >
          {isStripe ? (
            <>
              <Image src={CheckIcon} width={16} height={16} /> Integration
              Active
            </>
          ) : (
            <>
              <Image src={CancelIcon} width={16} height={16} /> Integration
              Inactive
            </>
          )}
        </div>
        <hr />
      </div>
      <div className={styles.right}>
        <Card
          backTo={routes.settingsIntegration}
          p0
          title={"Stripe configuration"}
        >
          <div>
            <div className={"tabs my-8"}>
              <button type={"button"} className={`tab active`}>
                Configuración
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit(handleStripe)}>
            <div className={"mb-6"}>
              <CustomInput
                label={"API Key - Live Mode"}
                {...register("privateKey", { required: true })}
                // defaultValue={
                //   '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
                // }
              />
            </div>
            {/*<div className={'mb-6'}>*/}
            {/*  <CustomInput*/}
            {/*    label={'API Key - Test Mode'}*/}
            {/*    defaultValue={*/}
            {/*      '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'*/}
            {/*    }*/}
            {/*  />*/}
            {/*</div>*/}
            <div className={"flex flex-wrap items-center justify-end gap-4"}>
              {/*<Button variant={'outline-primary'}>More information</Button>*/}
              <Button
                type={"submit"}
                variant={"primary"}
                disabled={loading}
                loading={loading}
              >
                Connect account
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default StripeIntegration;
