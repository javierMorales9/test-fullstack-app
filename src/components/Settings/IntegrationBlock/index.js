import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "~/components/Settings/Card";
import routes from "~/utils/routes";
import Modal from "~/components/Modal";
import Button from "~/components/Button";
import Icon1 from "public/images/dummy/integrations/stripe.png";
import Icon2 from "public/images/dummy/integrations/braintree.png";
import Icon3 from "public/images/dummy/integrations/adyen.png";
import Icon4 from "public/images/dummy/integrations/chargebee.png";
import Icon5 from "public/images/dummy/integrations/paypal.png";
import Icon6 from "public/images/dummy/integrations/slack.png";
import Icon7 from "public/images/dummy/integrations/webhooks.png";
import {
  title as titleCss,
  description as descriptionCss,
} from "~/components/Settings/settings.module.css";
import { PAYMENT_PROVIDERS } from "~/utils/constants";
import styles from "./IntegrationBlock.module.css";

const paymentProviders = [
  {
    id: 1,
    label: "Stripe",
    img: Icon1,
    href: routes.settingsIntegrationDetail(PAYMENT_PROVIDERS.STRIPE),
    enabled: true,
  },
  {
    id: 2,
    label: "Braintree",
    img: Icon2,
    href: routes.settingsIntegrationDetail(PAYMENT_PROVIDERS.BRAINTREE),
  },
  {
    id: 3,
    label: "Adyen",
    img: Icon3,
    href: routes.settingsIntegrationDetail(PAYMENT_PROVIDERS.ADYEN),
  },
  {
    id: 4,
    label: "Chargebee",
    img: Icon4,
    href: routes.settingsIntegrationDetail(PAYMENT_PROVIDERS.CHARGEBEE),
  },
  {
    id: 5,
    label: "Paypal",
    img: Icon5,
    href: routes.settingsIntegrationDetail(PAYMENT_PROVIDERS.PAYPAL),
  },
  {
    id: 6,
    label: "Slack",
    img: Icon6,
    href: routes.settingsIntegrationDetail(PAYMENT_PROVIDERS.SLACK),
  },
  {
    id: 7,
    label: "Webhooks",
    img: Icon7,
    href: routes.settingsIntegrationDetail(PAYMENT_PROVIDERS.WEBHOOKS),
  },
];

const HelpBlock = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  return (
    <>
      <Card p0>
        <div>
          <h4 className={titleCss}>Integrations</h4>
          <p className={`mt-3 ${descriptionCss}`}>
            This are the integrations currently available in Clickout. Configure
            them will take no more than a few clicks.
          </p>
        </div>
        <hr className={"my-7"} />
        <div className={styles.wrapper}>
          {paymentProviders.map(({ id, label, img, href, enabled }) =>
            enabled ? (
              <Link
                key={id}
                href={href}
                className={`${titleCss} ${styles.provider}`}
              >
                <Image src={img} width={36} height={36} />
                {label}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setShow(true)}
                  className={`${titleCss} ${styles.provider}`}
                >
                  <Image src={img} width={36} height={36} />
                  {label}
                </button>
              </>
            ),
          )}
        </div>
      </Card>
      <div className={"mt-7 text-center"}>
        <p className={titleCss}>Any integration left?</p>
        <p className={"label mt-3"}>
          You can{" "}
          <a
            className={"link"}
            href="https://www.clickout.io/contact"
            target={"_blank"}
            rel="noreferrer"
          >
            contact us
          </a>
          , and suggest us any integration you want Clickout to work with
        </p>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>Integration in process!</Modal.Header>
        <Modal.Body>
          Sorry, this integration is not available for the moment. If you were
          interested in using it, you would make us a favor if you completed
          this{" "}
          <a
            href="https://www.clickout.io/contact"
            target={"_blank"}
            rel="noreferrer"
            className={"link"}
          >
            form
          </a>
          .
          <Button
            size={"large"}
            onClick={handleClose}
            className={"mt-6 w-full"}
            variant={"outline-primary"}
          >
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HelpBlock;
