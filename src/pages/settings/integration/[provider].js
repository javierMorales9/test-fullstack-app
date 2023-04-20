import React from "react";
import TopBar from "~/components/Navigation/TopBar";
import { useRouter } from "next/router";
import { wrapper } from "~/styles/styles.module.css";
import StripeIntegration from "~/components/Settings/IntegrationBlock/Stripe";
import { PAYMENT_PROVIDERS } from "~/utils/constants";
import styles from "../settings.module.css";

const capitalizeFirstLetter = (string = "") => {
  if (!string) {
    return "";
  }
  return string[0].toUpperCase() + string.slice(1);
};

const Provider = () => {
  const router = useRouter();
  const { provider } = router.query;
  return (
    <>
      <TopBar active={"settings"} />
      <div className={`${styles.wrapper} ${wrapper}`}>
        {provider === PAYMENT_PROVIDERS.STRIPE && (
          <StripeIntegration provider={capitalizeFirstLetter(provider)} />
        )}
      </div>
    </>
  );
};

export default Provider;
